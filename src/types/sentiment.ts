export type SentimentDirection = "bullish" | "bearish" | "neutral";
export type SentimentTimeframe = "daily" | "weekly" | "monthly";

export interface SentimentScore {
  direction: SentimentDirection;
  score: number; // -100 (very bearish) to +100 (very bullish)
  confidence: number; // 0-100
}

export interface SentimentAnalysis {
  timeframe: SentimentTimeframe;
  score: SentimentScore;
  summary: string;
  keyDrivers: string[];
  riskFactors: string[];
  generatedAt: string;
}

export interface SentimentResponse {
  asset: string;
  daily: SentimentAnalysis;
  weekly: SentimentAnalysis;
  monthly: SentimentAnalysis;
  generatedAt: string;
}
