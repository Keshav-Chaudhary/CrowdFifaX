"use client";

import { useSimulation } from "@/contexts/SimulationContext";
import { useDispatch, DispatchMission } from "@/contexts/DispatchContext";
import { ExplainAIButton } from "@/components/ui/ExplainAIButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ShieldAlert, Image as ImageIcon, Camera, CheckSquare, ArrowLeft, CheckCircle2, Send, Clock, Activity, MessageSquare } from "lucide-react";
import { useAlerts } from "@/contexts/AlertsContext";
import { useState, useMemo, useEffect } from "react";

type Mission = {
  id: string;
  title: string;
  desc: string;
  priority: number; // 0 = Critical, 1 = High, 2 = Normal, 3 = Low
  eta: string;
  diff: string;
  diffColor: string;
  steps: string[];
};

// ─── DEFAULT_MISSIONS REMOVED ───────────────────────────────────────────────
// Volunteers now only see missions dynamically dispatched from the Organizer 
// via DispatchContext (and global emergency simulation missions).


const SIMULATION_MISSIONS: Record<string, Mission> = {
  rain: {
    id: "sim-rain", title: "Distribute Emergency Ponchos", desc: "Heavy rain detected. Move to Gate C Exterior and distribute ponchos to exiting fans.", priority: 0, eta: "2.0 mins", diff: "Low", diffColor: "text-[var(--positive)]", steps: ["Acknowledge mission", "Locate poncho pallet 4", "Distribute to exiting fans", "Report when pallet empty"]
  },
  power: {
    id: "sim-power", title: "Manual Crowd Direction", desc: "Power failure in Sector B Concourse. Provide manual illumination and direction.", priority: 0, eta: "0.5 mins", diff: "High", diffColor: "text-red-500", steps: ["Acknowledge mission", "Activate glow batons", "Form human chain at stairs", "Direct fans to emergency exit 2"]
  },
  metro: {
    id: "sim-metro", title: "Crowd Pacification", desc: "Metro delayed by 45 mins. Keep fans calm in the Gate 1 Plaza.", priority: 0, eta: "3.0 mins", diff: "Moderate", diffColor: "text-[var(--accent)]", steps: ["Acknowledge mission", "Inform fans of 45min delay", "Distribute water", "Guide to temporary waiting area"]
  },
  fire: {
    id: "sim-fire", title: "Evacuation Assistance", desc: "Fire alert in Sector F. Assist in immediate crowd redirection away from the affected zone.", priority: 0, eta: "1.0 mins", diff: "Critical", diffColor: "text-red-500", steps: ["Acknowledge mission", "Clear emergency lanes", "Direct fans away from smoke", "Ensure no re-entry"]
  },
  medical: {
    id: "sim-medical", title: "Clear Medical Path", desc: "Medical emergency reported near Seat 112A. Secure the area for EMTs.", priority: 0, eta: "0.5 mins", diff: "High", diffColor: "text-red-500", steps: ["Acknowledge mission", "Locate incident at Seat 112A", "Create 5m perimeter", "Wait for EMT arrival"]
  }
};

function TeamStatusList() {
  const { volunteers, missionQueue } = useDispatch();
  
  return (
    <>
      {volunteers.map(v => {
        const assignedMission = missionQueue.find(m => m.assignedTo === v.id && m.status === "assigned");
        const statusColor = v.status === "available" ? "bg-green-500" : v.status === "on-task" ? "bg-[var(--accent)]" : "bg-fg-muted";
        
        return (
          <div key={v.id} className="flex items-center gap-3 p-3 rounded-2xl border border-[var(--border-faint)] bg-surface-2 text-left transition-all">
            <div className="size-9 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-line)] flex items-center justify-center text-xs font-black text-[var(--accent)] shrink-0 relative">
              {v.initials}
              <span className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border border-surface ${statusColor}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-fg truncate">{v.name}</p>
              <p className="text-xs text-fg-muted truncate">{v.role} · {v.sector}</p>
              {assignedMission && <p className="text-[10px] text-[var(--accent)] font-bold truncate mt-0.5">↗ {assignedMission.title}</p>}
            </div>
          </div>
        );
      })}
    </>
  );
}

