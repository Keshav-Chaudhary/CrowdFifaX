"use client";

import { createContext, useContext, useState, ReactNode, useEffect } from "react";

export type Persona = "organizer" | "fan" | "volunteer";

interface PersonaContextType {
  persona: Persona;
  setPersona: (p: Persona) => void;
  isHydrated: boolean;
}

const PersonaContext = createContext<PersonaContextType | undefined>(undefined);

export function PersonaProvider({ children }: { children: ReactNode }) {
  const [persona, setPersonaState] = useState<Persona>(() => {
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("crowdfifax_persona") as Persona;
      if (saved && ["organizer", "fan", "volunteer"].includes(saved)) {
        return saved;
      }
    }
    return "organizer";
  });
  const [isHydrated, setIsHydrated] = useState(false);

  // Hydrate flag
  useEffect(() => {
    setTimeout(() => setIsHydrated(true), 0);
  }, []);

  const setPersona = (p: Persona) => {
    setPersonaState(p);
    localStorage.setItem("crowdfifax_persona", p);
  };

  return (
    <PersonaContext.Provider value={{ persona, setPersona, isHydrated }}>
      {children}
    </PersonaContext.Provider>
  );
}

export function usePersona() {
  const context = useContext(PersonaContext);
  if (context === undefined) {
    throw new Error("usePersona must be used within a PersonaProvider");
  }
  return context;
}
