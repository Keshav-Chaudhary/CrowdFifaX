import { describe, expect, it, vi } from "vitest";
import { parseSSEStream, streamChat, AINotConfiguredError } from "@/services/ai/client";
import type { AIConfig } from "@/services/ai/config";

/** Build a ReadableStream from string chunks for testing the SSE parser. */
function streamFrom(chunks: string[]): ReadableStream<Uint8Array> {
  const encoder = new TextEncoder();
  let i = 0;
  return new ReadableStream({
    pull(controller) {
      if (i < chunks.length) {
        controller.enqueue(encoder.encode(chunks[i++]));
      } else {
        controller.close();
      }
    },
  });
}

async function collect(gen: AsyncGenerator<string>): Promise<string> {
  let out = "";
  for await (const chunk of gen) out += chunk;
  return out;
}

describe("parseSSEStream", () => {
  it("concatenates delta content across events", async () => {
    const stream = streamFrom([
      'data: {"choices":[{"delta":{"content":"Hello"}}]}\n\n',
      'data: {"choices":[{"delta":{"content":", world"}}]}\n\n',
      "data: [DONE]\n\n",
    ]);
    expect(await collect(parseSSEStream(stream))).toBe("Hello, world");
  });

  it("handles events split across chunk boundaries", async () => {
    const stream = streamFrom([
      'data: {"choices":[{"delta":{"con',
      'tent":"split"}}]}\n\n',
    ]);
    expect(await collect(parseSSEStream(stream))).toBe("split");
  });

  it("ignores malformed and keep-alive lines", async () => {
    const stream = streamFrom([
      ": keep-alive\n\n",
      "data: not-json\n\n",
      'data: {"choices":[{"delta":{"content":"ok"}}]}\n\n',
    ]);
    expect(await collect(parseSSEStream(stream))).toBe("ok");
  });

  it("flushes a trailing event with no closing blank line", async () => {
    const stream = streamFrom([
      'data: {"choices":[{"delta":{"content":"tail"}}]}',
    ]);
    expect(await collect(parseSSEStream(stream))).toBe("tail");
  });
});

describe("streamChat", () => {
  it("streams chat content successfully with fallback models", async () => {
    const mockConfig: AIConfig = {
      baseURL: "http://mock-api.com",
      apiKey: "mock-key",
      models: ["model-1", "model-2"],
      timeoutMs: 1000,
    };
    
    let fetchCount = 0;
    const mockFetch = vi.fn().mockImplementation((url, init) => {
      fetchCount++;
      const body = JSON.parse(init.body);
      if (body.model === "model-1") {
        return Promise.resolve({
          ok: false,
          status: 500,
        });
      }
      return Promise.resolve({
        ok: true,
        body: streamFrom([
          'data: {"choices":[{"delta":{"content":"Success"}}]}\n\n',
          "data: [DONE]\n\n",
        ]),
      });
    });
    vi.stubGlobal("fetch", mockFetch);

    const gen = streamChat([{ role: "user", content: "Hi" }], mockConfig);
    const result = await collect(gen);
    
    expect(result).toBe("Success");
    expect(fetchCount).toBe(2);
    vi.unstubAllGlobals();
  });

  it("throws error when all models fail", async () => {
    const mockConfig: AIConfig = {
      baseURL: "http://mock-api.com",
      apiKey: "mock-key",
      models: ["model-1"],
      timeoutMs: 1000,
    };
    
    const mockFetch = vi.fn().mockImplementation(() => {
      return Promise.reject(new Error("Network Error"));
    });
    vi.stubGlobal("fetch", mockFetch);

    const gen = streamChat([{ role: "user", content: "Hi" }], mockConfig);
    await expect(async () => {
      for await (const chunk of gen) {
        expect(chunk).toBeDefined();
      }
    }).rejects.toThrow("All AI models failed. Last error: Network Error");
    vi.unstubAllGlobals();
  });

  it("throws AINotConfiguredError when getAIConfig returns null", async () => {
    const originalApiKey = process.env.GEMINI_API_KEY;
    const originalGoogleApiKey = process.env.GOOGLE_API_KEY;
    delete process.env.GEMINI_API_KEY;
    delete process.env.GOOGLE_API_KEY;

    await expect(async () => {
      const gen = streamChat([{ role: "user", content: "Hi" }]);
      for await (const chunk of gen) {
        expect(chunk).toBeDefined();
      }
    }).rejects.toThrow(AINotConfiguredError);

    process.env.GEMINI_API_KEY = originalApiKey;
    process.env.GOOGLE_API_KEY = originalGoogleApiKey;
  });

  it("calls getAIConfigOrThrow default parameter when config is not provided", async () => {
    const originalApiKey = process.env.GEMINI_API_KEY;
    process.env.GEMINI_API_KEY = "test-key";
    
    const mockFetch = vi.fn().mockResolvedValue({
      ok: true,
      body: streamFrom([
        'data: {"choices":[{"delta":{"content":"Default success"}}]}\n\n',
        "data: [DONE]\n\n",
      ]),
    });
    vi.stubGlobal("fetch", mockFetch);

    const gen = streamChat([{ role: "user", content: "Hi" }]);
    const result = await collect(gen);
    expect(result).toBe("Default success");

    vi.unstubAllGlobals();
    process.env.GEMINI_API_KEY = originalApiKey;
  });
});

describe("AINotConfiguredError", () => {
  it("constructs AINotConfiguredError correctly", () => {
    const err = new AINotConfiguredError();
    expect(err.message).toBe("AI assistant is not configured");
    expect(err.name).toBe("AINotConfiguredError");
  });
});
