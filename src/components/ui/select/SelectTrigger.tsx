import { RefObject } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/utils/cn";
import { SelectOption } from "../Select";

interface SelectTriggerProps {
  buttonRef: RefObject<HTMLButtonElement | null>;
  baseId: string;
  open: boolean;
  listboxId: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  selected: SelectOption | null;
  placeholder: string;
  className?: string;
  onButtonKeyDown: (event: React.KeyboardEvent) => void;
  toggleMenu: () => void;
}

export function SelectTrigger({
  buttonRef,
  baseId,
  open,
  listboxId,
  ariaLabel,
  ariaDescribedBy,
  selected,
  placeholder,
  className,
  onButtonKeyDown,
  toggleMenu,
}: SelectTriggerProps) {
  return (
    <button
      ref={buttonRef}
      type="button"
      id={baseId}
      aria-haspopup="listbox"
      aria-expanded={open}
      aria-controls={open ? listboxId : undefined}
      aria-label={ariaLabel}
      aria-describedby={ariaDescribedBy}
      onClick={toggleMenu}
      onKeyDown={onButtonKeyDown}
      className={cn(
        "flex h-10 w-full items-center justify-between gap-2 rounded-[var(--r-md)] border px-3 text-sm cursor-pointer",
        "border-[var(--border-strong)] bg-surface-2 text-fg transition-colors",
        "hover:border-[var(--fg-subtle)]",
        "focus:!outline-none focus-visible:!outline-none focus-visible:ring-1 focus-visible:ring-[var(--accent)]",
        open && "border-[var(--accent)]",
        className
      )}
    >
      <span className={cn(!selected && "text-fg-subtle", "truncate")}>
        {selected ? selected.label : placeholder}
      </span>
      <ChevronDown
        aria-hidden="true"
        className={cn(
          "size-4 shrink-0 text-fg-muted transition-transform duration-150",
          open && "rotate-180",
        )}
      />
    </button>
  );
}
