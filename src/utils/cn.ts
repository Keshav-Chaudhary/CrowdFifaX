import { clsx, type ClassValue } from "clsx";

/**
 * Merge class names. Thin wrapper over `clsx` so every component imports the
 * same helper; keeps conditional className logic terse and readable.
 */
export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}
