"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
} from "react";
import { Check, Info, TriangleAlert, X } from "lucide-react";
import { cn } from "@/utils/cn";

type ToastTone = "success" | "error" | "info";

interface Toast {
  id: number;
  message: string;
  tone: ToastTone;
}

interface ToastContextValue {
  toast: (message: string, tone?: ToastTone) => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

const ICONS: Record<ToastTone, typeof Check> = {
  success: Check,
  error: TriangleAlert,
  info: Info,
};

const TONE_CLASS: Record<ToastTone, string> = {
  success: "text-[var(--positive)]",
  error: "text-[var(--critical)]",
  info: "text-[var(--neutral)]",
};

/**
 * Toast provider. Toasts are rendered in an `aria-live` region so screen
 * readers announce them, and each auto-dismisses after a few seconds.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const counter = useRef(0);

  const dismiss = useCallback((id: number) => {
    setToasts((current) => current.filter((t) => t.id !== id));
  }, []);

  const toast = useCallback(
    (message: string, tone: ToastTone = "success") => {
      const id = ++counter.current;
      setToasts((current) => [...current, { id, message, tone }]);
      window.setTimeout(() => dismiss(id), 4000);
    },
    [dismiss],
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div
        role="status"
        aria-live="polite"
        className="pointer-events-none fixed bottom-4 right-4 z-[200] flex w-full max-w-sm flex-col gap-2"
      >
        {toasts.map((t) => {
          const Icon = ICONS[t.tone];
          return (
            <div
              key={t.id}
              className="animate-rise pointer-events-auto flex items-start gap-3 rounded-[var(--r-md)] border border-[var(--border-strong)] bg-surface-3 p-3 shadow-[var(--shadow-lg)]"
            >
              <Icon
                aria-hidden="true"
                className={cn("mt-0.5 size-4 shrink-0", TONE_CLASS[t.tone])}
              />
              <p className="flex-1 text-sm text-fg">{t.message}</p>
              <button
                type="button"
                onClick={() => dismiss(t.id)}
                aria-label="Dismiss notification"
                className="text-fg-subtle transition-colors hover:text-fg cursor-pointer"
              >
                <X aria-hidden="true" className="size-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

/** Trigger a toast. Must be used within ToastProvider. */
export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be used within ToastProvider");
  return ctx;
}
