"use client";

import { Trash2, Palette, Globe, Accessibility, ShieldAlert, Info } from "lucide-react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { useAccessibility } from "@/contexts/AccessibilityContext";
import { useTranslation } from "@/contexts/LanguageContext";
import { usePersona } from "@/contexts/PersonaContext";
import { useState } from "react";
import { PageHeader } from "@/components/app/shared/PageHeader";
import { cn } from "@/utils/cn";
import { Dialog, Button } from "@/components/ui";

/* ─── Section wrapper ───────────────────────────────────── */
export function Section({
  title,
  description,
  icon: Icon,
  children,
}: {
  title: string;
  description: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="group relative overflow-hidden rounded-3xl border border-[var(--border-faint)] bg-surface-2 p-6 md:p-8 shadow-[var(--shadow-sm)] transition-all hover:border-[var(--accent-line)] hover:shadow-[var(--shadow-md)]">
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--accent-subtle)] blur-[40px] opacity-0 transition-all group-hover:opacity-60 pointer-events-none" />
      <div className="relative z-10">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl border border-[var(--border-strong)] bg-surface-3 shadow-sm">
            <Icon className="size-5 text-[var(--accent)]" />
          </div>
          <div>
            <h2 className="text-lg font-bold text-fg">{title}</h2>
            <p className="text-sm text-fg-muted">{description}</p>
          </div>
        </div>
        <div className="border-t border-[var(--border-faint)] pt-5">{children}</div>
      </div>
    </div>
  );
}

/* ─── Row inside a section ──────────────────────────────── */
export function Row({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 py-4 sm:flex-row sm:items-center sm:justify-between border-b border-[var(--border-faint)] last:border-0 last:pb-0 first:pt-0">
      <div>
        <p className="text-sm font-semibold text-fg">{label}</p>
        {hint && <p className="mt-0.5 text-xs text-fg-muted">{hint}</p>}
      </div>
      <div className="flex shrink-0 items-center gap-2">{children}</div>
    </div>
  );
}

