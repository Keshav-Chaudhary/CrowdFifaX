import { forwardRef } from "react";
import { cn } from "@/utils/cn";

/**
 * Text/number/date input with consistent styling and focus treatment. Always
 * pair with a `<label>` (e.g. via the Field component) for accessibility.
 */
export const Input = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(function Input({ className, ...props }, ref) {
  return (
    <input
      ref={ref}
      className={cn(
        "h-10 w-full rounded-[var(--r-md)] border px-3 text-sm",
        "border-[var(--border-strong)] bg-surface-2 text-fg placeholder:text-fg-subtle",
        "transition-colors hover:border-[var(--fg-subtle)] focus:border-[var(--accent)]",
        "focus:!outline-none focus-visible:!outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]",
        "disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});

/**
 * Multi-line text input used by the assistant composer and notes.
 */
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  React.TextareaHTMLAttributes<HTMLTextAreaElement>
>(function Textarea({ className, ...props }, ref) {
  return (
    <textarea
      ref={ref}
      className={cn(
        "w-full rounded-[var(--r-md)] border px-3 py-2 text-sm",
        "border-[var(--border-strong)] bg-surface-2 text-fg placeholder:text-fg-subtle",
        "transition-colors hover:border-[var(--fg-subtle)] focus:border-[var(--accent)]",
        "focus:!outline-none focus-visible:!outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]",
        "resize-none disabled:opacity-50",
        className,
      )}
      {...props}
    />
  );
});
