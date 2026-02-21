"use client";

import { SentimentAnalysis } from "@/types/sentiment";

interface SentimentSummaryProps {
  analysis: SentimentAnalysis;
}

export default function SentimentSummary({ analysis }: SentimentSummaryProps) {
  return (
    <div className="space-y-3">
      <p className="text-sm text-[var(--foreground)] leading-relaxed">
        {analysis.summary}
      </p>

      <div>
        <h4 className="text-[10px] font-medium text-[var(--accent-blue)] uppercase tracking-wider mb-1.5">
          Key Drivers
        </h4>
        <ul className="space-y-1">
          {analysis.keyDrivers.map((driver, idx) => (
            <li
              key={idx}
              className="text-xs text-[var(--foreground)] flex items-start gap-1.5"
            >
              <span className="text-[var(--accent-blue)] mt-0.5 shrink-0">
                &bull;
              </span>
              {driver}
            </li>
          ))}
        </ul>
      </div>

      <div>
        <h4 className="text-[10px] font-medium text-[var(--accent-red)] uppercase tracking-wider mb-1.5">
          Risk Factors
        </h4>
        <ul className="space-y-1">
          {analysis.riskFactors.map((risk, idx) => (
            <li
              key={idx}
              className="text-xs text-[var(--foreground)] flex items-start gap-1.5"
            >
              <span className="text-[var(--accent-red)] mt-0.5 shrink-0">
                &bull;
              </span>
              {risk}
            </li>
          ))}
        </ul>
      </div>

      <p className="text-[10px] text-[var(--text-muted)]">
        Generated{" "}
        {new Date(analysis.generatedAt).toLocaleString()}
      </p>
    </div>
  );
}
