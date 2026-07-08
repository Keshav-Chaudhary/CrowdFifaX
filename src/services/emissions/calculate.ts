import { CATEGORIES, getFactor } from "./factors";
import type {
  Activity,
  Category,
  ComputedActivity,
  FootprintSummary,
} from "./types";

/** Round to a sensible number of decimals for display without float noise. */
export function round(value: number, decimals = 2): number {
  const factor = 10 ** decimals;
  return Math.round((value + Number.EPSILON) * factor) / factor;
}

/**
 * Compute emissions for a single activity.
 *
 * Returns `null` when the activity references an unknown factor or carries an
 * invalid quantity, so callers can skip bad data rather than crash. This keeps
 * the engine resilient to corrupted persisted state.
 */
export function computeActivity(activity: Activity): ComputedActivity | null {
  const factor = getFactor(activity.factorId);
  if (!factor) return null;
  if (!Number.isFinite(activity.quantity) || activity.quantity < 0) return null;

  return {
    ...activity,
    category: factor.category,
    label: factor.label,
    unit: factor.unit,
    kgCO2e: round(activity.quantity * factor.perUnitKg),
  };
}

/** Compute every valid activity, dropping any that cannot be resolved. */
export function computeActivities(
  activities: readonly Activity[],
): ComputedActivity[] {
  return activities
    .map(computeActivity)
    .filter((a): a is ComputedActivity => a !== null);
}

/** Build an empty per-category total map. */
function emptyByCategory(): Record<Category, number> {
  return CATEGORIES.reduce(
    (acc, category) => {
      acc[category] = 0;
      return acc;
    },
    {} as Record<Category, number>,
  );
}

/**
 * Summarise a set of activities into a total and a per-category breakdown.
 *
 * Accepts raw activities and resolves them internally so callers always get a
 * consistent summary regardless of input validity.
 */
export function summarize(activities: readonly Activity[]): FootprintSummary {
  const computed = computeActivities(activities);
  const byCategory = emptyByCategory();

  for (const activity of computed) {
    byCategory[activity.category] += activity.kgCO2e;
  }

  let totalKg = 0;
  for (const category of CATEGORIES) {
    byCategory[category] = round(byCategory[category]);
    totalKg += byCategory[category];
  }

  return {
    totalKg: round(totalKg),
    byCategory,
    activityCount: computed.length,
  };
}

/**
 * Group total emissions by ISO date, returned sorted ascending. Useful for the
 * trend chart and for detecting momentum over time.
 */
export function dailyTotals(
  activities: readonly Activity[],
): { date: string; kg: number }[] {
  const computed = computeActivities(activities);
  const byDate = new Map<string, number>();

  for (const activity of computed) {
    byDate.set(activity.date, (byDate.get(activity.date) ?? 0) + activity.kgCO2e);
  }

  return [...byDate.entries()]
    .map(([date, kg]) => ({ date, kg: round(kg) }))
    .sort((a, b) => a.date.localeCompare(b.date));
}
