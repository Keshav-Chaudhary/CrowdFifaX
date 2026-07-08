import { beforeEach, describe, expect, it } from "vitest";
import { rateLimit, resetRateLimits } from "@/services/ai/rate-limit";

beforeEach(() => resetRateLimits());

describe("rateLimit", () => {
  it("allows requests up to the limit then blocks", () => {
    const now = 1_000_000;
    for (let i = 0; i < 3; i++) {
      expect(rateLimit("ip", 3, 60_000, now).allowed).toBe(true);
    }
    const blocked = rateLimit("ip", 3, 60_000, now);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });

  it("decrements remaining count", () => {
    const now = 1_000_000;
    expect(rateLimit("ip", 5, 60_000, now).remaining).toBe(4);
    expect(rateLimit("ip", 5, 60_000, now).remaining).toBe(3);
  });

  it("resets after the window elapses", () => {
    const start = 1_000_000;
    rateLimit("ip", 1, 60_000, start);
    expect(rateLimit("ip", 1, 60_000, start).allowed).toBe(false);
    // Past the window boundary the bucket resets.
    expect(rateLimit("ip", 1, 60_000, start + 60_001).allowed).toBe(true);
  });

  it("tracks separate keys independently", () => {
    const now = 1_000_000;
    rateLimit("a", 1, 60_000, now);
    expect(rateLimit("a", 1, 60_000, now).allowed).toBe(false);
    expect(rateLimit("b", 1, 60_000, now).allowed).toBe(true);
  });
});
