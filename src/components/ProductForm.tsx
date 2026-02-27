"use client";

import { useState } from "react";
import { Product, ALL_MARKETS, Market, FEASIBILITY_CRITERIA, ATTRACTIVENESS_CRITERIA, QUADRANT_LABELS } from "@/lib/types";
import { enrichProduct } from "@/lib/scoring";
import ScoreSlider from "./ScoreSlider";
import { QUADRANT_COLORS } from "@/lib/scoring";

interface ProductFormProps {
  product?: Product;
  onSave: (data: Omit<Product, "id" | "createdAt" | "updatedAt">) => void;
  onCancel: () => void;
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [name, setName] = useState(product?.name || "");
  const [description, setDescription] = useState(product?.description || "");
  const [owner, setOwner] = useState(product?.owner || "");
  const [isOngoing, setIsOngoing] = useState(product?.isOngoing || false);
  const [isNew, setIsNew] = useState(product?.isNew ?? true);
  const [isDerivative, setIsDerivative] = useState(product?.isDerivative || false);
  const [markets, setMarkets] = useState<Market[]>(product?.markets || []);
  const [comments, setComments] = useState(product?.comments || "");

  const [feasibility, setFeasibility] = useState(
    product?.feasibility || { clearlyDefined: 3, marketKnowledge: 3, technologyMatch: 3, technicalDifficulty: 3 }
  );
  const [attractiveness, setAttractiveness] = useState(
    product?.attractiveness || { estimatedRevenue: 3, productLifeCycle: 3, competitiveAdvantage: 3, profitability: 3, estimatedInvestment: 3 }
  );

  const [step, setStep] = useState(0);

  const toggleMarket = (m: Market) => {
    setMarkets((prev) => (prev.includes(m) ? prev.filter((x) => x !== m) : [...prev, m]));
  };

  const preview = enrichProduct({
    id: product?.id || "preview",
    name: name || "Preview",
    description,
    owner,
    isOngoing,
    isNew,
    isDerivative,
    markets,
    feasibility,
    attractiveness,
    comments,
    createdAt: product?.createdAt || "",
    updatedAt: "",
  });

  const handleSubmit = () => {
    if (!name.trim()) return;
    onSave({
      name: name.trim(),
      description,
      owner,
      isOngoing,
      isNew,
      isDerivative,
      markets,
      feasibility,
      attractiveness,
      comments,
    });
  };

  const steps = ["Detaljer", "Gjennomforbarhet", "Attraktivitet", "Oppsummering"];

