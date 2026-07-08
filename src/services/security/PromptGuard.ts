import { escapeHtml } from "./sanitize";

/**
 * Error thrown when a prompt injection is detected by the guard.
 */
export class PromptBlockedError extends Error {
  constructor(message = "Prompt injection attempt detected and blocked.") {
    super(message);
    this.name = "PromptBlockedError";
  }
}

const INJECTION_PATTERNS: readonly RegExp[] = [
  /ignore\s+(?:any\s+)?previous\s+instructions/i,
  /ignore\s+(?:the\s+)?instructions\s+above/i,
  /system\s+override/i,
  /you\s+are\s+now\s+(?:a|an)\b/i,
  /reveal\s+(?:your\s+)?system\s+prompt/i,
  /bypass\s+safety/i,
  /forget\s+(?:your\s+)?rules/i,
  /dan\s+mode/i,
  /jailbreak/i,
];

/**
 * Validate a user prompt to guard against prompt injection.
 * Escapes input first as a defense-in-depth measure.
 *
 * @param prompt The raw user input prompt
 * @throws {PromptBlockedError} if injection pattern is detected
 */
export function validatePrompt(prompt: string): void {
  const escaped = escapeHtml(prompt);
  for (const pattern of INJECTION_PATTERNS) {
    if (pattern.test(escaped)) {
      throw new PromptBlockedError();
    }
  }
}
