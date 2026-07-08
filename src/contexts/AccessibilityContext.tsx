"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

export type TextSize = "normal" | "lg" | "xl";

interface AccessibilityContextType {
  highContrast: boolean;
  textSize: TextSize;
  dyslexicFont: boolean;
  highVisibilityFocus: boolean;
  setHighContrast: (val: boolean) => void;
  setTextSize: (val: TextSize) => void;
  setDyslexicFont: (val: boolean) => void;
  setHighVisibilityFocus: (val: boolean) => void;
}

const AccessibilityContext = createContext<AccessibilityContextType | undefined>(undefined);

export function AccessibilityProvider({ children }: { children: ReactNode }) {
  const [highContrast, setHighContrastState] = useState(false);
  const [textSize, setTextSizeState] = useState<TextSize>("normal");
  const [dyslexicFont, setDyslexicFontState] = useState(false);
  const [highVisibilityFocus, setHighVisibilityFocusState] = useState(false);

  // Load settings from localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedContrast = localStorage.getItem("a11y_high_contrast") === "true";
      const savedTextSize = (localStorage.getItem("a11y_text_size") as TextSize) || "normal";
      const savedDyslexic = localStorage.getItem("a11y_dyslexic") === "true";
      const savedFocus = localStorage.getItem("a11y_high_focus") === "true";

      setHighContrastState(savedContrast);
      setTextSizeState(savedTextSize);
      setDyslexicFontState(savedDyslexic);
      setHighVisibilityFocusState(savedFocus);
    }
  }, []);

  // Sync state modifications to HTML tag classes and localStorage
  useEffect(() => {
    const root = document.documentElement;
    
    // High contrast settings
    if (highContrast) {
      root.classList.add("a11y-high-contrast");
      // Explicit overrides for CSS custom properties to ensure absolute high contrast
      root.style.setProperty('--bg', '#000000');
      root.style.setProperty('--surface', '#000000');
      root.style.setProperty('--surface-2', '#111111');
      root.style.setProperty('--surface-3', '#222222');
      root.style.setProperty('--fg', '#ffffff');
      root.style.setProperty('--fg-muted', '#ffffff');
      root.style.setProperty('--fg-subtle', '#dddddd');
      root.style.setProperty('--border', '#ffffff');
      root.style.setProperty('--border-faint', '#888888');
      root.style.setProperty('--border-strong', '#ffffff');
      root.style.setProperty('--accent', '#ffffff');
      root.style.setProperty('--accent-subtle', '#000000');
    } else {
      root.classList.remove("a11y-high-contrast");
      root.style.removeProperty('--bg');
      root.style.removeProperty('--surface');
      root.style.removeProperty('--surface-2');
      root.style.removeProperty('--surface-3');
      root.style.removeProperty('--fg');
      root.style.removeProperty('--fg-muted');
      root.style.removeProperty('--fg-subtle');
      root.style.removeProperty('--border');
      root.style.removeProperty('--border-faint');
      root.style.removeProperty('--border-strong');
      root.style.removeProperty('--accent');
      root.style.removeProperty('--accent-subtle');
    }
    
    localStorage.setItem("a11y_high_contrast", String(highContrast));
  }, [highContrast]);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove("a11y-text-lg", "a11y-text-xl");
    if (textSize === "lg") root.classList.add("a11y-text-lg");
    if (textSize === "xl") root.classList.add("a11y-text-xl");
    localStorage.setItem("a11y_text_size", textSize);
  }, [textSize]);

  useEffect(() => {
    const root = document.documentElement;
    if (dyslexicFont) {
      root.classList.add("a11y-dyslexic");
    } else {
      root.classList.remove("a11y-dyslexic");
    }
    localStorage.setItem("a11y_dyslexic", String(dyslexicFont));
  }, [dyslexicFont]);

  useEffect(() => {
    const root = document.documentElement;
    if (highVisibilityFocus) {
      root.classList.add("a11y-high-focus");
    } else {
      root.classList.remove("a11y-high-focus");
    }
    localStorage.setItem("a11y_high_focus", String(highVisibilityFocus));
  }, [highVisibilityFocus]);

  const setHighContrast = (val: boolean) => setHighContrastState(val);
  const setTextSize = (val: TextSize) => setTextSizeState(val);
  const setDyslexicFont = (val: boolean) => setDyslexicFontState(val);
  const setHighVisibilityFocus = (val: boolean) => setHighVisibilityFocusState(val);

  return (
    <AccessibilityContext.Provider
      value={{
        highContrast,
        textSize,
        dyslexicFont,
        highVisibilityFocus,
        setHighContrast,
        setTextSize,
        setDyslexicFont,
        setHighVisibilityFocus,
      }}
    >
      {children}
    </AccessibilityContext.Provider>
  );
}

export function useAccessibility() {
  const context = useContext(AccessibilityContext);
  if (context === undefined) {
    throw new Error("useAccessibility must be used within an AccessibilityProvider");
  }
  return context;
}
