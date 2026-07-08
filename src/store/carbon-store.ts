"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Activity } from "../services/emissions/types";
import {
  type ActivityInput,
  activityInputSchema,
  makeId,
} from "./helpers";

/** Optional reduction goal: a daily footprint target in kg CO2e. */
export interface Goal {
  /** Target daily footprint in kg CO2e. */
  readonly dailyTargetKg: number;
}

export interface CarbonState {
  activities: Activity[];
  goal: Goal | null;

  /**
   * Validate and add an activity. Returns the created activity, or an error
   * message describing why the input was rejected. Validation lives in the
   * shared zod schema so the same rules apply on the server.
   */
  addActivity: (input: ActivityInput) => { ok: true; activity: Activity } | {
    ok: false;
    error: string;
  };
  updateActivity: (id: string, input: ActivityInput) => { ok: true; activity: Activity } | {
    ok: false;
    error: string;
  };
  removeActivity: (id: string) => void;
  setGoal: (dailyTargetKg: number | null) => void;
  clearAll: () => void;
}

export const STORAGE_KEY = "carbon-footprint-v1";

/**
 * Global app store, persisted to `localStorage` so a user's log survives page
 * reloads without any backend or account. All mutations validate their input
 * through {@link activityInputSchema} to keep persisted data trustworthy.
 */
export const useCarbonStore = create<CarbonState>()(
  persist(
    (set) => ({
      activities: [],
      goal: null,

      addActivity: (input) => {
        const parsed = activityInputSchema.safeParse(input);
        if (!parsed.success) {
          return {
            ok: false,
            error: parsed.error.issues[0]?.message ?? "Invalid activity",
          };
        }
        const activity: Activity = { id: makeId(), ...parsed.data };
        set((state) => ({ activities: [activity, ...state.activities] }));
        return { ok: true, activity };
      },

      updateActivity: (id, input) => {
        const parsed = activityInputSchema.safeParse(input);
        if (!parsed.success) {
          return {
            ok: false,
            error: parsed.error.issues[0]?.message ?? "Invalid activity",
          };
        }
        const updatedActivity: Activity = { id, ...parsed.data };
        set((state) => ({
          activities: state.activities.map((a) => (a.id === id ? updatedActivity : a)),
        }));
        return { ok: true, activity: updatedActivity };
      },

      removeActivity: (id) =>
        set((state) => ({
          activities: state.activities.filter((a) => a.id !== id),
        })),

      setGoal: (dailyTargetKg) =>
        set(() => ({
          goal:
            dailyTargetKg === null || !Number.isFinite(dailyTargetKg)
              ? null
              : { dailyTargetKg: Math.max(0, dailyTargetKg) },
        })),

      clearAll: () => set(() => ({ activities: [], goal: null })),
    }),
    {
      name: STORAGE_KEY,
      version: 1,
    },
  ),
);
