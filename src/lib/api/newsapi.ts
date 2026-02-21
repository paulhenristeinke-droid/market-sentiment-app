import { NewsArticle, NewsApiResponse, NewsCategory } from "@/types/news";

const NEWS_API_BASE = "https://newsapi.org/v2";

const CATEGORY_KEYWORDS: Record<NewsCategory, string[]> = {
  "Central Bank": [
    "federal reserve", "fed", "ecb", "boe", "boj", "central bank",
    "interest rate", "monetary policy", "rate decision", "fomc", "powell",
  ],
  Economic: [
    "inflation", "cpi", "gdp", "employment", "jobs", "nfp", "pmi",
    "retail sales", "consumer", "economic data", "trade balance",
  ],
  Geopolitical: [
    "war", "conflict", "sanctions", "geopolitical", "tension",
    "election", "political", "crisis", "trade war", "tariff",
  ],
  Market: [
    "rally", "sell-off", "bull", "bear", "trading", "price",
    "forecast", "analyst", "technical", "support", "resistance",
  ],
  General: [],
};

function categorizeArticle(title: string, description: string): NewsCategory {
  const text = `${title} ${description}`.toLowerCase();

  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (category === "General") continue;
    if (keywords.some((kw) => text.includes(kw))) {
      return category as NewsCategory;
    }
  }
  return "General";
}

export async function fetchNews(keywords: string[]): Promise<NewsArticle[]> {
  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    console.warn("NEWS_API_KEY not set, returning empty news");
    return [];
  }

  const query = keywords.slice(0, 5).join(" OR ");
  const fromDate = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const url = new URL(`${NEWS_API_BASE}/everything`);
  url.searchParams.set("q", query);
  url.searchParams.set("from", fromDate);
  url.searchParams.set("sortBy", "publishedAt");
  url.searchParams.set("language", "en");
  url.searchParams.set("pageSize", "30");
  url.searchParams.set("apiKey", apiKey);

  const res = await fetch(url.toString(), { next: { revalidate: 900 } });

  if (!res.ok) {
    console.error(`NewsAPI error: ${res.status}`);
    return [];
  }

  const data: NewsApiResponse = await res.json();

  return data.articles
    .filter((a) => a.title && a.title !== "[Removed]")
    .map((article) => ({
      title: article.title,
      description: article.description ?? "",
      url: article.url,
      source: article.source.name,
      publishedAt: article.publishedAt,
      category: categorizeArticle(article.title, article.description ?? ""),
      imageUrl: article.urlToImage ?? undefined,
    }));
}
