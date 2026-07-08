import { Check } from "lucide-react";
import { cn } from "@/utils/cn";
import { SelectOption as SelectOptionType } from "../Select";

interface SelectOptionProps {
  option: SelectOptionType;
  index: number;
  activeIndex: number;
  value: string;
  optionId: string;
  showGroup: boolean;
  setActiveIndex: (index: number) => void;
  selectIndex: (index: number) => void;
}

export function SelectOption({
  option,
  index,
  activeIndex,
  value,
  optionId,
  showGroup,
  setActiveIndex,
  selectIndex,
}: SelectOptionProps) {
  const isSelected = option.value === value;
  const isActive = index === activeIndex;

  return (
    <li role="presentation">
      {showGroup && (
        <div
          role="presentation"
          className="px-2 pb-1 pt-2 text-xs font-semibold uppercase tracking-wide text-fg-subtle"
        >
          {option.group}
        </div>
      )}
      <div
        id={optionId}
        role="option"
        aria-selected={isSelected}
        onMouseEnter={() => setActiveIndex(index)}
        onClick={() => selectIndex(index)}
        className={cn(
          "flex cursor-pointer items-center justify-between gap-2 rounded-[var(--r-sm)] px-2 py-1.5 text-sm",
          isActive ? "bg-[var(--accent-subtle)] text-fg" : "text-fg-muted",
        )}
      >
        <span className="flex flex-col">
          <span className={cn(isSelected && "font-medium text-fg")}>
            {option.label}
          </span>
          {option.description && (
            <span className="text-xs text-fg-subtle">
              {option.description}
            </span>
          )}
        </span>
        {isSelected && (
          <Check
            aria-hidden="true"
            className="size-4 shrink-0 text-[var(--accent)]"
          />
        )}
      </div>
    </li>
  );
}
