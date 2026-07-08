import type { Category, EmissionFactor } from "./types";

export const EMISSION_FACTORS: readonly EmissionFactor[] = [
  // ---- Gate Ingress (transport) ----
  {
    id: "gate_standard",
    category: "transport",
    label: "Standard Turnstile",
    unit: "min",
    perUnitKg: 45, // Using perUnitKg field as "Flow per unit"
    hint: "Average flow rate for standard ticket scanners.",
    source: "FIFA Green Book 2026 - Ingress Standards",
  },
  {
    id: "transit_walk",
    category: "transport",
    label: "Pedestrian Walkway",
    unit: "min",
    perUnitKg: 0,
    hint: "Unobstructed walking route with zero congestion coefficient.",
    source: "Stadium Ops Protocol 2026",
  },
  {
    id: "gate_wide",
    category: "transport",
    label: "Wide / ADA Gate",
    unit: "min",
    perUnitKg: 20,
    hint: "Flow rate for accessible and VIP entry points.",
    source: "FIFA Green Book 2026 - Accessibility Guidelines",
  },
  {
    id: "gate_vip",
    category: "transport",
    label: "VIP Turnstile",
    unit: "min",
    perUnitKg: 15,
    hint: "Premium entry points with secondary checks.",
    source: "Stadium Ops Protocol 2026",
  },

  // ---- Concourse Density (energy) ----
  {
    id: "conc_safe",
    category: "energy",
    label: "Optimal Flow",
    unit: "sqm",
    perUnitKg: 1.5,
    hint: "Safe, unhindered movement density.",
    source: "International Crowd Safety Guidelines",
  },
  {
    id: "conc_dense",
    category: "energy",
    label: "High Density",
    unit: "sqm",
    perUnitKg: 3.0,
    hint: "Restricted movement, high vigilance required.",
    source: "International Crowd Safety Guidelines",
  },
  {
    id: "conc_critical",
    category: "energy",
    label: "Critical Bottleneck",
    unit: "sqm",
    perUnitKg: 4.7,
    hint: "Exceeds safety thresholds. Requires immediate AI rerouting.",
    source: "FIFA Safety Regulations 2026",
  },

  // ---- Transit Hubs (diet) ----
  {
    id: "transit_subway",
    category: "diet",
    label: "Local Metro Surge",
    unit: "train",
    perUnitKg: 1200,
    hint: "Predicted passenger drop-off per train arrival.",
    source: "City Transit API Integration",
  },
  {
    id: "transit_bus",
    category: "diet",
    label: "Bus Terminal Arrivals",
    unit: "bus",
    perUnitKg: 60,
    hint: "Predicted passengers per transit bus.",
    source: "City Transit API Integration",
  },
  {
    id: "transit_parking",
    category: "diet",
    label: "Parking Egress",
    unit: "hr",
    perUnitKg: 800,
    hint: "Pedestrian flow from parking structures to precinct.",
    source: "Stadium Ops Telemetry",
  },

  // ---- Concessions (shopping) ----
  {
    id: "queue_fast",
    category: "shopping",
    label: "Express Beverage",
    unit: "queue",
    perUnitKg: 2.5,
    hint: "Average transaction time in minutes.",
    source: "Point of Sale Telemetry",
  },
  {
    id: "queue_food",
    category: "shopping",
    label: "Hot Food Stand",
    unit: "queue",
    perUnitKg: 6.0,
    hint: "Average transaction time in minutes.",
    source: "Point of Sale Telemetry",
  },

  // ---- Egress Flow (waste) ----
  {
    id: "egress_normal",
    category: "waste",
    label: "Standard Exit",
    unit: "min",
    perUnitKg: 85,
    hint: "Outflow rate during normal post-match egress.",
    source: "FIFA Green Book 2026 - Egress",
  },
  {
    id: "egress_emergency",
    category: "waste",
    label: "Emergency Evac",
    unit: "min",
    perUnitKg: 120,
    hint: "Maximum theoretical capacity during evacuation protocols.",
    source: "FIFA Emergency Protocol",
  },

  // ---- Custom ----
  {
    id: "custom_activity",
    category: "custom",
    label: "Manual Telemetry",
    unit: "pax",
    perUnitKg: 1, 
    hint: "Manually log a specific flow adjustment.",
    source: "Command Center Override",
  },
] as const;

/** Fast lookup of a factor by id. Built once at module load. */
const FACTOR_BY_ID: ReadonlyMap<string, EmissionFactor> = new Map(
  EMISSION_FACTORS.map((factor) => [factor.id, factor]),
);

export function getFactor(id: string): EmissionFactor | undefined {
  return FACTOR_BY_ID.get(id);
}

export const CATEGORY_META: Record<
  Category,
  { label: string; description: string }
> = {
  transport: {
    label: "Gate Ingress",
    description: "Turnstile flow rates and scanner telemetry.",
  },
  energy: {
    label: "Concourse Density",
    description: "Spatial density across internal walkways.",
  },
  diet: { 
    label: "Transit Hubs", 
    description: "External transport APIs and local arrivals." 
  },
  shopping: {
    label: "Concessions",
    description: "Queue lengths and wait times at vendor stands.",
  },
  waste: {
    label: "Egress Flow",
    description: "Exit velocities and safety thresholds.",
  },
  custom: {
    label: "Overrides",
    description: "Manual telemetry overrides.",
  },
};

export const CATEGORIES: readonly Category[] = [
  "transport",
  "energy",
  "diet",
  "shopping",
  "waste",
  "custom",
];
