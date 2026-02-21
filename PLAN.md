# Market Sentiment App - Implementation Plan

## Overview
A Next.js dashboard that aggregates news and economic data for financial instruments (starting with XAUUSD), then uses Claude AI to generate daily/weekly/monthly sentiment analysis. Multi-user with authentication.

## Tech Stack
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS
- **Auth:** NextAuth.js (GitHub + credentials providers)
- **Database:** SQLite via Prisma (easy local dev, can migrate to Postgres later)
- **AI:** Claude API (Anthropic SDK) for sentiment analysis
- **Charts/Prices:** TradingView widgets (advanced chart + ticker tape) - no API key needed
- **Sentiment Viz:** Recharts for sentiment gauges

## Data Sources (All Free Tier)

| Source | Purpose | Free Limits |
|--------|---------|-------------|
| [NewsAPI.org](https://newsapi.org) | Gold/USD news headlines + summaries | 100 req/day |
| [TradingView Widgets](https://www.tradingview.com/widget/) | Live charts + ticker tape (embedded) | Unlimited (free widgets) |
| [FinnHub](https://finnhub.io) | Economic calendar events | 60 req/min |

> **Note:** Free API keys will be required from these providers. The app will prompt for setup.

## Architecture

```
┌─────────────────────────────────────┐
│           Next.js Frontend          │
│  ┌───────────┐  ┌────────────────┐  │
│  │ Asset     │  │ Dashboard      │  │
│  │ Selector  │  │ - News Feed    │  │
│  │ (dropdown)│  │ - Econ Calendar│  │
│  │           │  │ - Sentiment    │  │
│  └───────────┘  └────────────────┘  │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│        Next.js API Routes           │
│  /api/news      - fetch & cache news│
│  /api/calendar  - econ events       │
│  /api/sentiment - Claude analysis   │
│  /api/auth      - NextAuth          │
│  (prices via TradingView widgets)   │
└──────────────┬──────────────────────┘
               │
┌──────────────▼──────────────────────┐
│  External APIs    │  SQLite + Prisma│
│  - NewsAPI        │  - Users        │
│  - TradingView    │  - Preferences  │
│  - FinnHub        │  - Cache        │
└───────────────────┴─────────────────┘
```

## Key Features

### 1. News Feed (Last 24 Hours)
- Headlines related to selected asset (gold, USD, commodities, geopolitics)
- Source attribution and timestamp
- Click-through to original articles
- Categorized: Economic, Geopolitical, Market, Central Bank

### 2. Economic Calendar
- Upcoming and recent economic events (CPI, NFP, FOMC, GDP, interest rates)
- Shows: Event name, Forecast, Actual (when released), Previous
- Impact level indicator (High/Medium/Low)
- Highlighted when actual deviates significantly from forecast

### 3. AI Sentiment Analysis (Claude-powered)
- **Daily sentiment:** Based on last 24h of news + today's data releases
- **Weekly sentiment:** Rolling 7-day trend analysis
- **Monthly sentiment:** Broader macro outlook
- Each includes:
  - Bullish / Bearish / Neutral score (visual gauge)
  - Key drivers (bullet points explaining why)
  - Confidence level
  - Risk factors to watch

### 4. TradingView Integration
- **Ticker tape banner** across top of dashboard showing live prices for watchlist assets
- **Advanced chart widget** embedded below ticker with full interactivity:
  - Candlestick/line charts with multiple timeframes
  - Built-in indicators (MA, RSI, MACD, etc.)
  - Drawing tools
  - Auto-switches symbol when asset is changed via dropdown
- Both widgets are free, require no API key, and show real-time data

### 5. Asset Selector
- Dropdown to switch between instruments
- Starting with XAUUSD only
- Designed to expand to: EURUSD, GBPJPY, XAGUSD, XTIUSD, S&P500, NASDAQ

### 5. Authentication
- NextAuth with GitHub OAuth (easy setup)
- User preferences saved (default asset, theme)

## Implementation Phases

### Phase 1: Project Scaffolding
- Initialize Next.js 14 with App Router
- Set up Tailwind CSS
- Set up Prisma with SQLite
- Configure environment variables structure
- Create basic layout with nav and asset dropdown

### Phase 2: Data Layer
- Implement API route for news fetching (NewsAPI)
- Implement API route for economic calendar (FinnHub)
- Integrate TradingView advanced chart + ticker tape widgets
- Add server-side caching to reduce API calls
- Create TypeScript types for all data models

### Phase 3: Dashboard UI
- News feed component with filtering and categorization
- Economic calendar component with impact indicators
- TradingView chart + ticker tape integration
- Responsive layout for the dashboard

### Phase 4: AI Sentiment Engine
- Integrate Claude API via Anthropic SDK
- Build prompt engineering for sentiment analysis
- Create sentiment display components (gauges, summaries)
- Implement daily/weekly/monthly sentiment views
- Cache sentiment results to avoid redundant API calls

### Phase 5: Authentication & User Features
- Set up NextAuth with GitHub provider
- Create user preferences model in Prisma
- Build settings page
- Protect routes and API endpoints

### Phase 6: Polish & Expand
- Error handling and loading states
- Mobile responsiveness
- Add more assets beyond XAUUSD
- Rate limit protection for free API tiers

## Environment Variables Required
```
# Auth
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000
GITHUB_ID=
GITHUB_SECRET=

# APIs
NEWS_API_KEY=           # from newsapi.org
# TradingView - no key needed (free widgets)
FINNHUB_API_KEY=        # from finnhub.io
ANTHROPIC_API_KEY=      # from console.anthropic.com
```

## File Structure (Planned)
```
market-sentiment-app/
├── prisma/
│   └── schema.prisma
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── page.tsx              # Main dashboard
│   │   ├── login/page.tsx
│   │   ├── settings/page.tsx
│   │   └── api/
│   │       ├── auth/[...nextauth]/route.ts
│   │       ├── news/route.ts
│   │       ├── calendar/route.ts
│   │       ├── # (prices handled client-side via TradingView widgets)
│   │       └── sentiment/route.ts
│   ├── components/
│   │   ├── layout/
│   │   │   ├── Header.tsx
│   │   │   ├── AssetSelector.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── news/
│   │   │   ├── NewsFeed.tsx
│   │   │   └── NewsCard.tsx
│   │   ├── calendar/
│   │   │   ├── EconomicCalendar.tsx
│   │   │   └── EventRow.tsx
│   │   ├── sentiment/
│   │   │   ├── SentimentDashboard.tsx
│   │   │   ├── SentimentGauge.tsx
│   │   │   └── SentimentSummary.tsx
│   │   └── tradingview/
│   │       ├── TickerTape.tsx      # Scrolling price banner
│   │       └── AdvancedChart.tsx   # Full interactive chart
│   ├── lib/
│   │   ├── prisma.ts
│   │   ├── auth.ts
│   │   ├── api/
│   │   │   ├── newsapi.ts
│   │   │   ├── tradingview.ts      # Widget config helpers
│   │   │   ├── finnhub.ts
│   │   │   └── anthropic.ts
│   │   ├── cache.ts
│   │   └── assets.ts             # Asset definitions & config
│   └── types/
│       ├── news.ts
│       ├── calendar.ts
│       ├── sentiment.ts
│       └── assets.ts
├── .env.local
├── tailwind.config.ts
├── package.json
└── tsconfig.json
```
