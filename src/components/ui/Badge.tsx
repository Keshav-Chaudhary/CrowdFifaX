import { cn } from "@/utils/cn";

type Tone = "neutral" | "positive" | "caution" | "critical" | "accent" | "info";

const TONES: Record<Tone, string> = {
  neutral: "bg-surface-3 text-fg-muted border-[var(--border)]",
  positive:
    "bg-[var(--positive-subtle)] text-[var(--positive)] border-[color:var(--positive-subtle)]",
  caution:
    "bg-[var(--caution-subtle)] text-[var(--caution)] border-[color:var(--caution-subtle)]",
  critical:
    "bg-[var(--critical-subtle)] text-[var(--critical)] border-[color:var(--critical-subtle)]",
  accent:
    "bg-[var(--accent-subtle)] text-[var(--accent)] border-[color:var(--accent-line)]",
  info: "bg-[var(--neutral-subtle)] text-[var(--neutral)] border-[color:var(--neutral-subtle)]",
};

/**
 * A small status/label pill. Tone conveys meaning via both colour and the
 * accompanying text label — colour is never the sole signal.
 */
export function Badge({
  tone = "neutral",
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { tone?: Tone }) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-medium",
        TONES[tone],
        className,
      )}
      {...props}
    />
  );
}
