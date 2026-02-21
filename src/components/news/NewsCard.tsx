"use client";

import { NewsArticle, NewsCategory } from "@/types/news";
import { formatDistanceToNow } from "date-fns";

const CATEGORY_COLORS: Record<NewsCategory, string> = {
  "Central Bank": "bg-purple-500/20 text-purple-400",
  Economic: "bg-blue-500/20 text-blue-400",
  Geopolitical: "bg-red-500/20 text-red-400",
  Market: "bg-green-500/20 text-green-400",
  General: "bg-gray-500/20 text-gray-400",
};

export default function NewsCard({ article }: { article: NewsArticle }) {
  const timeAgo = formatDistanceToNow(new Date(article.publishedAt), {
    addSuffix: true,
  });

  return (
    <a
      href={article.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-3 rounded-lg border border-[var(--card-border)] hover:border-[var(--accent-blue)]/50 transition-colors bg-[var(--card-bg)]"
    >
      <div className="flex items-start gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span
              className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${CATEGORY_COLORS[article.category]}`}
            >
              {article.category}
            </span>
            <span className="text-[10px] text-[var(--text-muted)]">
              {article.source}
            </span>
          </div>
          <h3 className="text-sm font-medium text-[var(--foreground)] line-clamp-2 leading-snug">
            {article.title}
          </h3>
          {article.description && (
            <p className="text-xs text-[var(--text-muted)] mt-1 line-clamp-2">
              {article.description}
            </p>
          )}
          <p className="text-[10px] text-[var(--text-muted)] mt-1.5">
            {timeAgo}
          </p>
        </div>
      </div>
    </a>
  );
}
