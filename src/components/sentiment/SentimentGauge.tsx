"use client";

import { SentimentScore, SentimentDirection } from "@/types/sentiment";

const DIRECTION_COLORS: Record<SentimentDirection, string> = {
  bullish: "var(--accent-green)",
  bearish: "var(--accent-red)",
  neutral: "var(--accent-yellow)",
};

const DIRECTION_BG: Record<SentimentDirection, string> = {
  bullish: "bg-green-500/10 border-green-500/30",
  bearish: "bg-red-500/10 border-red-500/30",
  neutral: "bg-yellow-500/10 border-yellow-500/30",
};

interface SentimentGaugeProps {
  score: SentimentScore;
  label: string;
}

export default function SentimentGauge({ score, label }: SentimentGaugeProps) {
  // Normalize score (-100 to 100) to percentage (0 to 100) for the gauge
  const normalizedPosition = (score.score + 100) / 2;
  const color = DIRECTION_COLORS[score.direction];

  return (
    <div
      className={`rounded-lg border p-3 ${DIRECTION_BG[score.direction]}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-medium text-[var(--text-muted)] uppercase tracking-wider">
          {label}
        </span>
        <span
          className="text-xs font-bold uppercase"
          style={{ color }}
        >
          {score.direction}
        </span>
      </div>

      {/* Gauge bar */}
      <div className="relative h-2 bg-[var(--background)] rounded-full mb-2">
        {/* Gradient background */}
        <div className="absolute inset-0 rounded-full overflow-hidden">
          <div className="h-full w-full bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 opacity-30" />
        </div>
        {/* Center marker */}
        <div className="absolute top-0 left-1/2 -translate-x-px w-0.5 h-full bg-[var(--text-muted)] opacity-50" />
        {/* Position indicator */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full border-2 shadow-lg"
          style={{
            left: `${normalizedPosition}%`,
            transform: `translate(-50%, -50%)`,
            backgroundColor: color,
            borderColor: color,
          }}
        />
      </div>

      <div className="flex items-center justify-between">
        <span className="text-lg font-bold" style={{ color }}>
          {score.score > 0 ? "+" : ""}
          {score.score}
        </span>
        <span className="text-[10px] text-[var(--text-muted)]">
          {score.confidence}% confidence
        </span>
      </div>
    </div>
  );
}
