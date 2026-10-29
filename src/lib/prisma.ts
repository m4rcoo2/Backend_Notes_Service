/**
 * Intento di sviluppo: esporre un'unica istanza Prisma configurata per SQLite,
 * evitando connessioni duplicate durante sviluppo e test.
 */
import "dotenv/config";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import { PrismaClient } from "../generated/prisma/client.js";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL non è configurata");
}

const globalForPrisma = globalThis as typeof globalThis & { prisma?: PrismaClient };

const adapter = new PrismaBetterSqlite3({ url: databaseUrl });

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
