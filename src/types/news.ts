export interface NewsArticle {
  title: string;
  description: string;
  url: string;
  source: string;
  publishedAt: string;
  category: NewsCategory;
  imageUrl?: string;
}

export type NewsCategory =
  | "Economic"
  | "Geopolitical"
  | "Central Bank"
  | "Market"
  | "General";

export interface NewsApiResponse {
  status: string;
  totalResults: number;
  articles: {
    source: { id: string | null; name: string };
    author: string | null;
    title: string;
    description: string | null;
    url: string;
    urlToImage: string | null;
    publishedAt: string;
    content: string | null;
  }[];
}
