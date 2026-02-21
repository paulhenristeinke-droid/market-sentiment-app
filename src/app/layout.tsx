import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MarketPulse - AI-Powered Market Sentiment",
  description:
    "Real-time market sentiment analysis powered by AI. Track XAUUSD, forex, commodities and indices with news, economic calendar, and TradingView charts.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased min-h-screen bg-[var(--background)]">
        {children}
      </body>
    </html>
  );
}
