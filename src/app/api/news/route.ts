import { NextRequest, NextResponse } from "next/server";
import { fetchNews } from "@/lib/api/newsapi";
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

  // Fetch from both NewsAPI and Financial Times RSS in parallel
  const [newsApiArticles, ftArticles] = await Promise.all([
    fetchNews(asset.newsKeywords),
    fetchFTNews(asset.id),
  ]);

  // Combine and deduplicate by title similarity
  const seenTitles = new Set<string>();
  const combined: NewsArticle[] = [];

  // FT articles first (higher quality source), then NewsAPI
  for (const article of [...ftArticles, ...newsApiArticles]) {
    const normalizedTitle = article.title.toLowerCase().trim();
    if (!seenTitles.has(normalizedTitle)) {
      seenTitles.add(normalizedTitle);
      combined.push(article);
    }
  }

  // Sort by publish date (newest first)
  combined.sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );

  setCache(cacheKey, combined, CACHE_TTL);

  return NextResponse.json({ articles: combined, cached: false });
}
