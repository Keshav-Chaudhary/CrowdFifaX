"use client";

import { useState, useEffect, useRef } from "react";
import { useSimulation } from "@/contexts/SimulationContext";
import { ExplainAIButton } from "@/components/ui/ExplainAIButton";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { AlertTriangle, Users, Eye, Activity, RefreshCw, Wifi } from "lucide-react";

// --- Static stadium layout data ---
type Sector = {
  id: string;
  label: string;
  x: number; // percent
  y: number; // percent
  w: number; // percent
  h: number; // percent
  baseLoad: number; // 0-100
  volatility: number; // how much it fluctuates
  emergencyLoad?: Record<string, number>; // load override per simulation mode
};

const SECTORS: Sector[] = [
  { id: "north-stand",  label: "North Stand",   x: 25, y: 4,  w: 50, h: 18, baseLoad: 72, volatility: 8 },
  { id: "south-stand",  label: "South Stand",   x: 25, y: 78, w: 50, h: 18, baseLoad: 65, volatility: 10 },
  { id: "east-stand",   label: "East Stand",    x: 75, y: 22, w: 20, h: 56, baseLoad: 58, volatility: 6 },
  { id: "west-stand",   label: "West Stand",    x: 5,  y: 22, w: 20, h: 56, baseLoad: 48, volatility: 7 },
  { id: "gate-6",       label: "Gate 6",        x: 3,  y: 6,  w: 16, h: 14, baseLoad: 89, volatility: 12, emergencyLoad: { fire: 98, power: 96, metro: 95 } },
  { id: "gate-7",       label: "Gate 7",        x: 81, y: 6,  w: 16, h: 14, baseLoad: 54, volatility: 5 },
  { id: "vip-north",   label: "VIP (N)",        x: 38, y: 22, w: 24, h: 10, baseLoad: 40, volatility: 3 },
  { id: "vip-south",   label: "VIP (S)",        x: 38, y: 68, w: 24, h: 10, baseLoad: 38, volatility: 3 },
  { id: "concourse-a", label: "Concourse A",    x: 3,  y: 22, w: 14, h: 24, baseLoad: 77, volatility: 9, emergencyLoad: { metro: 94, rain: 91 } },
  { id: "concourse-b", label: "Concourse B",    x: 83, y: 54, w: 14, h: 24, baseLoad: 62, volatility: 7, emergencyLoad: { power: 97 } },
  { id: "field",        label: "Field",         x: 20, y: 28, w: 60, h: 44, baseLoad: 15, volatility: 2 },
];

const ALERT_ZONES = ["gate-6", "concourse-a"];

function getDensityColor(load: number, isEmergency: boolean): string {
  if (isEmergency && load > 85) return "rgba(239,68,68,0.8)";
  if (load >= 85) return "rgba(239,68,68,0.75)";
  if (load >= 70) return "rgba(249,115,22,0.70)";
  if (load >= 50) return "rgba(234,179,8,0.65)";
  if (load >= 30) return "rgba(34,197,94,0.55)";
  return "rgba(34,197,94,0.30)";
}

function getDensityLabel(load: number): string {
  if (load >= 85) return "Critical";
  if (load >= 70) return "High";
  if (load >= 50) return "Moderate";
  if (load >= 30) return "Normal";
  return "Low";
}

function getDensityBadgeClass(load: number): string {
  if (load >= 85) return "bg-red-500 text-white";
  if (load >= 70) return "bg-orange-500 text-white";
  if (load >= 50) return "bg-yellow-500 text-black";
  return "bg-green-500 text-white";
}

