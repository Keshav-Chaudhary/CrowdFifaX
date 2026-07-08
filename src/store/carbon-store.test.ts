import { beforeEach, describe, expect, it } from "vitest";
import { useCarbonStore } from "@/store/carbon-store";
import {
  activityInputSchema,
  makeId,
  todayISO,
} from "@/store/helpers";

// Reset store state between tests (localStorage is jsdom-backed).
beforeEach(() => {
  useCarbonStore.setState({ activities: [], goal: null });
  localStorage.clear();
});

describe("helpers", () => {
  it("formats today as ISO YYYY-MM-DD", () => {
    expect(todayISO(new Date("2026-03-05T12:00:00"))).toBe("2026-03-05");
    expect(todayISO(new Date("2026-12-31T23:59:00"))).toBe("2026-12-31");
  });

  it("generates unique ids", () => {
    const a = makeId();
    const b = makeId();
    expect(a).not.toBe(b);
    expect(a.length).toBeGreaterThan(0);
  });

  it("generates unique ids using fallback when crypto is unavailable", () => {
    const originalCrypto = globalThis.crypto;
    // Temporarily delete/override crypto
    Object.defineProperty(globalThis, "crypto", {
      value: undefined,
      writable: true,
      configurable: true,
    });
    
    const a = makeId();
    const b = makeId();
    expect(a).not.toBe(b);
    expect(a.startsWith("id-")).toBe(true);

    // Restore original crypto
    Object.defineProperty(globalThis, "crypto", {
      value: originalCrypto,
      writable: true,
      configurable: true,
    });
  });
});

describe("activityInputSchema", () => {
  it("accepts a valid activity", () => {
    const result = activityInputSchema.safeParse({
      factorId: "gate_standard",
      quantity: 12,
      date: "2026-01-01",
    });
    expect(result.success).toBe(true);
  });

  it("rejects an unknown factor", () => {
    const result = activityInputSchema.safeParse({
      factorId: "spaceship",
      quantity: 12,
      date: "2026-01-01",
    });
    expect(result.success).toBe(false);
  });

  it.each([
    ["negative quantity", { quantity: -1 }],
    ["non-finite quantity", { quantity: Infinity }],
    ["bad date", { date: "01/01/2026" }],
  ])("rejects %s", (_label, override) => {
    const result = activityInputSchema.safeParse({
      factorId: "gate_standard",
      quantity: 10,
      date: "2026-01-01",
      ...override,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an over-long note", () => {
    const result = activityInputSchema.safeParse({
      factorId: "gate_standard",
      quantity: 10,
      date: "2026-01-01",
      note: "x".repeat(281),
    });
    expect(result.success).toBe(false);
  });
});

describe("useCarbonStore", () => {
  it("adds a valid activity to the front of the list", () => {
    const { addActivity } = useCarbonStore.getState();
    const r1 = addActivity({ factorId: "gate_standard", quantity: 10, date: "2026-01-01" });
    const r2 = addActivity({ factorId: "gate_wide", quantity: 5, date: "2026-01-02" });
    expect(r1.ok).toBe(true);
    expect(r2.ok).toBe(true);
    const { activities } = useCarbonStore.getState();
    expect(activities).toHaveLength(2);
    expect(activities[0].factorId).toBe("gate_wide"); // newest first
  });

  it("rejects an invalid activity and does not store it", () => {
    const result = useCarbonStore
      .getState()
      .addActivity({ factorId: "nope", quantity: 10, date: "2026-01-01" });
    expect(result.ok).toBe(false);
    if (!result.ok) expect(result.error).toMatch(/unknown/i);
    expect(useCarbonStore.getState().activities).toHaveLength(0);
  });

  it("updates an existing activity", () => {
    const { addActivity, updateActivity } = useCarbonStore.getState();
    const added = addActivity({ factorId: "gate_wide", quantity: 5, date: "2026-01-02" });
    expect(added.ok).toBe(true);
    
    if (added.ok) {
      const updated = updateActivity(added.activity.id, {
        factorId: "gate_wide",
        quantity: 15,
        date: "2026-01-02",
        note: "Updated note",
      });
      expect(updated.ok).toBe(true);
      expect(useCarbonStore.getState().activities[0].quantity).toBe(15);
      expect(useCarbonStore.getState().activities[0].note).toBe("Updated note");
    }
  });

  it("rejects an invalid update and does not change state", () => {
    const { addActivity, updateActivity } = useCarbonStore.getState();
    const added = addActivity({ factorId: "gate_wide", quantity: 5, date: "2026-01-02" });
    expect(added.ok).toBe(true);
    
    if (added.ok) {
      const updated = updateActivity(added.activity.id, {
        factorId: "nope",
        quantity: 5,
        date: "2026-01-02",
      });
      expect(updated.ok).toBe(false);
      expect(useCarbonStore.getState().activities[0].quantity).toBe(5); // unchanged
    }
  });

  it("updates an existing activity in a list with multiple activities", () => {
    const { addActivity, updateActivity } = useCarbonStore.getState();
    const other = addActivity({ factorId: "gate_standard", quantity: 10, date: "2026-01-01" });
    const added = addActivity({ factorId: "gate_wide", quantity: 5, date: "2026-01-02" });
    expect(other.ok).toBe(true);
    expect(added.ok).toBe(true);
    
    if (added.ok && other.ok) {
      const updated = updateActivity(added.activity.id, {
        factorId: "gate_wide",
        quantity: 15,
        date: "2026-01-02",
        note: "Updated note",
      });
      expect(updated.ok).toBe(true);
      
      const state = useCarbonStore.getState();
      expect(state.activities).toHaveLength(2);
      // Verify the updated activity
      const updatedItem = state.activities.find(a => a.id === added.activity.id);
      expect(updatedItem?.quantity).toBe(15);
      // Verify the untouched activity
      const untouchedItem = state.activities.find(a => a.id === other.activity.id);
      expect(untouchedItem?.quantity).toBe(10);
    }
  });

  it("removes an activity by id", () => {
    const { addActivity } = useCarbonStore.getState();
    const added = addActivity({ factorId: "gate_wide", quantity: 5, date: "2026-01-02" });
    expect(added.ok).toBe(true);
    if (added.ok) useCarbonStore.getState().removeActivity(added.activity.id);
    expect(useCarbonStore.getState().activities).toHaveLength(0);
  });

  it("sets and clears a goal, clamping negatives to zero", () => {
    const { setGoal } = useCarbonStore.getState();
    setGoal(5);
    expect(useCarbonStore.getState().goal?.dailyTargetKg).toBe(5);
    setGoal(-3);
    expect(useCarbonStore.getState().goal?.dailyTargetKg).toBe(0);
    setGoal(null);
    expect(useCarbonStore.getState().goal).toBeNull();
    setGoal(Infinity);
    expect(useCarbonStore.getState().goal).toBeNull();
    setGoal(NaN);
    expect(useCarbonStore.getState().goal).toBeNull();
  });

  it("clears all data", () => {
    const { addActivity, setGoal, clearAll } = useCarbonStore.getState();
    addActivity({ factorId: "gate_wide", quantity: 5, date: "2026-01-02" });
    setGoal(5);
    clearAll();
    const state = useCarbonStore.getState();
    expect(state.activities).toHaveLength(0);
    expect(state.goal).toBeNull();
  });
});
