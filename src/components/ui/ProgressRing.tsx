import { cn } from "@/utils/cn";

interface ProgressRingProps {
  /** 0–100+ percentage; values over 100 clamp the arc but show the real label. */
  value: number;
  size?: number;
  strokeWidth?: number;
  label?: React.ReactNode;
  sublabel?: string;
  /** Accessible name for the progressbar. Falls back to the sublabel, then a default. */
  ariaLabel?: string;
  /** Override the arc colour; defaults to the accent, turns critical when over. */
  tone?: "accent" | "caution" | "critical";
  className?: string;
}

const TONE_VAR: Record<NonNullable<ProgressRingProps["tone"]>, string> = {
  accent: "var(--accent)",
  caution: "var(--caution)",
  critical: "var(--critical)",
};

/**
 * Circular progress indicator drawn with SVG. Decorative arc is `aria-hidden`;
 * the accessible value is exposed via role="progressbar" on the wrapper, which
 * always carries an accessible name (aria-valuetext mirrors the visible label).
 */
export function ProgressRing({
  value,
  size = 96,
  strokeWidth = 8,
  label,
  sublabel,
  ariaLabel,
  tone = "accent",
  className,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const clamped = Math.max(0, Math.min(100, value));
  const offset = circumference - (clamped / 100) * circumference;
  const accessibleName = ariaLabel ?? sublabel ?? "Progress";

  return (
    <div
      role="progressbar"
      aria-label={accessibleName}
      aria-valuenow={Math.round(value)}
      aria-valuemin={0}
      aria-valuemax={100}
      className={cn("relative inline-flex items-center justify-center", className)}
      style={{ width: size, height: size }}
    >
      <svg width={size} height={size} aria-hidden="true" className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--border)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={TONE_VAR[tone]}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.6s cubic-bezier(0.22,1,0.36,1)" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {label && (
          <span className="tnum text-lg font-bold leading-none text-fg">
            {label}
          </span>
        )}
        {sublabel && (
          <span className="mt-0.5 text-xs text-fg-muted">{sublabel}</span>
        )}
      </div>
    </div>
  );
}
