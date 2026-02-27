"use client";

interface ScoreSliderProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
  description: string;
  low: string;
  high: string;
}

const SCORE_LABELS = ["", "1", "2", "3", "4", "5"];

export default function ScoreSlider({ value, onChange, label, description, low, high }: ScoreSliderProps) {
  const pct = ((value - 1) / 4) * 100;
  const hue = pct * 1.2;

  return (
    <div className="space-y-3">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h4 className="text-sm font-medium text-[var(--text-primary)]">{label}</h4>
          <p className="text-xs text-[var(--text-tertiary)] mt-0.5">{description}</p>
        </div>
        <div
          className="text-lg font-bold tabular-nums min-w-[2.5rem] text-center rounded-lg px-2 py-0.5"
          style={{ color: `hsl(${hue}, 70%, 55%)`, backgroundColor: `hsl(${hue}, 70%, 55%, 0.1)` }}
        >
          {value}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((score) => (
            <button
              key={score}
              onClick={() => onChange(score)}
              className={`
                flex-1 h-10 rounded-lg text-sm font-medium transition-all duration-200
                ${
                  score === value
                    ? "ring-2 shadow-lg scale-105"
                    : "hover:bg-[var(--bg-hover)] bg-[var(--bg-input)]"
                }
              `}
              style={
                score === value
                  ? {
                      backgroundColor: `hsl(${((score - 1) / 4) * 120}, 70%, 55%, 0.2)`,
                      color: `hsl(${((score - 1) / 4) * 120}, 70%, 55%)`,
                      borderColor: `hsl(${((score - 1) / 4) * 120}, 70%, 55%)`,
                      boxShadow: `0 0 20px hsl(${((score - 1) / 4) * 120}, 70%, 55%, 0.15)`,
                    }
                  : { color: "var(--text-secondary)" }
              }
            >
              {SCORE_LABELS[score]}
            </button>
          ))}
        </div>
        <div className="flex justify-between text-[10px] text-[var(--text-muted)] px-1">
          <span>{low}</span>
          <span>{high}</span>
        </div>
      </div>
    </div>
  );
}
