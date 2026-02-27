import { Product, FeasibilityScores, AttractivenessScores, Quadrant, ProductWithScores } from "./types";

/**
 * DECIDE scoring formula from the Excel:
 * Feasibility Score = (SUM(scores) / 20 - 0.2) * 5/4
 * Normalized to 0-1 range
 */
export function calculateFeasibilityScore(scores: FeasibilityScores): number {
  const sum = scores.clearlyDefined + scores.marketKnowledge + scores.technologyMatch + scores.technicalDifficulty;
  return (sum / 20 - 0.2) * (5 / 4);
}

/**
 * Attractiveness Score = (SUM(scores) / 25 - 0.2) * 5/4
 * Normalized to 0-1 range
 */
export function calculateAttractivenessScore(scores: AttractivenessScores): number {
  const sum =
    scores.estimatedRevenue +
    scores.productLifeCycle +
    scores.competitiveAdvantage +
    scores.profitability +
    scores.estimatedInvestment;
  return (sum / 25 - 0.2) * (5 / 4);
}

/**
 * 4-Block Quadrant determination:
 * - Launch Pad: Feasibility >= 0.5 AND Attractiveness >= 0.5
 * - Low Hanging Fruit: Feasibility >= 0.5 AND Attractiveness < 0.5
 * - Alpha Test: Feasibility < 0.5 AND Attractiveness >= 0.5
 * - Do Not Pursue: Feasibility < 0.5 AND Attractiveness < 0.5
 */
export function determineQuadrant(feasibility: number, attractiveness: number): Quadrant {
  if (feasibility >= 0.5 && attractiveness >= 0.5) return "Launch Pad";
  if (feasibility >= 0.5 && attractiveness < 0.5) return "Low Hanging Fruit";
  if (feasibility < 0.5 && attractiveness >= 0.5) return "Alpha Test";
  return "Do Not Pursue";
}

/**
 * 4-Block Score = sqrt(feasibility^2 + attractiveness^2)
 * Distance from origin - higher is better
 */
export function calculateFourBlockScore(feasibility: number, attractiveness: number): number {
  return Math.sqrt(feasibility ** 2 + attractiveness ** 2);
}

export function enrichProduct(product: Product): ProductWithScores {
  const feasibilityScore = calculateFeasibilityScore(product.feasibility);
  const attractivenessScore = calculateAttractivenessScore(product.attractiveness);
  const quadrant = determineQuadrant(feasibilityScore, attractivenessScore);
  const fourBlockScore = calculateFourBlockScore(feasibilityScore, attractivenessScore);

  return {
    ...product,
    feasibilityScore,
    attractivenessScore,
    quadrant,
    fourBlockScore,
  };
}

export const QUADRANT_COLORS: Record<Quadrant, string> = {
  "Launch Pad": "#22c55e",
  "Low Hanging Fruit": "#f59e0b",
  "Alpha Test": "#3b82f6",
  "Do Not Pursue": "#ef4444",
};

export const QUADRANT_BG: Record<Quadrant, string> = {
  "Launch Pad": "rgba(34, 197, 94, 0.08)",
  "Low Hanging Fruit": "rgba(245, 158, 11, 0.08)",
  "Alpha Test": "rgba(59, 130, 246, 0.08)",
  "Do Not Pursue": "rgba(239, 68, 68, 0.08)",
};
