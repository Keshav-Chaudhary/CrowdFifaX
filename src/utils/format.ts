/**
 * Display formatting helpers shared across the UI.
 */

/** Format a kg CO2e value for display, switching to tonnes at >= 1000 kg. */
export function formatKg(kg: number): string {
  if (kg >= 1000) return `${(kg / 1000).toFixed(2)} t`;
  return `${kg.toFixed(kg < 10 ? 1 : 0)} kg`;
}
