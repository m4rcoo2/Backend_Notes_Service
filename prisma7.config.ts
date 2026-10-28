/**
 * Intento di sviluppo: configurare Prisma 7 con schema e migration versionati,
 * leggendo il percorso SQLite dalla variabile DATABASE_URL locale.
 */
import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: env("DATABASE_URL"),
  },
});
