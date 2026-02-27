"use client";

import { ProductWithScores, QUADRANT_LABELS } from "@/lib/types";
import { QUADRANT_COLORS } from "@/lib/scoring";

interface ProductTableProps {
  products: ProductWithScores[];
  onProductClick: (id: string) => void;
  onDelete: (id: string) => void;
}

function QuadrantBadge({ quadrant }: { quadrant: string }) {
  const color = QUADRANT_COLORS[quadrant as keyof typeof QUADRANT_COLORS] || "#6b7280";
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium"
      style={{ backgroundColor: `${color}15`, color, border: `1px solid ${color}30` }}
    >
      <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: color }} />
      {QUADRANT_LABELS[quadrant as keyof typeof QUADRANT_LABELS] || quadrant}
    </span>
  );
}

function ScoreBar({ value, max = 1 }: { value: number; max?: number }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  const hue = pct * 1.2;
  return (
    <div className="flex items-center gap-2">
      <div className="w-16 h-1.5 bg-[var(--bg-tag)] rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all duration-500" style={{ width: `${pct}%`, backgroundColor: `hsl(${hue}, 70%, 50%)` }} />
      </div>
      <span className="text-xs text-[var(--text-secondary)] tabular-nums w-10">{(value * 100).toFixed(0)}%</span>
    </div>
  );
}

export default function ProductTable({ products, onProductClick, onDelete }: ProductTableProps) {
  const sorted = [...products].sort((a, b) => b.fourBlockScore - a.fourBlockScore);

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-[var(--border-primary)]">
            <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium text-xs uppercase tracking-wider">#</th>
            <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium text-xs uppercase tracking-wider">Produkt</th>
            <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium text-xs uppercase tracking-wider">Eier</th>
            <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium text-xs uppercase tracking-wider">Marked</th>
            <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium text-xs uppercase tracking-wider">Gjennomforbarhet</th>
            <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium text-xs uppercase tracking-wider">Attraktivitet</th>
            <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium text-xs uppercase tracking-wider">Kvadrant</th>
            <th className="text-left py-3 px-4 text-[var(--text-secondary)] font-medium text-xs uppercase tracking-wider">Poeng</th>
            <th className="py-3 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((p, i) => (
            <tr
              key={p.id}
              onClick={() => onProductClick(p.id)}
              className="border-b border-[var(--border-primary)]/50 hover:bg-[var(--bg-row-hover)] cursor-pointer transition-colors"
            >
              <td className="py-3 px-4 text-[var(--text-tertiary)] tabular-nums">{i + 1}</td>
              <td className="py-3 px-4">
                <div>
                  <span className="font-medium text-[var(--text-primary)]">{p.name}</span>
                  {p.isNew && (
                    <span className="ml-2 text-[10px] font-semibold uppercase tracking-wider text-emerald-400 bg-emerald-400/10 px-1.5 py-0.5 rounded">
                      Ny
                    </span>
                  )}
                </div>
                {p.description && <p className="text-xs text-[var(--text-tertiary)] mt-0.5 max-w-xs truncate">{p.description}</p>}
              </td>
              <td className="py-3 px-4 text-[var(--text-secondary)]">{p.owner || "—"}</td>
              <td className="py-3 px-4">
                <div className="flex flex-wrap gap-1">
                  {p.markets.slice(0, 2).map((m) => (
                    <span key={m} className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tag)] text-[var(--text-secondary)]">
                      {m}
                    </span>
                  ))}
                  {p.markets.length > 2 && (
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-[var(--bg-tag)] text-[var(--text-secondary)]">+{p.markets.length - 2}</span>
                  )}
                </div>
              </td>
              <td className="py-3 px-4">
                <ScoreBar value={p.feasibilityScore} />
              </td>
              <td className="py-3 px-4">
                <ScoreBar value={p.attractivenessScore} />
              </td>
              <td className="py-3 px-4">
                <QuadrantBadge quadrant={p.quadrant} />
              </td>
              <td className="py-3 px-4">
                <span className="text-[var(--text-primary)] font-mono font-medium">{p.fourBlockScore.toFixed(2)}</span>
              </td>
              <td className="py-3 px-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(p.id);
                  }}
                  className="text-[var(--text-muted)] hover:text-red-400 transition-colors p-1"
                  title="Slett"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
          {sorted.length === 0 && (
            <tr>
              <td colSpan={9} className="text-center py-12 text-[var(--text-tertiary)]">
                Ingen produkter ennå. Legg til din første produktidé for å komme i gang.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
