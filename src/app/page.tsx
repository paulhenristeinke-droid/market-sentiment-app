"use client";

import { useState, useEffect, useCallback } from "react";
import { Asset, getDefaultAsset } from "@/types/assets";
import { NewsArticle } from "@/types/news";
import { EconomicEvent } from "@/types/calendar";
import { SentimentResponse } from "@/types/sentiment";
import Header from "@/components/layout/Header";
import TickerTape from "@/components/tradingview/TickerTape";
import AdvancedChart from "@/components/tradingview/AdvancedChart";
import NewsFeed from "@/components/news/NewsFeed";
import EconomicCalendar from "@/components/calendar/EconomicCalendar";
import SentimentDashboard from "@/components/sentiment/SentimentDashboard";

export default function Dashboard() {
  const [selectedAsset, setSelectedAsset] = useState<Asset>(getDefaultAsset());
  const [news, setNews] = useState<NewsArticle[]>([]);
  const [events, setEvents] = useState<EconomicEvent[]>([]);
  const [sentiment, setSentiment] = useState<SentimentResponse | null>(null);
  const [newsLoading, setNewsLoading] = useState(true);
  const [calendarLoading, setCalendarLoading] = useState(true);
  const [sentimentLoading, setSentimentLoading] = useState(false);

  const fetchNewsData = useCallback(async (assetId: string) => {
    setNewsLoading(true);
    try {
      const res = await fetch(`/api/news?asset=${assetId}`);
      const data = await res.json();
      setNews(data.articles ?? []);
    } catch (err) {
      console.error("Failed to fetch news:", err);
      setNews([]);
    }
    setNewsLoading(false);
  }, []);

  const fetchCalendarData = useCallback(async () => {
    setCalendarLoading(true);
    try {
      const res = await fetch("/api/calendar");
      const data = await res.json();
      setEvents(data.events ?? []);
    } catch (err) {
      console.error("Failed to fetch calendar:", err);
      setEvents([]);
    }
    setCalendarLoading(false);
  }, []);

  const fetchSentiment = useCallback(
    async (assetId: string, refresh = false) => {
      setSentimentLoading(true);
      try {
        const res = await fetch(
          `/api/sentiment?asset=${assetId}${refresh ? "&refresh=true" : ""}`
        );
        const data = await res.json();
        setSentiment(data);
      } catch (err) {
        console.error("Failed to fetch sentiment:", err);
        setSentiment(null);
      }
      setSentimentLoading(false);
    },
    []
  );

  // Fetch data on mount and when asset changes
  useEffect(() => {
    fetchNewsData(selectedAsset.id);
    fetchCalendarData();
    fetchSentiment(selectedAsset.id);
  }, [selectedAsset.id, fetchNewsData, fetchCalendarData, fetchSentiment]);

  const handleAssetChange = (asset: Asset) => {
    setSelectedAsset(asset);
    setSentiment(null);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Ticker Tape Banner */}
      <TickerTape />

      {/* Header with Asset Selector */}
      <Header
        selectedAssetId={selectedAsset.id}
        onAssetChange={handleAssetChange}
      />

      {/* Main Content */}
      <main className="flex-1 max-w-[1920px] mx-auto w-full p-4">
        {/* TradingView Chart */}
        <div className="mb-4">
          <AdvancedChart symbol={selectedAsset.tradingViewSymbol} />
        </div>

        {/* Three-column layout: News | Sentiment | Calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4" style={{ height: "600px" }}>
          {/* News Feed */}
          <NewsFeed articles={news} loading={newsLoading} />

          {/* Sentiment Dashboard */}
          <SentimentDashboard
            sentiment={sentiment}
            loading={sentimentLoading}
            onRefresh={() => fetchSentiment(selectedAsset.id, true)}
          />

          {/* Economic Calendar */}
          <EconomicCalendar events={events} loading={calendarLoading} />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--card-border)] py-3 px-4 text-center">
        <p className="text-[10px] text-[var(--text-muted)]">
          MarketPulse — AI-powered market sentiment analysis. Data from NewsAPI,
          FinnHub & TradingView. Sentiment by Claude AI. Not financial advice.
        </p>
      </footer>
    </div>
  );
}
