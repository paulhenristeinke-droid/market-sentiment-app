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
