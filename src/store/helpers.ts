import { z } from "zod";
import { getFactor } from "../services/emissions/factors";

/** Today's date as an ISO `YYYY-MM-DD` string in the local timezone. */
export function todayISO(date = new Date()): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Generate a stable unique id. Uses the platform `crypto.randomUUID` when
 * available (browsers and Node 22) and falls back to a timestamp-based id so
 * the store never throws in constrained environments.
 */
export function makeId(): string {
  if (
    typeof globalThis.crypto !== "undefined" &&
    typeof globalThis.crypto.randomUUID === "function"
  ) {
    return globalThis.crypto.randomUUID();
  }
  return `id-${Date.now().toString(36)}-${Math.floor(Math.random() * 1e9).toString(36)}`;
}

/** Zod schema validating a raw activity-log submission before it is stored. */
export const activityInputSchema = z.object({
  factorId: z
    .string()
    .refine((id) => getFactor(id) !== undefined, "Unknown activity type"),
  quantity: z
    .number()
    .finite("Quantity must be a number")
    .nonnegative("Quantity cannot be negative")
    .max(1_000_000, "Quantity is unrealistically large"),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be YYYY-MM-DD"),
  note: z.string().max(280, "Note is too long").optional(),
});

export type ActivityInput = z.infer<typeof activityInputSchema>;
