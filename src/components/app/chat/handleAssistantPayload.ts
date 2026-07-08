import { getFactor } from "@/services/emissions/factors";
import { extractLogMarkers } from "./parseAssistantActivities";
import {
  dispatchActivityToast,
  dispatchIncompleteDataToast,
  dispatchUnknownActivityToast,
  dispatchInvalidFormatToast
} from "./assistantToastDispatcher";

type ToastFn = (msg: string, type: "success" | "error" | "info") => void;

export function handleAssistantPayload(
  content: string,
  addActivity: (a: { factorId: string; quantity: number; date: string }) => { ok: boolean; error?: string },
  toast: ToastFn
): string {
  const { clean, payloads } = extractLogMarkers(content);

  for (const json of payloads) {
    try {
      const parsed = JSON.parse(json) as Record<string, unknown>;
      const factorId = typeof parsed.factorId === "string" ? parsed.factorId : null;
      const quantity = typeof parsed.quantity === "number" ? parsed.quantity : null;
      const date = typeof parsed.date === "string" && /^\d{4}-\d{2}-\d{2}$/.test(parsed.date) ? parsed.date : null;

      if (!factorId || quantity === null || !date) {
        dispatchIncompleteDataToast(toast);
        continue;
      }

      if (!getFactor(factorId)) {
        dispatchUnknownActivityToast(factorId, toast);
        continue;
      }

      const result = addActivity({ factorId, quantity, date });
      dispatchActivityToast(factorId, quantity, result.ok, result.error, toast);
    } catch {
      dispatchInvalidFormatToast(toast);
    }
  }
  return clean;
}
