export interface Asset {
  id: string;
  name: string;
  symbol: string;
  tradingViewSymbol: string;
  category: "forex" | "commodity" | "index";
  newsKeywords: string[];
}

export const ASSETS: Asset[] = [
  {
    id: "xauusd",
    name: "Gold / US Dollar",
    symbol: "XAUUSD",
    tradingViewSymbol: "OANDA:XAUUSD",
    category: "commodity",
    newsKeywords: [
      "gold",
      "XAUUSD",
      "gold price",
      "precious metals",
      "safe haven",
      "federal reserve",
      "inflation",
      "US dollar",
      "treasury yields",
    ],
  },
  {
    id: "eurusd",
    name: "Euro / US Dollar",
    symbol: "EURUSD",
    tradingViewSymbol: "OANDA:EURUSD",
    category: "forex",
    newsKeywords: [
      "EURUSD",
      "euro",
      "ECB",
      "eurozone",
      "US dollar",
      "federal reserve",
    ],
  },
  {
    id: "gbpjpy",
    name: "British Pound / Japanese Yen",
    symbol: "GBPJPY",
    tradingViewSymbol: "OANDA:GBPJPY",
    category: "forex",
    newsKeywords: [
      "GBPJPY",
      "pound",
      "yen",
      "Bank of England",
      "Bank of Japan",
      "BOJ",
    ],
  },
  {
    id: "xagusd",
    name: "Silver / US Dollar",
    symbol: "XAGUSD",
    tradingViewSymbol: "OANDA:XAGUSD",
    category: "commodity",
    newsKeywords: [
      "silver",
      "XAGUSD",
      "silver price",
      "precious metals",
      "industrial metals",
    ],
  },
  {
    id: "xtiusd",
    name: "Crude Oil WTI",
    symbol: "XTIUSD",
    tradingViewSymbol: "TVC:USOIL",
    category: "commodity",
    newsKeywords: [
      "crude oil",
      "WTI",
      "OPEC",
      "oil price",
      "energy",
      "petroleum",
    ],
  },
  {
    id: "sp500",
    name: "S&P 500",
    symbol: "SPX500",
    tradingViewSymbol: "FOREXCOM:SPXUSD",
    category: "index",
    newsKeywords: [
      "S&P 500",
      "SPX",
      "stock market",
      "Wall Street",
      "equities",
    ],
  },
  {
    id: "nasdaq",
    name: "NASDAQ 100",
    symbol: "NAS100",
    tradingViewSymbol: "FOREXCOM:NSXUSD",
    category: "index",
    newsKeywords: [
      "NASDAQ",
      "tech stocks",
      "technology sector",
      "big tech",
    ],
  },
];

export function getAssetById(id: string): Asset | undefined {
  return ASSETS.find((a) => a.id === id);
}

export function getDefaultAsset(): Asset {
  return ASSETS[0]; // XAUUSD
}
