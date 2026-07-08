"use client";

import { useId } from "react";
import { cn } from "@/utils/cn";

interface FieldProps {
  label: string;
  /** Helper text shown below the label, wired via aria-describedby. */
  hint?: string;
  /** Error message; when present it is announced and replaces the hint. */
  error?: string;
  /** Visually hide the label (still available to screen readers). */
  hideLabel?: boolean;
  className?: string;
  /**
   * Render-prop receiving the ids to wire onto the control:
   * `id`, `aria-describedby`, and `aria-invalid`.
   */
  children: (ids: {
    id: string;
    "aria-describedby": string | undefined;
    "aria-invalid": boolean | undefined;
  }) => React.ReactNode;
}

/**
 * Accessible form-field scaffold: associates a label, optional hint, and error
 * with its control and wires the correct ARIA attributes. Centralising this
 * keeps every form field consistently labelled and announced.
 */
export function Field({
  label,
  hint,
  error,
  hideLabel,
  className,
  children,
}: FieldProps) {
  const id = useId();
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = error ? errorId : hint ? hintId : undefined;

  return (
    <div className={cn("flex flex-col gap-1.5 min-w-0", className)}>
      <label
        htmlFor={id}
        className={cn(
          "text-sm font-medium text-fg",
          hideLabel && "sr-only",
        )}
      >
        {label}
      </label>

      {children({
        id,
        "aria-describedby": describedBy,
        "aria-invalid": error ? true : undefined,
      })}

      {error ? (
        <p id={errorId} role="alert" className="text-sm text-[var(--critical)]">
          {error}
        </p>
      ) : hint ? (
        <p id={hintId} className="text-sm text-fg-muted">
          {hint}
        </p>
      ) : null}
    </div>
  );
}
