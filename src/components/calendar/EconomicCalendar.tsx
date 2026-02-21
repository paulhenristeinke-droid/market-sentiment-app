"use client";

import { useState } from "react";
import { EconomicEvent } from "@/types/calendar";
import EventRow from "./EventRow";

interface EconomicCalendarProps {
  events: EconomicEvent[];
  loading: boolean;
}

export default function EconomicCalendar({
  events,
  loading,
}: EconomicCalendarProps) {
  const [impactFilter, setImpactFilter] = useState<"all" | "high" | "medium">(
    "all"
  );

  const filtered =
    impactFilter === "all"
      ? events
      : events.filter((e) =>
          impactFilter === "high"
            ? e.impact === "high"
            : e.impact === "high" || e.impact === "medium"
        );

  return (
    <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] flex flex-col h-full">
      <div className="p-3 border-b border-[var(--card-border)]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            Economic Calendar
          </h2>
          <span className="text-[10px] text-[var(--text-muted)]">
            {events.length} events
          </span>
        </div>
        <div className="flex gap-1">
          {(["all", "high", "medium"] as const).map((level) => (
            <button
              key={level}
              onClick={() => setImpactFilter(level)}
              className={`text-[10px] px-2 py-1 rounded-full transition-colors capitalize ${
                impactFilter === level
                  ? "bg-[var(--accent-blue)] text-white"
                  : "bg-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {level === "all"
                ? "All"
                : level === "high"
                  ? "High Impact"
                  : "High + Medium"}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-blue)]" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] text-center py-12">
            No economic events found. Check your FINNHUB_API_KEY configuration.
          </p>
        ) : (
          filtered.map((event) => <EventRow key={event.id} event={event} />)
        )}
      </div>
    </div>
  );
}
