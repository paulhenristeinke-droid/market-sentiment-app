import { NewsArticle, NewsCategory } from "@/types/news";

// FT RSS feed URLs mapped to asset-relevant sections
const FT_FEEDS: Record<string, string[]> = {
  xauusd: [
    "https://www.ft.com/commodities?format=rss",
    "https://www.ft.com/gold?format=rss",
    "https://www.ft.com/precious-metals?format=rss",
  ],
  eurusd: [
    "https://www.ft.com/currencies?format=rss",
    "https://www.ft.com/eurozone-economy?format=rss",
    "https://www.ft.com/us-economy?format=rss",
  ],
  gbpjpy: [
    "https://www.ft.com/currencies?format=rss",
    "https://www.ft.com/uk-economy?format=rss",
    "https://www.ft.com/japanese-economy?format=rss",
  ],
  xagusd: [
    "https://www.ft.com/commodities?format=rss",
    "https://www.ft.com/precious-metals?format=rss",
  ],
  xtiusd: [
    "https://www.ft.com/oil?format=rss",
    "https://www.ft.com/commodities?format=rss",
    "https://www.ft.com/energy-sector?format=rss",
  ],
  sp500: [
    "https://www.ft.com/equities?format=rss",
    "https://www.ft.com/us-equities?format=rss",
    "https://www.ft.com/markets?format=rss",
  ],
  nasdaq: [
    "https://www.ft.com/technology-sector?format=rss",
    "https://www.ft.com/equities?format=rss",
    "https://www.ft.com/markets?format=rss",
  ],
};

// Fallback feeds used for any asset
const DEFAULT_FEEDS = [
  "https://www.ft.com/markets?format=rss",
  "https://www.ft.com/world-economy?format=rss",
];

const CATEGORY_KEYWORDS: Record<Exclude<NewsCategory, "General">, string[]> = {
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
};

function categorizeArticle(title: string, description: string): NewsCategory {
  const text = `${title} ${description}`.toLowerCase();
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    if (keywords.some((kw) => text.includes(kw))) {
      return category as NewsCategory;
    }
  }
  return "General";
}

interface RssItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  imageUrl?: string;
}

function parseRssXml(xml: string): RssItem[] {
  const items: RssItem[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    const title = extractTag(itemXml, "title");
    const description = extractTag(itemXml, "description");
    const link = extractTag(itemXml, "link");
    const pubDate = extractTag(itemXml, "pubDate");

    // Try to extract image from media:content or enclosure
    const mediaMatch = itemXml.match(/url=["']([^"']+\.(jpg|jpeg|png|webp)[^"']*)/i);
    const imageUrl = mediaMatch ? mediaMatch[1] : undefined;

    if (title && link) {
      items.push({
        title: cleanHtml(title),
        description: cleanHtml(description ?? ""),
        link,
        pubDate: pubDate ?? new Date().toISOString(),
        imageUrl,
      });
    }
  }

  return items;
}

function extractTag(xml: string, tag: string): string | null {
  // Handle CDATA sections
  const cdataRegex = new RegExp(`<${tag}[^>]*>\\s*<!\\[CDATA\\[([\\s\\S]*?)\\]\\]>\\s*<\\/${tag}>`, "i");
  const cdataMatch = xml.match(cdataRegex);
  if (cdataMatch) return cdataMatch[1].trim();

  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, "i");
  const match = xml.match(regex);
  return match ? match[1].trim() : null;
}

function cleanHtml(text: string): string {
  return text
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&apos;/g, "'")
    .trim();
}

async function fetchFeed(url: string): Promise<RssItem[]> {
  try {
    const res = await fetch(url, {
      next: { revalidate: 900 },
      headers: {
        "User-Agent": "Mozilla/5.0 (compatible; MarketSentimentApp/1.0)",
      },
    });
    if (!res.ok) return [];
    const xml = await res.text();
    return parseRssXml(xml);
  } catch (err) {
    console.warn(`Failed to fetch FT feed ${url}:`, err);
    return [];
  }
}

export async function fetchFTNews(assetId: string): Promise<NewsArticle[]> {
  const feedUrls = FT_FEEDS[assetId] ?? DEFAULT_FEEDS;

  const results = await Promise.allSettled(feedUrls.map(fetchFeed));

  const allItems: RssItem[] = [];
  const seenUrls = new Set<string>();

  for (const result of results) {
    if (result.status === "fulfilled") {
      for (const item of result.value) {
        if (!seenUrls.has(item.link)) {
          seenUrls.add(item.link);
          allItems.push(item);
        }
      }
    }
  }

  // Only include articles from the last 48 hours
  const cutoff = Date.now() - 48 * 60 * 60 * 1000;

  return allItems
    .filter((item) => {
      const date = new Date(item.pubDate).getTime();
      return !isNaN(date) && date > cutoff;
    })
    .sort((a, b) => new Date(b.pubDate).getTime() - new Date(a.pubDate).getTime())
    .slice(0, 20)
    .map((item) => ({
      title: item.title,
      description: item.description,
      url: item.link,
      source: "Financial Times",
      publishedAt: new Date(item.pubDate).toISOString(),
      category: categorizeArticle(item.title, item.description),
      imageUrl: item.imageUrl,
    }));
}
