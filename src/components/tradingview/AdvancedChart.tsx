"use client";

import { useEffect, useRef } from "react";

interface AdvancedChartProps {
  symbol: string; // TradingView symbol e.g. "OANDA:XAUUSD"
}

export default function AdvancedChart({ symbol }: AdvancedChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";

    const widgetInner = document.createElement("div");
    widgetInner.id = "tradingview-chart";
    widgetInner.style.height = "calc(100% - 32px)";
    widgetInner.style.width = "100%";
    widgetContainer.appendChild(widgetInner);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js";
    script.async = true;
    script.type = "text/javascript";
    script.textContent = JSON.stringify({
      autosize: true,
      symbol: symbol,
      interval: "60",
      timezone: "Etc/UTC",
      theme: "dark",
      style: "1",
      locale: "en",
      backgroundColor: "rgba(11, 14, 20, 1)",
      gridColor: "rgba(30, 37, 48, 0.6)",
      allow_symbol_change: true,
      calendar: false,
      support_host: "https://www.tradingview.com",
      hide_volume: false,
      studies: ["RSI@tv-basicstudies", "MASimple@tv-basicstudies"],
    });

    widgetContainer.appendChild(script);
    const currentContainer = containerRef.current;
    currentContainer.appendChild(widgetContainer);

    return () => {
      currentContainer.innerHTML = "";
    };
  }, [symbol]);

  return (
    <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] overflow-hidden h-[500px]">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  );
}
