"use client";

import { ASSETS } from "@/types/assets";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SettingsPage() {
  const router = useRouter();
  const [defaultAsset, setDefaultAsset] = useState("xauusd");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // In a full implementation, this would save to the database via API
    localStorage.setItem("defaultAsset", defaultAsset);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[var(--background)]">
      <div className="max-w-2xl mx-auto p-6">
        <button
          onClick={() => router.push("/")}
          className="text-sm text-[var(--accent-blue)] hover:underline mb-6 inline-block"
        >
          &larr; Back to Dashboard
        </button>

        <h1 className="text-2xl font-bold text-[var(--foreground)] mb-6">
          Settings
        </h1>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">
            Preferences
          </h2>

          <div className="space-y-4">
            <div>
              <label className="text-xs text-[var(--text-muted)] block mb-1">
                Default Asset
              </label>
              <select
                value={defaultAsset}
                onChange={(e) => setDefaultAsset(e.target.value)}
                className="bg-[var(--background)] border border-[var(--card-border)] text-[var(--foreground)] rounded-lg px-3 py-2 text-sm w-full"
              >
                {ASSETS.map((asset) => (
                  <option key={asset.id} value={asset.id}>
                    {asset.symbol} — {asset.name}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSave}
              className="bg-[var(--accent-blue)] text-white text-sm font-medium px-4 py-2 rounded-lg hover:opacity-90 transition-opacity"
            >
              {saved ? "Saved!" : "Save Preferences"}
            </button>
          </div>
        </div>

        <div className="bg-[var(--card-bg)] border border-[var(--card-border)] rounded-lg p-6 mt-4">
          <h2 className="text-sm font-semibold text-[var(--foreground)] mb-4">
            API Configuration
          </h2>
          <p className="text-xs text-[var(--text-muted)] mb-3">
            Set these environment variables in your <code className="text-[var(--accent-blue)]">.env.local</code> file:
          </p>
          <div className="space-y-2 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted)]">NEWS_API_KEY</span>
              <span className="text-[var(--accent-green)]">— newsapi.org</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted)]">FINNHUB_API_KEY</span>
              <span className="text-[var(--accent-green)]">— finnhub.io</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted)]">ANTHROPIC_API_KEY</span>
              <span className="text-[var(--accent-green)]">— console.anthropic.com</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[var(--text-muted)]">GITHUB_ID / GITHUB_SECRET</span>
              <span className="text-[var(--accent-green)]">— GitHub OAuth (optional)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
