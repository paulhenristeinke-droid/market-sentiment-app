"use client";

import { useState } from "react";
import { SentimentResponse, SentimentTimeframe } from "@/types/sentiment";
import SentimentGauge from "./SentimentGauge";
import SentimentSummary from "./SentimentSummary";

const TIMEFRAMES: { key: SentimentTimeframe; label: string }[] = [
  { key: "daily", label: "Today" },
  { key: "weekly", label: "This Week" },
  { key: "monthly", label: "This Month" },
];

interface SentimentDashboardProps {
  sentiment: SentimentResponse | null;
  loading: boolean;
  onRefresh: () => void;
}

export default function SentimentDashboard({
  sentiment,
  loading,
  onRefresh,
}: SentimentDashboardProps) {
  const [activeTimeframe, setActiveTimeframe] =
    useState<SentimentTimeframe>("daily");

  const activeAnalysis = sentiment
    ? sentiment[activeTimeframe]
    : null;

  return (
    <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] flex flex-col h-full">
      <div className="p-3 border-b border-[var(--card-border)]">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-sm font-semibold text-[var(--foreground)]">
            AI Sentiment Analysis
          </h2>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="text-[10px] px-2 py-1 rounded bg-[var(--accent-blue)]/20 text-[var(--accent-blue)] hover:bg-[var(--accent-blue)]/30 transition-colors disabled:opacity-50"
          >
            {loading ? "Analyzing..." : "Refresh"}
          </button>
        </div>
        <div className="flex gap-1">
          {TIMEFRAMES.map((tf) => (
            <button
              key={tf.key}
              onClick={() => setActiveTimeframe(tf.key)}
              className={`text-[10px] px-2 py-1 rounded-full transition-colors ${
                activeTimeframe === tf.key
                  ? "bg-[var(--accent-blue)] text-white"
                  : "bg-[var(--card-border)] text-[var(--text-muted)] hover:text-[var(--foreground)]"
              }`}
            >
              {tf.label}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[var(--accent-blue)]" />
            <p className="text-xs text-[var(--text-muted)]">
              Claude is analyzing market data...
            </p>
          </div>
        ) : !sentiment || !activeAnalysis ? (
          <div className="text-center py-12">
            <p className="text-xs text-[var(--text-muted)] mb-2">
              No sentiment data available.
            </p>
            <button
              onClick={onRefresh}
              className="text-xs text-[var(--accent-blue)] hover:underline"
            >
              Generate sentiment analysis
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {/* All three gauges */}
            <div className="grid grid-cols-3 gap-2">
              {TIMEFRAMES.map((tf) => (
                <SentimentGauge
                  key={tf.key}
                  score={sentiment[tf.key].score}
                  label={tf.label}
                />
              ))}
            </div>

            {/* Detailed summary for active timeframe */}
            <div className="border-t border-[var(--card-border)] pt-3">
              <h3 className="text-xs font-semibold text-[var(--foreground)] mb-2">
                {TIMEFRAMES.find((t) => t.key === activeTimeframe)?.label}{" "}
                Outlook
              </h3>
              <SentimentSummary analysis={activeAnalysis} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
