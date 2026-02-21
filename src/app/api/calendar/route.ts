import { NextResponse } from "next/server";
import { fetchEconomicCalendar } from "@/lib/api/finnhub";
import { getCached, setCache, CACHE_TTL } from "@/lib/cache";
import { EconomicEvent } from "@/types/calendar";

export async function GET() {
  const cacheKey = "economic-calendar";

  const cached = getCached<EconomicEvent[]>(cacheKey);
  if (cached) {
    return NextResponse.json({ events: cached, cached: true });
  }

  const events = await fetchEconomicCalendar();
  setCache(cacheKey, events, CACHE_TTL);

  return NextResponse.json({ events, cached: false });
}
