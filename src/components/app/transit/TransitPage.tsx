"use client";

import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Train, Car, Navigation, ShieldAlert } from "lucide-react";
import { ExplainAIButton } from "@/components/ui/ExplainAIButton";

export function TransitPage() {
  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-4xl mx-auto">
      
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-black tracking-tight text-fg">Transportation</h1>
          <p className="text-fg-muted">Live transit schedules and smart routing to Estádio da Luz.</p>
        </div>
        <ExplainAIButton explanation={{
          title: "AI Transit Optimization",
          dataInputs: ["Lisbon Metro API", "Live Traffic Feeds", "Stadium Exit Density"],
          prediction: "Leaving via the Blue Line (Linha Azul) will result in a 22-minute wait due to 8,000 fans exiting simultaneously.",
          confidence: 89,
          reasoning: "We recommend taking a 10-minute walk to the Green Line or booking a ride-share from Zone C to avoid the primary bottleneck at Colégio Militar/Luz station."
        }} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
        
        {/* Metro Status */}
        <ScrollReveal delayMs={100} className="flex flex-col gap-4">
          <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-6 shadow-sm">
            <h2 className="text-xl font-bold text-fg mb-4 flex items-center gap-2">
              <Train className="size-5 text-[var(--accent)]" /> Metro Lines
            </h2>
            
            <div className="flex flex-col gap-3">
              {/* Blue Line */}
              <div className="p-4 rounded-2xl bg-surface-2 border border-[var(--border-faint)] flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-blue-500/20 text-blue-500 border border-blue-500/30 flex items-center justify-center font-black">
                    Az
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-fg">Linha Azul (Blue Line)</span>
                    <span className="text-xs text-fg-muted">Colégio Militar/Luz</span>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-lg font-black text-red-500 animate-pulse">22 min</span>
                  <p className="text-[10px] uppercase tracking-widest text-fg-muted font-bold">Severe Delays</p>
                </div>
              </div>

              {/* Green Line */}
              <div className="p-4 rounded-2xl border border-[var(--accent-line)] bg-[var(--accent-subtle)] flex items-center justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-2">
                  <span className="text-[9px] font-black uppercase tracking-widest text-white bg-[var(--accent)] px-2 py-0.5 rounded-full">AI Recommended</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="size-10 rounded-full bg-green-500/20 text-green-500 border border-green-500/30 flex items-center justify-center font-black">
                    Vd
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-fg">Linha Verde (Green)</span>
                    <span className="text-xs text-[var(--accent)] font-bold">10 min walk away</span>
                  </div>
                </div>
                <div className="text-right mt-3 sm:mt-0">
                  <span className="text-lg font-black text-[var(--positive)]">3 min</span>
                  <p className="text-[10px] uppercase tracking-widest text-fg-muted font-bold">On Time</p>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Ride Sharing & Parking */}
        <ScrollReveal delayMs={200} className="flex flex-col gap-4">
          <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-6 shadow-sm h-full flex flex-col justify-between">
            <div>
              <h2 className="text-xl font-bold text-fg mb-4 flex items-center gap-2">
                <Car className="size-5 text-[var(--accent)]" /> Ride-Share & Parking
              </h2>
              
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-surface-2 border border-[var(--border-faint)] flex items-center justify-center shrink-0">
                    <Navigation className="size-5 text-fg-muted" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-sm font-bold text-fg">Pickup Zone C (South)</span>
                     <span className="text-xs text-fg-muted">Surge pricing active (1.5x)</span>
                  </div>
                  <div className="ml-auto text-right">
                     <span className="text-lg font-black text-fg">4 mins</span>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="size-12 rounded-2xl bg-surface-2 border border-[var(--border-faint)] flex items-center justify-center shrink-0">
                    <ShieldAlert className="size-5 text-fg-muted" />
                  </div>
                  <div className="flex flex-col">
                     <span className="text-sm font-bold text-fg">Parking P3</span>
                     <span className="text-xs text-red-500 font-bold">Exit traffic jammed</span>
                  </div>
                  <div className="ml-auto text-right">
                     <span className="text-lg font-black text-red-500">45 mins</span>
                  </div>
                </div>
              </div>
            </div>

            <button className="w-full mt-6 py-3 rounded-xl bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-strong)] transition-all shadow-[0_0_15px_var(--accent-line)]">
              Book Official Shuttle (Free)
            </button>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
