/**
 * Intento di sviluppo: costruire l'applicazione Fastify senza aprire porte,
 * così route ed errori possono essere verificati tramite injection nei test.
 */
import Fastify, { type FastifyInstance } from "fastify";
import notesRoutes from "./routes/notes.js";
import { NoteNotFoundError } from "./services/notes.js";

function isBadRequestError(error: unknown): error is { statusCode: 400; message: string } {
  if (typeof error !== "object" || error === null) return false;

  const candidate = error as { statusCode?: unknown; message?: unknown };
  return candidate.statusCode === 400 && typeof candidate.message === "string";
}

export function buildApp(): FastifyInstance {
  const app = Fastify({ logger: false });

  app.register(notesRoutes, { prefix: "/notes" });

  app.setErrorHandler((error, _request, reply) => {
    if (error instanceof NoteNotFoundError) {
      return reply.status(404).send({
        error: "NOT_FOUND",
        message: error.message,
      });
    }

    if (isBadRequestError(error)) {
      return reply.status(400).send({
        error: "VALIDATION_ERROR",
        message: error.message,
      });
    }

    app.log.error(error);
    return reply.status(500).send({
      error: "INTERNAL_ERROR",
      message: "Errore interno del server",
    });
  });

  return app;
}
