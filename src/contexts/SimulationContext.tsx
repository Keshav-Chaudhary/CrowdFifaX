"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export type SimulationMode = "normal" | "rain" | "power" | "metro" | "fire" | "medical";

interface SimulationContextType {
  mode: SimulationMode;
  setMode: (mode: SimulationMode) => void;
}

const SimulationContext = createContext<SimulationContextType | undefined>(undefined);

export function SimulationProvider({ children }: { children: ReactNode }) {
  const [mode, setMode] = useState<SimulationMode>("normal");

  return (
    <SimulationContext.Provider value={{ mode, setMode }}>
      {children}
    </SimulationContext.Provider>
  );
}

export function useSimulation() {
  const context = useContext(SimulationContext);
  if (context === undefined) {
    throw new Error("useSimulation must be used within a SimulationProvider");
  }
  return context;
}
