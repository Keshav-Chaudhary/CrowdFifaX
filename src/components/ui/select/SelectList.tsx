import { RefObject } from "react";
import { cn } from "@/utils/cn";
import { SelectOption as SelectOptionType } from "../Select";
import { SelectOption } from "./SelectOption";

interface SelectListProps {
  options: SelectOptionType[];
  value: string;
  listRef: RefObject<HTMLUListElement | null>;
  listboxId: string;
  activeIndex: number;
  optionId: (i: number) => string;
  ariaLabel?: string;
  onListKeyDown: (event: React.KeyboardEvent) => void;
  setActiveIndex: (index: number) => void;
  selectIndex: (index: number) => void;
}

export function SelectList({
  options,
  value,
  listRef,
  listboxId,
  activeIndex,
  optionId,
  ariaLabel,
  onListKeyDown,
  setActiveIndex,
  selectIndex,
}: SelectListProps) {
  return (
    <ul
      ref={listRef}
      id={listboxId}
      role="listbox"
      tabIndex={-1}
      aria-activedescendant={optionId(activeIndex)}
      aria-label={ariaLabel}
      onKeyDown={onListKeyDown}
      className={cn(
        "scroll-thin animate-fade-in absolute z-50 mt-1.5 max-h-72 w-full overflow-y-auto",
        "rounded-[var(--r-md)] border border-[var(--border-strong)] bg-surface-3 p-1 shadow-[var(--shadow-lg)]",
      )}
    >
      {options.map((option, index) => {
        const showGroup = Boolean(option.group && option.group !== options[index - 1]?.group);
        return (
          <SelectOption
            key={option.value}
            option={option}
            index={index}
            activeIndex={activeIndex}
            value={value}
            optionId={optionId(index)}
            showGroup={showGroup}
            setActiveIndex={setActiveIndex}
            selectIndex={selectIndex}
          />
        );
      })}
    </ul>
  );
}
