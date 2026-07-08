import { describe, expect, it } from "vitest";
import {
  EMISSION_FACTORS,
  getFactor,
  CATEGORY_META,
  CATEGORIES,
} from "@/services/emissions/factors";
import type { Category } from "@/services/emissions/types";

describe("EMISSION_FACTORS data integrity", () => {
  it("contains a meaningful number of factors", () => {
    expect(EMISSION_FACTORS.length).toBeGreaterThanOrEqual(10);
  });

  it("has unique ids", () => {
    const ids = EMISSION_FACTORS.map((f) => f.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("uses only known categories", () => {
    const valid = new Set<Category>(CATEGORIES);
    for (const f of EMISSION_FACTORS) {
      expect(valid.has(f.category)).toBe(true);
    }
  });

  it("has a non-negative, finite per-unit factor for every entry", () => {
    for (const f of EMISSION_FACTORS) {
      expect(f.perUnitKg).toBeGreaterThanOrEqual(0);
      expect(Number.isFinite(f.perUnitKg)).toBe(true);
    }
  });

  it("has at least one zero-emission option (e.g. bike/walk)", () => {
    expect(EMISSION_FACTORS.some((f) => f.perUnitKg === 0)).toBe(true);
  });

  it("has a non-empty label, unit, and source for every entry", () => {
    for (const f of EMISSION_FACTORS) {
      expect(f.label.length).toBeGreaterThan(0);
      expect(f.unit.length).toBeGreaterThan(0);
      expect(f.source.length).toBeGreaterThan(0);
    }
  });

  it("uses lower_snake_case ids", () => {
    for (const f of EMISSION_FACTORS) {
      expect(f.id).toMatch(/^[a-z0-9]+(_[a-z0-9]+)*$/);
    }
  });

  it("covers every category with at least one factor", () => {
    for (const category of CATEGORIES) {
      const inCategory = EMISSION_FACTORS.filter(
        (f) => f.category === category,
      );
      expect(inCategory.length).toBeGreaterThan(0);
    }
  });
});

describe("getFactor", () => {
  it("returns the factor for a known id", () => {
    const factor = getFactor("gate_standard");
    expect(factor).toBeDefined();
    expect(factor?.id).toBe("gate_standard");
  });

  it("returns undefined for an unknown id", () => {
    expect(getFactor("does_not_exist")).toBeUndefined();
  });

  it("returns undefined for an empty id", () => {
    expect(getFactor("")).toBeUndefined();
  });

  it("resolves every factor id round-trip", () => {
    for (const f of EMISSION_FACTORS) {
      expect(getFactor(f.id)).toEqual(f);
    }
  });
});

describe("CATEGORY_META", () => {
  it("has metadata for every category", () => {
    for (const category of CATEGORIES) {
      expect(CATEGORY_META[category]).toBeDefined();
      expect(CATEGORY_META[category].label.length).toBeGreaterThan(0);
    }
  });

  it("has no metadata keys beyond the known categories", () => {
    const keys = Object.keys(CATEGORY_META) as Category[];
    expect(new Set(keys)).toEqual(new Set(CATEGORIES));
  });
});

describe("CATEGORIES", () => {
  it("contains the expected verticals", () => {
    expect([...CATEGORIES].sort()).toEqual(
      ["custom", "diet", "energy", "shopping", "transport", "waste"].sort(),
    );
  });

  it("has no duplicates", () => {
    expect(new Set(CATEGORIES).size).toBe(CATEGORIES.length);
  });
});
