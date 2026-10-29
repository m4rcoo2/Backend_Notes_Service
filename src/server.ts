/**
 * Intento di sviluppo: avviare il server HTTP con parametri locali semplici,
 * separando l'ascolto di rete dalla composizione dell'app Fastify.
 */
import { buildApp } from "./app.js";

const port = Number(process.env.PORT ?? 3000);
const host = process.env.HOST ?? "127.0.0.1";
const app = buildApp();

try {
  await app.listen({ port, host });
} catch (error) {
  app.log.error(error);
  process.exit(1);
}
