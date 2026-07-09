import { CATEGORY_META } from "../emissions/factors";
import { summarize, computeActivities, round } from "../emissions/calculate";
import type { Activity, Category } from "../emissions/types";

/**
 * Reference daily crowd-ops benchmarks in kg CO2e.
 */
export const BENCHMARKS = {
  globalDailyAvg: round(4000 / 365),
  sustainableDailyTarget: round(2000 / 365),
} as const;

export type InsightLevel = "win" | "opportunity" | "info";

export interface Insight {
  readonly id: string;
  readonly level: InsightLevel;
  readonly title: string;
  readonly detail: string;
  readonly potentialSavingKg?: number;
  readonly category?: Category;
  readonly confidence?: "High" | "Medium" | "Low";
  readonly reasoning?: string;
}

export interface FootprintAnalysis {
  readonly totalKg: number;
  readonly byCategory: Record<Category, number>;
  readonly activityCount: number;
  readonly topCategory: { category: Category; kg: number; share: number } | null;
  readonly dailyAverageKg: number;
  readonly comparison: {
    vsGlobalPct: number;
    vsTarget: "under" | "over";
  };
  readonly insights: Insight[];
}

function distinctDays(activities: readonly Activity[]): number {
  return new Set(activities.map((a) => a.date)).size;
}

interface RuleContext {
  byCategory: Record<Category, number>;
  totalKg: number;
  computed: ReturnType<typeof computeActivities>;
  dailyAverageKg: number;
}

type Rule = (ctx: RuleContext) => Insight | null;

const RULES: Rule[] = [
  (ctx) => {
    const subway = ctx.computed
      .filter((a) => a.factorId === "transit_subway")
      .reduce((sum, a) => sum + a.quantity, 0);
    if (subway < 1) return null;
    const saving = round(subway * (6.6 - 1.8));
    return {
      id: "ops-subway-surge",
      level: "opportunity",
      category: "transit",
      title: "Divert Metro Arrivals to Buses",
      detail: `You logged ${subway} metro surge periods. Swapping to bus arrivals would cut about ${saving} units of pedestrian load.`,
      potentialSavingKg: saving,
      confidence: "High",
      reasoning: "Buses distribute entry arrivals over a wider range of gates, reducing local density at the subway terminal.",
    };
  },

  (ctx) => {
    const standardGates = ctx.computed
      .filter((a) => a.factorId === "gate_standard")
      .reduce((sum, a) => sum + a.quantity, 0);
    if (standardGates < 20) return null;
    const saving = round(standardGates * 0.5 * 0.17);
    return {
      id: "ops-gate-redirect",
      level: "opportunity",
      category: "transit",
      title: "Redirect Standard Ingress to Wide Gates",
      detail: `You directed ${round(standardGates)} units of standard flow. Redirecting to wide gates saves roughly ${saving} units of congestion.`,
      potentialSavingKg: saving,
      confidence: "High",
      reasoning: "Wide gates process larger pedestrian groups faster, lowering queue times.",
    };
  },

  (ctx) => {
    if (ctx.byCategory.energy < 5) return null;
    const saving = round(ctx.byCategory.energy * 0.15);
    return {
      id: "ops-density-alert",
      level: "opportunity",
      category: "energy",
      title: "Reduce Concourse Congestion",
      detail: `Concourse density load is ${round(ctx.byCategory.energy)} units of your total. Diverting traffic can trim about ${saving} units.`,
      potentialSavingKg: saving,
      confidence: "Medium",
      reasoning: "Rerouting traffic prevents secondary safety hazards.",
    };
  },

  (ctx) => {
    const optimalFlow = ctx.computed
      .filter((a) => ["transit_bus", "gate_wide"].includes(a.factorId))
      .reduce((sum, a) => sum + a.quantity, 0);
    if (optimalFlow < 10) return null;
    return {
      id: "ops-ingress-win",
      level: "win",
      category: "transit",
      title: "Optimal Ingress Flow",
      detail: `You managed ${round(optimalFlow)} units of flow via buses or wide gates. That is an optimal choice — keep it up.`,
      confidence: "High",
      reasoning: "Using multiple entry points prevents localized bottlenecking.",
    };
  },
];

function getTopCategory(summary: ReturnType<typeof summarize>) {
  let top: { category: Category; kg: number; share: number } | null = null;
  for (const [category, kg] of Object.entries(summary.byCategory) as [Category, number][]) {
    if (kg > 0 && (!top || kg > top.kg)) {
      top = { category, kg, share: summary.totalKg > 0 ? round((kg / summary.totalKg) * 100) : 0 };
    }
  }
  return top;
}

function generateHeadlines(summary: ReturnType<typeof summarize>, top: ReturnType<typeof getTopCategory>): Insight[] {
  if (summary.activityCount === 0) {
    return [{ id: "empty", level: "info", title: "Log your first activity", detail: "Add a transit or crowd control log to see analysis." }];
  }
  if (!top) return [];
  return [{
    id: "headline",
    level: "info",
    category: top.category,
    title: `${CATEGORY_META[top.category].label} is your biggest source`,
    detail: `${CATEGORY_META[top.category].label} makes up ${top.share}% of your logged activity. Focusing here gives you the most leverage.`,
    confidence: "High",
    reasoning: "Mathematically derived from your personal activity logs.",
  }];
}

export function analyzeFootprint(activities: readonly Activity[]): FootprintAnalysis {
  const summary = summarize(activities);
  const computed = computeActivities(activities);
  const days = Math.max(1, distinctDays(computed));
  const dailyAverageKg = round(summary.totalKg / days);

  const topCategory = getTopCategory(summary);

  const vsGlobalPct =
    BENCHMARKS.globalDailyAvg > 0
      ? round(((dailyAverageKg - BENCHMARKS.globalDailyAvg) / BENCHMARKS.globalDailyAvg) * 100)
      : 0;

  const ctx: RuleContext = {
    byCategory: summary.byCategory,
    totalKg: summary.totalKg,
    computed,
    dailyAverageKg,
  };

  const ruleInsights = RULES.map((rule) => rule(ctx)).filter(
    (i): i is Insight => i !== null,
  );

  const headlines = generateHeadlines(summary, topCategory);
  const insights = [...headlines, ...ruleInsights];
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
      vsTarget: dailyAverageKg <= BENCHMARKS.sustainableDailyTarget ? "under" : "over",
    },
    insights,
  };
}
