import { useCallback, useRef } from "react";
import type { SelectOption } from "../Select";

export function useTypeahead(
  options: SelectOption[],
  open: boolean,
  setActiveIndex: (index: number) => void,
  selectIndex: (index: number) => void
) {
  const typeahead = useRef<{ query: string; timer: number | null }>({
    query: "",
    timer: null,
  });

  return useCallback(
    (char: string) => {
      const state = typeahead.current;
      if (state.timer) window.clearTimeout(state.timer);
      state.query += char.toLowerCase();
      state.timer = window.setTimeout(() => {
        state.query = "";
      }, 500);
      const match = options.findIndex((o) =>
        o.label.toLowerCase().startsWith(state.query),
      );
      if (match >= 0) {
        setActiveIndex(match);
        if (!open) selectIndex(match);
      }
    },
    [options, open, selectIndex, setActiveIndex],
  );
}
