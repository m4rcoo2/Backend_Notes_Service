# SPEC — Backend Notes Service

## §G Goal

MVP REST per note operative: CRUD, search, filters, SQLite persistence.

## §C Constraints

- Stack: Node.js, TypeScript, Fastify, SQLite, Prisma ORM, Vitest.
- Scope: no frontend, auth, pagination, sorting, soft delete, OpenAPI, Docker.
- Modello: una sola risorsa `Note`; `context` testo, no tabella clienti.
- `README.md` & `ai-log/prompts.md` coerenti con stato reale.
- Commit source, migration, test, `.env.example`; ignore `.env` & SQLite locale.

## §I Interfaces

- api: `POST /notes` + JSON `{title,content,author,context,type,priority?,status}` → `201 Note`.
- api: `GET /notes?q?&title?&content?&context?&type?&priority?&status?` → `200 Note[]`.
- api: `GET /notes/:id` → `200 Note` | `404 {error,message}`.
- api: `PATCH /notes/:id` + nonempty subset writable fields → `200 Note` | `400` | `404`.
- api: `DELETE /notes/:id` → `204` | `404 {error,message}`.
- env: `DATABASE_URL` ! set; SQLite Prisma URL.
- cmd: `npm run dev`, `npm run build`, `npm test`, `npm run prisma:migrate`, `npm run prisma:deploy`, `npm run prisma:generate`.

`Note` → `{id,title,content,author,context,type,priority,status,createdAt,updatedAt}`.

`type` ∈ `REQUEST|ISSUE|DECISION|TASK|FOLLOW_UP|INFO`; `status` ∈ `OPEN|IN_PROGRESS|CLOSED|ARCHIVED`; `priority?` ∈ integer `1..5`.

## §V Invariants

- V1: valid POST with optional `priority` → persisted Note & `201`; `id`, `createdAt`, `updatedAt` server-managed.
- V2: invalid body, query, or empty PATCH → `400 {error,message}`; no DB write.
- V3: missing Note on GET/PATCH/DELETE → `404 {error,message}`.
- V4: list `q` searches `title|content`; `title`/`content` search field-only; supplied filters AND.
- V5: PATCH updates only supplied writable fields & refreshes `updatedAt`.
- V6: DELETE existing Note → `204`; later GET same id → `404`.
- V7: Prisma schema & migration reproduce Note data model on empty SQLite DB.
- V8: source/test/config tracked; `.env`, SQLite files, generated output ignored; `.env.example` & migrations tracked.
- V9: README documents only implemented APIs, commands, model, environment, errors.
- V10: ∀ T1 baseline → `npm run build` exits `0` before app modules exist.
- V11: `DATABASE_URL` targets ignored `prisma/dev.db`; tracked migration applies on empty DB.
- V12: Fastify error handler narrows unknown errors before accessing properties.

## §T Tasks
|id|status|task|cites|
| --- | --- | --- | --- |
|T1|x|add package/TS/Vitest config, `.env.example`, precise gitignore|V7,V8,V10,I.env,I.cmd|
|T2|x|add Prisma Note schema & initial migration|V1,V5,V7,V11,I.api|
|T3|x|add schemas, Prisma singleton, Notes service|V1,V4,V5,V6|
|T4|x|add Fastify app, routes, server & error mapping|V1,V2,V3,V4,V5,V6,V12,I.api|
|T5|x|add API tests via Fastify inject|V1,V2,V3,V4,V5,V6|
|T6|x|complete README & AI log; run checks|V7,V8,V9|

## §B Bugs

|id|date|cause|fix|
| --- | --- | --- | --- |
|B1|2026-10-28|dependencies absent|rerun install; verify `npm ls`|
|B2|2026-10-29|empty `src` → TS18003|V10|
|B3|2026-10-29|SQLite URL root/path mismatch|V11|
|B4|2026-10-29|PowerShell blocked `npm.ps1`|use `npm.cmd` for verification|
|B5|2026-10-29|PowerShell expanded `$disconnect` in inline check|escape `$` in command|
|B6|2026-10-29|shell removed quotes in inline check|run temporary `.mts` verification|
|B7|2026-10-29|error handler read unknown error properties|V12|
|B8|2026-10-29|validator omitted `title` & `content` filters|V4|
|B9|2026-10-29|Vitest cannot spawn `npm.cmd` directly|invoke Prisma CLI via Node|
