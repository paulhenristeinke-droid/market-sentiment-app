"use client";

import { useEffect, useRef } from "react";

export default function EconomicCalendar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const widgetContainer = document.createElement("div");
    widgetContainer.className = "tradingview-widget-container";
    widgetContainer.style.height = "100%";
    widgetContainer.style.width = "100%";

    const widgetInner = document.createElement("div");
    widgetInner.className = "tradingview-widget-container__widget";
    widgetContainer.appendChild(widgetInner);

    const script = document.createElement("script");
    script.src =
      "https://s3.tradingview.com/external-embedding/embed-widget-events.js";
    script.async = true;
    script.type = "text/javascript";
    script.textContent = JSON.stringify({
      colorTheme: "dark",
      isTransparent: true,
      width: "100%",
      height: "100%",
      locale: "en",
      importanceFilter: "-1,0,1",
      countryFilter: "us,eu,gb,jp,cn",
    });

    widgetContainer.appendChild(script);
    const currentContainer = containerRef.current;
    currentContainer.appendChild(widgetContainer);

    return () => {
      currentContainer.innerHTML = "";
    };
  }, []);

  return (
    <div className="bg-[var(--card-bg)] rounded-lg border border-[var(--card-border)] flex flex-col h-full overflow-hidden">
      <div className="p-3 border-b border-[var(--card-border)]">
        <h2 className="text-sm font-semibold text-[var(--foreground)]">
          Economic Calendar
        </h2>
        <span className="text-[10px] text-[var(--text-muted)]">
          Powered by TradingView
        </span>
      </div>
      <div className="flex-1" ref={containerRef} />
    </div>
  );
}
