import { useCallback } from "react";

interface KeyboardNavProps {
  optionsLength: number;
  openMenu: () => void;
  closeMenu: (focusButton?: boolean) => void;
  setActiveIndex: React.Dispatch<React.SetStateAction<number>>;
  selectIndex: (index: number) => void;
  activeIndex: number;
  handleTypeahead: (char: string) => void;
}

export function useKeyboardNavigation({
  optionsLength,
  openMenu,
  closeMenu,
  setActiveIndex,
  selectIndex,
  activeIndex,
  handleTypeahead
}: KeyboardNavProps) {
  const onButtonKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
      case "ArrowUp":
      case "Enter":
      case " ":
        event.preventDefault();
        openMenu();
        break;
      default:
        if (event.key.length === 1 && /\S/.test(event.key)) {
          handleTypeahead(event.key);
        }
    }
  }, [openMenu, handleTypeahead]);

  const onListKeyDown = useCallback((event: React.KeyboardEvent) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, optionsLength - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        event.preventDefault();
        setActiveIndex(0);
        break;
      case "End":
        event.preventDefault();
        setActiveIndex(optionsLength - 1);
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        selectIndex(activeIndex);
        break;
      case "Escape":
        event.preventDefault();
        closeMenu();
        break;
      case "Tab":
        closeMenu(false);
        break;
      default:
        if (event.key.length === 1 && /\S/.test(event.key)) {
          handleTypeahead(event.key);
        }
    }
  }, [optionsLength, setActiveIndex, selectIndex, activeIndex, closeMenu, handleTypeahead]);

  return { onButtonKeyDown, onListKeyDown };
}
