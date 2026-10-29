/**
 * Intento di sviluppo: definire tipi e validazioni indipendenti dal trasporto
 * HTTP, riusabili da route e servizi per mantenere il contratto delle Note.
 */

export const noteTypes = [
  "REQUEST",
  "ISSUE",
  "DECISION",
  "TASK",
  "FOLLOW_UP",
  "INFO",
] as const;

export const noteStatuses = ["OPEN", "IN_PROGRESS", "CLOSED", "ARCHIVED"] as const;

export type NoteTypeValue = (typeof noteTypes)[number];
export type NoteStatusValue = (typeof noteStatuses)[number];

export interface CreateNoteInput {
  title: string;
  content: string;
  author: string;
  context: string;
  type: NoteTypeValue;
  priority?: number;
  status: NoteStatusValue;
}

export type UpdateNoteInput = Partial<CreateNoteInput>;

export interface ListNotesFilters {
  q?: string;
  title?: string;
  content?: string;
  context?: string;
  type?: NoteTypeValue;
  priority?: number;
  status?: NoteStatusValue;
}

export interface ValidationIssue {
  field: string;
  message: string;
}

export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; issues: ValidationIssue[] };

const writableNoteFields = [
  "title",
  "content",
  "author",
  "context",
  "type",
  "priority",
  "status",
] as const;

const fieldLimits = {
  title: 200,
  content: 10_000,
  author: 120,
  context: 200,
} as const;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNoteType(value: unknown): value is NoteTypeValue {
  return typeof value === "string" && (noteTypes as readonly string[]).includes(value);
}

function isNoteStatus(value: unknown): value is NoteStatusValue {
  return typeof value === "string" && (noteStatuses as readonly string[]).includes(value);
}

function parseString(
  value: unknown,
  field: keyof typeof fieldLimits,
  issues: ValidationIssue[],
): string | undefined {
  if (typeof value !== "string" || value.trim().length === 0) {
    issues.push({ field, message: "deve essere una stringa non vuota" });
    return undefined;
  }

  const normalized = value.trim();
  if (normalized.length > fieldLimits[field]) {
    issues.push({ field, message: `non può superare ${fieldLimits[field]} caratteri` });
    return undefined;
  }

  return normalized;
}

function parsePriority(value: unknown, issues: ValidationIssue[]): number | undefined {
  if (!Number.isInteger(value) || typeof value !== "number" || value < 1 || value > 5) {
    issues.push({ field: "priority", message: "deve essere un intero tra 1 e 5" });
    return undefined;
  }

  return value;
}

function parseType(value: unknown, issues: ValidationIssue[]): NoteTypeValue | undefined {
  if (!isNoteType(value)) {
    issues.push({ field: "type", message: "deve essere un tipo di nota supportato" });
    return undefined;
  }

  return value;
}

function parseStatus(value: unknown, issues: ValidationIssue[]): NoteStatusValue | undefined {
  if (!isNoteStatus(value)) {
    issues.push({ field: "status", message: "deve essere uno stato supportato" });
    return undefined;
  }

  return value;
}

function validateKnownFields(record: Record<string, unknown>, issues: ValidationIssue[]): void {
  for (const key of Object.keys(record)) {
    if (!(writableNoteFields as readonly string[]).includes(key)) {
      issues.push({ field: key, message: "campo non supportato" });
    }
  }
}

export function validateCreateNoteInput(payload: unknown): ValidationResult<CreateNoteInput> {
  if (!isRecord(payload)) {
    return { success: false, issues: [{ field: "body", message: "deve essere un oggetto JSON" }] };
  }

  const issues: ValidationIssue[] = [];
  validateKnownFields(payload, issues);
  const title = parseString(payload.title, "title", issues);
  const content = parseString(payload.content, "content", issues);
  const author = parseString(payload.author, "author", issues);
  const context = parseString(payload.context, "context", issues);
  const type = parseType(payload.type, issues);
  const status = parseStatus(payload.status, issues);
  const priority = payload.priority === undefined ? undefined : parsePriority(payload.priority, issues);

  if (issues.length > 0 || !title || !content || !author || !context || !type || !status) {
    return { success: false, issues };
  }

  return {
    success: true,
    //qui si possono  modificare i campi opzionali, inserendli in undefined
    data: { title, content, author, context, type, status, ...(priority === undefined ? {} : { priority }) },
  };
}

export function validateUpdateNoteInput(payload: unknown): ValidationResult<UpdateNoteInput> {
  if (!isRecord(payload)) {
    return { success: false, issues: [{ field: "body", message: "deve essere un oggetto JSON" }] };
  }

  const issues: ValidationIssue[] = [];
  validateKnownFields(payload, issues);
  const update: UpdateNoteInput = {};

  if (Object.keys(payload).length === 0) {
    issues.push({ field: "body", message: "deve contenere almeno un campo modificabile" });
  }
  if ("title" in payload) update.title = parseString(payload.title, "title", issues);
  if ("content" in payload) update.content = parseString(payload.content, "content", issues);
  if ("author" in payload) update.author = parseString(payload.author, "author", issues);
  if ("context" in payload) update.context = parseString(payload.context, "context", issues);
  if ("type" in payload) update.type = parseType(payload.type, issues);
  if ("status" in payload) update.status = parseStatus(payload.status, issues);
  if ("priority" in payload) update.priority = parsePriority(payload.priority, issues);

  if (issues.length > 0) {
    return { success: false, issues };
  }

  return { success: true, data: update };
}

export function validateListNotesFilters(query: unknown): ValidationResult<ListNotesFilters> {
  if (!isRecord(query)) {
    return { success: false, issues: [{ field: "query", message: "deve essere un oggetto" }] };
  }

  const issues: ValidationIssue[] = [];
  const supportedFilters = ["q", "title", "content", "context", "type", "priority", "status"];
  for (const key of Object.keys(query)) {
    if (!supportedFilters.includes(key)) {
      issues.push({ field: key, message: "filtro non supportato" });
    }
  }

  const filters: ListNotesFilters = {};
  for (const field of ["q", "title", "content", "context"] as const) {
    if (field in query) {
      const value = query[field];
      if (typeof value !== "string" || value.trim().length === 0) {
        issues.push({ field, message: "deve essere una stringa non vuota" });
      } else {
        filters[field] = value.trim();
      }
    }
  }
  if ("type" in query) {
    const type = parseType(query.type, issues);
    if (type) filters.type = type;
  }
  if ("status" in query) {
    const status = parseStatus(query.status, issues);
    if (status) filters.status = status;
  }
  if ("priority" in query) {
    const rawPriority = query.priority;
    const parsedPriority = typeof rawPriority === "string" ? Number(rawPriority) : rawPriority;
    const priority = parsePriority(parsedPriority, issues);
    if (priority !== undefined) filters.priority = priority;
  }

  return issues.length > 0 ? { success: false, issues } : { success: true, data: filters };
}
