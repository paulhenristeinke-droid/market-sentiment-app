"use client";

import { useEffect, useRef } from "react";

const TICKER_SYMBOLS = [
  { proName: "OANDA:XAUUSD", title: "Gold" },
  { proName: "OANDA:XAGUSD", title: "Silver" },
  { proName: "OANDA:EURUSD", title: "EUR/USD" },
  { proName: "OANDA:GBPJPY", title: "GBP/JPY" },
  { proName: "TVC:USOIL", title: "Crude Oil" },
  { proName: "FOREXCOM:SPXUSD", title: "S&P 500" },
  { proName: "FOREXCOM:NSXUSD", title: "NASDAQ" },
  { proName: "TVC:DXY", title: "US Dollar Index" },
  { proName: "TVC:US10Y", title: "US 10Y Yield" },
];

export default function TickerTape() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    // Clear any existing content
    containerRef.current.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";

    const widgetInner = document.createElement("div");
    widgetInner.className = "tradingview-widget-container__widget";
    widgetContainer.appendChild(widgetInner);

    const script = document.createElement("script");
    script.src = "https://s3.tradingview.com/external-embedding/embed-widget-ticker-tape.js";
    script.async = true;
    script.type = "text/javascript";
    script.textContent = JSON.stringify({
      symbols: TICKER_SYMBOLS,
      showSymbolLogo: true,
      isTransparent: true,
      displayMode: "adaptive",
      colorTheme: "dark",
      locale: "en",
    });

    widgetContainer.appendChild(script);
    const currentContainer = containerRef.current;
    currentContainer.appendChild(widgetContainer);

    return () => {
      currentContainer.innerHTML = "";
    };
  }, []);

  return (
    <div className="border-b border-[var(--card-border)] overflow-hidden">
      <div ref={containerRef} />
    </div>
  );
}
