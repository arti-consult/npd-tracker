"use client";

import { ProductWithScores } from "@/lib/types";
import { QUADRANT_COLORS } from "@/lib/scoring";

interface StatsBarProps {
  products: ProductWithScores[];
}

export default function StatsBar({ products }: StatsBarProps) {
  const quadrantCounts = {
    "Launch Pad": products.filter((p) => p.quadrant === "Launch Pad").length,
    "Low Hanging Fruit": products.filter((p) => p.quadrant === "Low Hanging Fruit").length,
    "Alpha Test": products.filter((p) => p.quadrant === "Alpha Test").length,
    "Do Not Pursue": products.filter((p) => p.quadrant === "Do Not Pursue").length,
  };

  const avgFeasibility = products.length > 0 ? products.reduce((acc, p) => acc + p.feasibilityScore, 0) / products.length : 0;
  const avgAttractiveness = products.length > 0 ? products.reduce((acc, p) => acc + p.attractivenessScore, 0) / products.length : 0;
  const topProduct = products.length > 0 ? [...products].sort((a, b) => b.fourBlockScore - a.fourBlockScore)[0] : null;

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5">
        <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">Totalt produkter</span>
        <p className="text-3xl font-bold text-[var(--text-primary)] mt-1">{products.length}</p>
        <div className="flex gap-2 mt-3">
          {(Object.entries(quadrantCounts) as [string, number][]).map(([q, count]) => (
            count > 0 && (
              <span key={q} className="text-[10px] px-1.5 py-0.5 rounded" style={{ color: QUADRANT_COLORS[q as keyof typeof QUADRANT_COLORS], backgroundColor: `${QUADRANT_COLORS[q as keyof typeof QUADRANT_COLORS]}15` }}>
                {count}
              </span>
            )
          ))}
        </div>
      </div>
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5">
        <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">Snitt gjennomforbarhet</span>
        <p className="text-3xl font-bold text-[var(--text-primary)] mt-1 tabular-nums">{(avgFeasibility * 100).toFixed(0)}%</p>
      </div>
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5">
        <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">Snitt attraktivitet</span>
        <p className="text-3xl font-bold text-[var(--text-primary)] mt-1 tabular-nums">{(avgAttractiveness * 100).toFixed(0)}%</p>
      </div>
      <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5">
        <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">Toppprodukt</span>
        <p className="text-lg font-bold text-[var(--text-primary)] mt-1 truncate">{topProduct?.name || "—"}</p>
        {topProduct && (
          <span className="text-xs font-mono tabular-nums" style={{ color: QUADRANT_COLORS[topProduct.quadrant] }}>
            {topProduct.fourBlockScore.toFixed(2)}
          </span>
        )}
      </div>
    </div>
  );
}
