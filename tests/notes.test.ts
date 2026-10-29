/**
 * Intento di sviluppo: verificare il contratto HTTP delle Note con Fastify
 * injection e un database SQLite di test isolato da quello di sviluppo.
 */
import { execFileSync } from "node:child_process";
import { resolve } from "node:path";
import Database from "better-sqlite3";
import type { FastifyInstance } from "fastify";
import { afterAll, beforeAll, beforeEach, describe, expect, it } from "vitest";

const testDatabaseUrl = "file:./prisma/test.db";
const testDatabasePath = resolve("prisma/test.db");
const prismaCliPath = resolve("node_modules/prisma/build/index.js");

let app: FastifyInstance;
let prisma: (typeof import("../src/lib/prisma.js"))["prisma"];

const validNote = {
  title: "Accesso portale cliente",
  content: "Il cliente segnala un errore di login.",
  author: "Mario Rossi",
  context: "Acme S.r.l.",
  type: "ISSUE",
  priority: 4,
  status: "OPEN",
};

async function createNote(overrides: Record<string, unknown> = {}) {
  const response = await app.inject({
    method: "POST",
    url: "/notes",
    payload: { ...validNote, ...overrides },
  });

  expect(response.statusCode).toBe(201);
  return response.json() as { id: string; updatedAt: string } & typeof validNote;
}

beforeAll(async () => {
  process.env.DATABASE_URL = testDatabaseUrl;
  new Database(testDatabasePath).close();
  execFileSync(process.execPath, [prismaCliPath, "migrate", "deploy"], {
    env: { ...process.env, DATABASE_URL: testDatabaseUrl },
    stdio: "pipe",
  });

  ({ prisma } = await import("../src/lib/prisma.js"));
  const { buildApp } = await import("../src/app.js");
  app = buildApp();
});

beforeEach(async () => {
  await prisma.note.deleteMany();
});

afterAll(async () => {
  if (app) await app.close();
  if (prisma) await prisma.$disconnect();
});

describe("Notes API", () => {
  it("crea una nota valida e assegna id e timestamp", async () => {
    const response = await app.inject({ method: "POST", url: "/notes", payload: validNote });

    expect(response.statusCode).toBe(201);
    expect(response.json()).toMatchObject(validNote);
    expect(response.json()).toEqual(
      expect.objectContaining({
        id: expect.any(String),
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
      }),
    );
  });

  it("rifiuta payload non validi e PATCH vuote", async () => {
    const invalidCreate = await app.inject({
      method: "POST",
      url: "/notes",
      payload: { ...validNote, priority: 6 },
    });
    expect(invalidCreate.statusCode).toBe(400);
    expect(invalidCreate.json()).toMatchObject({ error: "VALIDATION_ERROR" });

    const note = await createNote();
    const emptyPatch = await app.inject({ method: "PATCH", url: `/notes/${note.id}`, payload: {} });
    expect(emptyPatch.statusCode).toBe(400);
    expect(emptyPatch.json()).toMatchObject({ error: "VALIDATION_ERROR" });
  });

  it("aggiorna soltanto i campi inviati", async () => {
    const note = await createNote();
    const response = await app.inject({
      method: "PATCH",
      url: `/notes/${note.id}`,
      payload: { status: "CLOSED" },
    });

    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      id: note.id,
      title: validNote.title,
      status: "CLOSED",
    });
  });

  it("cerca con q e combina filtri, inclusi title e content", async () => {
    const matching = await createNote({ content: "Errore login rilevato durante il test." });
    await createNote({
      title: "Report operativo",
      content: "Verificare la disponibilità del servizio.",
      context: "Globex S.p.A.",
      type: "TASK",
      priority: 2,
      status: "IN_PROGRESS",
    });

    const byQuery = await app.inject({ method: "GET", url: "/notes?q=login" });
    expect(byQuery.statusCode).toBe(200);
    expect(byQuery.json()).toHaveLength(1);
    expect(byQuery.json()[0]).toMatchObject({ id: matching.id });

    const combined = await app.inject({
      method: "GET",
      url: "/notes?title=Accesso&content=Errore&context=Acme%20S.r.l.&type=ISSUE&priority=4&status=OPEN",
    });
    expect(combined.statusCode).toBe(200);
    expect(combined.json()).toHaveLength(1);
    expect(combined.json()[0]).toMatchObject({ id: matching.id });
  });

  it("restituisce 404 per note inesistenti e dopo eliminazione", async () => {
    const absent = await app.inject({ method: "GET", url: "/notes/inesistente" });
    expect(absent.statusCode).toBe(404);
    expect(absent.json()).toMatchObject({ error: "NOT_FOUND" });

    const note = await createNote();
    const deleted = await app.inject({ method: "DELETE", url: `/notes/${note.id}` });
    expect(deleted.statusCode).toBe(204);

    const afterDelete = await app.inject({ method: "GET", url: `/notes/${note.id}` });
    expect(afterDelete.statusCode).toBe(404);
  });
});
