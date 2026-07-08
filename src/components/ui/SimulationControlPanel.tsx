"use client";

import { useSimulation, SimulationMode } from "@/contexts/SimulationContext";
import { CloudRain, ZapOff, Train, Flame, HeartPulse, ShieldAlert, X } from "lucide-react";
import { useState } from "react";

export function SimulationControlPanel() {
  const { mode, setMode } = useSimulation();
  const [isExpanded, setIsExpanded] = useState(false);

  const triggers: { id: SimulationMode; label: string; icon: React.ElementType }[] = [
    { id: "normal", label: "Clear Normal", icon: X },
    { id: "rain", label: "Heavy Rain", icon: CloudRain },
    { id: "power", label: "Power Failure", icon: ZapOff },
    { id: "metro", label: "Metro Delay", icon: Train },
    { id: "fire", label: "Fire Alert", icon: Flame },
    { id: "medical", label: "Medical", icon: HeartPulse },
  ];

  return (
    <div className="fixed bottom-24 right-4 md:bottom-6 md:right-6 z-50 flex flex-col gap-2 items-end">
      {isExpanded && (
        <div className="flex flex-col gap-2 bg-surface-2 p-2 rounded-2xl border border-[var(--border-strong)] shadow-2xl animate-in slide-in-from-bottom-4 origin-bottom-right">
          <p className="text-[10px] font-bold text-fg-muted uppercase tracking-widest px-2 pt-1 pb-2">Simulate Emergency</p>
          {triggers.map((t) => (
            <button
              key={t.id}
              onClick={() => {
                setMode(t.id);
                if (t.id === "normal") setIsExpanded(false);
              }}
              className={`flex items-center gap-3 px-3 py-2 rounded-xl text-xs font-bold transition-all ${mode === t.id ? "bg-[var(--accent)] text-white shadow-md" : "hover:bg-surface text-fg"}`}
            >
              <t.icon className="size-4" />
              {t.label}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-lg backdrop-blur-md transition-all ${mode !== "normal" ? "border-red-500/50 bg-red-500/10 text-red-500 animate-pulse" : "border-[var(--border-strong)] bg-surface/50 text-fg hover:bg-surface"}`}
      >
        <ShieldAlert className="size-4" />
        <span className="text-xs font-bold uppercase tracking-widest">{mode !== "normal" ? `Simulating: ${mode}` : "Simulation Mode"}</span>
      </button>
    </div>
  );
}
