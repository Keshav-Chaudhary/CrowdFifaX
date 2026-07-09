"use client";

import { useCallbackRef } from "@/components/ui/dialog/useCallbackRef";
import { useEffect, useRef, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";
import { cn } from "@/utils/cn";
import { Button } from "../Button";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

const FOCUSABLE =
  'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

/** Handles keyboard focus trapping and scroll lock while the dialog is open. */
function useFocusTrap(
  open: boolean,
  panelRef: React.RefObject<HTMLDivElement | null>,
  onClose: () => void,
): void {
  useEffect(() => {
    if (!open) return;

    const panel = panelRef.current;
    const prevFocus = document.activeElement as HTMLElement;
    const prevOverflow = document.body.style.overflow;

    const focusables = panel?.querySelectorAll<HTMLElement>(FOCUSABLE);
    (focusables?.[0] ?? panel)?.focus();
    document.body.style.overflow = "hidden";

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") { event.preventDefault(); onClose(); return; }
      if (event.key !== "Tab") return;
      const items = panel?.querySelectorAll<HTMLElement>(FOCUSABLE);
      if (!items || items.length === 0) { event.preventDefault(); return; }
      const first = items[0];
      const last = items[items.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && active === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && active === last) { event.preventDefault(); first.focus(); }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = prevOverflow;
      prevFocus?.focus();
    };
  }, [open, panelRef, onClose]);
}

/**
 * Accessible modal dialog.
 *
 * - `role="dialog"` + `aria-modal`, labelled by its title and described by its
 *   optional description.
 * - Focus is moved into the dialog on open, trapped while open (Tab cycles
 *   within), and restored to the trigger on close.
 * - Escape and backdrop click close it.
 */
export function Dialog({
  open,
  onClose,
  title,
  description,
  children,
  className,
}: DialogProps) {
  const panelRef = useRef<HTMLDivElement>(null);
  const onCloseStable = useCallbackRef(onClose);

  useFocusTrap(open, panelRef, onCloseStable);

  const mounted = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );

  if (!open || !mounted) return null;
  if (typeof document === "undefined" || !document.body) return null;

  const titleId = "dialog-title";
  const descId = description ? "dialog-desc" : undefined;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <button
        type="button"
        aria-label="Close dialog"
        onClick={onClose}
        className="animate-fade-in absolute inset-0 bg-[var(--overlay)] backdrop-blur-sm"
        tabIndex={-1}
      />

      {/* Panel */}
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descId}
        tabIndex={-1}
        className={cn(
          "animate-rise relative w-full max-w-md rounded-[var(--r-xl)] border border-[var(--border-strong)]",
          "bg-surface p-6 shadow-[var(--shadow-lg)]",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 id={titleId} className="text-lg font-semibold tracking-tight">
              {title}
            </h2>
            {description && (
              <p id={descId} className="mt-1 text-sm text-fg-muted">
                {description}
              </p>
            )}
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            aria-label="Close"
            className="-mr-2 -mt-2"
          >
            <X aria-hidden="true" className="size-4" />
          </Button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>,
    document.body
  );
}
