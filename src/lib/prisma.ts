import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient; dbReady: boolean };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export async function ensureDb() {
  if (globalForPrisma.dbReady) return;
  try {
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Product" (
        "id" TEXT NOT NULL PRIMARY KEY,
        "name" TEXT NOT NULL,
        "description" TEXT NOT NULL,
        "owner" TEXT NOT NULL,
        "isOngoing" BOOLEAN NOT NULL DEFAULT false,
        "isNew" BOOLEAN NOT NULL DEFAULT false,
        "isDerivative" BOOLEAN NOT NULL DEFAULT false,
        "markets" TEXT NOT NULL,
        "feasibility" TEXT NOT NULL,
        "attractiveness" TEXT NOT NULL,
        "comments" TEXT NOT NULL DEFAULT '',
        "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" DATETIME NOT NULL
      )
    `);
    globalForPrisma.dbReady = true;
  } catch {
    // Table already exists
    globalForPrisma.dbReady = true;
  }
}
