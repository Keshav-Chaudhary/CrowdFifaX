"use client";

import { useExplain, AIExplanation } from "@/contexts/ExplainContext";
import { Sparkles } from "lucide-react";

export function ExplainAIButton({ explanation }: { explanation: AIExplanation }) {
  const { showExplanation } = useExplain();

  return (
    <button
      onClick={() => showExplanation(explanation)}
      className="group relative flex items-center gap-2 rounded-full border border-[var(--accent-line)] bg-surface/50 backdrop-blur-md px-4 py-2 shadow-[0_0_15px_var(--accent-subtle)] transition-all hover:bg-surface hover:shadow-[0_0_25px_var(--accent-subtle)] hover:scale-105"
    >
      <div className="absolute inset-0 rounded-full bg-[var(--accent)] opacity-10 blur-sm group-hover:opacity-20 transition-opacity" />
      <Sparkles className="size-4 text-[var(--accent)]" />
      <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest">
        Explain AI
      </span>
    </button>
  );
}
