"use client";

const TICKER_SYMBOLS = [
  { proName: "OANDA:XAUUSD", title: "Gold", symbol: "XAUUSD" },
  { proName: "OANDA:XAGUSD", title: "Silver", symbol: "XAGUSD" },
  { proName: "OANDA:EURUSD", title: "EUR/USD", symbol: "EURUSD" },
  { proName: "OANDA:GBPJPY", title: "GBP/JPY", symbol: "GBPJPY" },
  { proName: "TVC:USOIL", title: "Crude Oil", symbol: "USOIL" },
  { proName: "FOREXCOM:SPXUSD", title: "S&P 500", symbol: "SPX500" },
  { proName: "FOREXCOM:NSXUSD", title: "NASDAQ", symbol: "NAS100" },
  { proName: "TVC:DXY", title: "US Dollar Index", symbol: "DXY" },
  { proName: "TVC:US10Y", title: "US 10Y Yield", symbol: "US10Y" },
];

function TickerItem({ item }: { item: (typeof TICKER_SYMBOLS)[number] }) {
  return (
    <a
      href={`https://www.tradingview.com/symbols/${item.proName}/`}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 px-6 whitespace-nowrap hover:opacity-80 transition-opacity"
    >
      <span className="text-xs font-semibold text-[var(--foreground)]">
        {item.title}
      </span>
      <span className="text-[11px] text-[var(--text-muted)]">
        {item.symbol}
      </span>
    </a>
  );
}

export default function TickerTape() {
  const renderItems = () =>
    TICKER_SYMBOLS.map((item) => (
      <TickerItem key={item.symbol} item={item} />
    ));

  return (
    <div className="border-b border-[var(--card-border)] overflow-hidden py-2.5 bg-[var(--card-bg)]">
      <div className="marquee-track">
        <div className="marquee-content">{renderItems()}</div>
        <div className="marquee-content" aria-hidden="true">
          {renderItems()}
        </div>
      </div>
    </div>
  );
}
