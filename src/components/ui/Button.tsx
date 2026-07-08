import { forwardRef } from "react";
import { cn } from "@/utils/cn";

type Variant = "primary" | "secondary" | "ghost" | "outline" | "danger";
type Size = "sm" | "md" | "lg";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const VARIANTS: Record<Variant, string> = {
  primary:
    "bg-accent text-[var(--accent-fg)] hover:bg-[var(--accent-strong)] font-semibold",
  secondary:
    "bg-surface-3 text-fg hover:bg-[var(--border)] border border-[var(--border)]",
  ghost: "bg-transparent text-fg-muted hover:text-fg hover:bg-surface-2",
  outline:
    "bg-transparent text-fg border border-[var(--border-strong)] hover:bg-surface-2 hover:border-[var(--fg-subtle)]",
  danger:
    "bg-[var(--critical-subtle)] text-[var(--critical)] hover:bg-[var(--critical)] hover:text-white border border-[color:var(--critical-subtle)]",
};

const SIZES: Record<Size, string> = {
  sm: "h-8 px-3 text-sm gap-1.5 rounded-[var(--r-sm)]",
  md: "h-10 px-4 text-sm gap-2 rounded-[var(--r-md)]",
  lg: "h-12 px-6 text-base gap-2.5 rounded-[var(--r-md)]",
};

/**
 * The primary action element. Variants cover the full hierarchy from a filled
 * accent CTA down to a quiet ghost button. Focus styling is inherited from the
 * global `:focus-visible` rule, so keyboard users always get a clear ring.
 */
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    { className, variant = "primary", size = "md", type, ...props },
    ref,
  ) {
    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={cn(
          "inline-flex items-center justify-center whitespace-nowrap transition-all duration-150 cursor-pointer focus:!outline-none focus-visible:!outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)]",
          "disabled:pointer-events-none disabled:opacity-50",
          VARIANTS[variant],
          SIZES[size],
          className,
        )}
        {...props}
      />
    );
  },
);
