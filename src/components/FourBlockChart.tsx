"use client";

import { useRef, useState, useEffect } from "react";
import { ProductWithScores, QUADRANT_LABELS } from "@/lib/types";
import { QUADRANT_COLORS } from "@/lib/scoring";
import {
  ScatterChart,
  Scatter,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  Label,
} from "recharts";

interface FourBlockChartProps {
  products: ProductWithScores[];
  onProductClick?: (id: string) => void;
}

// Iso-score thresholds for quarter-circle curves
const ISO_SCORES = [0.3, 0.5, 0.7, 1.0];
const CHART_MARGIN = { top: 30, right: 30, bottom: 40, left: 40 };
const DOMAIN_MIN = -0.05;
const DOMAIN_MAX = 1.05;

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
        <p>Gjennomførbarhet: {(p.feasibilityScore * 100).toFixed(0)}%</p>
        <p>Attraktivitet: {(p.attractivenessScore * 100).toFixed(0)}%</p>
        <p>4-Block-poeng: {p.fourBlockScore.toFixed(2)}</p>
        <p>Estimert omsetning: {p.attractiveness.estimatedRevenue}/5</p>
      </div>
    </div>
  );
}

function CustomDot(props: { cx?: number; cy?: number; payload?: ProductWithScores }) {
  const { cx, cy, payload: p } = props;
  if (cx == null || cy == null || !p) return <g />;
  const color = QUADRANT_COLORS[p.quadrant];

  // Bubble size based on estimatedRevenue (1-5)
  const revenue = p.attractiveness.estimatedRevenue;
  const outerR = 12 + revenue * 4; // 16 to 32
  const innerR = 3 + revenue * 1; // 4 to 8

  return (
    <g>
      <circle cx={cx} cy={cy} r={outerR} fill={color} fillOpacity={0.15} stroke={color} strokeWidth={2} />
      <circle cx={cx} cy={cy} r={innerR} fill={color} />
      <text x={cx} y={cy - outerR - 6} textAnchor="middle" fill="var(--chart-label)" fontSize={11} fontWeight={500}>
        {p.name}
      </text>
    </g>
  );
}

// SVG overlay for iso-score quarter-circle arcs
function IsoScoreOverlay({ width, height }: { width: number; height: number }) {
  const chartW = width - CHART_MARGIN.left - CHART_MARGIN.right;
  const chartH = height - CHART_MARGIN.top - CHART_MARGIN.bottom;
  const range = DOMAIN_MAX - DOMAIN_MIN;

  const toX = (v: number) => CHART_MARGIN.left + ((v - DOMAIN_MIN) / range) * chartW;
  const toY = (v: number) => CHART_MARGIN.top + ((DOMAIN_MAX - v) / range) * chartH;

  return (
    <svg className="absolute inset-0 pointer-events-none" width={width} height={height}>
      {ISO_SCORES.map((score) => {
        const steps = 80;
        const points: string[] = [];

        for (let i = 0; i <= steps; i++) {
          const angle = (Math.PI / 2) * (i / steps);
          const dataX = score * Math.cos(angle);
          const dataY = score * Math.sin(angle);
          if (dataX >= DOMAIN_MIN && dataX <= DOMAIN_MAX && dataY >= DOMAIN_MIN && dataY <= DOMAIN_MAX) {
            points.push(`${toX(dataX)},${toY(dataY)}`);
          }
        }

        if (points.length < 2) return null;

        // Label at 45 degrees
        const lx = score * Math.cos(Math.PI / 4);
        const ly = score * Math.sin(Math.PI / 4);
        const showLabel = lx <= 1.0 && ly <= 1.0;

        return (
          <g key={score}>
            <polyline
              points={points.join(" ")}
              fill="none"
              stroke="var(--chart-iso)"
              strokeWidth={1.2}
              strokeDasharray="6 4"
              opacity={0.45}
            />
            {showLabel && (
              <text
                x={toX(lx)}
                y={toY(ly) - 8}
                textAnchor="middle"
                fill="var(--chart-iso)"
                fontSize={10}
                opacity={0.6}
              >
                {score.toFixed(1)}
              </text>
            )}
          </g>
        );
      })}
    </svg>
  );
}

// Revenue scale legend
function BubbleLegend() {
  const sizes = [1, 3, 5];
  return (
    <div className="flex items-center gap-4 text-[10px]" style={{ color: "var(--text-tertiary)" }}>
      <span>Estimert omsetning:</span>
      {sizes.map((rev) => {
        const r = 6 + rev * 2;
        return (
          <div key={rev} className="flex items-center gap-1">
            <svg width={r * 2 + 2} height={r * 2 + 2}>
              <circle cx={r + 1} cy={r + 1} r={r} fill="var(--chart-axis)" fillOpacity={0.15} stroke="var(--chart-axis)" strokeWidth={1} />
            </svg>
            <span>{rev}/5</span>
          </div>
        );
      })}
    </div>
  );
}

export default function FourBlockChart({ products, onProductClick }: FourBlockChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dims, setDims] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => {
      const { width, height } = entries[0].contentRect;
      setDims({ width, height });
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const data = products.map((p) => ({
    ...p,
    x: p.feasibilityScore,
    y: p.attractivenessScore,
  }));

  return (
    <div className="w-full">
      <div ref={containerRef} className="h-[500px] relative">
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart margin={CHART_MARGIN}>
            {/* Quadrant backgrounds */}
            <ReferenceArea x1={0.5} x2={1.05} y1={0.5} y2={1.05} fill="rgba(34, 197, 94, 0.06)" />
            <ReferenceArea x1={-0.3} x2={0.5} y1={0.5} y2={1.05} fill="rgba(59, 130, 246, 0.06)" />
            <ReferenceArea x1={0.5} x2={1.05} y1={-0.3} y2={0.5} fill="rgba(245, 158, 11, 0.06)" />
            <ReferenceArea x1={-0.3} x2={0.5} y1={-0.3} y2={0.5} fill="rgba(239, 68, 68, 0.06)" />

            <CartesianGrid strokeDasharray="3 3" stroke="var(--chart-grid)" />
            <XAxis
              type="number"
              dataKey="x"
              domain={[DOMAIN_MIN, DOMAIN_MAX]}
              tickFormatter={(v: number) => `${(v * 100).toFixed(0)}%`}
              stroke="var(--chart-axis)"
              fontSize={11}
            >
              <Label value="Gjennomførbarhet" position="bottom" offset={15} style={{ fill: "var(--chart-axis-label)", fontSize: 13, fontWeight: 500 }} />
            </XAxis>
            <YAxis
              type="number"
              dataKey="y"
              domain={[DOMAIN_MIN, DOMAIN_MAX]}
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

        {/* Iso-score curves as SVG overlay */}
        {dims.width > 0 && dims.height > 0 && (
          <IsoScoreOverlay width={dims.width} height={dims.height} />
        )}

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

      {/* Bubble size legend */}
      <div className="flex justify-end mt-2 mr-8">
        <BubbleLegend />
      </div>
    </div>
  );
}
