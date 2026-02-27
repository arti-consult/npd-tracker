import { NextResponse } from "next/server";
import { prisma, ensureDb } from "@/lib/prisma";
import { Product } from "@/lib/types";

function dbToProduct(row: {
  id: string;
  name: string;
  description: string;
  owner: string;
  isOngoing: boolean;
  isNew: boolean;
  isDerivative: boolean;
  markets: string;
  feasibility: string;
  attractiveness: string;
  comments: string;
  createdAt: Date;
  updatedAt: Date;
}): Product {
  return {
    ...row,
    markets: JSON.parse(row.markets),
    feasibility: JSON.parse(row.feasibility),
    attractiveness: JSON.parse(row.attractiveness),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

export async function GET() {
  await ensureDb();
  const rows = await prisma.product.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(rows.map(dbToProduct));
}

export async function POST(request: Request) {
  await ensureDb();
  const body = await request.json();
  const row = await prisma.product.create({
    data: {
      name: body.name,
      description: body.description,
      owner: body.owner,
      isOngoing: body.isOngoing ?? false,
      isNew: body.isNew ?? false,
      isDerivative: body.isDerivative ?? false,
      markets: JSON.stringify(body.markets ?? []),
      feasibility: JSON.stringify(body.feasibility),
      attractiveness: JSON.stringify(body.attractiveness),
      comments: body.comments ?? "",
    },
  });
  return NextResponse.json(dbToProduct(row), { status: 201 });
}
