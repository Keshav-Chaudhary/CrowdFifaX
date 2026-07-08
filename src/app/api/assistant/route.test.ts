import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { resetRateLimits } from "@/services/ai/rate-limit";

/**
 * Route handler tests. The AI client is mocked so we exercise validation,
 * graceful degradation, and the streaming wrapper without hitting the network.
 */

// Mock the AI client module before importing the route.
vi.mock("@/services/ai/client", () => {
  class MockAINotConfiguredError extends Error {
    constructor() {
      super("AI assistant is not configured");
      this.name = "AINotConfiguredError";
    }
  }
  return {
    AINotConfiguredError: MockAINotConfiguredError,
    // Yield two chunks to simulate a streamed completion.
    streamChat: vi.fn(async function* () {
      yield "Hello ";
      yield "world";
    }),
  };
});

const enabledState = { value: true };
vi.mock("@/services/ai/config", () => ({
  isAIEnabled: () => enabledState.value,
  testAIConnection: async () => enabledState.value,
}));

import { POST, GET } from "@/app/api/assistant/route_disabled";

function makeRequest(body: unknown, raw = false): Request {
  return new Request("http://localhost/api/assistant", {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-forwarded-for": "1.2.3.4" },
    body: raw ? (body as string) : JSON.stringify(body),
  });
}

function makeRequestWithHeaders(
  body: unknown,
  extraHeaders: Record<string, string>,
): Request {
  return new Request("http://localhost/api/assistant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-forwarded-for": "1.2.3.4",
      ...extraHeaders,
    },
    body: JSON.stringify(body),
  });
}

const validBody = {
  messages: [{ role: "user", content: "How am I doing?" }],
  activities: [
    { id: "1", factorId: "transit_subway", quantity: 10, date: "2026-01-01" },
  ],
};

beforeEach(() => {
  enabledState.value = true;
  resetRateLimits();
});

afterEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/assistant", () => {
  it("reports the AI capability", async () => {
    const res = await GET();
    expect(await res.json()).toEqual({ enabled: true, configured: true });
  });
});

describe("POST /api/assistant", () => {
  it("streams the assistant reply for a valid request", async () => {
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect(res.headers.get("Cache-Control")).toBe("no-store");
    expect(await res.text()).toBe("Hello world");
  });

  it("returns 503 when the AI layer is not configured", async () => {
    enabledState.value = false;
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(503);
  });

  it("returns 400 for malformed JSON", async () => {
    const res = await POST(makeRequest("{ not json", true));
    expect(res.status).toBe(400);
  });

  it("returns 400 when messages are missing", async () => {
    const res = await POST(makeRequest({ activities: [] }));
    expect(res.status).toBe(400);
  });

  it("returns 400 when an activity references an unknown factor", async () => {
    const res = await POST(
      makeRequest({
        messages: [{ role: "user", content: "hi" }],
        activities: [
          { id: "1", factorId: "rocket", quantity: 1, date: "2026-01-01" },
        ],
      }),
    );
    expect(res.status).toBe(400);
  });

  it("enforces the rate limit after enough requests", async () => {
    let last: Response | null = null;
    for (let i = 0; i < 25; i++) {
      last = await POST(makeRequest(validBody));
    }
    expect(last?.status).toBe(429);
  });

  it("allows same-origin requests with a matching Origin header", async () => {
    const res = await POST(
      makeRequestWithHeaders(validBody, { origin: "http://localhost" }),
    );
    expect(res.status).toBe(200);
  });

  it("rejects cross-origin requests with 403", async () => {
    const res = await POST(
      makeRequestWithHeaders(validBody, { origin: "https://evil.example" }),
    );
    expect(res.status).toBe(403);
  });

  it("rejects a malformed Origin header", async () => {
    const res = await POST(
      makeRequestWithHeaders(validBody, { origin: "not a url" }),
    );
    expect(res.status).toBe(403);
  });

  it("rejects messages that are empty after sanitization", async () => {
    const res = await POST(
      makeRequest({
        messages: [{ role: "user", content: "​​​" }],
        activities: [],
      }),
    );
    expect(res.status).toBe(400);
  });

  it("still answers when control characters are stripped from the message", async () => {
    const res = await POST(
      makeRequest({
        messages: [{ role: "user", content: "How  am I doing?" }],
        activities: [],
      }),
    );
    expect(res.status).toBe(200);
    expect(await res.text()).toBe("Hello world");
  });

  it("returns 400 when an activity quantity is negative", async () => {
    const res = await POST(
      makeRequest({
        messages: [{ role: "user", content: "hi" }],
        activities: [
          { id: "1", factorId: "car_petrol", quantity: -5, date: "2026-01-01" },
        ],
      }),
    );
    expect(res.status).toBe(400);
  });

  it("handles AINotConfiguredError during streaming gracefully", async () => {
    const { streamChat, AINotConfiguredError } = await import("@/services/ai/client");
    vi.mocked(streamChat).mockImplementationOnce(async function* () {
      throw new AINotConfiguredError();
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("[AI assistant is not configured.]");
  });

  it("handles general errors during streaming gracefully", async () => {
    const { streamChat } = await import("@/services/ai/client");
    vi.mocked(streamChat).mockImplementationOnce(async function* () {
      throw new Error("Something went wrong");
    });
    const res = await POST(makeRequest(validBody));
    expect(res.status).toBe(200);
    expect(await res.text()).toContain("[The assistant is temporarily unavailable. Please try again.]");
  });

  it("uses anonymous fallback when x-forwarded-for header is missing", async () => {
    const req = new Request("http://localhost/api/assistant", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(validBody),
    });
    const res = await POST(req);
    expect(res.status).toBe(200);
  });
});
