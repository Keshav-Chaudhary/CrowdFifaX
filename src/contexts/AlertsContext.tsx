"use client";

import { createContext, useContext, useState, useCallback, ReactNode } from "react";

export type AlertSeverity = "Critical" | "High" | "Moderate" | "Low";

export type IncidentAlert = {
  id: string;
  sector: string;
  description: string;
  severity: AlertSeverity;
  status: "open" | "investigating" | "resolved";
  reportedBy: string; // e.g. "Fan (Seat 112A)"
  timestamp: string;
  aiSummary: string;
};

interface AlertsContextType {
  alerts: IncidentAlert[];
  reportIncident: (description: string, sector: string) => void;
  updateAlertStatus: (id: string, status: IncidentAlert["status"]) => void;
}

// Initial demo alerts
const INITIAL_ALERTS: IncidentAlert[] = [
  {
    id: "a-1",
    sector: "Concourse A",
    description: "There's a massive spill near the food vendors, people are slipping.",
    severity: "High",
    status: "open",
    reportedBy: "Fan (Anonymous)",
    timestamp: "2 mins ago",
    aiSummary: "Slip hazard reported near food vendors."
  },
  {
    id: "a-2",
    sector: "Gate 6",
    description: "The line isn't moving at all, getting crushed here.",
    severity: "Critical",
    status: "investigating",
    reportedBy: "Fan (Anonymous)",
    timestamp: "5 mins ago",
    aiSummary: "Severe crowd crush/bottleneck at entry."
  }
];

const AlertsContext = createContext<AlertsContextType | undefined>(undefined);

// Simple AI simulation helper
function analyzeIncident(desc: string): { severity: AlertSeverity, summary: string } {
  const text = desc.toLowerCase();
  if (text.includes("crush") || text.includes("fire") || text.includes("medical") || text.includes("fight")) {
    return { severity: "Critical", summary: "Immediate safety threat detected." };
  }
  if (text.includes("spill") || text.includes("broken") || text.includes("stuck")) {
    return { severity: "High", summary: "Physical hazard or significant disruption." };
  }
  if (text.includes("dirty") || text.includes("trash") || text.includes("empty")) {
    return { severity: "Low", summary: "Maintenance request." };
  }
  return { severity: "Moderate", summary: "General assistance required." };
}

export function AlertsProvider({ children }: { children: ReactNode }) {
  const [alerts, setAlerts] = useState<IncidentAlert[]>(INITIAL_ALERTS);

  const reportIncident = useCallback((description: string, sector: string = "Unknown") => {
    const analysis = analyzeIncident(description);
    const newAlert: IncidentAlert = {
      id: `a-${Date.now()}`,
      sector,
      description,
      severity: analysis.severity,
      status: "open",
      reportedBy: "Fan (Active Session)",
      timestamp: "Just now",
      aiSummary: analysis.summary
    };
    setAlerts(prev => [newAlert, ...prev]);
  }, []);

  const updateAlertStatus = useCallback((id: string, status: IncidentAlert["status"]) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, status } : a));
  }, []);

  return (
    <AlertsContext.Provider value={{ alerts, reportIncident, updateAlertStatus }}>
      {children}
    </AlertsContext.Provider>
  );
}

export function useAlerts() {
  const ctx = useContext(AlertsContext);
  if (!ctx) throw new Error("useAlerts must be used within AlertsProvider");
  return ctx;
}
