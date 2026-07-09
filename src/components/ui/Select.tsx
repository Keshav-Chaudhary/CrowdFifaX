"use client";

import { useCallback, useEffect, useId, useRef, useState } from "react";
import { cn } from "@/utils/cn";
import { useTypeahead } from "./select/useTypeahead";
import { useKeyboardNavigation } from "./select/useKeyboardNavigation";
import { SelectTrigger } from "./select/SelectTrigger";
import { SelectList } from "./select/SelectList";

export interface SelectOption {
  value: string;
  label: string;
  group?: string;
  description?: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  onChange: (value: string) => void;
  id?: string;
  ariaLabel?: string;
  ariaDescribedBy?: string;
  placeholder?: string;
  className?: string;
}

interface SelectMenuRefs {
  buttonRef: React.RefObject<HTMLButtonElement | null>;
  listRef: React.RefObject<HTMLUListElement | null>;
}

/** Closes the dropdown when a pointer event occurs outside the button or list. */
function useOutsidePointerClose(
  open: boolean,
  refs: SelectMenuRefs,
  onClose: () => void,
): void {
  useEffect(() => {
    if (!open) return;
    function onDocPointer(event: PointerEvent) {
      const target = event.target as Node;
      const outside =
        !refs.buttonRef.current?.contains(target) &&
        !refs.listRef.current?.contains(target);
      if (outside) onClose();
    }
    document.addEventListener("pointerdown", onDocPointer);
    return () => document.removeEventListener("pointerdown", onDocPointer);
  }, [open, refs, onClose]);
}

/** Scrolls the active option into view when the list is open. */
function useScrollActiveOption(
  open: boolean,
  activeIndex: number,
  optionId: (i: number) => string,
): void {
  useEffect(() => {
    if (!open) return;
    document.getElementById(optionId(activeIndex))?.scrollIntoView({ block: "nearest" });
  }, [activeIndex, open, optionId]);
}

/** Moves focus into the listbox when it opens. */
function useListFocusOnOpen(
  open: boolean,
  listRef: React.RefObject<HTMLUListElement | null>,
): void {
  useEffect(() => {
    if (open) listRef.current?.focus();
  }, [open, listRef]);
}

export function Select({
  options,
  value,
  onChange,
  id,
  ariaLabel,
  ariaDescribedBy,
  placeholder = "Select…",
  className,
}: SelectProps) {
  const generatedId = useId();
  const baseId = id ?? generatedId;
  const listboxId = `${baseId}-listbox`;
  const optionId = useCallback((i: number) => `${baseId}-option-${i}`, [baseId]);

  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const buttonRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const refs: SelectMenuRefs = { buttonRef, listRef };

  const selectedIndex = options.findIndex((o) => o.value === value);
  const selected = selectedIndex >= 0 ? options[selectedIndex] : null;

  const openMenu = useCallback(() => {
    setActiveIndex(selectedIndex >= 0 ? selectedIndex : 0);
    setOpen(true);
  }, [selectedIndex]);

  const closeMenu = useCallback((focusButton = true) => {
    setOpen(false);
    if (focusButton) buttonRef.current?.focus();
  }, []);

  const selectIndex = useCallback(
    (index: number) => {
      if (!options[index]) return;
      onChange(options[index].value);
      closeMenu();
    },
    [options, onChange, closeMenu]
  );

  const toggleMenu = useCallback(() => {
    if (open) closeMenu();
    else openMenu();
  }, [open, closeMenu, openMenu]);

  useOutsidePointerClose(open, refs, () => setOpen(false));
  useScrollActiveOption(open, activeIndex, optionId);
  useListFocusOnOpen(open, listRef);

  const handleTypeahead = useTypeahead(options, open, setActiveIndex, selectIndex);

  const { onButtonKeyDown, onListKeyDown } = useKeyboardNavigation({
    optionsLength: options.length,
    openMenu,
    closeMenu,
    setActiveIndex,
    selectIndex,
    activeIndex,
    handleTypeahead
  });

  return (
    <div className={cn("relative", className)}>
      <SelectTrigger
        buttonRef={buttonRef}
        baseId={baseId}
        open={open}
        listboxId={listboxId}
        ariaLabel={ariaLabel}
        ariaDescribedBy={ariaDescribedBy}
        selected={selected}
        placeholder={placeholder}
        onButtonKeyDown={onButtonKeyDown}
        toggleMenu={toggleMenu}
      />
      {open && (
        <SelectList
          options={options}
          value={value}
          listRef={listRef}
          listboxId={listboxId}
          activeIndex={activeIndex}
          optionId={optionId}
          ariaLabel={ariaLabel}
          onListKeyDown={onListKeyDown}
          setActiveIndex={setActiveIndex}
          selectIndex={selectIndex}
        />
      )}
    </div>
  );
}
