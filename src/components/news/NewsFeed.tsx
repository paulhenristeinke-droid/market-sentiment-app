"use client";

import { useState } from "react";
import { NewsArticle, NewsCategory } from "@/types/news";
import NewsCard from "./NewsCard";

const ALL_CATEGORIES: NewsCategory[] = [
  "Economic",
  "Central Bank",
  "Geopolitical",
  "Market",
  "General",
];

interface NewsFeedProps {
  articles: NewsArticle[];
  loading: boolean;
}

export default function NewsFeed({ articles, loading }: NewsFeedProps) {
  const [filter, setFilter] = useState<NewsCategory | "All">("All");

  const filtered =
    filter === "All"
      ? articles
      : articles.filter((a) => a.category === filter);

  return (
    <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] flex flex-col h-full">
      <div className="p-3 border-b border-[var(--card-border)]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            News Feed
          </h2>
          <span className="text-[10px] text-[var(--text-muted)]">
            Last 24 hours
          </span>
        </div>
        <div className="flex gap-1 flex-wrap">
          <button
            onClick={() => setFilter("All")}
            className={`text-[10px] px-2 py-1 rounded-full transition-colors ${
              filter === "All"
                ? "bg-[var(--accent-blue)] text-white"
                : "bg-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
            }`}
          >
            All ({articles.length})
          </button>
          {ALL_CATEGORIES.map((cat) => {
            const count = articles.filter((a) => a.category === cat).length;
            if (count === 0) return null;
            return (
              <button
                key={cat}
                onClick={() => setFilter(cat)}
                className={`text-[10px] px-2 py-1 rounded-full transition-colors ${
                  filter === cat
                    ? "bg-[var(--accent-blue)] text-white"
                    : "bg-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3 space-y-2">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-blue)]" />
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-xs text-[var(--text-muted)] text-center py-12">
            No news articles found. Check your NEWS_API_KEY configuration.
          </p>
        ) : (
          filtered.map((article, idx) => (
            <NewsCard key={`${article.url}-${idx}`} article={article} />
          ))
        )}
      </div>
    </div>
  );
}
