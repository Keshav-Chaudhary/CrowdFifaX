"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { QrCode, Map, ArrowRight, ShieldCheck, Ticket } from "lucide-react";
import Link from "next/link";
import { useTranslation } from "@/contexts/LanguageContext";

export function TicketPage() {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-lg mx-auto">
      
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-fg">{t.nav_ticket}</h1>
        <p className="text-fg-muted">{t.ticket_scan_desc}</p>
      </div>

      <ScrollReveal delayMs={100}>
        <div className="relative rounded-3xl border border-[var(--border-strong)] bg-surface shadow-2xl overflow-hidden mt-4">
          
          {/* Ticket Header */}
          <div className="bg-[var(--accent)] p-6 text-white text-center relative overflow-hidden">
             <div className="absolute top-0 right-0 p-4 opacity-20">
               <Ticket className="size-24 transform rotate-12" />
             </div>
             <div className="relative z-10">
               <span className="text-[10px] font-bold uppercase tracking-widest bg-black/20 px-3 py-1 rounded-full mb-3 inline-block">FIFA World Cup 2026™</span>
               <h2 className="text-3xl font-black mb-1">{t.ticket_match_name}</h2>
               <p className="text-white/80 text-sm font-medium">{t.ticket_match_venue}</p>
             </div>
          </div>

          {/* Ticket Details */}
          <div className="p-8 pb-4 flex flex-col gap-6 relative">
            <div className="flex items-center justify-between border-b border-[var(--border-faint)] pb-6">
              <div className="flex flex-col">
                <span className="text-[10px] font-bold text-fg-muted uppercase tracking-widest mb-1">{t.ticket_label_gate}</span>
                <span className="text-2xl font-black text-fg">06</span>
              </div>
              <div className="flex flex-col text-center border-l border-r border-[var(--border-faint)] px-6">
                <span className="text-[10px] font-bold text-fg-muted uppercase tracking-widest mb-1">{t.ticket_label_block}</span>
                <span className="text-2xl font-black text-fg">114</span>
              </div>
              <div className="flex flex-col text-right">
                <span className="text-[10px] font-bold text-fg-muted uppercase tracking-widest mb-1">{t.ticket_label_seat}</span>
                <span className="text-2xl font-black text-[var(--accent)]">44B</span>
              </div>
            </div>

            {/* QR Code Mock */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="p-4 bg-white rounded-2xl shadow-sm border border-[var(--border-faint)]">
                <QrCode className="size-48 text-black" strokeWidth={1} />
              </div>
              <p className="text-xs font-mono text-fg-muted mt-4">TICKET-ID: PTES-2026-993A</p>
            </div>

          </div>
          
          {/* Ticket Footer / Action */}
          <div className="bg-surface-2 p-4 border-t border-[var(--border-strong)] flex flex-col gap-3">
             <div className="flex items-center justify-center gap-2 text-xs font-bold text-[var(--positive)] mb-2">
               <ShieldCheck className="size-4" /> {t.ticket_verified}
             </div>
             
             <Link href="/app/wayfinding" className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-strong)] transition-all shadow-[0_0_15px_var(--accent-line)]">
               <Map className="size-4" /> {t.ticket_find_seat} <ArrowRight className="size-4" />
             </Link>
          </div>

        </div>
      </ScrollReveal>
      
    </div>
  );
}
