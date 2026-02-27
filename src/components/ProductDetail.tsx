"use client";

import { ProductWithScores, FEASIBILITY_CRITERIA, ATTRACTIVENESS_CRITERIA, QUADRANT_LABELS } from "@/lib/types";
import { QUADRANT_COLORS } from "@/lib/scoring";
import { RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";

interface ProductDetailProps {
  product: ProductWithScores;
  onEdit: () => void;
  onBack: () => void;
}

export default function ProductDetail({ product, onEdit, onBack }: ProductDetailProps) {
  const radarData = [
    ...FEASIBILITY_CRITERIA.map((c) => ({
      subject: c.label.split(" ").slice(0, 2).join(" "),
      score: product.feasibility[c.key],
      fullMark: 5,
    })),
    ...ATTRACTIVENESS_CRITERIA.map((c) => ({
      subject: c.label.split(" ").slice(0, 2).join(" "),
      score: product.attractiveness[c.key],
      fullMark: 5,
    })),
  ];

  const quadrantColor = QUADRANT_COLORS[product.quadrant];

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <button onClick={onBack} className="text-sm text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors mb-4 flex items-center gap-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Tilbake til oversikten
          </button>
          <h1 className="text-3xl font-bold text-[var(--text-primary)]">{product.name}</h1>
          {product.description && <p className="text-[var(--text-secondary)] mt-2 max-w-xl">{product.description}</p>}
          <div className="flex items-center gap-3 mt-4">
            {product.owner && <span className="text-sm text-[var(--text-tertiary)]">Eier: {product.owner}</span>}
            {product.isNew && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">Ny</span>
            )}
            {product.isOngoing && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-blue-400 bg-blue-400/10 px-2 py-0.5 rounded">Pågående</span>
            )}
            {product.isDerivative && (
              <span className="text-[10px] font-semibold uppercase tracking-wider text-amber-400 bg-amber-400/10 px-2 py-0.5 rounded">Derivat</span>
            )}
          </div>
        </div>
        <button onClick={onEdit} className="px-5 py-2.5 rounded-xl text-sm font-medium bg-[var(--text-primary)] text-[var(--text-inverse)] hover:opacity-80 transition-opacity">
          Rediger poeng
        </button>
      </div>

      {/* Score cards */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">Gjennomførbarhet</span>
          <p className="text-3xl font-bold text-[var(--text-primary)] mt-1 tabular-nums">{(product.feasibilityScore * 100).toFixed(0)}%</p>
          <div className="w-full h-1.5 bg-[var(--bg-hover)] rounded-full mt-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${product.feasibilityScore * 100}%`, backgroundColor: `hsl(${product.feasibilityScore * 120}, 70%, 50%)` }}
            />
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">Attraktivitet</span>
          <p className="text-3xl font-bold text-[var(--text-primary)] mt-1 tabular-nums">{(product.attractivenessScore * 100).toFixed(0)}%</p>
          <div className="w-full h-1.5 bg-[var(--bg-hover)] rounded-full mt-3 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-700"
              style={{ width: `${product.attractivenessScore * 100}%`, backgroundColor: `hsl(${product.attractivenessScore * 120}, 70%, 50%)` }}
            />
          </div>
        </div>
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-5">
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">4-Block-poeng</span>
          <p className="text-3xl font-bold text-[var(--text-primary)] mt-1 tabular-nums">{product.fourBlockScore.toFixed(2)}</p>
          <p className="text-xs text-[var(--text-tertiary)] mt-3">Maks: 1,41</p>
        </div>
        <div
          className="rounded-2xl p-5 border"
          style={{ backgroundColor: `${quadrantColor}08`, borderColor: `${quadrantColor}20` }}
        >
          <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">Kvadrant</span>
          <p className="text-xl font-bold mt-1" style={{ color: quadrantColor }}>
            {QUADRANT_LABELS[product.quadrant]}
          </p>
          <p className="text-xs text-[var(--text-tertiary)] mt-3">
            {product.quadrant === "Launch Pad" && "Høy gjennomførbarhet, høy attraktivitet"}
            {product.quadrant === "Low Hanging Fruit" && "Høy gjennomførbarhet, lav attraktivitet"}
            {product.quadrant === "Alpha Test" && "Lav gjennomførbarhet, høy attraktivitet"}
            {product.quadrant === "Do Not Pursue" && "Lav gjennomførbarhet, lav attraktivitet"}
          </p>
        </div>
      </div>

      {/* Radar Chart & Breakdowns */}
      <div className="grid grid-cols-2 gap-6">
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Poengprofil</h3>
          <ResponsiveContainer width="100%" height={320}>
            <RadarChart data={radarData}>
              <PolarGrid stroke="var(--chart-grid)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: "var(--chart-axis-label)", fontSize: 10 }} />
              <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: "var(--chart-axis)", fontSize: 9 }} />
              <Radar
                name="Poeng"
                dataKey="score"
                stroke={quadrantColor}
                fill={quadrantColor}
                fillOpacity={0.15}
                strokeWidth={2}
              />
            </RadarChart>
          </ResponsiveContainer>
        </div>

        <div className="space-y-6">
          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Gjennomførbarhet fordeling</h3>
            <div className="space-y-3">
              {FEASIBILITY_CRITERIA.map((c) => {
                const val = product.feasibility[c.key];
                const pct = (val / 5) * 100;
                return (
                  <div key={c.key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--text-secondary)]">{c.label}</span>
                      <span className="text-[var(--text-primary)] font-medium">{val}/5</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: `hsl(${pct * 1.2}, 70%, 50%)` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Attraktivitet fordeling</h3>
            <div className="space-y-3">
              {ATTRACTIVENESS_CRITERIA.map((c) => {
                const val = product.attractiveness[c.key];
                const pct = (val / 5) * 100;
                return (
                  <div key={c.key}>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-[var(--text-secondary)]">{c.label}</span>
                      <span className="text-[var(--text-primary)] font-medium">{val}/5</span>
                    </div>
                    <div className="w-full h-2 bg-[var(--bg-hover)] rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, backgroundColor: `hsl(${pct * 1.2}, 70%, 50%)` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Markets */}
      {product.markets.length > 0 && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Målmarkeder</h3>
          <div className="flex flex-wrap gap-2">
            {product.markets.map((m) => (
              <span key={m} className="px-3 py-1.5 rounded-lg bg-[var(--bg-hover)] text-sm text-[var(--text-secondary)]">{m}</span>
            ))}
          </div>
        </div>
      )}

      {product.comments && (
        <div className="bg-[var(--bg-card)] border border-[var(--border-primary)] rounded-2xl p-6">
          <h3 className="text-sm font-semibold text-[var(--text-primary)] mb-3">Kommentarer</h3>
          <p className="text-sm text-[var(--text-secondary)]">{product.comments}</p>
        </div>
      )}
    </div>
  );
}
