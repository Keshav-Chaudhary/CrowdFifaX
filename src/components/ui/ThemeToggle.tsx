"use client";

import { Moon, Sun } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { cn } from "@/utils/cn";

/**
 * Premium animated pill theme toggle.
 * Shows both options; the active one has a sliding highlight + icon.
 */
export function ThemeToggle({ className }: { className?: string }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      title={`Switch to ${theme === "dark" ? "light" : "dark"} theme`}
      className={cn(
        "relative flex h-8 w-16 cursor-pointer items-center rounded-full border border-[var(--border-strong)] bg-surface-3 p-0.5 shadow-inner transition-colors duration-300 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]",
        className,
      )}
    >
      {/* Sliding pill */}
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-0.5 h-[calc(100%-4px)] w-[calc(50%-2px)] rounded-full shadow-sm transition-all duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)]",
          theme === "dark"
            ? "left-0.5 bg-[var(--accent-subtle)] border border-[var(--accent-line)] shadow-none"
            : "left-[calc(50%+1px)] bg-[var(--surface-2,#fff)] shadow-sm border border-transparent",
        )}
      />
      {/* Moon icon — left slot */}
      <span
        aria-hidden="true"
        className={cn(
          "relative z-10 flex w-1/2 items-center justify-center transition-all duration-300",
          theme === "dark" ? "text-[var(--accent)]" : "text-fg-muted",
        )}
      >
        <Moon className="size-3.5" />
      </span>
      {/* Sun icon — right slot */}
      <span
        aria-hidden="true"
        className={cn(
          "relative z-10 flex w-1/2 items-center justify-center transition-all duration-300",
          theme === "light" ? "text-fg" : "text-fg-subtle",
        )}
      >
        <Sun className="size-3.5" />
      </span>
    </button>
  );
}
