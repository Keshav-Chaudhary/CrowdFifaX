/**
 * Core domain types for the carbon footprint engine.
 *
 * The engine is intentionally pure and framework-agnostic: every value here is
 * plain data so the calculations can be unit-tested in isolation and reused on
 * both the client and the server.
 */

/** Top-level emission categories a person can act on. */
export type Category = "transport" | "energy" | "diet" | "shopping" | "waste" | "custom";

/**
 * A single emission factor: how many kilograms of CO2-equivalent are produced
 * per unit of a given activity (e.g. 0.17 kg CO2e per km in a petrol car).
 */
export interface EmissionFactor {
  /** Stable identifier used to link an {@link Activity} to its factor. */
  readonly id: string;
  readonly category: Category;
  /** Human-readable name shown in the UI. */
  readonly label: string;
  /** The unit `quantity` is measured in (e.g. "km", "kWh", "meal"). */
  readonly unit: string;
  /** Kilograms of CO2e emitted per single unit. Always >= 0. */
  readonly perUnitKg: number;
  /** Short description shown as helper text. */
  readonly hint: string;
  /** Citation for the factor so the numbers are auditable, not magic. */
  readonly source: string;
}

/** A user-logged activity. Quantity is in the factor's unit. */
export interface Activity {
  readonly id: string;
  readonly factorId: string;
  /** Amount in the factor's unit. Must be a finite number >= 0. */
  readonly quantity: number;
  /** ISO date string (YYYY-MM-DD) the activity occurred on. */
  readonly date: string;
  readonly note?: string;
}

/** An {@link Activity} enriched with its resolved factor and computed emissions. */
export interface ComputedActivity extends Activity {
  readonly category: Category;
  readonly label: string;
  readonly unit: string;
  /** Kilograms of CO2e for this activity (quantity * factor). */
  readonly kgCO2e: number;
}

/** Aggregate view of a set of activities. */
export interface FootprintSummary {
  readonly totalKg: number;
  readonly byCategory: Record<Category, number>;
  readonly activityCount: number;
}
