import { NextResponse } from "next/server";
import { prisma, ensureDb } from "@/lib/prisma";

const SEED_DATA = [
  {
    name: "TEK17",
    description: "Teknisk samsvarsprodukt for byggebransjens standarder",
    owner: "Team Alpha",
    isOngoing: false,
    isNew: true,
    isDerivative: false,
    markets: ["Bygg & Anlegg"],
    feasibility: { clearlyDefined: 4, marketKnowledge: 5, technologyMatch: 3, technicalDifficulty: 2 },
    attractiveness: { estimatedRevenue: 2, productLifeCycle: 5, competitiveAdvantage: 2, profitability: 4, estimatedInvestment: 4 },
    comments: "",
  },
  {
    name: "Notably v2.0",
    description: "Neste generasjons notat- og kunnskapsstyringsplattform",
    owner: "Team Beta",
    isOngoing: false,
    isNew: false,
    isDerivative: true,
    markets: ["Forbruksvarer"],
    feasibility: { clearlyDefined: 5, marketKnowledge: 4, technologyMatch: 4, technicalDifficulty: 4 },
    attractiveness: { estimatedRevenue: 5, productLifeCycle: 5, competitiveAdvantage: 5, profitability: 5, estimatedInvestment: 5 },
    comments: "",
  },
  {
    name: "First Mover",
    description: "Først-til-markedet etterretning og konkurranseanalyseverktøy",
    owner: "Team Gamma",
    isOngoing: false,
    isNew: true,
    isDerivative: false,
    markets: ["Finans", "Industri"],
    feasibility: { clearlyDefined: 4, marketKnowledge: 4, technologyMatch: 3, technicalDifficulty: 5 },
    attractiveness: { estimatedRevenue: 5, productLifeCycle: 3, competitiveAdvantage: 3, profitability: 2, estimatedInvestment: 3 },
    comments: "",
  },
  {
    name: "ARTI Education",
    description: "Utdanningsplattform og opplæringsmoduler for ARTI-metodikken",
    owner: "Team Delta",
    isOngoing: true,
    isNew: true,
    isDerivative: false,
    markets: ["Annet"],
    feasibility: { clearlyDefined: 3, marketKnowledge: 3, technologyMatch: 4, technicalDifficulty: 2 },
    attractiveness: { estimatedRevenue: 5, productLifeCycle: 5, competitiveAdvantage: 4, profitability: 4, estimatedInvestment: 2 },
    comments: "",
  },
  {
    name: "Intale",
    description: "Intelligent dataanalyse og fortellingsbasert rapportering",
    owner: "Team Epsilon",
    isOngoing: false,
    isNew: true,
    isDerivative: false,
    markets: ["Finans", "Offentlig"],
    feasibility: { clearlyDefined: 4, marketKnowledge: 4, technologyMatch: 4, technicalDifficulty: 5 },
    attractiveness: { estimatedRevenue: 5, productLifeCycle: 3, competitiveAdvantage: 1, profitability: 5, estimatedInvestment: 3 },
    comments: "",
  },
  {
    name: "Kurs i generativ AI",
    description: "Omfattende kurs i generativ AI-teknologi og anvendelser",
    owner: "Team Zeta",
    isOngoing: true,
    isNew: true,
    isDerivative: false,
    markets: ["Annet"],
    feasibility: { clearlyDefined: 5, marketKnowledge: 4, technologyMatch: 5, technicalDifficulty: 5 },
    attractiveness: { estimatedRevenue: 2, productLifeCycle: 3, competitiveAdvantage: 3, profitability: 3, estimatedInvestment: 5 },
    comments: "",
  },
  {
    name: "BIO",
    description: "Bioteknologisk innovasjons- og optimaliseringsplattform",
    owner: "Team Eta",
    isOngoing: false,
    isNew: true,
    isDerivative: false,
    markets: ["Havbruk", "Industri"],
    feasibility: { clearlyDefined: 3, marketKnowledge: 4, technologyMatch: 5, technicalDifficulty: 5 },
    attractiveness: { estimatedRevenue: 1, productLifeCycle: 3, competitiveAdvantage: 2, profitability: 2, estimatedInvestment: 5 },
    comments: "",
  },
  {
    name: "AI-strategi",
    description: "AI-strategirådgivning og implementeringsveikart",
    owner: "Team Theta",
    isOngoing: true,
    isNew: true,
    isDerivative: false,
    markets: ["Finans", "Offentlig", "Industri"],
    feasibility: { clearlyDefined: 3, marketKnowledge: 4, technologyMatch: 5, technicalDifficulty: 4 },
    attractiveness: { estimatedRevenue: 2, productLifeCycle: 5, competitiveAdvantage: 5, profitability: 2, estimatedInvestment: 4 },
    comments: "",
  },
];

export async function POST() {
  await ensureDb();
  // Use a transaction to prevent race conditions from concurrent calls
  const result = await prisma.$transaction(async (tx) => {
    const count = await tx.product.count();
    if (count > 0) {
      return { message: "Database already seeded", count, seeded: false };
    }

    for (const item of SEED_DATA) {
      await tx.product.create({
        data: {
          ...item,
          markets: JSON.stringify(item.markets),
          feasibility: JSON.stringify(item.feasibility),
          attractiveness: JSON.stringify(item.attractiveness),
        },
      });
    }

    return { message: "Seeded successfully", count: SEED_DATA.length, seeded: true };
  });

  return NextResponse.json(result, { status: result.seeded ? 201 : 200 });
}
