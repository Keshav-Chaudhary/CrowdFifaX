import { getFactor } from "@/services/emissions/factors";
import { extractLogMarkers } from "./parseAssistantActivities";
import {
  dispatchActivityToast,
  dispatchIncompleteDataToast,
  dispatchUnknownActivityToast,
  dispatchInvalidFormatToast
} from "./assistantToastDispatcher";

type ToastFn = (msg: string, type: "success" | "error" | "info") => void;
type AddActivityFn = (a: { factorId: string; quantity: number; date: string }) => { ok: boolean; error?: string };

interface ParsedPayload {
  factorId: string | null;
  quantity: number | null;
  date: string | null;
}

/** Extracts and validates the typed fields from a raw JSON payload object. */
function parseActivityPayload(raw: Record<string, unknown>): ParsedPayload {
  const factorId = typeof raw.factorId === "string" ? raw.factorId : null;
  const quantity = typeof raw.quantity === "number" ? raw.quantity : null;
  const date =
    typeof raw.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(raw.date)
      ? raw.date
      : null;
  return { factorId, quantity, date };
}

/** Processes a single JSON activity payload, adding it to the store and dispatching a toast. */
function processPayload(json: string, addActivity: AddActivityFn, toast: ToastFn): void {
  const raw = JSON.parse(json) as Record<string, unknown>;
  const { factorId, quantity, date } = parseActivityPayload(raw);

  if (!factorId || quantity === null || !date) {
    dispatchIncompleteDataToast(toast);
    return;
  }
  if (!getFactor(factorId)) {
    dispatchUnknownActivityToast(factorId, toast);
    return;
  }
  const result = addActivity({ factorId, quantity, date });
  dispatchActivityToast(factorId, quantity, result.ok, result.error, toast);
}

export function handleAssistantPayload(
  content: string,
  addActivity: AddActivityFn,
  toast: ToastFn
): string {
  const { clean, payloads } = extractLogMarkers(content);
  for (const json of payloads) {
    try {
      processPayload(json, addActivity, toast);
    } catch {
      dispatchInvalidFormatToast(toast);
    }
  }
  return clean;
}
