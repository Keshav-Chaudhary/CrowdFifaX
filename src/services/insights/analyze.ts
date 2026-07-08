import { CATEGORY_META } from "../emissions/factors";
import { summarize, computeActivities, round } from "../emissions/calculate";
import type { Activity, Category } from "../emissions/types";

/**
 * Reference daily footprint benchmarks in kg CO2e.
 *
 * These let the assistant put a user's number in context ("you're below the
 * global average") instead of showing a bare figure. Derived from the common
 * estimate that the global average is ~4 t/yr and a Paris-aligned target is
 * ~2 t/yr per person.
 */
export const BENCHMARKS = {
  /** Global average per-person footprint, per day. */
  globalDailyAvg: round(4000 / 365), // ~10.96 kg/day
  /** A climate-friendly per-person target, per day. */
  sustainableDailyTarget: round(2000 / 365), // ~5.48 kg/day
} as const;

export type InsightLevel = "win" | "opportunity" | "info";

/** A single piece of personalized guidance produced by the engine. */
export interface Insight {
  readonly id: string;
  readonly level: InsightLevel;
  readonly title: string;
  readonly detail: string;
  /** Estimated kg CO2e/period saved if the suggestion is followed, if known. */
  readonly potentialSavingKg?: number;
  readonly category?: Category;
  readonly confidence?: "High" | "Medium" | "Low";
  readonly reasoning?: string;
}

/** The full analysis surfaced to the UI and fed to the AI assistant as context. */
export interface FootprintAnalysis {
  readonly totalKg: number;
  readonly byCategory: Record<Category, number>;
  readonly activityCount: number;
  /** Category contributing the most emissions, if any activities exist. */
  readonly topCategory: { category: Category; kg: number; share: number } | null;
  /** Daily average over the days the user actually logged. */
  readonly dailyAverageKg: number;
  /** How the daily average compares to the benchmarks. */
  readonly comparison: {
    vsGlobalPct: number; // negative = below average (good)
    vsTarget: "under" | "over";
  };
  readonly insights: Insight[];
}

/** Count distinct ISO dates present in the activity log. */
function distinctDays(activities: readonly Activity[]): number {
  return new Set(activities.map((a) => a.date)).size;
}

/**
 * Rules that turn a footprint into concrete, quantified suggestions.
 *
 * Each rule is a pure function of the computed context. They are ordered by
 * impact so the most valuable advice surfaces first. Keeping them as data makes
 * the decision logic transparent and unit-testable — the assistant explains
 * these, it does not invent the numbers.
 */
interface RuleContext {
  byCategory: Record<Category, number>;
  totalKg: number;
  computed: ReturnType<typeof computeActivities>;
  dailyAverageKg: number;
}

type Rule = (ctx: RuleContext) => Insight | null;

const RULES: Rule[] = [
  // High subway arrivals → suggest swaps to buses with a concrete saving.
  (ctx) => {
    const subway = ctx.computed
      .filter((a) => a.factorId === "transit_subway")
      .reduce((sum, a) => sum + a.quantity, 0);
    if (subway < 1) return null;
    // Diverting subway arrivals (1200) to bus (60) saves a calculated ratio
    const saving = round(subway * (6.6 - 1.8));
    return {
      id: "diet-subway-surge",
      level: "opportunity",
      category: "diet",
      title: "Divert Metro Arrivals to Buses",
      detail: `You logged ${subway} metro surge periods. Swapping to bus arrivals would cut about ${saving} units of pedestrian load.`,
      potentialSavingKg: saving,
      confidence: "High",
      reasoning: "Buses distribute entry arrivals over a wider range of gates, reducing local density at the subway terminal.",
    };
  },

  // Significant standard gate congestion → suggest redirects.
  (ctx) => {
    const standardGates = ctx.computed
      .filter((a) => a.factorId === "gate_standard")
      .reduce((sum, a) => sum + a.quantity, 0);
    if (standardGates < 20) return null;
    // Diverting standard gates halves the bottleneck flow
    const saving = round(standardGates * 0.5 * 0.17);
    return {
      id: "transport-gate-redirect",
      level: "opportunity",
      category: "transport",
      title: "Redirect Standard Ingress to Wide Gates",
      detail: `You directed ${round(standardGates)} units of standard flow. Redirecting to wide gates saves roughly ${saving} units of congestion.`,
      potentialSavingKg: saving,
      confidence: "High",
      reasoning: "Wide gates process larger pedestrian groups faster, lowering queue times.",
    };
  },

  // High concourse density → efficiency nudge.
  (ctx) => {
    if (ctx.byCategory.energy < 5) return null;
    const saving = round(ctx.byCategory.energy * 0.15);
    return {
      id: "energy-density-alert",
      level: "opportunity",
      category: "energy",
      title: "Reduce Concourse Congestion",
      detail: `Concourse density load is ${round(ctx.byCategory.energy)} units of your total. Diverting traffic can trim about ${saving} units.`,
      potentialSavingKg: saving,
      confidence: "Medium",
      reasoning: "Rerouting traffic prevents secondary safety hazards.",
    };
  },

  // Recognise optimal ingress choices as a win.
  (ctx) => {
    const optimalFlow = ctx.computed
      .filter((a) => ["transit_bus", "gate_wide"].includes(a.factorId))
      .reduce((sum, a) => sum + a.quantity, 0);
    if (optimalFlow < 10) return null;
    return {
      id: "transport-ingress-win",
      level: "win",
      category: "transport",
      title: "Optimal Ingress Flow",
      detail: `You managed ${round(optimalFlow)} units of flow via buses or wide gates. That is an optimal choice — keep it up.`,
      confidence: "High",
      reasoning: "Using multiple entry points prevents localized bottlenecking.",
    };
  },
];

