export interface Product {
  id: string;
  name: string;
  description: string;
  owner: string;
  isOngoing: boolean;
  isNew: boolean;
  isDerivative: boolean;
  markets: Market[];
  feasibility: FeasibilityScores;
  attractiveness: AttractivenessScores;
  comments: string;
  createdAt: string;
  updatedAt: string;
}

export type Market =
  | "Finans"
  | "Offentlig"
  | "Industri"
  | "Havbruk"
  | "Olje & Gass"
  | "Bygg & Anlegg"
  | "Forbruksvarer"
  | "Annet";

export const ALL_MARKETS: Market[] = [
  "Finans",
  "Offentlig",
  "Industri",
  "Havbruk",
  "Olje & Gass",
  "Bygg & Anlegg",
  "Forbruksvarer",
  "Annet",
];

export interface FeasibilityScores {
  clearlyDefined: number; // 1-5
  marketKnowledge: number; // 1-5
  technologyMatch: number; // 1-5
  technicalDifficulty: number; // 1-5 (Easy=5, Hard=1)
}

export interface AttractivenessScores {
  estimatedRevenue: number; // 1-5
  productLifeCycle: number; // 1-5
  competitiveAdvantage: number; // 1-5
  profitability: number; // 1-5
  estimatedInvestment: number; // 1-5
}

export type Quadrant = "Launch Pad" | "Low Hanging Fruit" | "Alpha Test" | "Do Not Pursue";

export const QUADRANT_LABELS: Record<Quadrant, string> = {
  "Launch Pad": "Lanseringsrampe",
  "Low Hanging Fruit": "Lavthengende frukt",
  "Alpha Test": "Alfatest",
  "Do Not Pursue": "Ikke prioriter",
};

export interface ProductWithScores extends Product {
  feasibilityScore: number;
  attractivenessScore: number;
  quadrant: Quadrant;
  fourBlockScore: number;
}

export const FEASIBILITY_CRITERIA = [
  {
    key: "clearlyDefined" as const,
    label: "Klart definerte egenskaper",
    description: "Er ytelseskravene bestemt?",
    low: "Generell anelse",
    high: "Klar vei fremover",
    lowLabel: "Nei = 1",
    highLabel: "Ja = 5",
  },
  {
    key: "marketKnowledge" as const,
    label: "Markedskunnskap",
    description: "Passer med eksisterende kundebase og salgskanaler?",
    low: "Helt nytt marked",
    high: "Etablert hovedmarked",
    lowLabel: "Nei = 1",
    highLabel: "Ja = 5",
  },
  {
    key: "technologyMatch" as const,
    label: "Teknologimatch",
    description: "Har vi personell og utstyr internt?",
    low: "Aldri gjort dette",
    high: "Vi er eksperter",
    lowLabel: "Nei = 1",
    highLabel: "Ja = 5",
  },
  {
    key: "technicalDifficulty" as const,
    label: "Teknisk vanskelighetsgrad",
    description: "Hvor teknisk utfordrende er prosjektet?",
    low: "Aldri blitt gjort",
    high: "Repakketering av eksist. teknologi",
    lowLabel: "Vanskelig = 1",
    highLabel: "Enkelt = 5",
  },
];

export const ATTRACTIVENESS_CRITERIA = [
  {
    key: "estimatedRevenue" as const,
    label: "Estimert omsetning",
    description: "Estimert årlig omsetningspotensial",
    low: "< 5 MNOK",
    high: "20 MNOK+",
    lowLabel: "1 = < 5 MNOK",
    highLabel: "5 = 20 MNOK+",
  },
  {
    key: "productLifeCycle" as const,
    label: "Produktlivssyklus",
    description: "Vokser markedet eller er det i tilbakegang?",
    low: "Gammel teknologi / Nedgang",
    high: "Fremvoksende teknologi",
    lowLabel: "Nedgang = 1",
    highLabel: "Helt nytt = 5",
  },
  {
    key: "competitiveAdvantage" as const,
    label: "Konkurransefortrinn",
    description: "Gir produktet et bærekraftig fortrinn?",
    low: "Etterfølger / Underlegen",
    high: "100% markedsandel",
    lowLabel: "Lavt = 1",
    highLabel: "Høyt = 5",
  },
  {
    key: "profitability" as const,
    label: "Lønnsomhet (BM%)",
    description: "Forventet bruttomargiprosent",
    low: "< 30%",
    high: "> 50%",
    lowLabel: "1 = <30%",
    highLabel: "5 = >50%",
  },
  {
    key: "estimatedInvestment" as const,
    label: "Estimert tidsbruk",
    description: "Hvor mye tid kreves?",
    low: "2 måneder+",
    high: "Under en uke",
    lowLabel: "1 = 2 mnd+",
    highLabel: "5 = < 1 uke",
  },
];
