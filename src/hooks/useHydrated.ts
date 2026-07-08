"use client";

import { useSyncExternalStore } from "react";

/**
 * Returns `true` once the component has mounted on the client.
 *
 * Persisted store state is only available after hydration, so components gate
 * client-only rendering on this to avoid a server/client markup mismatch.
 *
 * Uses `useSyncExternalStore` with a no-op subscription — the canonical React
 * 18 pattern for detecting hydration without a setState-in-effect hack.
 */
export function useHydrated(): boolean {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

