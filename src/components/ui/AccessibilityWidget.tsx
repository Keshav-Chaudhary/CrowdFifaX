"use client";

import { useState, useEffect, useRef } from "react";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { Type, Accessibility, X, Globe } from "lucide-react";

export function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const {
    highContrast,
    textSize,
    dyslexicFont,
    highVisibilityFocus,
    setHighContrast,
    setTextSize,
    setDyslexicFont,
    setHighVisibilityFocus,
  } = useAccessibility();
  const { language, setLanguage } = useTranslation();

  const menuRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  // Close on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Keyboard shortcut: Alt + A opens the widget
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.altKey && (e.key === "a" || e.key === "A")) {
        e.preventDefault();
        setIsOpen((prev) => !prev);
      }
      if (e.key === "Escape" && isOpen) {
        setIsOpen(false);
        triggerRef.current?.focus();
      }
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  // Focus trap inside the open panel
  useEffect(() => {
    if (!isOpen || !menuRef.current) return;
    
    const focusableElements = menuRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex="0"]'
    );
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    function handleTab(e: KeyboardEvent) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        }
      } else {
        if (document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      }
    }

    const el = menuRef.current;
    if (el) {
      el.addEventListener("keydown", handleTab);
    }
    firstElement.focus();

    return () => {
      if (el) {
        el.removeEventListener("keydown", handleTab);
      }
    };
  }, [isOpen]);

  return (
    <div className="fixed bottom-20 md:bottom-6 left-6 z-50 flex flex-col items-start">
      {/* Floating Panel */}
      {isOpen && (
        <div
          ref={menuRef}
          role="dialog"
          aria-modal="true"
          aria-labelledby="a11y-title"
          className="mb-3 w-[calc(100vw-48px)] sm:w-80 rounded-2xl border border-[var(--border)] bg-surface p-5 shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200"
        >
          <div className="flex items-center justify-between border-b border-[var(--border-faint)] pb-3 mb-4">
            <h2 id="a11y-title" className="text-sm font-bold text-fg flex items-center gap-2">
              <Accessibility className="size-4 text-[var(--accent)]" />
              Accessibility Settings
            </h2>
            <button
              onClick={() => {
                setIsOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close settings panel"
              className="rounded-lg p-1 text-fg-muted hover:bg-surface-3 hover:text-fg transition-colors"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {/* Language Selector */}
            <div className="flex flex-col gap-1.5 border-t border-[var(--border-faint)] pt-3">
              <span className="text-xs font-semibold text-fg flex items-center gap-1">
                <Globe className="size-3 text-fg-muted" /> Language / Idioma
              </span>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Language Selector">
                {(["EN", "FR", "ES"] as const).map((lang) => (
                  <button
                    key={lang}
                    onClick={() => setLanguage(lang)}
                    aria-pressed={language === lang}
                    className={`rounded-lg border px-2 py-1.5 text-xs font-bold transition-all ${
                      language === lang
                        ? "bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent-line)]"
                        : "bg-surface-2 text-fg-muted border-[var(--border)] hover:bg-surface-3 hover:text-fg"
                    }`}
                  >
                    {lang === "EN" && "English"}
                    {lang === "FR" && "Français"}
                    {lang === "ES" && "Español"}
                  </button>
                ))}
              </div>
            </div>

            {/* High Contrast */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="toggle-contrast" className="text-xs font-semibold text-fg block">
                  High Contrast Theme
                </label>
                <span className="text-[10px] text-fg-muted block">
                  Pure black & white UI contrast
                </span>
              </div>
              <button
                id="toggle-contrast"
                role="switch"
                aria-checked={highContrast}
                onClick={() => setHighContrast(!highContrast)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                  highContrast ? "bg-[var(--accent)]" : "bg-surface-3"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    highContrast ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Text Scaling */}
            <div className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold text-fg flex items-center gap-1">
                <Type className="size-3 text-fg-muted" /> Text Scale
              </span>
              <div className="grid grid-cols-3 gap-2" role="group" aria-label="Text Size Selector">
                {(["normal", "lg", "xl"] as const).map((size) => (
                  <button
                    key={size}
                    onClick={() => setTextSize(size)}
                    aria-pressed={textSize === size}
                    className={`rounded-lg border px-2 py-1.5 text-xs font-bold transition-all ${
                      textSize === size
                        ? "bg-[var(--accent-subtle)] text-[var(--accent)] border-[var(--accent-line)]"
                        : "bg-surface-2 text-fg-muted border-[var(--border)] hover:bg-surface-3 hover:text-fg"
                    }`}
                  >
                    {size === "normal" && "100%"}
                    {size === "lg" && "115%"}
                    {size === "xl" && "125%"}
                  </button>
                ))}
              </div>
            </div>

            {/* Dyslexia Typography */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="toggle-dyslexic" className="text-xs font-semibold text-fg block">
                  Dyslexia-Friendly Font
                </label>
                <span className="text-[10px] text-fg-muted block">
                  Clean sans-serif comic typography
                </span>
              </div>
              <button
                id="toggle-dyslexic"
                role="switch"
                aria-checked={dyslexicFont}
                onClick={() => setDyslexicFont(!dyslexicFont)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                  dyslexicFont ? "bg-[var(--accent)]" : "bg-surface-3"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    dyslexicFont ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* High Visibility Keyboard Focus */}
            <div className="flex items-center justify-between">
              <div>
                <label htmlFor="toggle-focus" className="text-xs font-semibold text-fg block">
                  Keyboard Focus Assist
                </label>
                <span className="text-[10px] text-fg-muted block">
                  Thick high-contrast yellow outline
                </span>
              </div>
              <button
                id="toggle-focus"
                role="switch"
                aria-checked={highVisibilityFocus}
                onClick={() => setHighVisibilityFocus(!highVisibilityFocus)}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-[var(--accent)] ${
                  highVisibilityFocus ? "bg-[var(--accent)]" : "bg-surface-3"
                }`}
              >
                <span
                  className={`pointer-events-none inline-block size-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                    highVisibilityFocus ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-[var(--border-faint)] text-[9px] text-fg-subtle text-center">
            Tip: Press <kbd className="bg-surface-2 px-1 py-0.5 rounded border border-[var(--border)] font-mono">Alt + A</kbd> to open this panel at any time.
          </div>
        </div>
      )}

      {/* Floating Trigger Button */}
      <button
        ref={triggerRef}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Open accessibility settings panel"
        aria-expanded={isOpen}
        className={`size-12 rounded-full border flex items-center justify-center transition-all shadow-xl hover:scale-105 active:scale-95 ${
          isOpen
            ? "bg-[var(--accent)] text-white border-[var(--accent-line)]"
            : "bg-surface/90 backdrop-blur-md text-fg border-[var(--border-strong)] hover:bg-surface-2"
        }`}
      >
        <Accessibility className="size-5" />
      </button>
    </div>
  );
}
