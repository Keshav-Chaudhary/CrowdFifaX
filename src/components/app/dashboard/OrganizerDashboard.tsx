"use client";

import { useState, useEffect } from "react";
import { useSimulation } from "@/contexts/SimulationContext";
import { ExplainAIButton } from "@/components/ui/ExplainAIButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AlertTriangle, Shield, HeartPulse, HardHat, TrendingUp, CheckCircle2 } from "lucide-react";

export function OrganizerDashboard() {
  const { mode } = useSimulation();
  
  // Real-time telemetry simulation
  const [attendance, setAttendance] = useState(82340);
  const [forecastTab, setForecastTab] = useState<"now" | "30" | "60">("now");

  useEffect(() => {
    const interval = setInterval(() => {
      setAttendance(prev => prev + Math.floor(Math.random() * 5) - 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const isEmergency = mode !== "normal";

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-fg">AI Control Center</h1>
          <p className="text-fg-muted mt-1">Live autonomous operations oversight.</p>
        </div>
        <div className="flex items-center gap-3">
          <ExplainAIButton 
            explanation={{
              title: "Global Resource Rerouting",
              dataInputs: ["Turnstile Flow", "CCTV Density", "Weather API"],
              prediction: "Gate 6 will exceed safe capacity (4.7 pax/sqm) in 12 minutes.",
              confidence: 94,
              reasoning: "The model detected a 15% faster arrival rate than historical baseline. By opening Gate 8 and dispatching 6 volunteers, pressure will normalize within 8 minutes."
            }} 
          />
          <span className={`flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-bold shadow-sm transition-colors ${isEmergency ? "border-red-500/50 bg-red-500/10 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.2)]" : "border-[var(--accent-line)] bg-[var(--accent-subtle)] text-[var(--accent)]"}`}>
            <span className={`flex size-2 rounded-full animate-pulse ${isEmergency ? "bg-red-500" : "bg-[var(--accent)]"}`} />
            {isEmergency ? `EMERGENCY: ${mode.toUpperCase()}` : "System Optimal"}
          </span>
        </div>
      </div>

      {/* Top Grid: Situation Room & Timeline */}
      <ScrollReveal delayMs={100} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* AI Situation Room */}
        <div className={`col-span-1 lg:col-span-2 rounded-3xl border p-8 relative overflow-hidden transition-all duration-500 ${isEmergency ? "border-red-500/50 bg-red-500/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]" : "border-[var(--border-strong)] bg-surface shadow-sm"}`}>
           {/* Background glow */}
           <div className={`absolute -right-20 -top-20 w-64 h-64 blur-[80px] rounded-full opacity-20 ${isEmergency ? "bg-red-500" : "bg-[var(--accent)]"}`} />
           
           <div className="flex items-center gap-3 mb-6">
             <div className={`size-10 rounded-xl flex items-center justify-center border ${isEmergency ? "border-red-500/30 bg-red-500/10 text-red-500" : "border-[var(--accent)]/30 bg-[var(--accent-subtle)] text-[var(--accent)]"}`}>
               <AlertTriangle className="size-5" />
             </div>
             <h2 className="text-xl font-bold text-fg">AI Situation Room</h2>
           </div>

           <div className="grid sm:grid-cols-2 gap-8">
             <div>
                <p className="text-sm font-bold text-fg-subtle uppercase tracking-widest mb-1">Current Attendance</p>
                <p className="text-5xl font-black text-fg font-mono tnum">{attendance.toLocaleString()}</p>
                <div className="flex items-center gap-2 mt-2 text-xs font-bold text-[var(--positive)]">
                  <TrendingUp className="size-3" /> +124 / min
                </div>
             </div>

             <div className="space-y-4">
                <div>
                  <p className="text-sm font-bold text-fg-subtle uppercase tracking-widest mb-1">High Risk</p>
                  <p className={`text-lg font-bold ${isEmergency ? "text-red-500" : "text-fg"}`}>
                    {isEmergency ? `${mode.toUpperCase()} Event Detected` : "Gate 6 Congestion"}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-bold text-fg-subtle uppercase tracking-widest mb-1">Prediction</p>
                  <p className="text-sm text-fg-muted font-medium">
                    {isEmergency ? `Critical mass reaching sector B in 4 mins.` : "Gate 6 reaches critical density in 12 minutes."}
                  </p>
                </div>
             </div>
           </div>

           <div className={`mt-8 p-5 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isEmergency ? "bg-red-500/10 border-red-500/30" : "bg-surface-2 border-[var(--border-faint)]"}`}>
              <div>
                <p className={`text-xs font-bold uppercase tracking-widest mb-1 ${isEmergency ? "text-red-500" : "text-[var(--accent)]"}`}>AI Recommendation</p>
                <p className="text-sm font-bold text-fg">
                  {isEmergency ? "Initiate protocol Alpha. Redirect Gate 4 to Gate 8." : "Open Gate 8. Dispatch 6 volunteers."}
                </p>
              </div>
              <div className="shrink-0 flex flex-col items-end">
                <span className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">Confidence</span>
                <span className={`text-xl font-black ${isEmergency ? "text-red-500" : "text-[var(--positive)]"}`}>94%</span>
              </div>
           </div>
        </div>

        {/* AI Incident Timeline */}
        <div className="col-span-1 rounded-3xl border border-[var(--border-strong)] bg-surface p-8 shadow-sm flex flex-col">
          <h2 className="text-xl font-bold text-fg mb-6">Incident Timeline</h2>
          <div className="relative flex-1">
            {/* Vertical Line */}
            <div className="absolute left-[11px] top-2 bottom-2 w-0.5 bg-[var(--border-strong)]" />
            
            <div className="flex flex-col gap-6 relative z-10">
              <div className="flex gap-4 opacity-50">
                <div className="size-6 rounded-full bg-surface-3 border-2 border-[var(--border-strong)] shrink-0" />
                <div className="-mt-1">
                  <p className="text-xs font-bold text-fg-muted">10:31 AM</p>
                  <p className="text-sm font-medium text-fg line-through">Queue growing</p>
                </div>
              </div>
              <div className="flex gap-4 opacity-70">
                <div className="size-6 rounded-full bg-surface-3 border-2 border-[var(--border-strong)] shrink-0" />
                <div className="-mt-1">
                  <p className="text-xs font-bold text-fg-muted">10:36 AM</p>
                  <p className="text-sm font-medium text-fg line-through">Pressure detected</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="size-6 rounded-full bg-surface-3 border-2 border-[var(--accent)] shrink-0 flex items-center justify-center">
                  <div className="size-2 rounded-full bg-[var(--accent)] animate-pulse" />
                </div>
                <div className="-mt-1">
                  <p className="text-xs font-bold text-[var(--accent)]">10:39 AM (Current)</p>
                  <p className="text-sm font-bold text-fg">Emergency lane opened</p>
                </div>
              </div>
              <div className="flex gap-4 opacity-70">
                <div className="size-6 rounded-full bg-surface-3 border-2 border-[var(--border-faint)] shrink-0 flex items-center justify-center">
                  <CheckCircle2 className="size-4 text-[var(--border-strong)]" />
                </div>
                <div className="-mt-1">
                  <p className="text-xs font-bold text-fg-muted">Predicted 10:41 AM</p>
                  <p className="text-sm font-medium text-fg-muted">Recovered</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>

      {/* Bottom Grid: Forecast & Optimizer */}
      <ScrollReveal delayMs={200} className="grid grid-cols-1 xl:grid-cols-2 gap-6 mt-2">
        
        {/* Predictive Crowd Forecast */}
        <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-8 shadow-sm flex flex-col">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-fg">Predictive Crowd Forecast</h2>
            <div className="flex bg-surface-2 p-1 rounded-xl border border-[var(--border-faint)]">
              {(["now", "30", "60"] as const).map(t => (
                <button 
                  key={t}
                  onClick={() => setForecastTab(t)}
                  className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all ${forecastTab === t ? "bg-surface shadow-sm text-fg" : "text-fg-muted hover:text-fg"}`}
                >
                  {t === "now" ? "Now" : `+${t} Min`}
                </button>
              ))}
            </div>
          </div>
          
          <div className="flex-1 rounded-2xl border border-[var(--border-faint)] bg-surface-2 relative overflow-hidden flex items-center justify-center min-h-[300px]">
            {/* Simulated Heatmap Abstract UI */}
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(99,102,241,0.05),transparent_70%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:20px_20px] opacity-20" />
            
            {/* Zones mapping */}
            <div className={`absolute top-1/4 left-1/4 size-32 rounded-full blur-[40px] transition-all duration-700 ${forecastTab === "now" ? "bg-[var(--accent)] opacity-40" : forecastTab === "30" ? "bg-orange-500 opacity-60 scale-125" : "bg-red-500 opacity-80 scale-150"}`} />
            <div className={`absolute bottom-1/4 right-1/4 size-40 rounded-full blur-[50px] transition-all duration-700 ${forecastTab === "now" ? "bg-[var(--positive)] opacity-30" : forecastTab === "30" ? "bg-[var(--accent)] opacity-50 translate-x-10" : "bg-orange-500 opacity-60 translate-x-20"}`} />

            <div className="z-10 flex flex-col items-center">
              <span className="px-4 py-2 rounded-full bg-surface/80 backdrop-blur-md border border-[var(--border-strong)] text-sm font-bold text-fg shadow-lg">
                AI predicting {(forecastTab === "now" ? "current" : forecastTab === "30" ? "near-future" : "mid-future")} crowd movement...
              </span>
            </div>
          </div>
        </div>

        {/* AI Resource Optimizer */}
        <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-8 shadow-sm flex flex-col">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-xl font-bold text-fg">AI Resource Optimizer</h2>
            <span className="text-xs font-bold text-[var(--accent)] uppercase tracking-widest bg-[var(--accent-subtle)] px-3 py-1 rounded-full border border-[var(--accent-line)]">
              Active Reallocation
            </span>
          </div>

          <div className="space-y-6">
            {[
              { label: "Security", icon: Shield, pct: isEmergency ? 95 : 60, trend: "+12 dispatched to sector B", color: "text-blue-500", bg: "bg-blue-500" },
              { label: "Volunteers", icon: HardHat, pct: isEmergency ? 85 : 45, trend: "+6 dispatched to Gate 8", color: "text-[var(--accent)]", bg: "bg-[var(--accent)]" },
              { label: "Medical", icon: HeartPulse, pct: isEmergency ? 100 : 20, trend: isEmergency ? "All units mobilized" : "Standby normal", color: "text-red-500", bg: "bg-red-500" },
              { label: "Police", icon: Shield, pct: isEmergency ? 70 : 15, trend: "Perimeter hold", color: "text-slate-400", bg: "bg-slate-400" },
            ].map((res, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className={`size-10 rounded-xl flex items-center justify-center border border-[var(--border-strong)] bg-surface-2 ${res.color}`}>
                  <res.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-sm font-bold text-fg">{res.label}</span>
                    <span className="text-xs font-medium text-fg-muted">{res.trend}</span>
                  </div>
                  <div className="h-2 w-full bg-surface-3 rounded-full overflow-hidden">
                    <div className={`h-full ${res.bg} transition-all duration-1000 ease-out`} style={{ width: `${res.pct}%` }} />
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>

      </ScrollReveal>
    </div>
  );
}