export function HeatmapsPage() {
  const { mode } = useSimulation();
  const isEmergency = mode !== "normal";
  const [loads, setLoads] = useState<Record<string, number>>({});
  const [selectedSector, setSelectedSector] = useState<string | null>(null);
  const [lastRefresh, setLastRefresh] = useState(new Date());
  const [activeLayer, setActiveLayer] = useState<"density" | "flow" | "risk">("density");
  const tickRef = useRef(0);

  // Simulate live telemetry updates every 2s
  useEffect(() => {
    const init: Record<string, number> = {};
    SECTORS.forEach(s => {
      const emergencyOverride = s.emergencyLoad?.[mode];
      init[s.id] = emergencyOverride ?? s.baseLoad;
    });
    setTimeout(() => setLoads(init), 0);

    const interval = setInterval(() => {
      tickRef.current += 1;
      setLoads(prev => {
        const next = { ...prev };
        SECTORS.forEach(s => {
          const base = s.emergencyLoad?.[mode] ?? s.baseLoad;
          const delta = (Math.random() - 0.5) * s.volatility;
          next[s.id] = Math.min(99, Math.max(5, base + delta));
        });
        return next;
      });
      setLastRefresh(new Date());
    }, 2000);

    return () => clearInterval(interval);
  }, [mode]);

  const selectedSectorData = selectedSector ? SECTORS.find(s => s.id === selectedSector) : null;
  const selectedLoad = selectedSector ? Math.round(loads[selectedSector] ?? 0) : 0;

  const highRisk = SECTORS.filter(s => (loads[s.id] ?? 0) >= 85);
  const avgLoad = Math.round(SECTORS.reduce((acc, s) => acc + (loads[s.id] ?? 0), 0) / SECTORS.length);

  return (
    <div className="flex flex-col gap-6 w-full animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-fg">Live Heatmaps</h1>
          <p className="text-fg-muted flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--positive)] animate-pulse inline-block" />
            Real-time crowd density · Updates every 2s
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-fg-muted bg-surface-2 border border-[var(--border-strong)] px-3 py-2 rounded-xl">
            <RefreshCw className="size-3 animate-spin" style={{ animationDuration: "3s" }} />
            {lastRefresh.toLocaleTimeString()}
          </div>
          <ExplainAIButton
            explanation={{
              title: "Heatmap Model",
              dataInputs: ["Gate Sensor Feeds", "WiFi Probe Counts", "Ticket Scan Rate", "Camera Crowd Estimation"],
              prediction: `Average venue load: ${avgLoad}%. ${highRisk.length} sectors at critical density.`,
              confidence: 94,
              reasoning: "We fuse 4 independent sensor streams and run them through a density normalizer. Each sector is weighted by its maximum rated capacity. The output is refreshed every 2 seconds to enable near-real-time decisions."
            }}
          />
        </div>
      </div>

      {/* KPI Strip */}
      <ScrollReveal delayMs={100} className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "Avg Load", value: `${avgLoad}%`, icon: Activity, color: "text-[var(--accent)]" },
          { label: "Critical Zones", value: highRisk.length, icon: AlertTriangle, color: "text-red-500" },
          { label: "Total Attendance", value: "82,340", icon: Users, color: "text-[var(--positive)]" },
          { label: "Live Sensors", value: "42 / 42", icon: Wifi, color: "text-[var(--positive)]" },
        ].map(kpi => (
          <div key={kpi.label} className="rounded-2xl border border-[var(--border-strong)] bg-surface p-4 flex items-center gap-4">
            <div className={`size-10 rounded-xl bg-surface-2 flex items-center justify-center ${kpi.color}`}>
              <kpi.icon className="size-5" />
            </div>
            <div>
              <p className="text-[10px] font-bold text-fg-muted uppercase tracking-widest">{kpi.label}</p>
              <p className={`text-xl font-black ${kpi.color}`}>{kpi.value}</p>
            </div>
          </div>
        ))}
      </ScrollReveal>

      {/* Main Content */}
      <ScrollReveal delayMs={150} className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* Heatmap Canvas */}
        <div className="xl:col-span-2 rounded-3xl border border-[var(--border-strong)] bg-surface p-6 shadow-sm">
          {/* Layer Tabs */}
          <div className="flex flex-col items-start sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <h2 className="text-xl font-bold text-fg">Stadium Overview</h2>
            <div className="flex items-center gap-1 bg-surface-2 p-1 rounded-xl border border-[var(--border-faint)]">
              {(["density", "flow", "risk"] as const).map(layer => (
                <button
                  key={layer}
                  onClick={() => setActiveLayer(layer)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-bold uppercase tracking-widest transition-all capitalize ${activeLayer === layer ? "bg-[var(--accent)] text-white shadow" : "text-fg-muted hover:text-fg"}`}
                >
                  {layer}
                </button>
              ))}
            </div>
          </div>

          {/* SVG Map */}
          <div className="relative w-full" style={{ paddingBottom: "75%" }}>
            <div className="absolute inset-0">
              <svg viewBox="0 0 100 100" className="w-full h-full" style={{ filter: "drop-shadow(0 0 24px rgba(0,0,0,0.2))" }}>
                <defs>
                  <pattern id="grass" x="0" y="0" width="6" height="100" patternUnits="userSpaceOnUse">
                    <rect x="0" y="0" width="3" height="100" fill="rgba(34,197,94,0.18)" />
                    <rect x="3" y="0" width="3" height="100" fill="rgba(34,197,94,0.10)" />
                  </pattern>
                </defs>
                {/* Stadium outer oval - fills the stands area with theme-aware color */}
                <ellipse cx="50" cy="50" rx="48" ry="47" fill="var(--surface-2)" stroke="var(--border-strong)" strokeWidth="0.6" />
                {/* Running track - thin ochre band */}
                <ellipse cx="50" cy="50" rx="44" ry="43" fill="none" stroke="rgba(180,120,40,0.6)" strokeWidth="1.2" />
                {/* Pitch grass */}
                <rect x="20" y="28" width="60" height="44" rx="1" fill="url(#grass)" stroke="rgba(255,255,255,0.15)" strokeWidth="0.3" />
                {/* Halfway line */}
                <line x1="50" y1="28" x2="50" y2="72" stroke="rgba(255,255,255,0.35)" strokeWidth="0.35" />
                {/* Centre circle */}
                <circle cx="50" cy="50" r="7" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth="0.35" />
                <circle cx="50" cy="50" r="0.6" fill="rgba(255,255,255,0.5)" />
                {/* Penalty areas */}
                <rect x="34" y="28" width="32" height="10" rx="0.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
                <rect x="34" y="62" width="32" height="10" rx="0.5" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
                {/* Goal areas */}
                <rect x="41" y="28" width="18" height="5" rx="0.5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.25" />
                <rect x="41" y="67" width="18" height="5" rx="0.5" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.25" />
                {/* Penalty arcs */}
                <path d="M 40 38 A 7 7 0 0 0 60 38" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.3" />
                <path d="M 40 62 A 7 7 0 0 1 60 62" fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="0.3" />
                {/* Penalty spots */}
                <circle cx="50" cy="35" r="0.6" fill="rgba(255,255,255,0.45)" />
                <circle cx="50" cy="65" r="0.6" fill="rgba(255,255,255,0.45)" />
                {/* Corner arcs */}
                <path d="M 20 30 A 2 2 0 0 1 22 28" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
                <path d="M 78 30 A 2 2 0 0 0 80 28" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
                <path d="M 20 70 A 2 2 0 0 0 22 72" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
                <path d="M 78 70 A 2 2 0 0 1 80 72" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="0.3" />
                {/* Goals */}
                <rect x="44" y="26.2" width="12" height="1.8" rx="0.3" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" />
                <rect x="44" y="72" width="12" height="1.8" rx="0.3" fill="rgba(255,255,255,0.15)" stroke="rgba(255,255,255,0.4)" strokeWidth="0.3" />

                {/* Sectors */}
                {SECTORS.map(sector => {
                  const load = loads[sector.id] ?? sector.baseLoad;
                  const isSelected = selectedSector === sector.id;
                  const isAlert = ALERT_ZONES.includes(sector.id) && isEmergency;

                  let fillColor = getDensityColor(load, isEmergency);
                  if (activeLayer === "flow") {
                    fillColor = load > 70 ? "rgba(99,102,241,0.6)" : "rgba(99,102,241,0.2)";
                  } else if (activeLayer === "risk") {
                    fillColor = load > 80 ? "rgba(239,68,68,0.7)" : load > 60 ? "rgba(249,115,22,0.4)" : "rgba(34,197,94,0.2)";
                  }

                  return (
                    <g key={sector.id} className="cursor-pointer" onClick={() => setSelectedSector(isSelected ? null : sector.id)}>
                      {/* Skip drawing a fill rect for the pitch itself */}
                      {sector.id !== "field" && (
                        <rect
                          x={sector.x}
                          y={sector.y}
                          width={sector.w}
                          height={sector.h}
                          rx="2"
                          fill={fillColor}
                          stroke={isSelected ? "var(--fg)" : isAlert ? "rgba(239,68,68,0.8)" : "var(--border)"}
                          strokeWidth={isSelected ? "0.6" : isAlert ? "0.5" : "0.3"}
                          className="transition-all duration-700"
                        />
                      )}
                      {/* Pulse on alert */}
                      {isAlert && (
                        <rect
                          x={sector.x - 0.5}
                          y={sector.y - 0.5}
                          width={sector.w + 1}
                          height={sector.h + 1}
                          rx="2.5"
                          fill="none"
                          stroke="rgba(239,68,68,0.5)"
                          strokeWidth="0.8"
                          className="animate-ping"
                          style={{ transformOrigin: `${sector.x + sector.w / 2}% ${sector.y + sector.h / 2}%` }}
                        />
                      )}
                      {/* Label */}
                      {sector.w > 15 && sector.id !== "field" && (
                        <text
                          x={sector.x + sector.w / 2}
                          y={sector.y + sector.h / 2}
                          textAnchor="middle"
                          dominantBaseline="middle"
                          fontSize="2.8"
                          fill="var(--fg)"
                          fillOpacity="0.9"
                          fontWeight="700"
                          className="select-none pointer-events-none"
                        >
                          {Math.round(load)}%
                        </text>
                      )}
                    </g>
                  );
                })}

                {/* PITCH label */}
                <text x="50" y="50" textAnchor="middle" dominantBaseline="middle" fontSize="3" fill="rgba(255,255,255,0.3)" fontWeight="800" letterSpacing="1" className="select-none pointer-events-none">
                  PITCH
                </text>
              </svg>
            </div>
          </div>

          {/* Legend */}
          <div className="flex items-center gap-4 mt-4 flex-wrap">
            {[
              { color: "bg-green-500", label: "Low (<30%)" },
              { color: "bg-yellow-500", label: "Normal (30-50%)" },
              { color: "bg-orange-500", label: "High (50-85%)" },
              { color: "bg-red-500", label: "Critical (>85%)" },
            ].map(l => (
              <div key={l.label} className="flex items-center gap-2">
                <div className={`size-3 rounded-sm ${l.color} opacity-80`} />
                <span className="text-xs text-fg-muted">{l.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">

          {/* Selected Sector Detail */}
          {selectedSectorData ? (
            <div className={`rounded-3xl border p-6 animate-in fade-in zoom-in-95 duration-300 ${selectedLoad >= 85 ? "border-red-500/50 bg-red-500/5" : "border-[var(--accent-line)] bg-[var(--accent-subtle)]"}`}>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-fg">{selectedSectorData.label}</h3>
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${getDensityBadgeClass(selectedLoad)}`}>
                  {getDensityLabel(selectedLoad)}
                </span>
              </div>
              <div className="text-5xl font-black text-fg mb-2">{selectedLoad}%</div>
              <p className="text-xs text-fg-muted mb-6">Current capacity load</p>
              <div className="w-full h-2 rounded-full bg-surface-2 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${selectedLoad}%`,
                    background: selectedLoad >= 85 ? "var(--color-red-500)" : selectedLoad >= 70 ? "var(--color-orange-500)" : "var(--accent)"
                  }}
                />
              </div>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="bg-surface p-3 rounded-xl border border-[var(--border-faint)]">
                  <p className="text-fg-muted font-bold uppercase tracking-widest text-[10px] mb-1">Capacity</p>
                  <p className="text-fg font-bold">8,400 seats</p>
                </div>
                <div className="bg-surface p-3 rounded-xl border border-[var(--border-faint)]">
                  <p className="text-fg-muted font-bold uppercase tracking-widest text-[10px] mb-1">Occupied</p>
                  <p className="text-fg font-bold">{Math.round(8400 * selectedLoad / 100).toLocaleString()}</p>
                </div>
              </div>
              <button
                onClick={() => setSelectedSector(null)}
                className="w-full mt-4 py-2 rounded-xl text-xs font-bold text-fg-muted border border-[var(--border-strong)] hover:text-fg transition-colors"
              >
                Deselect
              </button>
            </div>
          ) : (
            <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-6 text-center flex flex-col items-center justify-center min-h-[200px]">
              <Eye className="size-8 text-fg-muted mb-3" />
              <p className="text-sm font-bold text-fg">Click any sector</p>
              <p className="text-xs text-fg-muted mt-1">to inspect its live data</p>
            </div>
          )}

          {/* Critical Alerts Panel */}
          <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-6 shadow-sm flex flex-col gap-3">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-base font-bold text-fg">Alert Feed</h3>
              <span className={`size-2 rounded-full animate-pulse ${highRisk.length > 0 ? "bg-red-500" : "bg-[var(--positive)]"}`} />
            </div>
            {highRisk.length === 0 ? (
              <p className="text-xs text-fg-muted text-center py-4">All sectors within safe thresholds</p>
            ) : (
              highRisk.map(sector => (
                <button
                  key={sector.id}
                  onClick={() => setSelectedSector(sector.id)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-red-500/10 border border-red-500/30 hover:border-red-500/60 transition-colors text-left w-full"
                >
                  <AlertTriangle className="size-4 text-red-500 shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-bold text-red-400">{sector.label}</p>
                    <p className="text-xs text-fg-muted">{Math.round(loads[sector.id] ?? 0)}% capacity · Action required</p>
                  </div>
                </button>
              ))
            )}
          </div>

          {/* Sector List */}
          <div className="rounded-3xl border border-[var(--border-strong)] bg-surface p-6 shadow-sm">
            <h3 className="text-base font-bold text-fg mb-4">All Sectors</h3>
            <div className="flex flex-col gap-2 max-h-60 overflow-y-auto pr-1">
              {SECTORS.filter(s => s.id !== "field").sort((a, b) => (loads[b.id] ?? 0) - (loads[a.id] ?? 0)).map(sector => {
                const load = Math.round(loads[sector.id] ?? 0);
                return (
                  <button
                    key={sector.id}
                    onClick={() => setSelectedSector(sector.id === selectedSector ? null : sector.id)}
                    className={`flex items-center gap-3 px-3 py-2 rounded-xl border transition-all text-left hover:border-[var(--accent)] ${selectedSector === sector.id ? "border-[var(--accent)] bg-surface-2" : "border-[var(--border-faint)] bg-surface-3"}`}
                  >
                    <div className="flex-1">
                      <p className="text-xs font-bold text-fg">{sector.label}</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-16 h-1.5 rounded-full bg-surface overflow-hidden">
                        <div
                          className="h-full rounded-full transition-all duration-700"
                          style={{
                            width: `${load}%`,
                            background: load >= 85 ? "#ef4444" : load >= 70 ? "#f97316" : load >= 50 ? "#eab308" : "#22c55e"
                          }}
                        />
                      </div>
                      <span className={`text-[10px] font-black w-8 text-right ${load >= 85 ? "text-red-500" : load >= 70 ? "text-orange-500" : "text-[var(--positive)]"}`}>{load}%</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
