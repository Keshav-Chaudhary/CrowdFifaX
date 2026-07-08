import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Navigation2, Maximize2, AlertTriangle, ShieldCheck } from "lucide-react";

export function StadiumMapSection() {
  return (
    <section className="relative overflow-hidden border-b border-[var(--border)] bg-surface py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        <ScrollReveal className="mx-auto max-w-2xl text-center">
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-[var(--accent)] drop-shadow-sm">Live Stadium View</h2>
          <p className="mt-2 text-3xl font-extrabold tracking-tight text-fg sm:text-5xl">
            See the entire venue at a glance.
          </p>
          <p className="mt-6 text-lg leading-relaxed text-fg-muted">
            The CrowdFifaX dashboard maps predicted crowd density to the stadium layout, allowing organizers to act before bottlenecks occur.
          </p>
        </ScrollReveal>

        <ScrollReveal delayMs={200} className="mt-16 lg:mt-24">
          <div className="relative mx-auto max-w-6xl overflow-hidden rounded-3xl border border-[var(--border-strong)] bg-surface shadow-[0_20px_60px_-15px_rgba(99,102,241,0.2)]">
            
            {/* Top Bar for HUD feel */}
            <div className="flex h-12 items-center justify-between border-b border-[var(--border-faint)] bg-surface-2 px-6">
              <div className="flex items-center gap-3">
                <span className="flex size-2 rounded-full bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-pulse" />
                <span className="text-xs font-bold uppercase tracking-widest text-fg-muted">Live Telemetry Active</span>
              </div>
              <Maximize2 className="size-4 text-fg-subtle" />
            </div>

            {/* Main Interactive Area: flex on mobile, relative on desktop */}
            <div className="flex flex-col lg:block">
              
              {/* Map Container */}
              <div className="relative h-[400px] lg:h-[600px] w-full overflow-hidden">
                
                {/* Subtle grid background */}
                <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px]" />
                
                {/* Massive ambient glow in center */}
                <div className="absolute left-1/2 top-1/2 h-[300px] lg:h-[400px] w-[80%] lg:w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--accent)] opacity-5 blur-[80px] lg:blur-[120px]" />

                {/* The "Stadium" Abstract Rings */}
                <div className="absolute inset-0 flex items-center justify-center p-4">
                  
                  {/* Outer Ring */}
                  <div className="relative w-full max-w-[800px] aspect-[16/9] rounded-full border border-[var(--border-faint)] shadow-[inset_0_0_50px_rgba(0,0,0,0.5)] flex items-center justify-center">
                    
                    {/* Middle Ring (Dashed) */}
                    <div className="w-[80%] aspect-[16/9] rounded-full border border-dashed border-[var(--border-strong)] opacity-50 animate-[spin_60s_linear_infinite]" />
                    
                    {/* Inner Pitch */}
                    <div className="absolute w-[50%] aspect-[2/1] rounded-full border-2 border-[var(--accent-line)] bg-[var(--accent-subtle)] shadow-[0_0_30px_rgba(99,102,241,0.15)] flex items-center justify-center overflow-hidden">
                      {/* Pitch markings */}
                      <div className="h-full w-0.5 bg-[var(--accent-line)] opacity-50" />
                      <div className="absolute w-[30%] aspect-square rounded-full border-2 border-[var(--accent-line)] opacity-50" />
                    </div>
                  </div>

                </div>

                {/* Data Overlays & Markers */}
                
                {/* Marker: Gate 4 (Critical) */}
                <div className="absolute left-[5%] lg:left-[15%] top-[20%] lg:top-[30%] z-20 group">
                  <div className="flex flex-col items-center gap-2 transition-transform hover:scale-105">
                    <div className="relative flex items-center gap-2 lg:gap-3 rounded-full border border-red-500/30 bg-surface-3/90 px-3 lg:px-4 py-1.5 lg:py-2 backdrop-blur-md shadow-[0_0_20px_rgba(239,68,68,0.1)]">
                      <span className="relative flex size-2 lg:size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                        <span className="relative inline-flex size-2 lg:size-3 rounded-full bg-red-500" />
                      </span>
                      <span className="text-[10px] lg:text-xs font-bold text-red-400">Gate 4</span>
                      <span className="rounded bg-red-500/10 px-1.5 py-0.5 text-[8px] lg:text-[10px] font-black text-red-400">92%</span>
                    </div>
                    {/* Connector Line */}
                    <div className="h-8 lg:h-16 w-px bg-gradient-to-b from-red-500/50 to-transparent" />
                  </div>
                </div>

                {/* Marker: Gate 7 (Optimal) */}
                <div className="absolute right-[5%] lg:right-[20%] bottom-[15%] lg:bottom-[20%] z-20 group">
                  <div className="flex flex-col items-center gap-2 transition-transform hover:scale-105">
                    {/* Connector Line UP */}
                    <div className="h-8 lg:h-12 w-px bg-gradient-to-t from-green-500/50 to-transparent" />
                    <div className="relative flex items-center gap-2 lg:gap-3 rounded-full border border-green-500/30 bg-surface-3/90 px-3 lg:px-4 py-1.5 lg:py-2 backdrop-blur-md shadow-[0_0_20px_rgba(34,197,94,0.1)]">
                      <span className="relative flex size-2 lg:size-3">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-green-400 opacity-30" />
                        <span className="relative inline-flex size-2 lg:size-3 rounded-full bg-green-500" />
                      </span>
                      <span className="text-[10px] lg:text-xs font-bold text-green-400">Gate 7</span>
                      <span className="rounded bg-green-500/10 px-1.5 py-0.5 text-[8px] lg:text-[10px] font-black text-green-400">34%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* HUD Panels - Stacked on Mobile, Absolute on Desktop */}
              <div className="flex flex-col gap-4 p-4 lg:p-0 lg:block bg-surface-2 lg:bg-transparent border-t border-[var(--border-faint)] lg:border-t-0 z-30">
                
                {/* Left Panel: System Recommendation */}
                <div className="relative lg:absolute lg:left-8 lg:bottom-8 lg:w-72 rounded-2xl border border-[var(--accent-line)] bg-surface-3/95 p-4 lg:p-5 shadow-lg lg:shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="flex size-6 items-center justify-center rounded bg-[var(--accent-subtle)] text-[var(--accent)]">
                      <Navigation2 className="size-3" />
                    </div>
                    <h4 className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-[var(--accent)]">AI Recommendation</h4>
                  </div>
                  <p className="text-xs lg:text-sm text-fg-muted leading-relaxed">
                    Traffic anomaly detected at Gate 4. Automatically notifying fans via the app to use Gate 7 for faster entry.
                  </p>
                  <div className="mt-4 flex items-center justify-between rounded-lg bg-surface-2 p-2 lg:p-3 border border-[var(--border-faint)]">
                    <span className="text-[10px] lg:text-xs font-semibold text-fg">Action Status</span>
                    <span className="text-[10px] lg:text-xs font-bold text-green-400 flex items-center gap-1.5">
                      <ShieldCheck className="size-3.5" /> Deployed
                    </span>
                  </div>
                </div>

                {/* Right Panel: Alert Log */}
                <div className="relative lg:absolute lg:right-8 lg:top-8 lg:w-64 rounded-2xl border border-red-500/20 bg-surface-3/95 p-4 lg:p-5 shadow-lg lg:shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertTriangle className="size-4 text-red-400" />
                    <h4 className="text-[10px] lg:text-xs font-bold uppercase tracking-widest text-red-400">Live Alerts</h4>
                  </div>
                  <div className="flex flex-col gap-3">
                    <div className="border-l-2 border-red-500 pl-3">
                      <p className="text-[8px] lg:text-[10px] font-bold text-fg-muted uppercase mb-1">12:04 PM</p>
                      <p className="text-[10px] lg:text-xs font-semibold text-fg">Gate 4 queue exceeding 15 mins.</p>
                    </div>
                    <div className="border-l-2 border-yellow-500 pl-3 opacity-60">
                      <p className="text-[8px] lg:text-[10px] font-bold text-fg-muted uppercase mb-1">11:58 AM · Volunteer Log</p>
                      <p className="text-[10px] lg:text-xs font-semibold text-fg">&ldquo;Spill reported in Sector B concourse. Needs cleanup.&rdquo;</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
