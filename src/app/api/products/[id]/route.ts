import { NextResponse } from "next/server";
import { prisma, ensureDb } from "@/lib/prisma";

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  await ensureDb();
  const { id } = await params;
  const body = await request.json();

  const data: Record<string, unknown> = {};
  if (body.name !== undefined) data.name = body.name;
  if (body.description !== undefined) data.description = body.description;
  if (body.owner !== undefined) data.owner = body.owner;
  if (body.isOngoing !== undefined) data.isOngoing = body.isOngoing;
  if (body.isNew !== undefined) data.isNew = body.isNew;
  if (body.isDerivative !== undefined) data.isDerivative = body.isDerivative;
  if (body.markets !== undefined) data.markets = JSON.stringify(body.markets);
  if (body.feasibility !== undefined) data.feasibility = JSON.stringify(body.feasibility);
  if (body.attractiveness !== undefined) data.attractiveness = JSON.stringify(body.attractiveness);
  if (body.comments !== undefined) data.comments = body.comments;

  const row = await prisma.product.update({ where: { id }, data });
  return NextResponse.json({
    ...row,
    markets: JSON.parse(row.markets),
    feasibility: JSON.parse(row.feasibility),
    attractiveness: JSON.parse(row.attractiveness),
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  await ensureDb();
  const { id } = await params;
  await prisma.product.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
