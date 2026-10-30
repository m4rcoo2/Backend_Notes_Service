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

  it("recupera una nota esistente e accetta priority omessa", async () => {
    const { priority: _priority, ...noteWithoutPriority } = validNote;
    const created = await app.inject({ method: "POST", url: "/notes", payload: noteWithoutPriority });
    expect(created.statusCode).toBe(201);
    expect(created.json()).toMatchObject({ ...noteWithoutPriority, priority: null });

    const detail = await app.inject({ method: "GET", url: `/notes/${created.json().id}` });
    expect(detail.statusCode).toBe(200);
    expect(detail.json()).toMatchObject({ id: created.json().id, ...noteWithoutPriority, priority: null });

    const atLimit = await app.inject({
      method: "POST",
      url: "/notes",
      payload: { ...validNote, title: "a".repeat(200) },
    });
    expect(atLimit.statusCode).toBe(201);
  });

  it("rifiuta dati di creazione e aggiornamento non validi senza persistirli", async () => {
    const invalidCreates = [
      { ...validNote, title: "" },
      { ...validNote, author: "   " },
      { ...validNote, title: "a".repeat(201) },
      { ...validNote, priority: 0 },
      { ...validNote, priority: 2.5 },
      { ...validNote, priority: "4" },
      { ...validNote, type: "OTHER" },
      { ...validNote, status: "DONE" },
      { ...validNote, id: "client-id" },
      { ...validNote, createdAt: "2020-01-01T00:00:00.000Z" },
    ];

    for (const payload of invalidCreates) {
      const response = await app.inject({ method: "POST", url: "/notes", payload });
      expect(response.statusCode).toBe(400);
      expect(response.json()).toMatchObject({ error: "VALIDATION_ERROR" });
    }
    expect(await prisma.note.count()).toBe(0);

    const note = await createNote();
    const invalidPatch = await app.inject({
      method: "PATCH",
      url: `/notes/${note.id}`,
      payload: { updatedAt: "2020-01-01T00:00:00.000Z" },
    });
    expect(invalidPatch.statusCode).toBe(400);
    expect(invalidPatch.json()).toMatchObject({ error: "VALIDATION_ERROR" });
  });

  it("cerca separatamente in title e content e restituisce una lista vuota senza risultati", async () => {
    const titleMatch = await createNote({
      title: "Login portal",
      content: "Descrizione generica.",
    });
    const contentMatch = await createNote({
      title: "Report operativo",
      content: "Login trovato nel contenuto.",
    });

    const q = await app.inject({ method: "GET", url: "/notes?q=Login" });
    expect(q.statusCode).toBe(200);
    expect(q.json()).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ id: titleMatch.id }),
        expect.objectContaining({ id: contentMatch.id }),
      ]),
    );

    const title = await app.inject({ method: "GET", url: "/notes?title=Login" });
    expect(title.statusCode).toBe(200);
    expect(title.json()).toEqual([expect.objectContaining({ id: titleMatch.id })]);

    const content = await app.inject({ method: "GET", url: "/notes?content=Login" });
    expect(content.statusCode).toBe(200);
    expect(content.json()).toEqual([expect.objectContaining({ id: contentMatch.id })]);

    const empty = await app.inject({ method: "GET", url: "/notes?q=missing" });
    expect(empty.statusCode).toBe(200);
    expect(empty.json()).toEqual([]);
  });

  it("rifiuta filtri non validi o sconosciuti", async () => {
    for (const url of ["/notes?q=", "/notes?priority=2.5", "/notes?type=OTHER", "/notes?status=DONE", "/notes?unknown=value"]) {
      const response = await app.inject({ method: "GET", url });
      expect(response.statusCode).toBe(400);
      expect(response.json()).toMatchObject({ error: "VALIDATION_ERROR" });
    }
  });

  it("restituisce 404 per PATCH e DELETE di una nota inesistente", async () => {
    const patch = await app.inject({
      method: "PATCH",
      url: "/notes/inesistente",
      payload: { status: "CLOSED" },
    });
    expect(patch.statusCode).toBe(404);
    expect(patch.json()).toMatchObject({ error: "NOT_FOUND" });

    const deleted = await app.inject({ method: "DELETE", url: "/notes/inesistente" });
    expect(deleted.statusCode).toBe(404);
    expect(deleted.json()).toMatchObject({ error: "NOT_FOUND" });
  });

  it("aggiorna updatedAt e lascia invariati i campi non inviati", async () => {
    const note = await createNote();
    const oldUpdatedAt = new Date("2020-01-01T00:00:00.000Z");
    await prisma.note.update({ where: { id: note.id }, data: { updatedAt: oldUpdatedAt } });

    const response = await app.inject({
      method: "PATCH",
      url: `/notes/${note.id}`,
      payload: { status: "CLOSED", priority: 5 },
    });
    expect(response.statusCode).toBe(200);
    expect(response.json()).toMatchObject({
      id: note.id,
      title: validNote.title,
      content: validNote.content,
      author: validNote.author,
      context: validNote.context,
      status: "CLOSED",
      priority: 5,
    });
    expect(new Date(response.json().updatedAt).getTime()).toBeGreaterThan(oldUpdatedAt.getTime());
  });

  it("normalizza le stringhe e applica tutti i limiti testuali", async () => {
    const normalized = await app.inject({
      method: "POST",
      url: "/notes",
      payload: {
        ...validNote,
        title: "  Titolo normalizzato  ",
        content: "  Contenuto normalizzato  ",
        author: "  Mario Rossi  ",
        context: "  Acme S.r.l.  ",
      },
    });
    expect(normalized.statusCode).toBe(201);
    expect(normalized.json()).toMatchObject({
      title: "Titolo normalizzato",
      content: "Contenuto normalizzato",
      author: "Mario Rossi",
      context: "Acme S.r.l.",
    });

    const atAllLimits = await app.inject({
      method: "POST",
      url: "/notes",
      payload: {
        ...validNote,
        content: "a".repeat(10_000),
        author: "a".repeat(120),
        context: "a".repeat(200),
      },
    });
    expect(atAllLimits.statusCode).toBe(201);

    for (const payload of [
      { ...validNote, content: "a".repeat(10_001) },
      { ...validNote, author: "a".repeat(121) },
      { ...validNote, context: "a".repeat(201) },
    ]) {
      const response = await app.inject({ method: "POST", url: "/notes", payload });
      expect(response.statusCode).toBe(400);
    }
  });

  it("rifiuta tipi errati, campi sconosciuti e PATCH non valide senza scrivere", async () => {
    for (const payload of [
      { ...validNote, content: null },
      { ...validNote, author: 42 },
      { ...validNote, context: [] },
      { ...validNote, priority: null },
      { ...validNote, extra: "non ammesso" },
    ]) {
      const response = await app.inject({ method: "POST", url: "/notes", payload });
      expect(response.statusCode).toBe(400);
      expect(response.json()).toMatchObject({ error: "VALIDATION_ERROR" });
    }
    expect(await prisma.note.count()).toBe(0);

    const note = await createNote();
    for (const payload of [{ title: "   " }, { priority: null }, { id: "nuovo-id" }, []]) {
      const response = await app.inject({ method: "PATCH", url: `/notes/${note.id}`, payload });
      expect(response.statusCode).toBe(400);
      expect(response.json()).toMatchObject({ error: "VALIDATION_ERROR" });
    }
    expect(await prisma.note.findUnique({ where: { id: note.id } })).toMatchObject(validNote);
  });

  it("rifiuta body JSON malformati e valori di filtro fuori contratto", async () => {
    const malformed = await app.inject({
      method: "POST",
      url: "/notes",
      headers: { "content-type": "application/json" },
      payload: '{"title":',
    });
    expect(malformed.statusCode).toBe(400);
    expect(malformed.json()).toMatchObject({ error: "VALIDATION_ERROR" });
    expect(await prisma.note.count()).toBe(0);

    for (const url of [
      "/notes?title=",
      "/notes?content=",
      "/notes?context=",
      "/notes?priority=0",
      "/notes?priority=6",
      "/notes?priority=not-a-number",
    ]) {
      const response = await app.inject({ method: "GET", url });
      expect(response.statusCode).toBe(400);
      expect(response.json()).toMatchObject({ error: "VALIDATION_ERROR" });
    }
  });
});
