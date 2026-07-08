import "server-only";

import { type AIConfig, getAIConfig } from "./config";

/** Error thrown when the AI layer is not configured. */
export class AINotConfiguredError extends Error {
  constructor() {
    super("AI assistant is not configured");
    this.name = "AINotConfiguredError";
  }
}

interface CompletionMessage {
  role: string;
  content: string;
}

/**
 * Stream a chat completion from the DigitalOcean (OpenAI-compatible) endpoint,
 * yielding text chunks as they arrive.
 *
 * Resilience: if the primary model errors before producing output, the next
 * model in the configured fallback list is tried. Once streaming has started
 * we do not switch models (the partial answer is already committed).
 */
export async function* streamChat(
  messages: CompletionMessage[],
  config: AIConfig = getAIConfigOrThrow(),
): AsyncGenerator<string, void, unknown> {
  let lastError: unknown = null;

  for (const model of config.models) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), config.timeoutMs);
    try {
      const response = await fetch(`${config.baseURL}/chat/completions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${config.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages,
          stream: true,
          temperature: 0.6,
          max_tokens: 800,
        }),
        signal: controller.signal,
      });

      if (!response.ok || !response.body) {
        lastError = new Error(`Model ${model} returned HTTP ${response.status}`);
        continue; // try the next fallback model
      }

      yield* parseSSEStream(response.body);
      return; // completed successfully
    } catch (error) {
      lastError = error;
      continue;
    } finally {
      clearTimeout(timeout);
    }
  }

  throw new Error(
    `All AI models failed. Last error: ${
      lastError instanceof Error ? lastError.message : String(lastError)
    }`,
  );
}

function getAIConfigOrThrow(): AIConfig {
  const config = getAIConfig();
  if (!config) throw new AINotConfiguredError();
  return config;
}

/**
 * Parse an OpenAI-style Server-Sent Events stream, yielding the incremental
 * `delta.content` text from each chunk. Exported for unit testing.
 */
export async function* parseSSEStream(
  body: ReadableStream<Uint8Array>,
): AsyncGenerator<string, void, unknown> {
  const reader = body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  try {
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      buffer += decoder.decode(value, { stream: true });

      // SSE events are separated by double newlines.
      let boundary: number;
      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        const rawEvent = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);
        const text = extractDelta(rawEvent);
        if (text) yield text;
      }
    }
    // Flush any trailing event without a closing blank line.
    const text = extractDelta(buffer);
    if (text) yield text;
  } finally {
    reader.releaseLock();
  }
}

/** Pull the assistant text delta out of a single SSE event block. */
function extractDelta(rawEvent: string): string {
  let out = "";
  for (const line of rawEvent.split("\n")) {
    const trimmed = line.trim();
    if (!trimmed.startsWith("data:")) continue;
    const data = trimmed.slice(5).trim();
    if (data === "[DONE]" || data === "") continue;
    try {
      const json = JSON.parse(data);
      const delta = json?.choices?.[0]?.delta?.content;
      if (typeof delta === "string") out += delta;
    } catch {
      // Ignore keep-alive comments or malformed partial lines.
    }
  }
  return out;
}
