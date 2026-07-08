import { describe, expect, it } from "vitest";
import {
  computeActivity,
  computeActivities,
  dailyTotals,
  round,
  summarize,
} from "@/services/emissions/calculate";
import { EMISSION_FACTORS, getFactor } from "@/services/emissions/factors";
import type { Activity } from "@/services/emissions/types";

describe("round", () => {
  it("rounds half up in a float-safe way", () => {
    expect(round(1.005)).toBe(1.01); // naive Math.round(1.005*100)/100 gives 1.0
    expect(round(0.17 * 12)).toBe(2.04);
  });

  it("respects a custom precision", () => {
    expect(round(1.23456, 3)).toBe(1.235);
  });
});

describe("emission factors", () => {
  it("has unique ids", () => {
    const ids = EMISSION_FACTORS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("has non-negative factors and a source for every entry", () => {
    for (const factor of EMISSION_FACTORS) {
      expect(factor.perUnitKg).toBeGreaterThanOrEqual(0);
      expect(factor.source.length).toBeGreaterThan(0);
      expect(factor.unit.length).toBeGreaterThan(0);
    }
  });

  it("resolves known factors and rejects unknown ones", () => {
    expect(getFactor("gate_standard")?.category).toBe("transport");
    expect(getFactor("nope")).toBeUndefined();
  });
});

describe("computeActivity", () => {
  it("multiplies quantity by the factor", () => {
    const result = computeActivity({
      id: "1",
      factorId: "gate_standard",
      quantity: 10,
      date: "2026-01-01",
    });
    expect(result?.kgCO2e).toBe(450);
    expect(result?.category).toBe("transport");
    expect(result?.unit).toBe("min");
  });

  it("returns zero for a zero-emission factor", () => {
    const result = computeActivity({
      id: "1",
      factorId: "transit_walk",
      quantity: 20,
      date: "2026-01-01",
    });
    expect(result?.kgCO2e).toBe(0);
  });

  it("returns null for an unknown factor", () => {
    expect(
      computeActivity({
        id: "1",
        factorId: "teleporter",
        quantity: 5,
        date: "2026-01-01",
      }),
    ).toBeNull();
  });

  it.each([NaN, Infinity, -1])(
    "returns null for invalid quantity %s",
    (quantity) => {
      expect(
        computeActivity({
          id: "1",
          factorId: "gate_standard",
          quantity,
          date: "2026-01-01",
        }),
      ).toBeNull();
    },
  );
});

describe("computeActivities", () => {
  it("drops invalid activities instead of throwing", () => {
    const activities: Activity[] = [
      { id: "1", factorId: "gate_standard", quantity: 10, date: "2026-01-01" },
      { id: "2", factorId: "unknown", quantity: 10, date: "2026-01-01" },
      { id: "3", factorId: "gate_wide", quantity: -5, date: "2026-01-01" },
    ];
    const computed = computeActivities(activities);
    expect(computed).toHaveLength(1);
    expect(computed[0].id).toBe("1");
  });
});

describe("summarize", () => {
  const activities: Activity[] = [
    { id: "1", factorId: "gate_standard", quantity: 10, date: "2026-01-01" }, // 450 transport
    { id: "2", factorId: "gate_wide", quantity: 100, date: "2026-01-02" }, // 2000 transport
    { id: "3", factorId: "conc_safe", quantity: 5, date: "2026-01-02" }, // 7.5 energy
    { id: "4", factorId: "transit_bus", quantity: 2, date: "2026-01-03" }, // 120 diet
  ];

  it("totals across categories", () => {
    const summary = summarize(activities);
    expect(summary.byCategory.transport).toBe(2450);
    expect(summary.byCategory.energy).toBe(7.5);
    expect(summary.byCategory.diet).toBe(120);
    expect(summary.byCategory.shopping).toBe(0);
    expect(summary.totalKg).toBe(2577.5);
    expect(summary.activityCount).toBe(4);
  });

  it("returns an all-zero summary for no activities", () => {
    const summary = summarize([]);
    expect(summary.totalKg).toBe(0);
    expect(summary.activityCount).toBe(0);
    expect(summary.byCategory.transport).toBe(0);
  });

  it("ignores invalid activities in the total", () => {
    const summary = summarize([
      ...activities,
      { id: "x", factorId: "bogus", quantity: 999, date: "2026-01-04" },
    ]);
    expect(summary.activityCount).toBe(4);
    expect(summary.totalKg).toBe(2577.5);
  });
});

describe("dailyTotals", () => {
  it("groups by date and sorts ascending", () => {
    const totals = dailyTotals([
      { id: "1", factorId: "gate_standard", quantity: 10, date: "2026-01-02" }, // 450
      { id: "2", factorId: "gate_wide", quantity: 100, date: "2026-01-01" }, // 2000
      { id: "3", factorId: "gate_standard", quantity: 10, date: "2026-01-02" }, // 450
    ]);
    expect(totals).toEqual([
      { date: "2026-01-01", kg: 2000 },
      { date: "2026-01-02", kg: 900 },
    ]);
  });

  it("returns an empty array for no activities", () => {
    expect(dailyTotals([])).toEqual([]);
  });
});
