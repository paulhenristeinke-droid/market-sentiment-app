"use client";

import { Asset } from "@/types/assets";
import AssetSelector from "./AssetSelector";

interface HeaderProps {
  selectedAssetId: string;
  onAssetChange: (asset: Asset) => void;
}

export default function Header({ selectedAssetId, onAssetChange }: HeaderProps) {
  return (
    <header className="border-b border-[var(--card-border)] bg-[var(--card-bg)]">
      <div className="max-w-[1920px] mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-lg font-bold text-[var(--foreground)]">
            <span className="text-[var(--accent-blue)]">Market</span>Pulse
          </h1>
          <div className="h-6 w-px bg-[var(--card-border)]" />
          <AssetSelector
            selectedAssetId={selectedAssetId}
            onAssetChange={onAssetChange}
          />
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-[var(--text-muted)]">
            AI-Powered Sentiment
          </span>
        </div>
      </div>
    </header>
  );
}
