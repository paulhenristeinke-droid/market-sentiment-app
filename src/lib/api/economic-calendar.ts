import { EconomicEvent } from "@/types/calendar";

// Forex Factory calendar JSON endpoint (free, no API key required)
const FF_CALENDAR_URL =
  "https://nfs.faireconomy.media/ff_calendar_thisweek.json";

interface FFCalendarEvent {
  title: string;
  country: string;
  date: string;
  impact: string;
  forecast: string;
  previous: string;
}

// Map FF country codes to readable names
const COUNTRY_MAP: Record<string, string> = {
  USD: "US",
  EUR: "EU",
  GBP: "UK",
  JPY: "JP",
  CAD: "CA",
  AUD: "AU",
  NZD: "NZ",
  CHF: "CH",
  CNY: "CN",
};

// Map FF impact labels to our type
function mapImpact(impact: string): "high" | "medium" | "low" {
  const normalized = impact.toLowerCase().trim();
  if (normalized === "high" || normalized === "holiday") return "high";
  if (normalized === "medium") return "medium";
  return "low";
}

// Filter events relevant to a given asset
const ASSET_COUNTRIES: Record<string, string[]> = {
  xauusd: ["USD", "EUR", "CNY", "JPY", "GBP", "CHF"],
  eurusd: ["USD", "EUR"],
  gbpjpy: ["GBP", "JPY"],
  xagusd: ["USD", "EUR", "CNY"],
  xtiusd: ["USD", "CAD", "EUR", "CNY"],
  sp500: ["USD"],
  nasdaq: ["USD"],
};

// All major currencies as fallback
const DEFAULT_COUNTRIES = ["USD", "EUR", "GBP", "JPY"];

export async function fetchEconomicCalendar(
  assetId: string
): Promise<EconomicEvent[]> {
  try {
    const res = await fetch(FF_CALENDAR_URL, {
      next: { revalidate: 1800 }, // revalidate every 30 minutes
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MarketSentimentApp/1.0)",
      },
    });

    if (!res.ok) {
      console.warn(`Economic calendar fetch failed: ${res.status}`);
      return [];
    }

    const data: FFCalendarEvent[] = await res.json();
    const relevantCountries = ASSET_COUNTRIES[assetId] ?? DEFAULT_COUNTRIES;

    // Filter to relevant countries and medium/high impact events
    const filtered = data.filter((e) => {
      const isRelevantCountry = relevantCountries.includes(e.country);
      const impact = mapImpact(e.impact);
      const isSignificant = impact === "high" || impact === "medium";
      return isRelevantCountry && isSignificant;
    });

    // Sort by date descending (most recent first)
    filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return filtered.slice(0, 20).map((e, index) => ({
      id: `ff-${index}-${Date.now()}`,
      event: e.title,
      country: COUNTRY_MAP[e.country] ?? e.country,
      date: e.date,
      time: new Date(e.date).toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
      impact: mapImpact(e.impact),
      forecast: e.forecast || null,
      actual: null,
      previous: e.previous || null,
      unit: "",
    }));
  } catch (err) {
    console.warn("Failed to fetch economic calendar:", err);
    return [];
  }
}