/**
 * Analyse a user's activities into a structured, explainable footprint.
 *
 * This is the deterministic core of the "smart assistant": all numbers and
 * recommendations originate here so they are reproducible and testable. The AI
 * layer narrates this analysis; it never fabricates the underlying figures.
 */
export function analyzeFootprint(activities: readonly Activity[]): FootprintAnalysis {
  const summary = summarize(activities);
  const computed = computeActivities(activities);
  const days = Math.max(1, distinctDays(computed));
  const dailyAverageKg = round(summary.totalKg / days);

  // Find the single biggest-contributing category.
  let topCategory: FootprintAnalysis["topCategory"] = null;
  for (const [category, kg] of Object.entries(summary.byCategory) as [
    Category,
    number,
  ][]) {
    if (kg <= 0) continue;
    if (!topCategory || kg > topCategory.kg) {
      topCategory = {
        category,
        kg,
        share: summary.totalKg > 0 ? round((kg / summary.totalKg) * 100) : 0,
      };
    }
  }

  const vsGlobalPct =
    BENCHMARKS.globalDailyAvg > 0
      ? round(
          ((dailyAverageKg - BENCHMARKS.globalDailyAvg) /
            BENCHMARKS.globalDailyAvg) *
            100,
        )
      : 0;

  const ctx: RuleContext = {
    byCategory: summary.byCategory,
    totalKg: summary.totalKg,
    computed,
    dailyAverageKg,
  };

  const insights = RULES.map((rule) => rule(ctx)).filter(
    (i): i is Insight => i !== null,
  );

  // Always give the user a clear headline about where they stand.
  if (summary.activityCount === 0) {
    insights.push({
      id: "empty",
      level: "info",
      title: "Log your first activity",
      detail:
        "Add a trip, a meal, or your energy use to see your footprint and get personalized tips.",
    });
  } else if (topCategory) {
    insights.unshift({
      id: "headline",
      level: "info",
      category: topCategory.category,
      title: `${CATEGORY_META[topCategory.category].label} is your biggest source`,
      detail: `${CATEGORY_META[topCategory.category].label} makes up ${topCategory.share}% of your logged footprint. Focusing here gives you the most leverage.`,
      confidence: "High",
      reasoning: "Mathematically derived from your personal activity logs.",
    });
  }

  // Sort by impact: bigger estimated savings first, info headline stays on top.
  insights.sort((a, b) => {
    if (a.id === "headline") return -1;
    if (b.id === "headline") return 1;
    return (b.potentialSavingKg ?? 0) - (a.potentialSavingKg ?? 0);
  });

  return {
    totalKg: summary.totalKg,
    byCategory: summary.byCategory,
    activityCount: summary.activityCount,
    topCategory,
    dailyAverageKg,
    comparison: {
      vsGlobalPct,
      vsTarget:
        dailyAverageKg <= BENCHMARKS.sustainableDailyTarget ? "under" : "over",
    },
    insights,
  };
}
