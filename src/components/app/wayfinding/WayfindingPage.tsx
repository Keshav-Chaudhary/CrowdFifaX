"use client";

import { useSimulation } from "@/contexts/SimulationContext";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { MapPin, Locate, Star, DoorOpen, ArrowRight, ActivitySquare } from "lucide-react";
import { useTranslation } from "@/contexts/LanguageContext";
import { useState } from "react";

type Location = "Seat 44B" | "Merch Stand A" | "Concourse C" | "Exit Gate 2";

export function WayfindingPage() {
  const { mode } = useSimulation();
  const { t } = useTranslation();
  const isEmergency = mode !== "normal";

  const [destination, setDestination] = useState<Location>(isEmergency ? "Exit Gate 2" : "Seat 44B");
  const [isWheelchairAccessible, setIsWheelchairAccessible] = useState(false);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-5xl mx-auto h-auto md:h-[calc(100vh-80px)]">
      
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-fg">{t.live_wayfinding}</h1>
          <p className="text-fg-muted">{isEmergency ? t.ai_reroute_emerg : t.wayfinding_subtitle}</p>
        </div>
        {/* Destination Selector & Accessibility */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsWheelchairAccessible(!isWheelchairAccessible)}
            className={`p-2 rounded-xl border flex items-center justify-center transition-colors ${
              isWheelchairAccessible 
                ? "bg-[var(--accent)] text-white border-[var(--accent-line)]" 
                : "bg-surface-2 text-fg-muted border-[var(--border-strong)] hover:text-fg hover:border-fg-subtle"
            }`}
            title="Wheelchair Accessible Route"
          >
            {/* Using a standard icon to represent accessibility/wheelchair since lucide might not have wheelchair */}
            <ActivitySquare className="size-5" /> 
          </button>

          <div className={`p-1.5 rounded-2xl border flex items-center gap-1 ${isEmergency ? "border-red-500/50 bg-red-500/10" : "border-[var(--border-strong)] bg-surface-2"}`}>
             <span className={`text-[10px] font-bold uppercase tracking-widest pl-3 pr-1 ${isEmergency ? "text-red-500" : "text-fg-muted"}`}>
               Routing To:
             </span>
             <select 
               aria-label="Route Destination"
               value={isEmergency ? "Exit Gate 2" : destination} 
               onChange={(e) => setDestination(e.target.value as Location)}
               disabled={isEmergency}
               className={`bg-transparent text-sm font-bold p-2 focus:outline-none cursor-pointer ${isEmergency ? "text-red-500" : "text-fg"}`}
             >
               <option value="Seat 44B" className="bg-surface text-fg">Seat 44B</option>
               <option value="Merch Stand A" className="bg-surface text-fg">Merch Stand A</option>
               <option value="Concourse C" className="bg-surface text-fg">Concourse C</option>
               <option value="Exit Gate 2" className="bg-surface text-fg">Nearest Exit</option>
             </select>
          </div>
        </div>
      </div>

      <ScrollReveal delayMs={100} className="flex-1 flex flex-col md:flex-row gap-6 min-h-0">
        
        {/* Map View */}
        <div className={`h-[350px] md:h-auto md:flex-1 rounded-3xl border relative overflow-hidden flex flex-col ${isEmergency ? "border-red-500/50 bg-red-950/20 shadow-[0_0_50px_rgba(239,68,68,0.15)]" : "border-[var(--accent-line)] bg-surface-2"}`}>
          
          {/* Map Grid & Radar Background */}
          <div className="absolute inset-0 opacity-20 pointer-events-none text-fg">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="stadium-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
                </pattern>
                <radialGradient id="radar-glow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor={isEmergency ? "rgba(239,68,68,0.4)" : "var(--accent)"} stopOpacity="0.5" />
                  <stop offset="100%" stopColor={isEmergency ? "rgba(239,68,68,0)" : "var(--accent)"} stopOpacity="0" />
                </radialGradient>
              </defs>
              <rect width="100%" height="100%" fill="url(#stadium-grid)" />
              <circle cx="50%" cy="50%" r="70%" fill="url(#radar-glow)" className="animate-[pulse_4s_cubic-bezier(0.4,0,0.6,1)_infinite]" />
            </svg>
          </div>

          {/* Abstract Stadium Map Graphics */}
          <div className="absolute inset-0 flex items-center justify-center p-4 sm:p-12">
             <div className="relative w-full max-w-lg aspect-[4/3] drop-shadow-2xl">
                
                {/* Stadium Base layers for depth */}
                <div className={`absolute inset-0 rounded-[80px] bg-surface border-4 shadow-2xl ${isEmergency ? "border-red-500/20" : "border-surface-3"}`} />
                <div className={`absolute inset-4 rounded-[70px] bg-surface-2 border-2 ${isEmergency ? "border-red-500/30" : "border-[var(--border-strong)]"}`} />
                <div className={`absolute inset-12 rounded-[50px] border-2 opacity-50 ${isEmergency ? "border-red-500 bg-red-500/5" : "border-[var(--accent)] bg-[var(--accent)]/5"}`} />
                
                {/* Sector Divisions (svg overlay) */}
                <svg className="absolute inset-0 w-full h-full opacity-10 pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                  <line x1="50" y1="0" x2="50" y2="100" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                  <line x1="0" y1="50" x2="100" y2="50" stroke="currentColor" strokeWidth="0.5" strokeDasharray="2 2" />
                </svg>

                {/* User Location */}
                <div className="absolute bottom-[25%] left-[25%] z-20 group -translate-x-1/2 translate-y-1/2">
                   <div className="relative flex items-center justify-center">
                     <div className={`absolute size-8 rounded-full animate-ping opacity-40 ${isEmergency ? "bg-red-500" : "bg-[var(--accent)]"}`} />
                     <div className={`size-5 rounded-full ${isEmergency ? "bg-red-500" : "bg-[var(--accent)]"} border-2 border-white shadow-lg z-10 flex items-center justify-center`}>
                       <div className="size-1.5 bg-white rounded-full" />
                     </div>
                   </div>
                   <span className="absolute top-8 left-1/2 -translate-x-1/2 bg-surface text-fg text-xs font-bold px-3 py-1.5 rounded-lg border border-[var(--border-strong)] shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                     You are here
                   </span>
                </div>

                {/* Destination */}
                <div className="absolute top-[25%] right-[25%] z-20 group -translate-x-1/2 -translate-y-1/2">
                   <div className="relative flex items-center justify-center">
                     <div className={`absolute size-10 rounded-full opacity-20 ${isEmergency ? "bg-red-500 animate-pulse" : "bg-surface-3"}`} />
                     <div className={`size-8 rounded-full flex items-center justify-center border-[3px] shadow-lg z-10 ${isEmergency ? "bg-red-500 border-red-300 text-white" : "bg-surface text-fg border-[var(--border-strong)]"}`}>
                       {isEmergency ? <DoorOpen className="size-4" /> : <MapPin className="size-4" />}
                     </div>
                   </div>
                   <span className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-surface text-fg text-xs font-bold px-3 py-1.5 rounded-lg border border-[var(--border-strong)] shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30">
                     {isEmergency ? "Nearest Exit" : destination}
                   </span>
                </div>

                {/* SVG Route Line */}
                <svg className="absolute inset-0 w-full h-full z-10" style={{ overflow: 'visible' }}>
                  <defs>
                    <filter id="glow-line" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                  </defs>
                  
                  {/* Base Track */}
                  <path 
                    d="M 25% 75% Q 25% 50% 50% 50% T 75% 25%" 
                    fill="none" 
                    stroke={isEmergency ? "rgba(239, 68, 68, 0.2)" : "var(--accent-subtle)"} 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                  />
                  
                  {/* Animated Glowing Line */}
                  <path 
                    d="M 25% 75% Q 25% 50% 50% 50% T 75% 25%" 
                    fill="none" 
                    stroke={isEmergency ? "#ef4444" : "var(--accent)"} 
                    strokeWidth="3" 
                    strokeLinecap="round" 
                    strokeDasharray="12 12"
                    className="animate-[dash_1s_linear_infinite]"
                    filter="url(#glow-line)"
                  />
                </svg>
             </div>
          </div>

          <style dangerouslySetInnerHTML={{__html: `
            @keyframes dash {
              to { stroke-dashoffset: -24; }
            }
          `}} />

          {/* Map Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col gap-3 z-30">
            <button 
              aria-label="Recenter map to user location"
              className="size-12 rounded-2xl bg-surface/90 backdrop-blur-md border border-[var(--border-strong)] flex items-center justify-center text-fg hover:bg-surface hover:scale-105 transition-all shadow-lg active:scale-95"
            >
               <Locate className="size-5" />
            </button>
          </div>
        </div>

        {/* Turn-by-Turn Panel */}
        <div className="w-full md:w-[340px] shrink-0 flex flex-col gap-4 overflow-y-visible md:overflow-y-auto pr-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className={`p-5 rounded-3xl border flex flex-col items-center justify-center text-center ${isEmergency ? "bg-red-500 text-white border-red-600 shadow-xl" : "bg-neutral-900 dark:bg-neutral-100 text-neutral-50 dark:text-neutral-950 border-transparent shadow-xl"}`}>
             <span className="text-[10px] font-bold uppercase tracking-widest mb-1">
               {isEmergency ? t.evac_eta : t.estimated_time}
             </span>
             <h2 className="text-4xl font-black tracking-tighter mb-2">
               {isEmergency ? "2 min" : isWheelchairAccessible ? "9 min" : "7 min"}
             </h2>
             <p className="text-sm font-medium">
               {isEmergency ? t.evac_follow : isWheelchairAccessible ? t.route_elevators : t.route_direct}
             </p>
          </div>
 
          <div className="flex flex-col relative before:absolute before:inset-y-4 before:left-[27px] before:w-[2px] before:bg-[var(--border-faint)] before:-z-10">
            
            {/* Step 1 */}
            <div className="relative flex items-start gap-4 p-4 rounded-2xl bg-surface border border-[var(--border-strong)] mb-2 shadow-sm z-10">
              <div className="size-6 rounded-full bg-surface-2 border-2 border-[var(--border-strong)] flex items-center justify-center shrink-0 mt-0.5">
                <div className={`size-2 rounded-full ${isEmergency ? "bg-red-500" : "bg-[var(--accent)]"}`} />
              </div>
              <div>
                <h4 className="text-sm font-bold text-fg">
                  {isWheelchairAccessible ? t.step1_elevator : t.step1_walk}
                </h4>
                <p className="text-xs text-fg mt-1">
                  {isWheelchairAccessible ? t.step1_elevator_desc : t.step1_walk_desc}
                </p>
              </div>
            </div>
 
            {/* Step 2 */}
            <div className="relative flex items-start gap-4 p-4 rounded-2xl bg-surface-2 border border-[var(--border-faint)] mb-2 z-10">
              <div className="size-6 rounded-full bg-surface-3 border-2 border-[var(--border-faint)] flex items-center justify-center shrink-0 mt-0.5">
                <ArrowRight className="size-3 text-fg-muted" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-fg">{t.step2}</h4>
                <p className="text-xs text-fg mt-1">{t.step2_desc}</p>
              </div>
            </div>
 
            {/* Step 3 (Dest) */}
            <div className="relative flex items-start gap-4 p-4 rounded-2xl bg-surface-2 border border-[var(--border-faint)] z-10">
              <div className="size-6 rounded-full bg-surface-3 border-2 border-[var(--border-faint)] flex items-center justify-center shrink-0 mt-0.5">
                {isEmergency ? <DoorOpen className="size-3 text-red-500" /> : <MapPin className="size-3 text-fg-muted" />}
              </div>
              <div>
                <h4 className="text-sm font-bold text-fg">{isEmergency ? t.nearest_exit : destination}</h4>
                <p className="text-xs text-fg mt-1">{isEmergency ? t.evac_follow : t.step3_dest}</p>
              </div>
            </div>
 
          </div>
 
          {/* GenAI Reroute Notice */}
          <div className="mt-auto p-4 rounded-2xl bg-[var(--accent-subtle)] border border-[var(--accent-line)] flex items-start gap-3">
             <Star className="size-4 text-[var(--accent)] shrink-0 mt-0.5" />
             <div>
               <h4 className="text-xs font-bold text-fg uppercase tracking-widest">{t.ai_reroute}</h4>
               <p className="text-xs text-fg mt-1">
                 {isEmergency ? t.ai_reroute_emerg : t.ai_reroute_desc}
               </p>
             </div>
          </div>
        </div>

      </ScrollReveal>
    </div>
  );
}