/* ─── Main Component ────────────────────────────────────── */
export function SettingsClient() {
  const { theme, toggleTheme } = useTheme();
  const { language, setLanguage, t } = useTranslation();
  const {
    highContrast,
    setHighContrast,
    textSize,
    setTextSize,
    dyslexicFont,
    setDyslexicFont,
    highVisibilityFocus,
    setHighVisibilityFocus,
  } = useAccessibility();
  const { persona, setPersona } = usePersona();

  const [showResetDialog, setShowResetDialog] = useState(false);
  const [enableSound, setEnableSound] = useState(true);

  const handleResetAll = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="stagger flex flex-col gap-4 pb-12">
      <PageHeader
        eyebrow={t.nav_settings}
        title="Preferences & Control"
        description="Customize your tournament display languages, visual accessibility settings, and active persona settings."
        actions={
          <div className="flex items-center gap-2 rounded-xl border border-[var(--border-strong)] bg-surface-3 px-3 py-1.5">
            <span className="text-[10px] font-bold uppercase tracking-widest text-fg-muted">
              {theme === "dark" ? "Dark" : "Light"} Mode
            </span>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Toggle theme"
              className="relative flex h-6 w-11 cursor-pointer rounded-full border border-[var(--border-strong)] bg-surface transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--accent)]"
              style={{
                backgroundColor: theme === "dark" ? "var(--accent)" : "var(--surface-3)",
              }}
            >
              <span
                className={cn(
                  "absolute top-0.5 size-5 rounded-full bg-[#ffffff] shadow-sm transition-transform duration-300",
                  theme === "dark" ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </button>
          </div>
        }
      />

      {/* Language Section */}
      <Section
        icon={Globe}
        title="Language Settings / Idiomas"
        description="Choose your preferred interface language."
      >
        <Row
          label="Active Language"
          hint="Select the translation for dashboards, routing directions, and system prompts."
        >
          <div className="flex items-center gap-2">
            {(["EN", "PT", "ES"] as const).map((lang) => (
              <button
                key={lang}
                type="button"
                onClick={() => setLanguage(lang)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all",
                  language === lang
                    ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-surface text-fg-muted hover:border-[var(--border-strong)]"
                )}
              >
                {lang === "EN" && "English"}
                {lang === "PT" && "Português"}
                {lang === "ES" && "Español"}
              </button>
            ))}
          </div>
        </Row>
      </Section>

      {/* Accessibility Section */}
      <Section
        icon={Accessibility}
        title="Accessibility Settings"
        description="Adjust styles for readability and accessibility compliance."
      >
        <Row
          label="High Contrast Mode"
          hint="Convert layouts to high-contrast white and dark color pairings."
        >
          <button
            type="button"
            onClick={() => setHighContrast(!highContrast)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all",
              highContrast
                ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]"
                : "border-[var(--border)] bg-surface text-fg-muted hover:border-[var(--border-strong)]"
            )}
          >
            {highContrast ? "Enabled" : "Disabled"}
          </button>
        </Row>

        <Row
          label="Text Size Scaling"
          hint="Select custom display layout font sizing thresholds."
        >
          <div className="flex items-center gap-2">
            {(["normal", "lg", "xl"] as const).map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => setTextSize(size)}
                className={cn(
                  "flex items-center gap-2 rounded-xl border px-3 py-1.5 text-xs font-bold transition-all",
                  textSize === size
                    ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]"
                    : "border-[var(--border)] bg-surface text-fg-muted hover:border-[var(--border-strong)]"
                )}
              >
                {size === "normal" && "100%"}
                {size === "lg" && "115%"}
                {size === "xl" && "125%"}
              </button>
            ))}
          </div>
        </Row>

        <Row
          label="Dyslexia Font Override"
          hint="Force typography to sans-serif comic-style fonts."
        >
          <button
            type="button"
            onClick={() => setDyslexicFont(!dyslexicFont)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all",
              dyslexicFont
                ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]"
                : "border-[var(--border)] bg-surface text-fg-muted hover:border-[var(--border-strong)]"
            )}
          >
            {dyslexicFont ? "Enabled" : "Disabled"}
          </button>
        </Row>

        <Row
          label="Keyboard Focus Ring Assist"
          hint="Display visible, thick outlines on focused interactive elements."
        >
          <button
            type="button"
            onClick={() => setHighVisibilityFocus(!highVisibilityFocus)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all",
              highVisibilityFocus
                ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]"
                : "border-[var(--border)] bg-surface text-fg-muted hover:border-[var(--border-strong)]"
            )}
          >
            {highVisibilityFocus ? "Enabled" : "Disabled"}
          </button>
        </Row>
      </Section>

      {/* Simulator Mode Preferences */}
      <Section
        icon={ShieldAlert}
        title="Incident Notification Simulator"
        description="Choose how simulation emergencies alert you."
      >
        <Row
          label="Emergency Sirens"
          hint="Play warning sounds on simulated heavy rain or fire delays."
        >
          <button
            type="button"
            onClick={() => setEnableSound(!enableSound)}
            className={cn(
              "flex items-center gap-2 rounded-xl border px-4 py-2 text-xs font-bold transition-all",
              enableSound
                ? "border-[var(--accent)] bg-[var(--accent-subtle)] text-[var(--accent)]"
                : "border-[var(--border)] bg-surface text-fg-muted hover:border-[var(--border-strong)]"
            )}
          >
            {enableSound ? "Sirens Enabled" : "Sirens Muted"}
          </button>
        </Row>
      </Section>

      {/* Storage and App Reset */}
      <Section
        icon={Trash2}
        title="Application Cache & Storage"
        description="Reset and empty local saved state preferences."
      >
        <Row
          label="Reset Configuration Data"
          hint="Revert all persona, language, and theme overrides to factory defaults."
        >
          <Button
            onClick={() => setShowResetDialog(true)}
            className="bg-[var(--critical)] text-white hover:opacity-90 border-transparent shadow-sm"
          >
            Reset All Preferences
          </Button>
        </Row>
      </Section>

      {/* About Section */}
      <Section
        icon={Info}
        title="About CrowdFifaX"
        description="Application version and development information."
      >
        <Row label="Version" hint="Current application release.">
          <span className="rounded-lg border border-[var(--border-strong)] bg-surface-3 px-3 py-1.5 font-mono text-xs font-bold text-fg-muted">
            v1.0.0
          </span>
        </Row>
        <Row label="Developer" hint="Lead engineer and architect.">
          <span className="text-sm font-semibold text-fg">
            K. (chaudhary)
          </span>
        </Row>
        <Row label="Project Initiative" hint="Developed for the following hackathon/challenge.">
          <span className="rounded-lg border border-[var(--border-strong)] bg-surface-3 px-3 py-1.5 font-mono text-xs font-bold text-fg-muted">
            Prompt Wars Challenge 4
          </span>
        </Row>
        <Row label="AI Assistants Used" hint="Tools utilized for development, alignment, and data gathering.">
          <div className="flex flex-wrap justify-end gap-2 max-w-xs">
            {["Antigravity", "Claude AI", "Web Scrapper v2026", "Hybrid Local RAG Model"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--border)] bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-fg-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </Row>
        <Row label="Framework" hint="Built with Next.js, Tailwind CSS, and Zustand.">
          <div className="flex flex-wrap justify-end gap-2">
            {["Next.js", "Tailwind CSS", "Zustand"].map((t) => (
              <span
                key={t}
                className="rounded-full border border-[var(--border)] bg-surface px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-fg-muted"
              >
                {t}
              </span>
            ))}
          </div>
        </Row>
      </Section>

      {/* Reset Confirmation Dialog */}
      <Dialog
        open={showResetDialog}
        onClose={() => setShowResetDialog(false)}
        title="Reset All Preferences?"
        description="This will permanently empty your local preferences, including high contrast variables, custom dyslexia fonts, text scaling, persona keys, and active translation selectors. The application will reload immediately."
      >
        <div className="mt-6 flex justify-end gap-3">
          <Button variant="ghost" onClick={() => setShowResetDialog(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleResetAll}
            className="bg-[var(--critical)] text-white hover:opacity-90 border-transparent shadow-sm"
          >
            Confirm Reset
          </Button>
        </div>
      </Dialog>
    </div>
  );
}
