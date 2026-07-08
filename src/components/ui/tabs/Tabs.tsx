"use client";

import { useId, useRef, useState } from "react";
import { cn } from "@/utils/cn";

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
}

/**
 * Accessible tabs following the ARIA tablist pattern with automatic activation.
 * Arrow keys move between tabs (wrapping), Home/End jump to the ends, and the
 * focused tab is the selected tab.
 */
export function Tabs({
  items,
  defaultTab,
  className,
  "aria-label": ariaLabel,
}: {
  items: TabItem[];
  defaultTab?: string;
  className?: string;
  "aria-label": string;
}) {
  const base = useId();
  const [active, setActive] = useState(defaultTab ?? items[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  function focusTab(id: string) {
    setActive(id);
    tabRefs.current[id]?.focus();
  }

  function onKeyDown(event: React.KeyboardEvent, index: number) {
    const last = items.length - 1;
    let next: number | null = null;
    if (event.key === "ArrowRight") next = index === last ? 0 : index + 1;
    else if (event.key === "ArrowLeft") next = index === 0 ? last : index - 1;
    else if (event.key === "Home") next = 0;
    else if (event.key === "End") next = last;
    if (next !== null) {
      event.preventDefault();
      focusTab(items[next].id);
    }
  }

  return (
    <div className={className}>
      <div
        role="tablist"
        aria-label={ariaLabel}
        className="flex gap-1 border-b border-[var(--border)]"
      >
        {items.map((item, index) => {
          const selected = item.id === active;
          return (
            <button
              key={item.id}
              ref={(el) => {
                tabRefs.current[item.id] = el;
              }}
              role="tab"
              id={`${base}-tab-${item.id}`}
              aria-selected={selected}
              aria-controls={`${base}-panel-${item.id}`}
              tabIndex={selected ? 0 : -1}
              onClick={() => setActive(item.id)}
              onKeyDown={(e) => onKeyDown(e, index)}
              className={cn(
                "-mb-px border-b-2 px-3 py-2 text-sm font-medium transition-colors cursor-pointer",
                selected
                  ? "border-[var(--accent)] text-fg"
                  : "border-transparent text-fg-muted hover:text-fg",
              )}
            >
              {item.label}
            </button>
          );
        })}
      </div>

      {items.map((item) => (
        <div
          key={item.id}
          role="tabpanel"
          id={`${base}-panel-${item.id}`}
          aria-labelledby={`${base}-tab-${item.id}`}
          hidden={item.id !== active}
          tabIndex={0}
          className="pt-4 focus-visible:!outline-none"
        >
          {item.id === active && item.content}
        </div>
      ))}
    </div>
  );
}
