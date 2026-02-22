import Anthropic from "@anthropic-ai/sdk";
import { SentimentResponse, SentimentAnalysis } from "@/types/sentiment";
import { NewsArticle } from "@/types/news";
import { EconomicEvent } from "@/types/calendar";
import { Asset } from "@/types/assets";

// Lazy client — ensures API key is read at call time, not at module load time.
// Creating the client at module scope can cause it to capture an empty key
// if the module is evaluated before Next.js has loaded .env files.
function getClient(apiKey: string): Anthropic {
  return new Anthropic({ apiKey });
}

function buildPrompt(
  asset: Asset,
  news: NewsArticle[],
  events: EconomicEvent[]
): string {
  const newsSection = news.length > 0
    ? news
        .slice(0, 20)
        .map(
          (n) =>
            `- [${n.category}] ${n.title} (${n.source}, ${new Date(n.publishedAt).toLocaleDateString()})`
        )
        .join("\n")
    : "No recent news available.";

  const calendarSection = events.length > 0
    ? events
        .slice(0, 15)
        .map(
          (e) =>
            `- [${e.country}] ${e.event} | Impact: ${e.impact} | Forecast: ${e.forecast ?? "N/A"} | Actual: ${e.actual ?? "Pending"} | Previous: ${e.previous ?? "N/A"}`
        )
        .join("\n")
    : "No recent economic events available.";

  return `You are an expert financial analyst specializing in ${asset.symbol} (${asset.name}) market analysis.

Analyze the following recent news headlines and economic calendar events to generate market sentiment for ${asset.symbol}.

## Recent News (Last 24 Hours)
${newsSection}

## Economic Calendar (Recent & Upcoming)
${calendarSection}

## Instructions
Provide a JSON response with sentiment analysis for three timeframes: daily, weekly, and monthly.

For each timeframe, provide:
- **direction**: "bullish", "bearish", or "neutral"
- **score**: A number from -100 (extremely bearish) to +100 (extremely bullish)
- **confidence**: 0-100 indicating how confident you are in this assessment
- **summary**: 1-2 sentence summary of the outlook
- **keyDrivers**: Array of 3-5 key factors driving the sentiment
- **riskFactors**: Array of 2-3 risk factors to watch

Consider:
- For ${asset.symbol}: how do the news events, economic data, and geopolitical factors impact this specific market?
- Central bank policy implications
- Risk-on vs risk-off sentiment
- Supply/demand dynamics where relevant
- Technical market context if evident from news

Respond ONLY with valid JSON in this exact format:
{
  "daily": {
    "direction": "bullish|bearish|neutral",
    "score": <number>,
    "confidence": <number>,
    "summary": "<string>",
    "keyDrivers": ["<string>", ...],
    "riskFactors": ["<string>", ...]
  },
  "weekly": { ... same format ... },
  "monthly": { ... same format ... }
}`;
}

export async function generateSentiment(
  asset: Asset,
  news: NewsArticle[],
  events: EconomicEvent[]
): Promise<SentimentResponse> {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("[Sentiment] ANTHROPIC_API_KEY is not set in environment");
    return createFallbackResponse(
      asset,
      "ANTHROPIC_API_KEY is not configured. Add it to your .env file."
    );
  }

  console.log(
    `[Sentiment] Calling Claude for ${asset.symbol} (key: ${apiKey.substring(0, 12)}..., news: ${news.length}, events: ${events.length})`
  );

  try {
    const client = getClient(apiKey);
    const prompt = buildPrompt(asset, news, events);

    const message = await client.messages.create({
      model: "claude-sonnet-4-20250514",
      max_tokens: 1500,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText =
      message.content[0].type === "text" ? message.content[0].text : "";

    // Extract JSON from the response
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      console.error("[Sentiment] No JSON in Claude response:", responseText.substring(0, 200));
      return createFallbackResponse(
        asset,
        "Claude returned an unexpected response format. Try refreshing."
      );
    }

    const parsed = JSON.parse(jsonMatch[0]);
    const now = new Date().toISOString();

    console.log(
      `[Sentiment] Success: daily=${parsed.daily.direction}(${parsed.daily.score}), weekly=${parsed.weekly.direction}(${parsed.weekly.score}), monthly=${parsed.monthly.direction}(${parsed.monthly.score})`
    );

    return {
      asset: asset.id,
      daily: {
        timeframe: "daily",
        score: {
          direction: parsed.daily.direction,
          score: parsed.daily.score,
          confidence: parsed.daily.confidence,
        },
        summary: parsed.daily.summary,
        keyDrivers: parsed.daily.keyDrivers,
        riskFactors: parsed.daily.riskFactors,
        generatedAt: now,
      },
      weekly: {
        timeframe: "weekly",
        score: {
          direction: parsed.weekly.direction,
          score: parsed.weekly.score,
          confidence: parsed.weekly.confidence,
        },
        summary: parsed.weekly.summary,
        keyDrivers: parsed.weekly.keyDrivers,
        riskFactors: parsed.weekly.riskFactors,
        generatedAt: now,
      },
      monthly: {
        timeframe: "monthly",
        score: {
          direction: parsed.monthly.direction,
          score: parsed.monthly.score,
          confidence: parsed.monthly.confidence,
        },
        summary: parsed.monthly.summary,
        keyDrivers: parsed.monthly.keyDrivers,
        riskFactors: parsed.monthly.riskFactors,
        generatedAt: now,
      },
      generatedAt: now,
    };
  } catch (error: unknown) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("[Sentiment] Claude API error:", errorMessage);

    if (errorMessage.includes("credit balance") || errorMessage.includes("billing")) {
      return createFallbackResponse(
        asset,
        "AI analysis unavailable — Anthropic API account has insufficient credits."
      );
    }
    if (errorMessage.includes("authentication") || errorMessage.includes("401") || errorMessage.includes("api_key")) {
      return createFallbackResponse(
        asset,
        "AI analysis unavailable — invalid API key. Check your ANTHROPIC_API_KEY."
      );
    }
    return createFallbackResponse(
      asset,
      `AI analysis temporarily unavailable — ${errorMessage}`
    );
  }
}

function createFallbackResponse(asset: Asset, message?: string): SentimentResponse {
  const now = new Date().toISOString();
  const fallback: SentimentAnalysis = {
    timeframe: "daily",
    score: { direction: "neutral", score: 0, confidence: 0 },
    summary:
      message ?? "Sentiment analysis unavailable. Please check your ANTHROPIC_API_KEY configuration.",
    keyDrivers: ["API key not configured or API error occurred"],
    riskFactors: ["Unable to assess risk factors without AI analysis"],
    generatedAt: now,
  };

  return {
    asset: asset.id,
    daily: { ...fallback, timeframe: "daily" },
    weekly: { ...fallback, timeframe: "weekly" },
    monthly: { ...fallback, timeframe: "monthly" },
    generatedAt: now,
  };
}
