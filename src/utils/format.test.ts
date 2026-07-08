import { describe, expect, it } from "vitest";
import { formatKg } from "@/utils/format";

describe("formatKg", () => {
  it("shows one decimal below 10 kg", () => {
    expect(formatKg(5.4)).toBe("5.4 kg");
    expect(formatKg(0)).toBe("0.0 kg");
    expect(formatKg(9.99)).toBe("10.0 kg");
  });

  it("rounds to whole kg between 10 and 1000", () => {
    expect(formatKg(42)).toBe("42 kg");
    expect(formatKg(42.6)).toBe("43 kg");
    expect(formatKg(999)).toBe("999 kg");
  });

  it("switches to tonnes at or above 1000 kg", () => {
    expect(formatKg(1000)).toBe("1.00 t");
    expect(formatKg(1500)).toBe("1.50 t");
    expect(formatKg(12345)).toBe("12.35 t");
  });
});
