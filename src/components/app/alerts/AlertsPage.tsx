"use client";

import { usePersona } from "@/contexts/PersonaContext";
import { useAlerts, IncidentAlert } from "@/contexts/AlertsContext";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { Clock, MapPin, CheckCircle2, ShieldAlert } from "lucide-react";
import { useMemo } from "react";

export function AlertsPage() {
  const { persona } = usePersona();
  const { alerts, updateAlertStatus } = useAlerts();

  if (persona === "organizer") {
    return <OrganizerAlertsView alerts={alerts} />;
  }

  return <VolunteerAlertsView alerts={alerts} updateAlertStatus={updateAlertStatus} />;
}

function OrganizerAlertsView({ alerts }: { alerts: IncidentAlert[] }) {
  // Group by sector, ignoring resolved alerts
  const sectorData = useMemo(() => {
    const data: Record<string, { count: number, criticals: number, alerts: IncidentAlert[] }> = {};
    const activeAlerts = alerts.filter(a => a.status !== "resolved");
    
    activeAlerts.forEach(a => {
      if (!data[a.sector]) data[a.sector] = { count: 0, criticals: 0, alerts: [] };
      data[a.sector].count++;
      if (a.severity === "Critical" || a.severity === "High") data[a.sector].criticals++;
      data[a.sector].alerts.push(a);
    });
    return Object.entries(data).sort((a, b) => b[1].criticals - a[1].criticals || b[1].count - a[1].count);
  }, [alerts]);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-fg">Sector Alerts Center</h1>
        <p className="text-fg-muted">Macro-level view of live fan complaints and AI risk assessments.</p>
      </div>

      <ScrollReveal delayMs={100}>
        {sectorData.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-12 flex flex-col items-center justify-center text-center max-w-2xl mx-auto mt-8">
            <CheckCircle2 className="size-12 text-[var(--positive)] mb-4" />
            <h3 className="text-xl font-bold text-fg">All Sectors Clear</h3>
            <p className="text-fg-muted">There are no active fan complaints requiring attention.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {sectorData.map(([sector, stats]) => {
              const isHighRisk = stats.criticals > 0;
              return (
                <div key={sector} className={`rounded-3xl border ${isHighRisk ? "border-red-500/50 bg-red-500/5 shadow-[0_0_20px_rgba(239,68,68,0.1)]" : "border-[var(--border-strong)] bg-surface"} p-6 flex flex-col`}>
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-bold text-fg flex items-center gap-2">
                    <MapPin className="size-5" /> {sector}
                  </h2>
                  <span className={`text-xs font-bold px-3 py-1 rounded-full ${isHighRisk ? "bg-red-500 text-white" : "bg-surface-2 text-fg-muted border border-[var(--border-faint)]"}`}>
                    {stats.count} Active
                  </span>
                </div>
                
                <div className="flex flex-col gap-3 flex-1 mb-6">
                  {stats.alerts.slice(0, 3).map(a => (
                    <div key={a.id} className="p-3 rounded-xl bg-surface-2 border border-[var(--border-faint)] flex flex-col gap-1">
                       <div className="flex items-center justify-between">
                         <span className={`text-[10px] font-bold uppercase tracking-widest ${a.severity === "Critical" || a.severity === "High" ? "text-red-500" : "text-fg-muted"}`}>{a.severity}</span>
                         <span className="text-[10px] text-fg-muted flex items-center gap-1"><Clock className="size-3" /> {a.timestamp}</span>
                       </div>
                       <p className="text-sm font-bold text-fg">{a.aiSummary}</p>
                       <p className="text-xs text-fg-subtle line-clamp-1 italic">&ldquo;{a.description}&rdquo;</p>
                    </div>
                  ))}
                  {stats.count > 3 && <p className="text-xs text-fg-muted text-center mt-2">+{stats.count - 3} more alerts in this sector</p>}
                </div>

                <button className={`w-full py-3 rounded-xl font-bold text-sm transition-all ${isHighRisk ? "bg-red-500 text-white hover:bg-red-600" : "bg-[var(--accent)] text-white hover:scale-[1.02]"}`}>
                  Dispatch Team to {sector}
                </button>
              </div>
            );
          })}
        </div>
        )}
      </ScrollReveal>
    </div>
  );
}

