import { getFactor } from "@/services/emissions/factors";

type ToastFn = (msg: string, type: "success" | "error" | "info") => void;

export function dispatchActivityToast(
  factorId: string,
  quantity: number,
  ok: boolean,
  error: string | undefined,
  toast: ToastFn
) {
  if (ok) {
    const factor = getFactor(factorId);
    toast(
      `Logged ${quantity} ${factor?.unit ?? "unit"} of ${factor?.label ?? factorId}.`,
      "success"
    );
  } else {
    toast(`Could not log activity: ${error}`, "error");
  }
}

export function dispatchIncompleteDataToast(toast: ToastFn) {
  toast("Assistant tried to log an activity but the data was incomplete.", "error");
}

export function dispatchUnknownActivityToast(factorId: string, toast: ToastFn) {
  toast(`Assistant suggested an unknown activity type: ${factorId}.`, "error");
}

export function dispatchInvalidFormatToast(toast: ToastFn) {
  toast("Assistant tried to log an activity but the format was invalid.", "error");
}
