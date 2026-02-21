"use client";

import { EconomicEvent } from "@/types/calendar";

const IMPACT_STYLES = {
  high: "bg-red-500/20 text-red-400",
  medium: "bg-yellow-500/20 text-yellow-400",
  low: "bg-gray-500/20 text-gray-400",
};

const COUNTRY_FLAGS: Record<string, string> = {
  US: "\u{1F1FA}\u{1F1F8}",
  GB: "\u{1F1EC}\u{1F1E7}",
  EU: "\u{1F1EA}\u{1F1FA}",
  JP: "\u{1F1EF}\u{1F1F5}",
  CN: "\u{1F1E8}\u{1F1F3}",
  DE: "\u{1F1E9}\u{1F1EA}",
  FR: "\u{1F1EB}\u{1F1F7}",
  CA: "\u{1F1E8}\u{1F1E6}",
  AU: "\u{1F1E6}\u{1F1FA}",
};

function hasSurprise(event: EconomicEvent): boolean {
  if (!event.actual || !event.forecast) return false;
  const actual = parseFloat(event.actual);
  const forecast = parseFloat(event.forecast);
  if (isNaN(actual) || isNaN(forecast) || forecast === 0) return false;
  return Math.abs((actual - forecast) / forecast) > 0.1;
}

export default function EventRow({ event }: { event: EconomicEvent }) {
  const surprise = hasSurprise(event);
  const flag = COUNTRY_FLAGS[event.country] ?? event.country;

  return (
    <div
      className={`grid grid-cols-[auto_1fr_60px_60px_60px] gap-2 items-center px-3 py-2 text-xs border-b border-[var(--card-border)] last:border-b-0 ${
        surprise ? "bg-yellow-500/5" : ""
      }`}
    >
      <div className="flex items-center gap-1.5 min-w-[80px]">
        <span className="text-sm">{flag}</span>
        <span
          className={`text-[9px] font-medium px-1.5 py-0.5 rounded ${IMPACT_STYLES[event.impact]}`}
        >
          {event.impact.toUpperCase()}
        </span>
      </div>

      <div className="min-w-0">
        <p className="text-[var(--foreground)] truncate font-medium">
          {event.event}
        </p>
        <p className="text-[10px] text-[var(--text-muted)]">
          {event.date} {event.time !== "All Day" ? `at ${event.time}` : ""}
        </p>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-[var(--text-muted)]">Forecast</p>
        <p className="text-[var(--foreground)]">
          {event.forecast ?? "—"}
          {event.unit && event.forecast ? event.unit : ""}
        </p>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-[var(--text-muted)]">Actual</p>
        <p
          className={
            event.actual
              ? surprise
                ? "text-[var(--accent-yellow)] font-semibold"
                : "text-[var(--foreground)]"
              : "text-[var(--text-muted)]"
          }
        >
          {event.actual ?? "Pending"}
          {event.unit && event.actual ? event.unit : ""}
        </p>
      </div>

      <div className="text-center">
        <p className="text-[10px] text-[var(--text-muted)]">Previous</p>
        <p className="text-[var(--foreground)]">
          {event.previous ?? "—"}
          {event.unit && event.previous ? event.unit : ""}
        </p>
      </div>
    </div>
  );
}
