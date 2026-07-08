"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type VolunteerStatus = "available" | "on-task" | "off-duty";

export type VolunteerAgent = {
  id: string;
  name: string;
  initials: string;
  role: string;
  sector: string;
  status: VolunteerStatus;
  assignedMissionId: string | null;
  completedCount: number;
};

export type DispatchMission = {
  id: string;
  title: string;
  desc: string;
  priority: 0 | 1 | 2 | 3;
  sector: string;
  eta: string;
  diff: string;
  diffColor: string;
  steps: string[];
  assignedTo: string | null; // volunteer id, null = unassigned
  status: "pending" | "assigned" | "completed";
  source: "ai" | "organizer" | "simulation";
};

interface DispatchContextType {
  volunteers: VolunteerAgent[];
  missionQueue: DispatchMission[];
  assignMission: (missionId: string, volunteerId: string) => void;
  unassignMission: (missionId: string) => void;
  completeMissionById: (missionId: string) => void;
  addMission: (mission: Omit<DispatchMission, "id" | "status" | "assignedTo">) => void;
  getMyMissions: (volunteerId: string) => DispatchMission[];
}

// ─── Initial Data ──────────────────────────────────────────────────────────────
const INITIAL_VOLUNTEERS: VolunteerAgent[] = [
  { id: "v-you", name: "You (Active Session)", initials: "YO", role: "Ground Ops", sector: "Gate 6", status: "on-task", assignedMissionId: "d-1", completedCount: 0 },
  { id: "v-2", name: "Alex Chen", initials: "AC", role: "Crowd Control", sector: "Concourse A", status: "available", assignedMissionId: null, completedCount: 2 },
  { id: "v-3", name: "Priya Rajan", initials: "PR", role: "Medical Support", sector: "North Stand", status: "on-task", assignedMissionId: null, completedCount: 5 },
  { id: "v-4", name: "Omar Khalid", initials: "OK", role: "Translation", sector: "Gate 7", status: "available", assignedMissionId: null, completedCount: 1 },
  { id: "v-5", name: "Sofia Martins", initials: "SM", role: "VIP Services", sector: "VIP (N)", status: "off-duty", assignedMissionId: null, completedCount: 3 },
  { id: "v-6", name: "James Okafor", initials: "JO", role: "Security", sector: "South Stand", status: "available", assignedMissionId: null, completedCount: 0 },
];

const INITIAL_MISSIONS: DispatchMission[] = [
  {
    id: "d-1", title: "Gate 6 Crowd Buildup", desc: "Sensor data shows Gate 6 at 89% capacity. Deploy stanchions and redirect flow to Route A.", priority: 0, sector: "Gate 6", eta: "1.5 mins", diff: "High", diffColor: "text-red-500", steps: ["Acknowledge dispatch", "Arrive at Gate 6", "Deploy stanchions", "Redirect fans to Route A", "File report"], assignedTo: "v-you", status: "assigned", source: "ai"
  },
  {
    id: "d-2", title: "Concourse A Flow Assist", desc: "Concourse A is generating a bottleneck near the restroom block. Guide crowd to alternate path.", priority: 1, sector: "Concourse A", eta: "2.0 mins", diff: "Moderate", diffColor: "text-[var(--accent)]", steps: ["Acknowledge dispatch", "Arrive at Concourse A", "Set up directional cones", "Assist for 10 min"], assignedTo: null, status: "pending", source: "ai"
  },
  {
    id: "d-3", title: "VIP Lounge Check-in", desc: "VIP arrival window open. Ensure hydration station and welcome desk are staffed.", priority: 2, sector: "VIP (N)", eta: "5.0 mins", diff: "Low", diffColor: "text-[var(--positive)]", steps: ["Acknowledge dispatch", "Report to VIP (N)", "Check station inventory", "Stand by for 30 min"], assignedTo: null, status: "pending", source: "organizer"
  },
  {
    id: "d-4", title: "South Stand Litter Sweep", desc: "Half-time litter accumulation at South Stand lower tier. Clear before second half.", priority: 3, sector: "South Stand", eta: "8.0 mins", diff: "Low", diffColor: "text-[var(--positive)]", steps: ["Acknowledge dispatch", "Collect equipment", "Sweep lower tier", "Dispose at Gate C bin"], assignedTo: null, status: "pending", source: "organizer"
  },
];

// ─── Context ───────────────────────────────────────────────────────────────────
const DispatchContext = createContext<DispatchContextType | undefined>(undefined);

export function DispatchProvider({ children }: { children: ReactNode }) {
  const [volunteers, setVolunteers] = useState<VolunteerAgent[]>(INITIAL_VOLUNTEERS);
  const [missionQueue, setMissionQueue] = useState<DispatchMission[]>(INITIAL_MISSIONS);

  const assignMission = useCallback((missionId: string, volunteerId: string) => {
    setMissionQueue(prev =>
      prev.map(m => m.id === missionId ? { ...m, assignedTo: volunteerId, status: "assigned" } : m)
    );
    setVolunteers(prev =>
      prev.map(v => v.id === volunteerId ? { ...v, status: "on-task", assignedMissionId: missionId } : v)
    );
  }, []);

  const unassignMission = useCallback((missionId: string) => {
    setMissionQueue(prev =>
      prev.map(m => m.id === missionId ? { ...m, assignedTo: null, status: "pending" } : m)
    );
    setVolunteers(prev =>
      prev.map(v => v.assignedMissionId === missionId ? { ...v, status: "available", assignedMissionId: null } : v)
    );
  }, []);

  const completeMissionById = useCallback((missionId: string) => {
    setMissionQueue(prev =>
      prev.map(m => m.id === missionId ? { ...m, status: "completed" } : m)
    );
    setVolunteers(prev =>
      prev.map(v => v.assignedMissionId === missionId
        ? { ...v, status: "available", assignedMissionId: null, completedCount: v.completedCount + 1 }
        : v
      )
    );
  }, []);

  const addMission = useCallback((mission: Omit<DispatchMission, "id" | "status" | "assignedTo">) => {
    const newMission: DispatchMission = {
      ...mission,
      id: `d-${Date.now()}`,
      status: "pending",
      assignedTo: null,
    };
    setMissionQueue(prev => [newMission, ...prev].sort((a, b) => a.priority - b.priority));
  }, []);

  const getMyMissions = useCallback((volunteerId: string) => {
    return missionQueue.filter(m => m.assignedTo === volunteerId && m.status !== "completed");
  }, [missionQueue]);

  return (
    <DispatchContext.Provider value={{ volunteers, missionQueue, assignMission, unassignMission, completeMissionById, addMission, getMyMissions }}>
      {children}
    </DispatchContext.Provider>
  );
}

export function useDispatch() {
  const ctx = useContext(DispatchContext);
  if (!ctx) throw new Error("useDispatch must be used within DispatchProvider");
  return ctx;
}
