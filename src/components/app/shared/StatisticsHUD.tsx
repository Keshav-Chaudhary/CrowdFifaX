"use client";

import { formatKg } from "@/components/ui";

interface StatisticsHUDProps {
  filteredCount: number;
  totalEmissions: number;
  maxImpact: number;
  avgImpact: number;
}

export function StatisticsHUD({
  filteredCount,
  totalEmissions,
  maxImpact,
  avgImpact,
}: StatisticsHUDProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 py-6 border-b border-[var(--border-faint)] text-xs text-fg-subtle">
      <div className="p-4 rounded-2xl bg-surface-3 border border-[var(--border-faint)] shadow-sm">
        <span className="block text-fg-muted font-medium uppercase tracking-wider text-[10px]">Filtered Count</span>
        <span className="block text-xl font-bold text-fg mt-1 tnum">{filteredCount}</span>
      </div>
      <div className="p-4 rounded-2xl bg-surface-3 border border-[var(--border-faint)] shadow-sm">
        <span className="block text-fg-muted font-medium uppercase tracking-wider text-[10px]">Emissions Sum</span>
        <span className="block text-xl font-bold text-[var(--accent)] mt-1 tnum">{formatKg(totalEmissions)}</span>
      </div>
      <div className="p-4 rounded-2xl bg-surface-3 border border-[var(--border-faint)] shadow-sm">
        <span className="block text-fg-muted font-medium uppercase tracking-wider text-[10px]">Peak Activity</span>
        <span className="block text-xl font-bold text-fg mt-1 tnum">{formatKg(maxImpact)}</span>
      </div>
      <div className="p-4 rounded-2xl bg-surface-3 border border-[var(--border-faint)] shadow-sm">
        <span className="block text-fg-muted font-medium uppercase tracking-wider text-[10px]">Average Impact</span>
        <span className="block text-xl font-bold text-fg mt-1 tnum">{formatKg(avgImpact)}</span>
      </div>
    </div>
  );
}
