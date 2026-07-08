"use client";

import { Sparkles, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui";
import { cn } from "@/utils/cn";
import { usePersona } from "@/contexts/PersonaContext";

interface ChatHeaderProps {
  enabled: boolean | null;
  hasMessages: boolean;
  onClearClick: () => void;
}

export function ChatHeader({
  enabled,
  hasMessages,
  onClearClick,
}: ChatHeaderProps) {
  const { persona } = usePersona();

  let category = "INTELLIGENCE";
  let title = "Operations AI";

  if (persona === "fan") {
    category = "SUPPORT";
    title = "Fan Copilot";
  } else if (persona === "volunteer") {
    category = "SUPPORT";
    title = "Translation AI";
  }

  return (
    <div className="flex items-center justify-between border-b border-[var(--border)] bg-surface px-4 py-3 md:px-6 shrink-0 z-20">
      <div className="flex items-center gap-3">
        <div className="flex size-9 items-center justify-center rounded-lg bg-[var(--accent-subtle)] border border-[var(--accent-muted)] shadow-sm">
          <Sparkles className="size-4.5 text-[var(--accent)]" />
        </div>
        <div>
          <span className="text-[9px] font-bold uppercase tracking-widest text-[var(--accent)] block mb-0.5">
            {category}
          </span>
          <h1 className="text-sm font-bold tracking-tight text-fg leading-none">
            {title}
          </h1>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="relative flex size-2">
              <span
                className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                  enabled ? "bg-[var(--success)]" : "bg-[var(--critical)]"
                )}
              />
              <span
                className={cn(
                  "relative inline-flex size-2 rounded-full",
                  enabled ? "bg-[var(--success)]" : "bg-[var(--critical)]"
                )}
              />
            </span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-fg-muted">
              {enabled ? "System Online" : "Offline"}
            </span>
          </div>
        </div>
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-2">
        {hasMessages && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearClick}
            className="h-8 gap-2 text-xs font-semibold text-fg-muted hover:text-fg hover:bg-[var(--accent-subtle)]"
          >
            <RotateCcw className="size-3.5" />
            <span className="hidden sm:inline">Clear Context</span>
          </Button>
        )}
      </div>
    </div>
  );
}
