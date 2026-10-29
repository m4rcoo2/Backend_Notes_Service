/**
 * Intento di sviluppo: esporre le API REST delle note, traducendo richieste
 * HTTP in validazioni e chiamate al servizio senza incorporare query Prisma.
 */
import type { FastifyPluginAsync, FastifyReply } from "fastify";
import {
  validateCreateNoteInput,
  validateListNotesFilters,
  validateUpdateNoteInput,
  type ValidationIssue,
} from "../schemas/notes.js";
import {
  createNote,
  deleteNote,
  getNoteById,
  listNotes,
  updateNote,
} from "../services/notes.js";

interface NoteParams {
  id: string;
}

function sendValidationError(reply: FastifyReply, issues: ValidationIssue[]) {
  return reply.status(400).send({
    error: "VALIDATION_ERROR",
    message: "La richiesta contiene dati non validi",
    issues,
  });
}

function validateNoteId(reply: FastifyReply, id: string): string | undefined {
  const normalizedId = id.trim();
  if (normalizedId.length === 0) {
    sendValidationError(reply, [{ field: "id", message: "non può essere vuoto" }]);
    return undefined;
  }

  return normalizedId;
}

const notesRoutes: FastifyPluginAsync = async (app) => {
  app.post("/", async (request, reply) => {
    const result = validateCreateNoteInput(request.body);
    if (!result.success) return sendValidationError(reply, result.issues);

    const note = await createNote(result.data);
    return reply.status(201).send(note);
  });

  app.get("/", async (request, reply) => {
    const result = validateListNotesFilters(request.query);
    if (!result.success) return sendValidationError(reply, result.issues);

    const notes = await listNotes(result.data);
    return reply.status(200).send(notes);
  });

  app.get<{ Params: NoteParams }>("/:id", async (request, reply) => {
    const id = validateNoteId(reply, request.params.id);
    if (!id) return reply;

    const note = await getNoteById(id);
    return reply.status(200).send(note);
  });

  app.patch<{ Params: NoteParams }>("/:id", async (request, reply) => {
    const id = validateNoteId(reply, request.params.id);
    if (!id) return reply;

    const result = validateUpdateNoteInput(request.body);
    if (!result.success) return sendValidationError(reply, result.issues);

    const note = await updateNote(id, result.data);
    return reply.status(200).send(note);
  });

  app.delete<{ Params: NoteParams }>("/:id", async (request, reply) => {
    const id = validateNoteId(reply, request.params.id);
    if (!id) return reply;

    await deleteNote(id);
    return reply.status(204).send();
  });
};

export default notesRoutes;
