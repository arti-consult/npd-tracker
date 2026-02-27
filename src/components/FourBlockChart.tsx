"use client";

import { ProductWithScores, QUADRANT_LABELS } from "@/lib/types";
import { QUADRANT_COLORS } from "@/lib/scoring";
import { ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine, ReferenceArea, Label } from "recharts";

interface FourBlockChartProps {
  products: ProductWithScores[];
  onProductClick?: (id: string) => void;
}

function CustomTooltip({ active, payload }: { active?: boolean; payload?: Array<{ payload: ProductWithScores }> }) {
  if (!active || !payload?.length) return null;
  const p = payload[0].payload;
  return (
    <div className="border rounded-lg px-4 py-3 shadow-xl" style={{ backgroundColor: "var(--bg-primary)", borderColor: "var(--border-secondary)" }}>
      <p className="font-semibold text-[var(--text-primary)] text-sm">{p.name}</p>
      <p className="text-xs mt-1" style={{ color: QUADRANT_COLORS[p.quadrant] }}>
        {QUADRANT_LABELS[p.quadrant]}
      </p>
      <div className="mt-2 space-y-1 text-xs text-[var(--text-secondary)]">
        <p>Gjennomforbarhet: {(p.feasibilityScore * 100).toFixed(0)}%</p>
        <p>Attraktivitet: {(p.attractivenessScore * 100).toFixed(0)}%</p>
        <p>4-Block-poeng: {p.fourBlockScore.toFixed(2)}</p>
      </div>
    </div>
  );
}

function CustomDot(props: { cx?: number; cy?: number; payload?: ProductWithScores }) {
  const { cx, cy, payload: p } = props;
  if (cx == null || cy == null || !p) return <g />;
  const color = QUADRANT_COLORS[p.quadrant];
  return (
    <g>
      <circle cx={cx} cy={cy} r={22} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={5} fill={color} />
      <text x={cx} y={cy - 28} textAnchor="middle" fill="var(--chart-label)" fontSize={11} fontWeight={500}>
        {p.name}
      </text>
    </g>
  );
}

export default function FourBlockChart({ products, onProductClick }: FourBlockChartProps) {
  const data = products.map((p) => ({
    ...p,
    x: p.feasibilityScore,
    y: p.attractivenessScore,
  }));

  return (
    <div className="w-full h-[500px] relative">
      <ResponsiveContainer width="100%" height="100%">
        <ScatterChart margin={{ top: 30, right: 30, bottom: 40, left: 40 }}>
          {/* Quadrant backgrounds */}
          <ReferenceArea x1={0.5} x2={1.05} y1={0.5} y2={1.05} fill="rgba(34, 197, 94, 0.06)" />
          <ReferenceArea x1={-0.3} x2={0.5} y1={0.5} y2={1.05} fill="rgba(59, 130, 246, 0.06)" />
          <ReferenceArea x1={0.5} x2={1.05} y1={-0.3} y2={0.5} fill="rgba(245, 158, 11, 0.06)" />
          <ReferenceArea x1={-0.3} x2={0.5} y1={-0.3} y2={0.5} fill="rgba(239, 68, 68, 0.06)" />

          <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
          <XAxis
            type="number"
            dataKey="x"
            domain={[-0.05, 1.05]}
            tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
            stroke="var(--chart-axis)"
            fontSize={11}
          >
            <Label value="Gjennomførbarhet" position="bottom" offset={15} style={{ fill: "var(--chart-axis-label)", fontSize: 13, fontWeight: 500 }} />
          </XAxis>
          <YAxis
            type="number"
            dataKey="y"
            domain={[-0.05, 1.05]}
            tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
            stroke="var(--chart-axis)"
            fontSize={11}
          >
            <Label value="Attraktivitet" angle={-90} position="left" offset={15} style={{ fill: "var(--chart-axis-label)", fontSize: 13, fontWeight: 500 }} />
          </YAxis>

          {/* Center lines */}
          <ReferenceLine x={0.5} stroke="var(--chart-ref)" strokeDasharray="6 4" />
          <ReferenceLine y={0.5} stroke="var(--chart-ref)" strokeDasharray="6 4" />

          <Tooltip content={<CustomTooltip />} />

          <Scatter
            data={data}
            onClick={(entry) => onProductClick?.(entry.id)}
            cursor="pointer"
            shape={<CustomDot />}
          />
        </ScatterChart>
      </ResponsiveContainer>

      {/* Quadrant labels */}
      <div className="absolute top-8 right-10 text-xs font-medium" style={{ color: QUADRANT_COLORS["Launch Pad"] }}>
        Lanseringsrampe
      </div>
      <div className="absolute top-8 left-14 text-xs font-medium" style={{ color: QUADRANT_COLORS["Alpha Test"] }}>
        Alfatest
      </div>
      <div className="absolute bottom-12 right-10 text-xs font-medium" style={{ color: QUADRANT_COLORS["Low Hanging Fruit"] }}>
        Lavthengende frukt
      </div>
      <div className="absolute bottom-12 left-14 text-xs font-medium" style={{ color: QUADRANT_COLORS["Do Not Pursue"] }}>
        Ikke prioriter
      </div>
    </div>
  );
}
