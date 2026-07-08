"use client";

import { useState, useMemo } from "react";
import { useDispatch, DispatchMission } from "@/contexts/DispatchContext";
import { useSimulation } from "@/contexts/SimulationContext";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { ExplainAIButton } from "@/components/ui/ExplainAIButton";
import {
  Users, CheckCircle2, AlertTriangle, Zap, Clock,
  MapPin, X, Send, Sparkles, Plus
} from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  available: "bg-green-500/20 text-green-400 border-green-500/30",
  "on-task": "bg-[var(--accent)]/20 text-[var(--accent)] border-[var(--accent)]/30",
  "off-duty": "bg-surface-3 text-fg-muted border-[var(--border)]",
};
const STATUS_DOT: Record<string, string> = {
  available: "bg-green-500",
  "on-task": "bg-[var(--accent)] animate-pulse",
  "off-duty": "bg-fg-subtle",
};

function priorityLabel(p: number) {
  return ["Critical", "High", "Normal", "Low"][p] ?? "Low";
}
function priorityBadge(p: number) {
  return [
    "bg-red-500 text-white",
    "bg-orange-500 text-white",
    "bg-[var(--accent)] text-white",
    "bg-surface-3 text-fg-muted border border-[var(--border)]",
  ][p] ?? "bg-surface-3 text-fg-muted";
}

function sourceBadge(source: DispatchMission["source"]) {
  if (source === "ai") return "text-[var(--accent)] bg-[var(--accent-subtle)] border border-[var(--accent-line)] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest";
  if (source === "simulation") return "text-red-500 bg-red-500/10 border border-red-500/30 text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest";
  return "text-fg-muted bg-surface-3 border border-[var(--border)] text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-widest";
}

