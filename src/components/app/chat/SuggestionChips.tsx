"use client";

import { TrendingDown, Route, Target, Users, ShieldAlert, Coffee, MapPin, Languages, MessageCircle, HelpCircle } from "lucide-react";
import { usePersona } from "@/contexts/PersonaContext";

interface SuggestionChipsProps {
  submit: (text: string) => void;
  enabled: boolean | null;
  streaming: boolean;
}

export function SuggestionChips({
  submit,
  enabled,
  streaming,
}: SuggestionChipsProps) {
  const { persona } = usePersona();

  let SUGGESTIONS = [];
  if (persona === "fan") {
    SUGGESTIONS = [
      { icon: Coffee, text: "Where is the shortest food queue?" },
      { icon: MapPin, text: "How do I get to Seat 44B?" },
      { icon: ShieldAlert, text: "Report an incident nearby." },
      { icon: Route, text: "Show me the best exit route." },
    ];
  } else if (persona === "volunteer") {
    SUGGESTIONS = [
      { icon: Languages, text: "Translate 'Where is the bathroom?' to Spanish." },
      { icon: MessageCircle, text: "How to handle a lost ticket?" },
      { icon: ShieldAlert, text: "What is the protocol for a spill?" },
      { icon: HelpCircle, text: "Where is the nearest medical tent?" },
    ];
  } else {
    // organizer
    SUGGESTIONS = [
      { icon: Users, text: "Analyze current crowd density at Gate 6." },
      { icon: Route, text: "Suggest dispatch routing for the spill at Concourse C." },
      { icon: Target, text: "Evaluate wait times across all food vendors." },
      { icon: TrendingDown, text: "Predict bottlenecks for the 75th minute." },
    ];
  }

  return (
    <div className="mt-8 flex flex-wrap justify-center gap-2">
      {SUGGESTIONS.map(({ icon: Icon, text }) => (
        <button
          key={text}
          type="button"
          onClick={() => submit(text)}
          disabled={enabled === null || streaming}
          className="inline-flex items-center gap-2 px-4 py-2 text-xs font-medium bg-surface border border-[var(--border)] rounded-full text-fg-muted hover:text-fg hover:border-[var(--accent-strong)] hover:bg-[var(--accent-subtle)] transition-all disabled:opacity-50 shadow-sm cursor-pointer"
        >
          <Icon aria-hidden="true" className="size-3.5 text-[var(--accent)]" />
          {text}
        </button>
      ))}
    </div>
  );
}
