import { ArrowDown, ArrowUp, type LucideIcon } from "lucide-react";

import { cn } from "@/utils/cn";

interface StatCardProps {
  label: string;
  value: string;
  unit?: string;
  icon?: LucideIcon;
  /** Optional trend chip: negative delta is framed as good (less carbon). */
  delta?: { value: number; goodWhenNegative?: boolean };
  hint?: string;
}

/**
 * A single headline metric. The optional delta is colour- and arrow-coded, and
 * because lower emissions are better, a negative delta is treated as positive.
 */
export function StatCard({
  label,
  value,
  unit,
  icon: Icon,
  delta,
  hint,
}: StatCardProps) {
  const good =
    delta &&
    (delta.goodWhenNegative ?? true ? delta.value <= 0 : delta.value >= 0);

  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-5 sm:p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)] h-full flex flex-col justify-center">
      <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-[var(--accent-subtle)] blur-[40px] opacity-0 transition-transform group-hover:scale-150 group-hover:opacity-100 pointer-events-none" />
      <div className="relative z-10 flex items-center justify-between mb-4">
        <p className="text-sm font-bold uppercase tracking-widest text-fg-muted">{label}</p>
        {Icon && (
          <span className="flex size-10 items-center justify-center rounded-xl bg-surface-3 border border-[var(--border)] text-[var(--accent)] group-hover:border-[var(--accent)] transition-colors">
            <Icon aria-hidden="true" className="size-5 group-hover:scale-110 transition-transform" />
          </span>
        )}
      </div>
      <div className="relative z-10 flex items-baseline gap-2">
        <span className="text-4xl sm:text-5xl font-black tabular-nums tracking-tighter text-transparent bg-clip-text bg-gradient-to-br from-fg to-fg-subtle drop-shadow-sm">
          {value}
        </span>
        {unit && <span className="text-sm font-bold text-fg-muted">{unit}</span>}
      </div>
      {delta && (
        <div
          className={cn(
            "mt-3 inline-flex items-center gap-1 text-sm font-medium",
            good ? "text-[var(--positive)]" : "text-[var(--caution)]",
          )}
        >
          {delta.value <= 0 ? (
            <ArrowDown aria-hidden="true" className="size-4" />
          ) : (
            <ArrowUp aria-hidden="true" className="size-4" />
          )}
          <span>{Math.abs(delta.value)}%</span>
          {hint && <span className="font-normal text-fg-subtle ml-1">{hint}</span>}
        </div>
      )}
      {!delta && hint && <p className="mt-3 text-sm text-fg-subtle">{hint}</p>}
    </div>
  );
}