export function DispatchPage() {
  const { volunteers, missionQueue, assignMission, unassignMission, addMission } = useDispatch();
  const { mode } = useSimulation();
  const isEmergency = mode !== "normal";

  const [selectedMissionId, setSelectedMissionId] = useState<string | null>(null);
  const [selectedVolunteerId, setSelectedVolunteerId] = useState<string | null>(null);
  const [showAddMission, setShowAddMission] = useState(false);
  const [newMissionTitle, setNewMissionTitle] = useState("");
  const [newMissionDesc, setNewMissionDesc] = useState("");
  const [newMissionSector, setNewMissionSector] = useState("Gate 6");

  const pendingMissions = useMemo(() => missionQueue.filter(m => m.status === "pending"), [missionQueue]);
  const assignedMissions = useMemo(() => missionQueue.filter(m => m.status === "assigned"), [missionQueue]);
  const completedMissions = useMemo(() => missionQueue.filter(m => m.status === "completed"), [missionQueue]);

  const availableVolunteers = volunteers.filter(v => v.status === "available");

  // AI recommendation: highest priority pending mission → nearest available volunteer
  const aiRecommendation = useMemo(() => {
    const mission = pendingMissions[0];
    const volunteer = availableVolunteers[0];
    if (!mission || !volunteer) return null;
    return { mission, volunteer };
  }, [pendingMissions, availableVolunteers]);

  const handleAssign = (missionId: string, volunteerId: string) => {
    assignMission(missionId, volunteerId);
    setSelectedMissionId(null);
    setSelectedVolunteerId(null);
  };

  const handleAddMission = () => {
    if (!newMissionTitle.trim()) return;
    addMission({
      title: newMissionTitle,
      desc: newMissionDesc || "Manual dispatch by Organizer.",
      priority: 1,
      sector: newMissionSector,
      eta: "3.0 mins",
      diff: "Moderate",
      diffColor: "text-[var(--accent)]",
      steps: ["Acknowledge dispatch", "Arrive at sector", "Execute task", "File report"],
      source: "organizer",
    });
    setNewMissionTitle("");
    setNewMissionDesc("");
    setShowAddMission(false);
  };

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-fg">Volunteer Dispatch</h1>
          <p className="text-fg-muted">Assign AI-prioritized missions to ground teams in real time.</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowAddMission(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[var(--accent)] text-white text-sm font-bold hover:bg-[var(--accent-strong)] transition-colors shadow-[0_0_15px_var(--accent-line)]"
          >
            <Plus className="size-4" /> New Mission
          </button>
          <ExplainAIButton explanation={{
            title: "AI Dispatch Prioritization",
            dataInputs: ["Gate sensor loads", "Volunteer proximity", "Incident severity", "Crowd flow models"],
            prediction: `${pendingMissions.length} missions queued. ${availableVolunteers.length} volunteers available.`,
            confidence: 96,
            reasoning: "The AI ranks missions by urgency (crowd density × incident type × response ETA) and cross-references volunteer proximity data to propose the optimal assignment. This eliminates radio coordination delays by up to 73%."
          }} />
        </div>
      </div>

      {/* KPI Strip */}
      <ScrollReveal delayMs={100} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Available", value: availableVolunteers.length, icon: Users, color: "text-[var(--positive)]" },
          { label: "On Task", value: assignedMissions.length, icon: Zap, color: "text-[var(--accent)]" },
          { label: "Pending Missions", value: pendingMissions.length, icon: AlertTriangle, color: pendingMissions.length > 2 ? "text-red-500" : "text-[var(--caution)]" },
          { label: "Completed Today", value: completedMissions.length, icon: CheckCircle2, color: "text-[var(--positive)]" },
        ].map(k => (
          <div key={k.label} className="rounded-2xl border border-[var(--border-strong)] bg-surface p-4 flex items-center gap-4">
            <div className={`size-10 rounded-xl bg-surface-2 flex items-center justify-center ${k.color}`}>
              <k.icon className="size-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">{k.label}</p>
              <p className={`text-2xl font-black ${k.color}`}>{k.value}</p>
            </div>
          </div>
        ))}
      </ScrollReveal>

      {/* AI Recommendation Banner */}
      {aiRecommendation && (
        <ScrollReveal delayMs={150} className={`rounded-3xl border p-5 flex flex-col sm:flex-row sm:items-center gap-4 transition-all ${isEmergency ? "border-red-500/50 bg-red-500/5" : "border-[var(--accent-line)] bg-[var(--accent-subtle)]"}`}>
          <Sparkles className={`size-8 shrink-0 ${isEmergency ? "text-red-500" : "text-[var(--accent)]"}`} />
          <div className="flex-1">
            <p className="text-xs font-bold uppercase tracking-widest text-fg-muted mb-1">AI Recommendation · {isEmergency ? mode.toUpperCase() + " Protocol" : "Optimal Assignment"}</p>
            <p className="text-fg font-bold">
              Assign <span className={isEmergency ? "text-red-400" : "text-[var(--accent)]"}>&ldquo;{aiRecommendation.mission.title}&rdquo;</span> &rarr; <span className="text-fg">{aiRecommendation.volunteer.name}</span>
            </p>
            <p className="text-xs text-fg-muted mt-1">{aiRecommendation.volunteer.sector} · {aiRecommendation.volunteer.role} · Nearest available · 96% confidence</p>
          </div>
          <button
            onClick={() => handleAssign(aiRecommendation.mission.id, aiRecommendation.volunteer.id)}
            className={`shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all ${isEmergency ? "bg-red-500 hover:bg-red-600 shadow-[0_0_15px_rgba(239,68,68,0.4)]" : "bg-[var(--accent)] hover:bg-[var(--accent-strong)] shadow-[0_0_15px_var(--accent-line)]"}`}
          >
            <Send className="size-4" /> Deploy Now
          </button>
        </ScrollReveal>
      )}

      <ScrollReveal delayMs={200} className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Volunteer Roster */}
        <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-6 shadow-sm">
          <h2 className="text-lg font-bold text-fg mb-5">Ground Team Roster</h2>
          <div className="flex flex-col gap-3">
            {volunteers.map(v => {
              const assignedMission = missionQueue.find(m => m.assignedTo === v.id && m.status === "assigned");
              const isSelected = selectedVolunteerId === v.id;
              return (
                <button
                  key={v.id}
                  onClick={() => {
                    if (v.status === "available") setSelectedVolunteerId(isSelected ? null : v.id);
                  }}
                  disabled={v.status !== "available"}
                  className={`flex items-center gap-3 p-3 rounded-2xl border text-left transition-all ${v.status === "available" ? "hover:border-[var(--accent)] cursor-pointer" : "opacity-60 cursor-default"} ${isSelected ? "border-[var(--accent)] bg-[var(--accent-subtle)]" : "border-[var(--border-faint)] bg-surface-2"}`}
                >
                  <div className="size-9 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-line)] flex items-center justify-center text-xs font-black text-[var(--accent)] shrink-0 relative">
                    {v.initials}
                    <span className={`absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full border border-surface ${STATUS_DOT[v.status]}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-fg truncate">{v.name}</p>
                    <p className="text-xs text-fg-muted truncate">{v.role} · <span className="flex-inline items-center"><MapPin className="size-2.5 inline mr-0.5" />{v.sector}</span></p>
                    {assignedMission && <p className="text-[10px] text-[var(--accent)] font-bold truncate mt-0.5">↗ {assignedMission.title}</p>}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${STATUS_STYLES[v.status]}`}>
                    {v.status.replace("-", " ")}
                  </span>
                </button>
              );
            })}
          </div>
          {selectedVolunteerId && (
            <p className="text-xs text-[var(--accent)] font-bold mt-4 text-center animate-pulse">
              ← Now click a mission to assign →
            </p>
          )}
        </div>

        {/* Mission Queue */}
        <div className="xl:col-span-2 flex flex-col gap-4">

          {/* Pending Missions */}
          <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-6 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <h2 className="text-lg font-bold text-fg">Unassigned Missions</h2>
              <span className="text-xs font-bold bg-red-500/10 text-red-400 border border-red-500/30 px-2 py-1 rounded-full">{pendingMissions.length} pending</span>
            </div>
            {pendingMissions.length === 0 ? (
              <div className="text-center py-8">
                <CheckCircle2 className="size-8 text-[var(--positive)] mx-auto mb-2" />
                <p className="text-sm font-bold text-fg">All missions assigned</p>
              </div>
            ) : (
              pendingMissions.map(mission => {
                const isSelected = selectedMissionId === mission.id;
                return (
                  <div
                    key={mission.id}
                    onClick={() => setSelectedMissionId(isSelected ? null : mission.id)}
                    className={`flex flex-col p-4 rounded-2xl border cursor-pointer transition-all hover:scale-[1.005] ${mission.priority === 0 ? "bg-red-500/10 border-red-500/30" : "bg-surface-2 border-[var(--border-faint)]"} ${isSelected ? "ring-2 ring-[var(--accent)]" : ""}`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-widest ${priorityBadge(mission.priority)}`}>{priorityLabel(mission.priority)}</span>
                        <span className={sourceBadge(mission.source)}>{mission.source === "ai" ? "✦ AI" : mission.source === "simulation" ? "⚡ SIM" : "Organizer"}</span>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <span className="text-xs text-fg-muted flex items-center gap-1"><Clock className="size-3" />{mission.eta}</span>
                        <span className="text-xs text-fg-muted flex items-center gap-1"><MapPin className="size-3" />{mission.sector}</span>
                      </div>
                    </div>
                    <h3 className={`text-base font-bold mb-1 ${mission.priority === 0 ? "text-red-400" : "text-fg"}`}>{mission.title}</h3>
                    <p className="text-xs text-fg-subtle">{mission.desc}</p>

                    {/* Assign UI */}
                    {isSelected && selectedVolunteerId && (
                      <div className="mt-3 flex items-center gap-3 animate-in slide-in-from-bottom-2 duration-200">
                        <div className="flex-1 text-xs text-fg-muted">
                          Assign to: <span className="font-bold text-[var(--accent)]">{volunteers.find(v => v.id === selectedVolunteerId)?.name}</span>
                        </div>
                        <button
                          onClick={(e) => { e.stopPropagation(); handleAssign(mission.id, selectedVolunteerId); }}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[var(--accent)] text-white text-xs font-bold hover:bg-[var(--accent-strong)] transition-colors"
                        >
                          <Send className="size-3" /> Dispatch
                        </button>
                      </div>
                    )}
                    {isSelected && !selectedVolunteerId && (
                      <p className="mt-2 text-xs text-fg-muted animate-pulse">← Select a volunteer from the roster first</p>
                    )}
                  </div>
                );
              })
            )}
          </div>

          {/* Active Assignments */}
          {assignedMissions.length > 0 && (
            <div className="rounded-3xl border border-[var(--accent-line)] bg-[var(--accent-subtle)] p-6 shadow-sm flex flex-col gap-3">
              <h2 className="text-lg font-bold text-fg mb-2">Active Assignments</h2>
              {assignedMissions.map(mission => {
                const vol = volunteers.find(v => v.id === mission.assignedTo);
                return (
                  <div key={mission.id} className="flex items-center gap-3 p-3 rounded-xl bg-surface border border-[var(--border-faint)]">
                    <div className="size-8 rounded-full bg-[var(--accent-subtle)] border border-[var(--accent-line)] flex items-center justify-center text-[10px] font-black text-[var(--accent)] shrink-0">
                      {vol?.initials ?? "??"}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-fg truncate">{mission.title}</p>
                      <p className="text-xs text-fg-muted">{vol?.name} · {mission.sector}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-[var(--accent)] animate-pulse">In Progress</span>
                      <button
                        onClick={() => unassignMission(mission.id)}
                        className="size-6 rounded-full border border-[var(--border)] hover:border-red-500 hover:text-red-500 flex items-center justify-center transition-colors text-fg-muted"
                        title="Recall mission"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Completed Today */}
          {completedMissions.length > 0 && (
            <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-5">
              <h3 className="text-sm font-bold uppercase tracking-widest text-fg-muted mb-3">Completed Today ({completedMissions.length})</h3>
              <div className="flex flex-col gap-2">
                {completedMissions.map(m => {
                  return (
                    <div key={m.id} className="flex items-center gap-3 p-2 rounded-xl opacity-50">
                      <CheckCircle2 className="size-4 text-[var(--positive)] shrink-0" />
                      <span className="text-sm font-bold text-fg line-through flex-1">{m.title}</span>
                      <span className="text-xs text-fg-muted">{m.sector}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </ScrollReveal>

      {/* Add Mission Modal */}
      {showAddMission && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" onClick={() => setShowAddMission(false)}>
          <div className="w-full max-w-md bg-surface rounded-3xl border border-[var(--border-strong)] p-6 shadow-2xl animate-in zoom-in-95 fade-in duration-200" onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-fg">Create Mission</h2>
              <button onClick={() => setShowAddMission(false)} className="size-8 rounded-full border border-[var(--border)] flex items-center justify-center text-fg-muted hover:text-fg"><X className="size-4" /></button>
            </div>
            <div className="flex flex-col gap-4">
              <div>
                <label className="text-xs font-bold text-fg-muted uppercase tracking-widest mb-2 block">Mission Title</label>
                <input value={newMissionTitle} onChange={e => setNewMissionTitle(e.target.value)} placeholder="e.g. Gate 2 Queue Control" className="w-full bg-surface-2 border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-fg outline-none focus:border-[var(--accent)]" />
              </div>
              <div>
                <label className="text-xs font-bold text-fg-muted uppercase tracking-widest mb-2 block">Description</label>
                <textarea value={newMissionDesc} onChange={e => setNewMissionDesc(e.target.value)} placeholder="Brief for the volunteer..." rows={3} className="w-full bg-surface-2 border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-fg outline-none focus:border-[var(--accent)] resize-none" />
              </div>
              <div>
                <label className="text-xs font-bold text-fg-muted uppercase tracking-widest mb-2 block">Sector</label>
                <select value={newMissionSector} onChange={e => setNewMissionSector(e.target.value)} className="w-full bg-surface-2 border border-[var(--border)] rounded-xl px-4 py-3 text-sm text-fg outline-none focus:border-[var(--accent)]">
                  {["Gate 6", "Gate 7", "Concourse A", "Concourse B", "North Stand", "South Stand", "East Stand", "West Stand", "VIP (N)", "VIP (S)"].map(s => <option key={s}>{s}</option>)}
                </select>
              </div>
              <button onClick={handleAddMission} className="w-full py-3 rounded-xl bg-[var(--accent)] text-white font-bold hover:bg-[var(--accent-strong)] transition-colors flex items-center justify-center gap-2">
                <Send className="size-4" /> Add to Queue
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
