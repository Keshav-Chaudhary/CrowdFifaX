import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { getAIConfig, isAIEnabled, FALLBACK_MODELS } from "@/services/ai/config";

/**
 * The AI config is the security boundary for the provider key: it must read
 * from the environment, never expose anything when the key is absent, and
 * degrade gracefully. These tests manipulate process.env around each case.
 */

const KEYS = [
  "GEMINI_API_KEY",
  "GOOGLE_API_KEY",
  "GEMINI_BASE_URL",
  "GEMINI_MODEL",
  "GEMINI_TIMEOUT_MS",
] as const;

let saved: Record<string, string | undefined>;

beforeEach(() => {
  saved = {};
  for (const k of KEYS) {
    saved[k] = process.env[k];
    delete process.env[k];
  }
});

afterEach(() => {
  for (const k of KEYS) {
    if (saved[k] === undefined) delete process.env[k];
    else process.env[k] = saved[k];
  }
});

describe("getAIConfig", () => {
  it("returns null when no API key is configured", () => {
    expect(getAIConfig()).toBeNull();
  });

  it("returns null when the API key is blank or whitespace", () => {
    process.env.GEMINI_API_KEY = "   ";
    process.env.GOOGLE_API_KEY = "   ";
    expect(getAIConfig()).toBeNull();
  });

  it("resolves config when a key is present", () => {
    process.env.GEMINI_API_KEY = "secret-key";
    const config = getAIConfig();
    expect(config).not.toBeNull();
    expect(config?.apiKey).toBe("secret-key");
  });

  it("defaults to the Gemini API base URL", () => {
    process.env.GEMINI_API_KEY = "k";
    expect(getAIConfig()?.baseURL).toBe("https://generativelanguage.googleapis.com/v1beta/openai");
  });

  it("strips a trailing slash from a custom base URL", () => {
    process.env.GEMINI_API_KEY = "k";
    process.env.GEMINI_BASE_URL = "https://example.com/v1/";
    expect(getAIConfig()?.baseURL).toBe("https://example.com/v1");
  });

  it("uses the default fallback model chain when no model is set", () => {
    process.env.GEMINI_API_KEY = "k";
    expect(getAIConfig()?.models).toEqual(FALLBACK_MODELS);
  });

  it("prepends an explicit model and dedupes it from the fallback chain", () => {
    process.env.GEMINI_API_KEY = "k";
    process.env.GEMINI_MODEL = FALLBACK_MODELS[1];
    const models = getAIConfig()?.models ?? [];
    expect(models[0]).toBe(FALLBACK_MODELS[1]);
    expect(models.filter((m) => m === FALLBACK_MODELS[1])).toHaveLength(1);
  });

  it("defaults the timeout to 30 seconds", () => {
    process.env.GEMINI_API_KEY = "k";
    expect(getAIConfig()?.timeoutMs).toBe(30_000);
  });

  it("respects a custom timeout", () => {
    process.env.GEMINI_API_KEY = "k";
    process.env.GEMINI_TIMEOUT_MS = "5000";
    expect(getAIConfig()?.timeoutMs).toBe(5000);
  });

  it("falls back to the default timeout for an invalid value", () => {
    process.env.GEMINI_API_KEY = "k";
    process.env.GEMINI_TIMEOUT_MS = "not-a-number";
    expect(getAIConfig()?.timeoutMs).toBe(30_000);
  });
});

describe("isAIEnabled", () => {
  it("is false without a key", () => {
    expect(isAIEnabled()).toBe(false);
  });

  it("is true with a key", () => {
    process.env.GEMINI_API_KEY = "k";
    expect(isAIEnabled()).toBe(true);
  });
});

describe("FALLBACK_MODELS", () => {
  it("is a non-empty, de-duplicated list", () => {
    expect(FALLBACK_MODELS.length).toBeGreaterThan(0);
    expect(new Set(FALLBACK_MODELS).size).toBe(FALLBACK_MODELS.length);
  });
});
