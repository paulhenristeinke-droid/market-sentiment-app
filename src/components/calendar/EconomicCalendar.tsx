"use client";

import { useEffect, useRef } from "react";

export default function EconomicCalendar() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current) return;

    containerRef.current.innerHTML = "";

    const iframe = document.createElement("iframe");
    iframe.src =
      "https://www.tradays.com/en/economy/widget?dateFormat=MMM dd&impact=0&theme=1";
    iframe.style.width = "100%";
    iframe.style.height = "100%";
    iframe.style.border = "none";
    iframe.title = "Economic Calendar";
    iframe.allow = "encrypted-media";

    const currentContainer = containerRef.current;
    currentContainer.appendChild(iframe);

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
          Powered by Tradays
        </span>
      </div>
      <div className="flex-1" ref={containerRef} />
    </div>
  );
}
