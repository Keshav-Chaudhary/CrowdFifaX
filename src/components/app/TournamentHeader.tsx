"use client";

import { Calendar, MapPin } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslation } from "@/contexts/LanguageContext";

export function TournamentHeader() {
  const [mounted, setMounted] = useState(false);
  const { t } = useTranslation();
  useEffect(() => {
    setTimeout(() => setMounted(true), 0);
  }, []);

  if (!mounted) return null;

  return (
    <div className="w-full bg-surface-2 border-b border-[var(--border-strong)] py-3 px-4 md:px-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-in slide-in-from-top-2">
      
      {/* Live Match */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="relative flex size-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full size-2.5 bg-red-500"></span>
          </span>
          <span className="text-[10px] font-black uppercase tracking-widest text-red-500">Live</span>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-fg">Portugal</span>
            <span className="text-sm font-bold text-fg-muted">vs</span>
            <span className="text-sm font-bold text-fg">Spain</span>
          </div>
          <div className="px-3 py-0.5 bg-surface-3 border border-[var(--border-strong)] rounded-md text-sm font-black text-[var(--accent)] shadow-inner">
            2 - 1
          </div>
        </div>
      </div>

      <div className="hidden sm:block w-px h-6 bg-[var(--border-faint)]" />

      {/* Venue Context */}
      <div className="flex items-center gap-4 text-xs font-medium text-fg-muted">
        <div className="flex items-center gap-1.5">
          <MapPin className="size-3.5" />
          <span>Estádio da Luz, Lisbon</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Calendar className="size-3.5" />
          <span>72&apos; Min</span>
        </div>
      </div>

      <div className="hidden xl:block w-px h-6 bg-[var(--border-faint)]" />

      {/* Upcoming Match */}
      <div className="hidden lg:flex items-center gap-3 opacity-95" aria-label="Upcoming tournament match details">
        <span className="text-[10px] font-bold uppercase tracking-widest text-fg-subtle border border-[var(--border-faint)] px-2 py-0.5 rounded-sm">{t.up_next}</span>
        <div className="flex flex-col">
          <span className="text-[11px] font-bold text-fg">{t.upcoming_match}</span>
          <span className="text-[10px] text-fg-muted">{t.venue_time}</span>
        </div>
      </div>

    </div>
  );
}
