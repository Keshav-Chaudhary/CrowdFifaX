/**
 * Server-side configuration for the AI assistant.
 *
 * Uses Google Gemini API via its OpenAI-compatible endpoint.
 * The API key is read from the environment and MUST never be exposed to the client.
 */

export const FALLBACK_MODELS: readonly string[] = [
  "gemini-1.5-flash", 
  "gemini-1.5-pro",
];

export const DEFAULT_TIMEOUT_MS = 30_000;
export const PROBE_TIMEOUT_MS = 3_000;

export interface AIConfig {
  baseURL: string;
  apiKey: string;
  models: readonly string[];
  timeoutMs: number;
}

/**
 * Resolve AI configuration from environment variables.
 */
export function getAIConfig(): AIConfig | null {
  const apiKey = process.env.GEMINI_API_KEY?.trim() || process.env.GOOGLE_API_KEY?.trim();
  if (!apiKey) return null;

  const baseURL = (
    process.env.GEMINI_BASE_URL?.trim() || "https://generativelanguage.googleapis.com/v1beta/openai/"
  ).replace(/\/$/, "");

  const envModel = process.env.GEMINI_MODEL?.trim();
  const models = envModel
    ? [envModel, ...FALLBACK_MODELS.filter((m) => m !== envModel)]
    : FALLBACK_MODELS;

  return {
    baseURL,
    apiKey,
    models,
    timeoutMs: Number(process.env.GEMINI_TIMEOUT_MS) || DEFAULT_TIMEOUT_MS,
  };
}

/** Whether the AI layer is configured and available. */
export function isAIEnabled(): boolean {
  return getAIConfig() !== null;
}

/** Probe the LLM server to verify if it is actually online and responding. */
export async function testAIConnection(): Promise<boolean> {
  const config = getAIConfig();
  if (!config) return false;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), PROBE_TIMEOUT_MS);
    
    const response = await fetch(`${config.baseURL}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        model: config.models[0],
        messages: [{ role: "user", content: "ping" }],
        max_tokens: 1,
      }),
      signal: controller.signal,
    });
    
    clearTimeout(timeout);
    return response.ok;
  } catch {
    return false;
  }
}
