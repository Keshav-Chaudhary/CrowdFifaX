"use client";

import { usePersona, Persona } from "@/contexts/PersonaContext";
import { LayoutDashboard, Compass, Briefcase, ArrowRight, CheckCircle2, ShieldCheck, Activity } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ScrollReveal } from "@/components/ui/ScrollReveal";

export default function LaunchPage() {
  const { setPersona } = usePersona();
  const router = useRouter();
  const [selected, setSelected] = useState<Persona | null>(null);

  const personas = [
    {
      id: "organizer" as Persona,
      title: "Organizer",
      icon: LayoutDashboard,
      color: "text-blue-500",
      bgSubtle: "bg-blue-500/10",
      borderGlow: "group-hover:border-blue-500/50 group-hover:shadow-[0_0_30px_rgba(59,130,246,0.15)]",
      description: "Access the global command center. Monitor real-time heatmaps, system alerts, and dispatch ground operations.",
    },
    {
      id: "fan" as Persona,
      title: "Fan",
      icon: Compass,
      color: "text-[var(--positive)]",
      bgSubtle: "bg-[var(--positive)]/10",
      borderGlow: "group-hover:border-[var(--positive)]/50 group-hover:shadow-[0_0_30px_rgba(236,72,153,0.15)]",
      description: "Experience the matchday app. Navigate the stadium, receive optimal routing, and use the multilingual AI copilot.",
    },
    {
      id: "volunteer" as Persona,
      title: "Volunteer",
      icon: Briefcase,
      color: "text-[var(--accent)]",
      bgSubtle: "bg-[var(--accent-subtle)]",
      borderGlow: "group-hover:border-[var(--accent-line)] group-hover:shadow-[0_0_30px_var(--accent-subtle)]",
      description: "View the ground ops interface. Receive high-priority tasks and assist fans based on GenAI predictive models.",
    },
  ];

  const handleLaunch = () => {
    if (selected) {
      setPersona(selected);
      router.push("/app");
    }
  };

  return (
    <div className="min-h-screen bg-surface flex flex-col items-center justify-center p-6 relative overflow-hidden font-sans">
      
      {/* Background Deep Ambient Glow */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_top,_var(--accent-subtle),_transparent_50%)] opacity-60" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[500px] w-[800px] rounded-full bg-[var(--accent)] opacity-[0.03] blur-[150px] pointer-events-none" />

      {/* 3D Isometric Football Pitch Background (Refined Enterprise Look) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1400px] h-[900px] pointer-events-none z-0 opacity-10" style={{ perspective: '1200px' }}>
        <div className="w-full h-full border-2 border-[var(--accent)]/20 rounded-[120px] relative" style={{ transform: 'rotateX(65deg) rotateZ(-40deg)' }}>
          {/* Halfway Line */}
          <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[var(--accent)]/30 -translate-y-1/2" />
          {/* Center Circle */}
          <div className="absolute top-1/2 left-1/2 size-72 border-2 border-[var(--accent)]/30 rounded-full -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
            <div className="size-3 bg-[var(--accent)]/40 rounded-full animate-ping" />
          </div>
          {/* Penalty Boxes */}
          <div className="absolute top-0 left-1/2 w-[400px] h-[200px] border-2 border-t-0 border-[var(--accent)]/30 -translate-x-1/2" />
          <div className="absolute bottom-0 left-1/2 w-[400px] h-[200px] border-2 border-b-0 border-[var(--accent)]/30 -translate-x-1/2" />
        </div>
      </div>

      <ScrollReveal className="max-w-6xl w-full relative z-10 pt-16 flex flex-col items-center">
        
        {/* Enterprise System Badge */}
        <div className="flex items-center gap-3 rounded-full border border-[var(--border-strong)] bg-surface-2/80 backdrop-blur-md px-4 py-2 mb-10 shadow-[var(--shadow-sm)]">
          <ShieldCheck className="size-4 text-[var(--accent)]" />
          <span className="text-xs font-bold uppercase tracking-[0.15em] text-fg-muted flex items-center gap-2">
            Secure Session <span className="flex size-1.5 rounded-full bg-green-500 animate-pulse" />
          </span>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-5xl md:text-6xl font-black tracking-tight text-fg mb-6 drop-shadow-sm">
            Initialize <span className="text-[var(--accent)] bg-clip-text text-transparent bg-gradient-to-r from-[var(--accent)] to-blue-400">Workspace</span>
          </h1>
          <p className="text-lg text-fg-muted max-w-2xl mx-auto leading-relaxed">
            Select your active operational persona. The CrowdFifaX AI engine will dynamically adapt your command interface and data authorizations.
          </p>
        </div>

        {/* Persona Selection Grid */}
        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16 w-full">
          {personas.map((p) => {
            const isSelected = selected === p.id;
            return (
              <button
                key={p.id}
                onClick={() => setSelected(p.id)}
                className={`group relative flex flex-col items-start text-left p-8 rounded-[2rem] border backdrop-blur-2xl transition-all duration-500 ease-out overflow-hidden ${
                  isSelected
                    ? `bg-surface-2 border-[var(--accent)] shadow-[0_20px_40px_-15px_rgba(0,0,0,0.5),inset_0_0_20px_var(--accent-subtle)] scale-[1.02] ring-1 ring-[var(--accent)]/50`
                    : `bg-surface/60 border-[var(--border-strong)] ${p.borderGlow} hover:-translate-y-1 hover:bg-surface-2/80`
                }`}
              >
                {/* Subtle sweeping light effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out opacity-20" />
                
                {/* Internal card glow based on persona */}
                <div className={`absolute -bottom-10 -right-10 w-48 h-48 rounded-full blur-[70px] opacity-20 ${isSelected ? p.bgSubtle : ''} transition-all duration-700`} />
                <div className={`absolute -top-10 -left-10 w-48 h-48 rounded-full blur-[70px] opacity-10 ${isSelected ? p.bgSubtle : ''} transition-all duration-700 group-hover:opacity-30`} />

                {isSelected && (
                  <div className={`absolute top-6 right-6 ${p.color} animate-in zoom-in duration-300 drop-shadow-lg`}>
                    <CheckCircle2 className="size-6" />
                  </div>
                )}
                
                {/* Icon Container with glowing effect */}
                <div className="relative mb-6">
                   <div className={`absolute inset-0 blur-xl ${p.bgSubtle} opacity-40 group-hover:opacity-100 transition-opacity`} />
                   <div
                    className={`relative size-16 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                      isSelected
                        ? `${p.bgSubtle} ${p.color} ring-1 ring-white/10`
                        : `bg-surface-3 text-fg-muted group-hover:${p.bgSubtle} group-hover:${p.color}`
                    }`}
                  >
                    <p.icon className="size-8" />
                  </div>
                </div>

                <h3 className="text-2xl font-bold mb-3 text-fg tracking-tight">
                  {p.title}
                </h3>
                <p className="text-sm text-fg-subtle leading-relaxed font-medium">
                  {p.description}
                </p>

                {/* Simulated connection status metric */}
                <div className="mt-8 flex items-center gap-2 text-[10px] uppercase tracking-widest text-fg-muted font-bold opacity-0 group-hover:opacity-100 transition-opacity delay-100">
                  <Activity className="size-3" />
                  <span>Telemetry Ready</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* Launch Action */}
        <div className="flex justify-center w-full">
          <button
            onClick={handleLaunch}
            disabled={!selected}
            className={`group relative overflow-hidden inline-flex h-16 items-center justify-center gap-3 rounded-full px-12 text-lg font-bold transition-all duration-500 ${
              selected
                ? "bg-[var(--accent)] text-[var(--accent-fg)] hover:scale-105 shadow-[0_0_30px_var(--accent-line)] cursor-pointer"
                : "bg-surface-3 text-fg-muted border border-[var(--border-strong)] cursor-not-allowed opacity-60"
            }`}
          >
            {/* Button sweeping shine */}
            {selected && (
              <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-[shimmer_1.5s_infinite]" />
            )}
            <span className="relative z-10 flex items-center gap-3">
              Initialize Session
              <ArrowRight className={`size-5 transition-transform duration-300 ${selected ? "group-hover:translate-x-1.5" : ""}`} />
            </span>
          </button>
        </div>
      </ScrollReveal>
    </div>
  );
}
