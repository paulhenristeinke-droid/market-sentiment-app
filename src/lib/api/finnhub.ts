import { EconomicEvent, FinnhubCalendarResponse } from "@/types/calendar";
import { format, subDays, addDays } from "date-fns";

const FINNHUB_BASE = "https://finnhub.io/api/v1";

function mapImpact(impact: string): "high" | "medium" | "low" {
  const num = parseInt(impact, 10);
  if (num >= 3) return "high";
  if (num >= 2) return "medium";
  return "low";
}

export async function fetchEconomicCalendar(): Promise<EconomicEvent[]> {
  const apiKey = process.env.FINNHUB_API_KEY;
  if (!apiKey) {
    console.warn("FINNHUB_API_KEY not set, returning empty calendar");
    return [];
  }

  const today = new Date();
  const from = format(subDays(today, 1), "yyyy-MM-dd");
  const to = format(addDays(today, 7), "yyyy-MM-dd");

  const url = `${FINNHUB_BASE}/calendar/economic?from=${from}&to=${to}&token=${apiKey}`;

  const res = await fetch(url, { next: { revalidate: 900 } });

  if (!res.ok) {
    console.error(`Finnhub error: ${res.status}`);
    return [];
  }

  const data: FinnhubCalendarResponse = await res.json();

  if (!data.economicCalendar) return [];

  // Filter for major economies and sort by date
  const majorCountries = ["US", "GB", "EU", "JP", "CN", "DE", "FR", "CA", "AU"];

  return data.economicCalendar
    .filter((e) => majorCountries.includes(e.country))
    .map((event, idx) => ({
      id: `${event.date}-${event.event}-${idx}`,
      event: event.event,
      country: event.country,
      date: event.date,
      time: event.time || "All Day",
      impact: mapImpact(event.impact),
      forecast: event.estimate !== null ? String(event.estimate) : null,
      actual: event.actual !== null ? String(event.actual) : null,
      previous: event.prev !== null ? String(event.prev) : null,
      unit: event.unit || "",
    }))
    .sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      return a.time.localeCompare(b.time);
    });
}
