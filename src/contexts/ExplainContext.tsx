"use client";

import { createContext, useContext, useState, ReactNode } from "react";

export interface AIExplanation {
  title: string;
  dataInputs: string[];
  prediction: string;
  confidence: number;
  reasoning: string;
}

interface ExplainContextType {
  activeExplanation: AIExplanation | null;
  setExplanation: (explanation: AIExplanation | null) => void;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  showExplanation: (explanation: AIExplanation) => void;
}

const ExplainContext = createContext<ExplainContextType | undefined>(undefined);

export function ExplainProvider({ children }: { children: ReactNode }) {
  const [activeExplanation, setExplanation] = useState<AIExplanation | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  const showExplanation = (explanation: AIExplanation) => {
    setExplanation(explanation);
    setIsOpen(true);
  };

  return (
    <ExplainContext.Provider value={{ activeExplanation, setExplanation, isOpen, setIsOpen, showExplanation }}>
      {children}
    </ExplainContext.Provider>
  );
}

export function useExplain() {
  const context = useContext(ExplainContext);
  if (context === undefined) {
    throw new Error("useExplain must be used within an ExplainProvider");
  }
  return context;
}
