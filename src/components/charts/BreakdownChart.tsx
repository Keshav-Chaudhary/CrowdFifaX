"use client";

import { CATEGORIES, CATEGORY_META } from "@/services/emissions/factors";
import type { Category } from "@/services/emissions/types";
import { formatKg } from "@/components/ui";
import { CATEGORY_COLOR_VAR, CATEGORY_ICON } from "./icons";

interface BreakdownChartProps {
  byCategory: Record<Category, number>;
  total: number;
}

/**
 * Per-category emissions breakdown rendered as a semantic table.
 *
 * Screen readers get a proper table with a caption, column headers, and row
 * headers; sighted users get a horizontal bar in each row. The bar is
 * decorative (`aria-hidden`) — the numeric value and share are always present
 * as text, so meaning never depends on colour alone.
 */
export function BreakdownChart({ byCategory, total }: BreakdownChartProps) {
  const rows = CATEGORIES.map((category) => ({
    category,
    kg: byCategory[category],
    pct: total > 0 ? (byCategory[category] / total) * 100 : 0,
  })).sort((a, b) => b.kg - a.kg);

  return (
    <table className="w-full border-collapse">
      <caption className="sr-only">
        Carbon footprint by category, in kilograms of CO2 equivalent
      </caption>
      <thead className="sr-only">
        <tr>
          <th scope="col">Category</th>
          <th scope="col">Emissions</th>
          <th scope="col">Share</th>
        </tr>
      </thead>
      <tbody>
        {rows.map(({ category, kg, pct }) => {
          const Icon = CATEGORY_ICON[category];
          return (
            <tr key={category} className="align-middle">
              <th scope="row" className="py-2.5 pr-4 text-left font-normal">
                <span className="flex items-center gap-2 whitespace-nowrap">
                  <Icon
                    aria-hidden="true"
                    className="size-4 shrink-0"
                    style={{ color: CATEGORY_COLOR_VAR[category] }}
                  />
                  <span className="text-sm text-fg">
                    {CATEGORY_META[category].label}
                  </span>
                </span>
              </th>
              <td className="w-full py-2.5">
                <div
                  className="h-2 w-full overflow-hidden rounded-full bg-surface-3"
                  aria-hidden="true"
                >
                  <div
                    className="h-full rounded-full"
                    style={{
                      width: `${pct}%`,
                      minWidth: pct > 0 ? "0.5rem" : 0,
                      backgroundColor: CATEGORY_COLOR_VAR[category],
                      transition:
                        "width 0.6s cubic-bezier(0.22,1,0.36,1)",
                    }}
                  />
                </div>
              </td>
              <td className="tnum py-2.5 pl-4 text-right text-sm whitespace-nowrap">
                <span className="font-medium text-fg">{formatKg(kg)}</span>
                <span className="ml-1.5 text-fg-subtle">{pct.toFixed(0)}%</span>
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
