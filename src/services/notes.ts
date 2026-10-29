/**
 * Intento di sviluppo: concentrare accesso dati e regole applicative delle
 * note, mantenendo le route HTTP sottili e facilmente verificabili.
 */
import { type Note, type Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import type { CreateNoteInput, ListNotesFilters, UpdateNoteInput } from "../schemas/notes.js";

export class NoteNotFoundError extends Error {
  constructor(id: string) {
    super(`Nota con id ${id} non trovata`);
    this.name = "NoteNotFoundError";
  }
}

export function createNote(input: CreateNoteInput): Promise<Note> {
  return prisma.note.create({ data: input });
}

export function listNotes(filters: ListNotesFilters): Promise<Note[]> {
  const where: Prisma.NoteWhereInput = {};

  if (filters.q) {
    where.OR = [
      { title: { contains: filters.q } },
      { content: { contains: filters.q } },
    ];
  }
  if (filters.title) where.title = { contains: filters.title };
  if (filters.content) where.content = { contains: filters.content };
  if (filters.context) where.context = filters.context;
  if (filters.type) where.type = filters.type;
  if (filters.priority !== undefined) where.priority = filters.priority;
  if (filters.status) where.status = filters.status;

  return prisma.note.findMany({ where });
}

export async function getNoteById(id: string): Promise<Note> {
  const note = await prisma.note.findUnique({ where: { id } });
  if (!note) throw new NoteNotFoundError(id);
  return note;
}

export async function updateNote(id: string, input: UpdateNoteInput): Promise<Note> {
  await getNoteById(id);
  return prisma.note.update({ where: { id }, data: input });
}

export async function deleteNote(id: string): Promise<void> {
  await getNoteById(id);
  await prisma.note.delete({ where: { id } });
}
