import { NextRequest, NextResponse } from "next/server";
import { generateSentiment } from "@/lib/api/anthropic";
import { fetchNews } from "@/lib/api/newsapi";
import { fetchEconomicCalendar } from "@/lib/api/finnhub";
import { getAssetById, getDefaultAsset } from "@/types/assets";
import { getCached, setCache, SENTIMENT_CACHE_TTL } from "@/lib/cache";
import { SentimentResponse } from "@/types/sentiment";

export async function GET(request: NextRequest) {
  const assetId = request.nextUrl.searchParams.get("asset") ?? "xauusd";
  const asset = getAssetById(assetId) ?? getDefaultAsset();
  const forceRefresh = request.nextUrl.searchParams.get("refresh") === "true";

  const cacheKey = `sentiment:${asset.id}`;

  if (!forceRefresh) {
    const cached = getCached<SentimentResponse>(cacheKey);
    if (cached) {
      return NextResponse.json({ ...cached, cached: true });
    }
  }

  // Fetch news and calendar data in parallel
  const [news, events] = await Promise.all([
    fetchNews(asset.newsKeywords),
    fetchEconomicCalendar(),
  ]);

  const sentiment = await generateSentiment(asset, news, events);
  setCache(cacheKey, sentiment, SENTIMENT_CACHE_TTL);

  return NextResponse.json({ ...sentiment, cached: false });
}
