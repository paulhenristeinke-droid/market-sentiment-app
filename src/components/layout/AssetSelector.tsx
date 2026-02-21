"use client";

import { ASSETS, Asset } from "@/types/assets";

interface AssetSelectorProps {
  selectedAssetId: string;
  onAssetChange: (asset: Asset) => void;
}

export default function AssetSelector({
  selectedAssetId,
  onAssetChange,
}: AssetSelectorProps) {
  return (
    <div className="relative">
      <select
        value={selectedAssetId}
        onChange={(e) => {
          const asset = ASSETS.find((a) => a.id === e.target.value);
          if (asset) onAssetChange(asset);
        }}
        className="appearance-none bg-[var(--card-bg)] border border-[var(--card-border)] text-[var(--foreground)] rounded-lg px-4 py-2 pr-10 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] focus:border-transparent cursor-pointer"
      >
        {ASSETS.map((asset) => (
          <option key={asset.id} value={asset.id}>
            {asset.symbol} — {asset.name}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3">
        <svg className="h-4 w-4 text-[var(--text-muted)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </div>
    </div>
  );
}