  return (
    <div className="max-w-3xl mx-auto">
      {/* Step indicator */}
      <div className="flex items-center gap-2 mb-8">
        {steps.map((s, i) => (
          <button
            key={s}
            onClick={() => setStep(i)}
            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
              i === step ? "bg-[var(--text-primary)] text-[var(--text-inverse)]" : i < step ? "bg-[var(--bg-tag)] text-emerald-400" : "bg-[var(--bg-card)] text-[var(--text-tertiary)]"
            }`}
          >
            <span
              className={`w-5 h-5 rounded-full flex items-center justify-center text-xs ${
                i < step ? "bg-emerald-500 text-white" : i === step ? "bg-[var(--bg-primary)] text-[var(--text-primary)]" : "bg-[var(--bg-hover)] text-[var(--text-tertiary)]"
              }`}
            >
              {i < step ? "✓" : i + 1}
            </span>
            {s}
          </button>
        ))}
      </div>

      {/* Live score preview bar */}
      <div className="mb-6 p-4 rounded-xl bg-[var(--bg-card)] border border-[var(--border-primary)] flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">Gjennomforbarhet</span>
            <p className="text-lg font-bold text-[var(--text-primary)] tabular-nums">{(preview.feasibilityScore * 100).toFixed(0)}%</p>
          </div>
          <div className="w-px h-8 bg-[var(--border-secondary)]" />
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">Attraktivitet</span>
            <p className="text-lg font-bold text-[var(--text-primary)] tabular-nums">{(preview.attractivenessScore * 100).toFixed(0)}%</p>
          </div>
          <div className="w-px h-8 bg-[var(--border-secondary)]" />
          <div>
            <span className="text-[10px] uppercase tracking-wider text-[var(--text-tertiary)]">4-Block-poeng</span>
            <p className="text-lg font-bold text-[var(--text-primary)] tabular-nums">{preview.fourBlockScore.toFixed(2)}</p>
          </div>
        </div>
        <div
          className="px-3 py-1.5 rounded-full text-xs font-semibold"
          style={{
            color: QUADRANT_COLORS[preview.quadrant],
            backgroundColor: `${QUADRANT_COLORS[preview.quadrant]}15`,
            border: `1px solid ${QUADRANT_COLORS[preview.quadrant]}30`,
          }}
        >
          {QUADRANT_LABELS[preview.quadrant]}
        </div>
      </div>

      {/* Step 0: Detaljer */}
      {step === 0 && (
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Produktnavn *</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="f.eks. Notably v2.0"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-secondary)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Beskrivelse</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Kort beskrivelse av produktideen..."
              rows={3}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-secondary)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-transparent resize-none"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Eier</label>
            <input
              type="text"
              value={owner}
              onChange={(e) => setOwner(e.target.value)}
              placeholder="Team eller ansvarlig person"
              className="w-full bg-[var(--bg-input)] border border-[var(--border-secondary)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">Produkttype</label>
            <div className="flex gap-3">
              {[
                { label: "Ny", checked: isNew, onChange: () => setIsNew(!isNew) },
                { label: "Pågående", checked: isOngoing, onChange: () => setIsOngoing(!isOngoing) },
                { label: "Derivat", checked: isDerivative, onChange: () => setIsDerivative(!isDerivative) },
              ].map((opt) => (
                <button
                  key={opt.label}
                  onClick={opt.onChange}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    opt.checked ? "bg-[var(--text-primary)] text-[var(--text-inverse)]" : "bg-[var(--bg-input)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-3">Målmarkeder</label>
            <div className="flex flex-wrap gap-2">
              {ALL_MARKETS.map((m) => (
                <button
                  key={m}
                  onClick={() => toggleMarket(m)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    markets.includes(m) ? "bg-[var(--text-primary)] text-[var(--text-inverse)]" : "bg-[var(--bg-input)] text-[var(--text-secondary)] hover:bg-[var(--bg-hover)]"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">Kommentarer</label>
            <textarea
              value={comments}
              onChange={(e) => setComments(e.target.value)}
              placeholder="Tilleggsnotater eller kommentarer..."
              rows={2}
              className="w-full bg-[var(--bg-input)] border border-[var(--border-secondary)] rounded-xl px-4 py-3 text-[var(--text-primary)] placeholder-[var(--text-muted)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]/30 focus:border-transparent resize-none"
            />
          </div>
        </div>
      )}

      {/* Step 1: Feasibility Scoring */}
      {step === 1 && (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Gjennomforbarhetsvurdering</h3>
            <p className="text-sm text-[var(--text-tertiary)]">Vurder hvert kriterium fra 1 (lav) til 5 (høy)</p>
          </div>
          {FEASIBILITY_CRITERIA.map((criterion) => (
            <ScoreSlider
              key={criterion.key}
              value={feasibility[criterion.key]}
              onChange={(v) => setFeasibility({ ...feasibility, [criterion.key]: v })}
              label={criterion.label}
              description={criterion.description}
              low={criterion.low}
              high={criterion.high}
            />
          ))}
        </div>
      )}

      {/* Step 2: Attractiveness Scoring */}
      {step === 2 && (
        <div className="space-y-8">
          <div>
            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-1">Attraktivitetsvurdering</h3>
            <p className="text-sm text-[var(--text-tertiary)]">Vurder hvert kriterium fra 1 (lav) til 5 (høy)</p>
          </div>
          {ATTRACTIVENESS_CRITERIA.map((criterion) => (
            <ScoreSlider
              key={criterion.key}
              value={attractiveness[criterion.key]}
              onChange={(v) => setAttractiveness({ ...attractiveness, [criterion.key]: v })}
              label={criterion.label}
              description={criterion.description}
              low={criterion.low}
              high={criterion.high}
            />
          ))}
        </div>
      )}

      {/* Step 3: Review */}
      {step === 3 && (
        <div className="space-y-6">
          <h3 className="text-lg font-semibold text-[var(--text-primary)]">Gjennomgang og innsending</h3>

          <div className="grid grid-cols-2 gap-6">
            <div className="bg-[var(--bg-card)] rounded-xl p-5 border border-[var(--border-primary)]">
              <h4 className="text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-3">Produktinfo</h4>
              <p className="text-[var(--text-primary)] font-medium">{name || "Uten navn"}</p>
              <p className="text-sm text-[var(--text-secondary)] mt-1">{description || "Ingen beskrivelse"}</p>
              <p className="text-sm text-[var(--text-tertiary)] mt-2">Eier: {owner || "—"}</p>
              <div className="flex flex-wrap gap-1 mt-3">
                {markets.map((m) => (
                  <span key={m} className="text-[10px] px-2 py-0.5 rounded bg-[var(--bg-hover)] text-[var(--text-secondary)]">{m}</span>
                ))}
              </div>
            </div>

            <div className="bg-[var(--bg-card)] rounded-xl p-5 border border-[var(--border-primary)] space-y-4">
              <h4 className="text-xs uppercase tracking-wider text-[var(--text-tertiary)] mb-3">Poeng</h4>
              <div className="grid grid-cols-2 gap-4">
                {FEASIBILITY_CRITERIA.map((c) => (
                  <div key={c.key}>
                    <span className="text-xs text-[var(--text-tertiary)]">{c.label}</span>
                    <p className="text-[var(--text-primary)] font-medium">{feasibility[c.key]}/5</p>
                  </div>
                ))}
              </div>
              <div className="border-t border-[var(--border-secondary)] pt-3">
                <div className="grid grid-cols-2 gap-4">
                  {ATTRACTIVENESS_CRITERIA.map((c) => (
                    <div key={c.key}>
                      <span className="text-xs text-[var(--text-tertiary)]">{c.label}</span>
                      <p className="text-[var(--text-primary)] font-medium">{attractiveness[c.key]}/5</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation */}
      <div className="flex justify-between mt-10 pt-6 border-t border-[var(--border-primary)]">
        <button
          onClick={step === 0 ? onCancel : () => setStep(step - 1)}
          className="px-5 py-2.5 rounded-xl text-sm font-medium text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors bg-[var(--bg-card)] hover:bg-[var(--bg-hover)]"
        >
          {step === 0 ? "Avbryt" : "Tilbake"}
        </button>
        {step < 3 ? (
          <button
            onClick={() => setStep(step + 1)}
            className="px-6 py-2.5 rounded-xl text-sm font-medium bg-[var(--text-primary)] text-[var(--text-inverse)] hover:opacity-80 transition-opacity"
          >
            Neste
          </button>
        ) : (
          <button
            onClick={handleSubmit}
            disabled={!name.trim()}
            className="px-6 py-2.5 rounded-xl text-sm font-medium bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            {product ? "Oppdater produkt" : "Legg til produkt"}
          </button>
        )}
      </div>
    </div>
  );
}
