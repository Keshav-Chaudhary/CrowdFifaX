/**
 * Minimal fixed-window in-memory rate limiter.
 *
 * Suitable for a single-instance demo deployment: it bounds abuse of the AI
 * endpoint without external infrastructure. For multi-instance production you
 * would back this with a shared store (e.g. Redis). Documented as a known
 * limitation in the README.
 */
interface Window {
  count: number;
  resetAt: number;
}

const buckets = new Map<string, Window>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Record a hit for `key` and report whether it is allowed.
 *
 * @param key        Caller identity (e.g. client IP).
 * @param limit      Max requests permitted per window.
 * @param windowMs   Window length in milliseconds.
 * @param now        Injectable clock for deterministic tests.
 */
export function rateLimit(
  key: string,
  limit = 20,
  windowMs = 60_000,
  now: number = Date.now(),
): RateLimitResult {
  const existing = buckets.get(key);

  if (!existing || now >= existing.resetAt) {
    const resetAt = now + windowMs;
    buckets.set(key, { count: 1, resetAt });
    return { allowed: true, remaining: limit - 1, resetAt };
  }

  existing.count += 1;
  const remaining = Math.max(0, limit - existing.count);
  return {
    allowed: existing.count <= limit,
    remaining,
    resetAt: existing.resetAt,
  };
}

/** Clear all rate-limit state. Intended for tests. */
export function resetRateLimits(): void {
  buckets.clear();
}
