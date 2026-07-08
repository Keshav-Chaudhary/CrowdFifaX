import { describe, expect, it } from "vitest";
import {
  todayISO,
  makeId,
  activityInputSchema,
} from "@/store/helpers";

describe("todayISO", () => {
  it("formats a date as YYYY-MM-DD", () => {
    expect(todayISO(new Date(2026, 0, 5))).toBe("2026-01-05");
  });

  it("zero-pads single-digit months and days", () => {
    expect(todayISO(new Date(2026, 8, 9))).toBe("2026-09-09");
  });

  it("handles the last day of December", () => {
    expect(todayISO(new Date(2026, 11, 31))).toBe("2026-12-31");
  });

  it("returns a string matching the ISO date shape by default", () => {
    expect(todayISO()).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});

describe("makeId", () => {
  it("returns a non-empty string", () => {
    expect(makeId().length).toBeGreaterThan(0);
  });

  it("returns unique values across many calls", () => {
    const ids = new Set(Array.from({ length: 500 }, () => makeId()));
    expect(ids.size).toBe(500);
  });
});

describe("activityInputSchema", () => {
  const valid = { factorId: "transit_subway", quantity: 10, date: "2026-01-01" };

  it("accepts a valid activity", () => {
    expect(activityInputSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a valid activity with a note", () => {
    expect(
      activityInputSchema.safeParse({ ...valid, note: "commute" }).success,
    ).toBe(true);
  });

  it("rejects an unknown factor", () => {
    expect(
      activityInputSchema.safeParse({ ...valid, factorId: "rocket" }).success,
    ).toBe(false);
  });

  it("rejects a negative quantity", () => {
    expect(
      activityInputSchema.safeParse({ ...valid, quantity: -1 }).success,
    ).toBe(false);
  });

  it("accepts a zero quantity", () => {
    expect(
      activityInputSchema.safeParse({ ...valid, quantity: 0 }).success,
    ).toBe(true);
  });

  it("rejects a non-finite quantity", () => {
    expect(
      activityInputSchema.safeParse({ ...valid, quantity: Infinity }).success,
    ).toBe(false);
  });

  it("rejects an unrealistically large quantity", () => {
    expect(
      activityInputSchema.safeParse({ ...valid, quantity: 2_000_000 }).success,
    ).toBe(false);
  });

  it("rejects a malformed date", () => {
    expect(
      activityInputSchema.safeParse({ ...valid, date: "01-01-2026" }).success,
    ).toBe(false);
  });

  it("rejects an over-long note", () => {
    expect(
      activityInputSchema.safeParse({ ...valid, note: "x".repeat(281) })
        .success,
    ).toBe(false);
  });

  it("accepts a note exactly at the length limit", () => {
    expect(
      activityInputSchema.safeParse({ ...valid, note: "x".repeat(280) })
        .success,
    ).toBe(true);
  });

  it("reports a helpful message for an unknown factor", () => {
    const result = activityInputSchema.safeParse({
      ...valid,
      factorId: "rocket",
    });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.issues[0]?.message).toMatch(/unknown activity/i);
    }
  });
});