export function VolunteerDashboard() {
  const { mode } = useSimulation();
  const { getMyMissions, completeMissionById } = useDispatch();
  
  const [completedIds, setCompletedIds] = useState<Set<string>>(new Set());
  const [activeMissionId, setActiveMissionId] = useState<string | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  // Vision AI State
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<{ density: string; risk: string; riskLevel: string } | null>(null);

  // Reporter State
  const { reportIncident } = useAlerts();
  const [reportText, setReportText] = useState("");
  const [isReporting, setIsReporting] = useState(false);
  const [reported, setReported] = useState(false);

  const handleReport = () => {
    if (!reportText.trim()) return;
    setIsReporting(true);
    setTimeout(() => {
      reportIncident(reportText, "Concourse B");
      setIsReporting(false);
      setReported(true);
      setReportText("");
      setTimeout(() => setReported(false), 3000);
    }, 1500);
  };

  // If simulation mode changes, clear active mission to force them to see the new critical task

  useEffect(() => {
    setTimeout(() => setActiveMissionId(null), 0);
  }, [mode]);

  // Derive the active list of missions based on simulation mode and completion status
  const activeMissions = useMemo(() => {
    // Dispatched missions from organizer (highest priority)
    const dispatched = getMyMissions("v-you").map(m => ({
      id: m.id,
      title: m.title,
      desc: m.desc,
      priority: 0 as const,
      eta: m.eta,
      diff: m.diff,
      diffColor: m.diffColor,
      steps: m.steps,
      source: "organizer" as const,
    }));

    const list: Mission[] = [];
    if (mode !== "normal" && SIMULATION_MISSIONS[mode]) {
      list.push(SIMULATION_MISSIONS[mode]);
    }
    const localFiltered = list
      .filter(m => !completedIds.has(m.id))
      .sort((a, b) => a.priority - b.priority);

    // Dispatched missions go first, then local emergency
    return [...dispatched, ...localFiltered];
  }, [mode, completedIds, getMyMissions]);

  const completedMissionsData = useMemo(() => {
    // We only have completed IDs, so we'll just show generic titles or simulation titles
    // In a real app, completed missions would be tracked in DispatchContext.
    // For now, we'll map the completedIds to generic names if they don't exist in SIMULATION_MISSIONS.
    return Array.from(completedIds).map(id => {
      const simMission = Object.values(SIMULATION_MISSIONS).find(m => m.id === id);
      if (simMission) return simMission;
      return {
        id,
        title: "Completed Task",
        desc: "", priority: 3, eta: "", diff: "", diffColor: "", steps: []
      };
    });
  }, [completedIds]);

  const activeMission = activeMissionId ? activeMissions.find(m => m.id === activeMissionId) : null;

  const handleCompleteMission = () => {
    if (activeMissionId) {
      // If it's a dispatched mission (id starts with 'd-'), notify context
      if (activeMissionId.startsWith("d-")) {
        completeMissionById(activeMissionId);
      } else {
        setCompletedIds(prev => new Set(prev).add(activeMissionId));
      }
      setActiveMissionId(null);
    }
  };

  const handleVisionAnalyze = () => {
    setIsAnalyzing(true);
    setAnalysisResult(null);
    // Simulate AI processing delay
    setTimeout(() => {
      setIsAnalyzing(false);
      setAnalysisResult({
        density: "89% (Critical)",
        risk: "Stanchion Collapse Risk",
        riskLevel: "High"
      });
    }, 2000);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-fg">Ground Ops</h1>
          <p className="text-fg-muted">AI-directed volunteer missions.</p>
        </div>
        {!activeMissionId && (
          <ExplainAIButton 
            explanation={{
              title: "Task Prioritization Logic",
              dataInputs: ["Simulation State", "Crowd Density Alerts", "Inventory Logs"],
              prediction: "Tasks are sorted by immediate safety impact.",
              confidence: 98,
              reasoning: "The system actively rearranges your task list. Emergency protocols are elevated to Priority 0, displacing standard restocking tasks to prevent severe bottlenecks."
            }}
          />
        )}
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Main Content Column (Missions & Team) */}
        <ScrollReveal delayMs={100} className="flex-1 flex flex-col gap-6 min-w-0">
          
          {!activeMission ? (
            // LIST VIEW
            <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-6 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-fg">Pending Missions</h2>
                <span className="text-xs font-bold text-fg-muted bg-surface-2 px-3 py-1 rounded-full border border-[var(--border-faint)]">
                  {activeMissions.length} Tasks
                </span>
              </div>
              
              {activeMissions.length === 0 ? (
                <div className="flex flex-col items-center justify-center text-center py-12">
                  <div className="size-16 rounded-full bg-[var(--positive)]/10 text-[var(--positive)] flex items-center justify-center mb-4">
                    <CheckCircle2 className="size-8" />
                  </div>
                  <h3 className="text-lg font-bold text-fg">All clear!</h3>
                  <p className="text-sm text-fg-muted">You have completed all assigned missions.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {activeMissions.map((mission) => (
                    <button
                      key={mission.id}
                      onClick={() => {
                        setActiveMissionId(mission.id);
                        setActiveStep(0);
                      }}
                      className={`flex flex-col p-4 rounded-2xl border text-left transition-all hover:scale-[1.01] ${mission.priority === 0 ? "bg-red-500/10 border-red-500/50 shadow-[0_0_15px_rgba(239,68,68,0.15)] hover:border-red-500" : "bg-surface-2 border-[var(--border-faint)] hover:border-[var(--accent)]"}`}
                    >
                      <div className="flex items-start justify-between w-full mb-2">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full ${mission.priority === 0 ? "bg-red-500 text-white" : mission.priority === 1 ? "bg-[var(--accent)] text-white" : "bg-surface-3 text-fg-muted border border-[var(--border)]"}`}>
                            {mission.priority === 0 ? "Critical" : mission.priority === 1 ? "High" : mission.priority === 2 ? "Normal" : "Low"}
                          </span>
                          {(mission as DispatchMission).source === "organizer" && (
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-[var(--accent-subtle)] text-[var(--accent)] border border-[var(--accent-line)] uppercase tracking-widest">
                              ✦ Dispatched
                            </span>
                          )}
                        </div>
                        <span className="text-xs font-bold text-fg-muted">{mission.eta}</span>
                      </div>
                      <h3 className={`text-base font-bold mb-1 ${mission.priority === 0 ? "text-red-500" : "text-fg"}`}>{mission.title}</h3>
                      <p className="text-xs text-fg-subtle line-clamp-2">{mission.desc}</p>
                    </button>
                  ))}
                </div>
              )}

              {/* Completed Missions History */}
              {completedMissionsData.length > 0 && (
                <div className="mt-8 pt-6 border-t border-[var(--border-strong)]">
                  <h3 className="text-sm font-bold uppercase tracking-widest text-fg-muted mb-4">
                    Completed Missions ({completedMissionsData.length})
                  </h3>
                  <div className="flex flex-col gap-2">
                    {completedMissionsData.map(mission => (
                      <div key={mission.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-[var(--border-faint)] opacity-60">
                        <div className="size-6 rounded-full bg-[var(--positive)]/10 text-[var(--positive)] flex items-center justify-center shrink-0">
                          <CheckCircle2 className="size-4" />
                        </div>
                        <div className="flex-1">
                          <h4 className="text-sm font-bold text-fg line-through">{mission.title}</h4>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            // ACTIVE MISSION CHECKLIST VIEW
            <div className={`rounded-3xl border p-6 relative overflow-hidden transition-all animate-in slide-in-from-right-4 ${activeMission.priority === 0 ? "border-red-500/50 bg-red-500/5 shadow-[0_0_30px_rgba(239,68,68,0.1)]" : "border-[var(--accent-line)] bg-surface shadow-[0_0_30px_var(--accent-subtle)]"}`}>
              {activeMission.priority === 0 && <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(239,68,68,0.1),transparent_70%)]" />}
              
              <div className="flex items-center gap-4 mb-6 relative z-10">
                <button 
                  onClick={() => setActiveMissionId(null)}
                  className="size-8 rounded-full bg-surface-2 border border-[var(--border-strong)] flex items-center justify-center text-fg hover:bg-surface-3 transition-colors"
                >
                  <ArrowLeft className="size-4" />
                </button>
                <div className="flex-1 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-fg">Active Execution</h2>
                  <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${activeMission.priority === 0 ? "bg-red-500 text-white" : "bg-[var(--accent)] text-white"}`}>
                    Priority {activeMission.priority}
                  </span>
                </div>
              </div>

              <div className="bg-surface-2 border border-[var(--border-strong)] rounded-2xl p-5 mb-6 relative z-10">
                <h3 className="text-lg font-bold text-fg mb-1">{activeMission.title}</h3>
                <p className="text-sm text-fg-muted mb-4">{activeMission.desc}</p>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="flex flex-col items-start gap-1.5 p-3 rounded-xl border border-[var(--border-strong)] bg-surface shadow-sm">
                    <div className="flex items-center gap-1.5 text-[10px] text-fg-muted font-bold uppercase tracking-widest">
                       <Clock className="size-3" /> ETA
                    </div>
                    <span className="text-sm font-bold text-fg">{activeMission.eta}</span>
                  </div>
                  <div className="flex flex-col items-start gap-1.5 p-3 rounded-xl border border-[var(--border-strong)] bg-surface shadow-sm">
                    <div className="flex items-center gap-1.5 text-[10px] text-fg-muted font-bold uppercase tracking-widest">
                       <Activity className="size-3" /> Difficulty
                    </div>
                    <span className={`text-sm font-bold ${activeMission.diffColor}`}>{activeMission.diff}</span>
                  </div>
                  <div className="flex flex-col items-start gap-1.5 p-3 rounded-xl border border-[var(--border-strong)] bg-surface shadow-sm">
                    <div className="flex items-center gap-1.5 text-[10px] text-fg-muted font-bold uppercase tracking-widest">
                       <CheckCircle2 className="size-3" /> Confidence
                    </div>
                    <span className="text-sm font-bold text-[var(--positive)]">98% Match</span>
                  </div>
                </div>
              </div>

              {/* Smart Checklist */}
              <h3 className="text-sm font-bold uppercase tracking-widest text-fg-subtle mb-3 relative z-10">Execution Steps</h3>
              <div className="space-y-2 relative z-10">
                {activeMission.steps.map((step, i) => {
                  const isCompleted = activeStep > i;
                  const isActive = activeStep === i;
                  return (
                    <button 
                      key={i}
                      onClick={() => {
                        if (isActive) setActiveStep(i + 1);
                        else if (i < activeStep) setActiveStep(i);
                      }}
                      className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all text-left ${isActive ? "bg-surface-2 border-[var(--accent)] shadow-[0_0_10px_var(--accent-subtle)]" : isCompleted ? "bg-surface/50 border-[var(--border-faint)] opacity-50" : "bg-surface border-[var(--border-strong)]"}`}
                    >
                      <div className={`size-5 rounded flex items-center justify-center shrink-0 border ${isCompleted ? "bg-[var(--positive)] border-[var(--positive)] text-white" : isActive ? "border-[var(--accent)] text-transparent" : "border-[var(--border-strong)] text-transparent"}`}>
                        <CheckSquare className="size-3" />
                      </div>
                      <span className={`text-sm font-medium ${isCompleted ? "line-through text-fg-muted" : "text-fg"}`}>{step}</span>
                    </button>
                  );
                })}
              </div>

              {/* Complete Button */}
              {activeStep === activeMission.steps.length && (
                <button 
                  onClick={handleCompleteMission}
                  className="w-full mt-6 py-4 rounded-xl font-bold uppercase tracking-widest transition-all bg-[var(--positive)] hover:bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-300"
                >
                  <CheckCircle2 className="size-5" /> Submit Report & Complete
                </button>
              )}
            </div>
          )}

          {/* Live Team Status - Moved to left column */}
          <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-6 shadow-sm flex flex-col">
            <h2 className="text-xl font-bold text-fg mb-4">Live Team Status</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <TeamStatusList />
            </div>
          </div>
        </ScrollReveal>

        {/* AI Tools Column (Right sidebar) */}
        <ScrollReveal delayMs={200} className="w-full lg:w-[400px] shrink-0 flex flex-col gap-6">
          
          {/* AI Crowd Detection Simulator */}
          <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-6 shadow-sm flex flex-col sticky top-24">
            <h2 className="text-xl font-bold text-fg mb-2">Vision AI Assessor</h2>
            <p className="text-sm text-fg-muted mb-6">Upload photo of a crowd bottleneck for instant safety analysis.</p>

            <button 
              onClick={handleVisionAnalyze}
              disabled={isAnalyzing}
              className={`rounded-2xl border-2 border-dashed ${isAnalyzing ? "border-[var(--accent)] bg-[var(--accent-subtle)]" : analysisResult ? "border-green-500/50 bg-green-500/5" : "border-[var(--border-strong)] bg-surface-2 hover:border-[var(--accent)] hover:bg-[var(--accent-subtle)]"} p-8 flex flex-col items-center justify-center text-center cursor-pointer transition-all group overflow-hidden relative min-h-[220px]`}
            >
              {isAnalyzing ? (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--accent-subtle)] to-transparent translate-y-full animate-[scan_2s_ease-in-out_infinite]" />
                  <div className="size-10 border-4 border-[var(--accent)] border-t-transparent rounded-full animate-spin mb-3" />
                  <p className="text-sm font-bold text-[var(--accent)]">Processing Vision Model...</p>
                  <p className="text-xs text-[var(--accent)]/70 mt-1">Identifying crowd anomalies</p>
                </>
              ) : analysisResult ? (
                <>
                  <CheckCircle2 className="size-10 text-[var(--positive)] mb-3" />
                  <p className="text-sm font-bold text-fg">Analysis Complete</p>
                  <p className="text-xs text-fg-muted mt-1">Tap to capture new area</p>
                </>
              ) : (
                <>
                  <Camera className="size-10 text-fg-muted group-hover:text-[var(--accent)] mb-3 transition-colors" />
                  <p className="text-sm font-bold text-fg">Tap to capture sector</p>
                  <p className="text-xs text-fg-muted mt-1">AI analyzes density, wheelchairs, and risks.</p>
                </>
              )}
            </button>

            <div className="mt-6 space-y-3">
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-3 transition-all">
                <span className="text-sm font-bold text-fg-subtle flex items-center gap-2"><ImageIcon className="size-4" /> Crowd Density</span>
                <span className={`text-xs font-bold ${analysisResult ? "text-red-500" : "text-fg"}`}>{analysisResult ? analysisResult.density : "Pending Photo"}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-surface-3 transition-all">
                <span className="text-sm font-bold text-fg-subtle flex items-center gap-2"><ShieldAlert className="size-4" /> Primary Risk</span>
                <span className={`text-xs font-bold ${analysisResult ? (analysisResult.riskLevel === "High" ? "text-red-500" : "text-[var(--accent)]") : "text-fg-muted"}`}>
                  {analysisResult ? analysisResult.risk : "Unknown"}
                </span>
              </div>
            </div>
          </div>

          {/* AI Incident Reporter */}
          <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-6 shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-fg flex items-center gap-2">
                  <MessageSquare className="size-5 text-[var(--accent)]" /> Report Issue
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted border border-[var(--border-faint)] bg-surface-2 px-2 py-0.5 rounded-full">HQ Link</span>
              </div>
              <p className="text-sm text-fg-muted mb-6">Log field incidents to dispatch immediately.</p>
            </div>
            
            {reported ? (
              <div className="rounded-2xl border border-[var(--positive)]/30 bg-[var(--positive)]/10 p-6 flex flex-col items-center justify-center text-center transition-all animate-in zoom-in-95 h-32">
                <CheckCircle2 className="size-8 text-[var(--positive)] mb-2" />
                <p className="text-sm font-bold text-fg">Report Logged</p>
                <p className="text-[10px] font-bold uppercase tracking-widest text-[var(--positive)] mt-1">Sent to Organizer</p>
              </div>
            ) : (
              <div className="relative">
                <textarea 
                  value={reportText}
                  onChange={(e) => setReportText(e.target.value)}
                  placeholder="e.g. Spill in Concourse B"
                  className="w-full bg-surface-2 border border-[var(--border-strong)] rounded-2xl p-4 pr-14 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:border-[var(--accent)] focus:ring-1 focus:ring-[var(--accent)] transition-all min-h-[120px] resize-none"
                  disabled={isReporting}
                />
                <button 
                  onClick={handleReport}
                  disabled={isReporting || !reportText.trim()}
                  aria-label="Submit incident report"
                  className={`absolute bottom-3 right-3 size-10 rounded-xl flex items-center justify-center transition-all ${isReporting || !reportText.trim() ? "bg-surface-3 text-fg-muted cursor-not-allowed border border-[var(--border-faint)]" : "bg-[var(--accent)] text-white shadow-[0_4px_15px_var(--accent-subtle)] hover:scale-105 active:scale-95"}`}
                >
                  {isReporting ? <div className="size-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Send className="size-4 -ml-0.5" />}
                </button>
                {isReporting && (
                  <div className="absolute inset-0 bg-surface/50 backdrop-blur-sm rounded-2xl flex flex-col gap-2 items-center justify-center">
                    <div className="size-6 border-2 border-[var(--accent)] border-t-transparent rounded-full animate-spin" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent)] animate-pulse bg-surface-2 px-3 py-1 rounded-full border border-[var(--accent-line)] shadow-lg">Analyzing...</span>
                  </div>
                )}
              </div>
            )}
          </div>

        </ScrollReveal>

      </div>
    </div>
  );
}