function VolunteerAlertsView({ alerts, updateAlertStatus }: { alerts: IncidentAlert[], updateAlertStatus: (id: string, s: IncidentAlert["status"]) => void }) {
  const openAlerts = alerts.filter(a => a.status !== "resolved");
  const resolvedAlerts = alerts.filter(a => a.status === "resolved");

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20 max-w-4xl mx-auto">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-black tracking-tight text-fg">Sector Alerts</h1>
        <p className="text-fg-muted">Live incidents reported by fans nearby.</p>
      </div>

      <ScrollReveal delayMs={100} className="flex flex-col gap-4">
        {openAlerts.length === 0 ? (
          <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-12 flex flex-col items-center justify-center text-center">
            <CheckCircle2 className="size-12 text-[var(--positive)] mb-4" />
            <h3 className="text-xl font-bold text-fg">All clear!</h3>
            <p className="text-fg-muted">No active incidents in your sector.</p>
          </div>
        ) : (
          openAlerts.map(a => (
            <div key={a.id} className={`rounded-3xl border p-6 flex flex-col sm:flex-row gap-6 ${a.severity === "Critical" || a.severity === "High" ? "border-red-500/50 bg-red-500/5" : "border-[var(--border-strong)] bg-surface"}`}>
               <div className="flex-1 flex flex-col gap-3">
                 <div className="flex items-center gap-3">
                   <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${a.severity === "Critical" || a.severity === "High" ? "bg-red-500 text-white" : "bg-surface-3 text-fg-muted border border-[var(--border)]"}`}>
                     {a.severity} Risk
                   </span>
                   <span className="text-sm font-bold text-fg-muted flex items-center gap-1"><MapPin className="size-4" /> {a.sector}</span>
                   <span className="text-xs text-fg-muted ml-auto">{a.timestamp}</span>
                 </div>
                 
                 <div>
                   <h3 className="text-xl font-bold text-fg mb-1 flex items-center gap-2">
                     <ShieldAlert className="size-5 text-[var(--accent)]" /> {a.aiSummary}
                   </h3>
                   <div className="p-3 rounded-xl bg-surface-2 border border-[var(--border-faint)] italic text-sm text-fg-subtle">
                     &ldquo;{a.description}&rdquo; &mdash; <span className="font-bold text-fg-muted">{a.reportedBy}</span>
                   </div>
                 </div>
               </div>
               
               <div className="flex flex-row sm:flex-col gap-3 w-full sm:w-auto shrink-0 justify-center">
                 {a.status === "open" ? (
                   <button onClick={() => updateAlertStatus(a.id, "investigating")} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-[var(--accent-line)] bg-[var(--accent-subtle)] text-[var(--accent)] hover:bg-[var(--accent)] hover:text-white transition-all w-full sm:w-[160px]">
                     Investigate
                   </button>
                 ) : (
                   <button onClick={() => updateAlertStatus(a.id, "resolved")} className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-bold text-sm border border-[var(--positive)]/30 bg-[var(--positive)]/10 text-[var(--positive)] hover:bg-[var(--positive)] hover:text-white transition-all w-full sm:w-[160px]">
                     <CheckCircle2 className="size-4" /> Mark Resolved
                   </button>
                 )}
               </div>
            </div>
          ))
        )}
      </ScrollReveal>

      {resolvedAlerts.length > 0 && (
        <ScrollReveal delayMs={200} className="mt-8">
          <h3 className="text-sm font-bold uppercase tracking-widest text-fg-muted mb-4">Recently Resolved</h3>
          <div className="flex flex-col gap-3">
            {resolvedAlerts.map(a => (
              <div key={a.id} className="flex items-center gap-4 p-4 rounded-2xl bg-surface border border-[var(--border-faint)] opacity-60">
                 <CheckCircle2 className="size-5 text-[var(--positive)] shrink-0" />
                 <div className="flex-1">
                   <p className="text-sm font-bold text-fg line-through">{a.aiSummary}</p>
                   <p className="text-xs text-fg-muted">{a.sector}</p>
                 </div>
              </div>
            ))}
          </div>
        </ScrollReveal>
      )}
    </div>
  );
}
