import { NextRequest, NextResponse } from "next/server";
import { fetchFTNews } from "@/lib/api/ft-rss";
import { getAssetById, getDefaultAsset } from "@/types/assets";
import { getCached, setCache, CACHE_TTL } from "@/lib/cache";
import { NewsArticle } from "@/types/news";

export async function GET(request: NextRequest) {
  const assetId = request.nextUrl.searchParams.get("asset") ?? "xauusd";
  const asset = getAssetById(assetId) ?? getDefaultAsset();
  const cacheKey = `news:${asset.id}`;

  const cached = getCached<NewsArticle[]>(cacheKey);
  if (cached) {
    return NextResponse.json({ articles: cached, cached: true });
  }

  const articles = await fetchFTNews(asset.id);
  setCache(cacheKey, articles, CACHE_TTL);

  return NextResponse.json({ articles, cached: false });
}
