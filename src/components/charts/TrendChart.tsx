"use client";

import { useId } from "react";
import { formatKg } from "@/components/ui";

export interface TrendPoint {
  date: string;
  kg: number;
}

/**
 * A compact area + line trend chart drawn with hand-built SVG (no chart lib).
 *
 * Accessibility: the SVG is `aria-hidden` and labelled at the figure level; an
 * adjacent visually-hidden table exposes the same data points to screen
 * readers, so the trend is never conveyed by the visual alone.
 */
export function TrendChart({
  data,
  height = 160,
  caption = "Daily emissions over time",
}: {
  data: TrendPoint[];
  height?: number;
  caption?: string;
}) {
  const gradientId = useId();
  const width = 600; // viewBox width; scales responsively via CSS

  if (data.length === 0) {
    return (
      <p className="py-8 text-center text-sm text-fg-muted">
        Log activities on a few different days to see your trend.
      </p>
    );
  }

  const pad = { top: 12, right: 8, bottom: 20, left: 8 };
  const innerW = width - pad.left - pad.right;
  const innerH = height - pad.top - pad.bottom;

  const max = Math.max(...data.map((d) => d.kg), 1);
  const stepX = data.length > 1 ? innerW / (data.length - 1) : 0;

  const x = (i: number) => pad.left + i * stepX;
  const y = (kg: number) => pad.top + innerH - (kg / max) * innerH;

  const linePath = data
    .map((d, i) => `${i === 0 ? "M" : "L"} ${x(i).toFixed(1)} ${y(d.kg).toFixed(1)}`)
    .join(" ");

  const areaPath =
    `${linePath} L ${x(data.length - 1).toFixed(1)} ${(pad.top + innerH).toFixed(1)}` +
    ` L ${x(0).toFixed(1)} ${(pad.top + innerH).toFixed(1)} Z`;

  return (
    <figure className="m-0">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        width="100%"
        height={height}
        preserveAspectRatio="none"
        role="img"
        aria-label={caption}
        className="overflow-visible"
      >
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="80%" stopColor="var(--accent)" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Baseline */}
        <line
          x1={pad.left}
          y1={pad.top + innerH}
          x2={width - pad.right}
          y2={pad.top + innerH}
          stroke="var(--border-strong)"
          strokeWidth="1"
        />

        {/* Area fill */}
        {data.length > 1 && (
          <path d={areaPath} fill={`url(#${gradientId})`} />
        )}

        {/* Line */}
        {data.length > 1 && (
          <path
            d={linePath}
            fill="none"
            stroke="var(--accent)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-[0_0_8px_var(--accent-subtle)]"
          />
        )}

        {/* Points */}
        {data.map((d, i) => (
          <circle
            key={i}
            cx={x(i)}
            cy={y(d.kg)}
            r={data.length === 1 ? 6 : 4}
            fill="var(--accent)"
            className="drop-shadow-[0_0_5px_var(--accent-subtle)]"
          />
        ))}
      </svg>

      <figcaption className="sr-only">
        <table>
          <caption>{caption}</caption>
          <thead>
            <tr>
              <th scope="col">Date</th>
              <th scope="col">Emissions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((d) => (
              <tr key={d.date}>
                <th scope="row">{d.date}</th>
                <td>{formatKg(d.kg)} CO2e</td>
              </tr>
            ))}
          </tbody>
        </table>
      </figcaption>
    </figure>
  );
}
