# Valuta coerenza con le guidelines

```yaml
Source: rollout-2026-10-29T10-37-54-01a18705-ec32-7d32-98bf-2c2ddc819b9c.jsonl
Date: 2026-10-29T09:38:02.635Z
CWD: q:\ComputerScience\Backend_Notes_Service
```

## 👤 User

# AGENTS.md instructions for Q:\ComputerScience\Backend_Notes_Service

<INSTRUCTIONS>
# Istruzioni per gli agenti AI — Backend Notes Service

## Applicazione delle istruzioni

- Leggi questo file prima di analizzare, modificare o creare file nel repository.
- Segui queste istruzioni per ogni nuova richiesta ricevuta nel progetto.
- Se una richiesta dell'utente è in conflitto con questo file, prevale la richiesta esplicita dell'utente.
- Non implementare funzionalità o modifiche non richieste.

## Obiettivo del progetto

Realizzare un backend per la gestione di note operative, rispettando lo stack obbligatorio:

- Node.js;
- TypeScript;
- Fastify;
- SQLite;
- Prisma ORM;
- Vitest.

Privilegiare soluzioni semplici, leggibili, testabili e proporzionate alla challenge.

## Regola obbligatoria: README

Il file `README.md` è parte della consegna e deve restare coerente con lo stato reale del progetto.

Dopo ogni modifica che cambia il comportamento, la configurazione o la struttura del progetto, verifica se il README deve essere aggiornato. Aggiornalo nella stessa attività quando la risposta è sì.

Aggiorna in particolare il README quando vengono aggiunti o modificati:

- endpoint, payload, query parameter, codici di risposta o gestione errori;
- modello dati, migration o variabili d'ambiente;
- comandi di installazione, migrazione, avvio o test;
- dipendenze, script `package.json` o struttura significativa del progetto;
- scelte implementative, assunzioni, limiti noti o miglioramenti futuri.

Non dichiarare nel README funzionalità non implementate. Non considerare una modifica completata se le istruzioni di utilizzo risultano obsolete.

Il README finale deve contenere almeno queste sezioni:

1. Descrizione
2. Analisi della richiesta
3. Stack utilizzato
4. Installazione
5. Configurazione ambiente
6. Database e migration
7. Avvio del progetto
8. Test
9. API disponibili
10. Esempi di richieste
11. Scelte implementative
12. Uso dell'AI
13. Limiti noti
14. Miglioramenti futuri

## Regola obbligatoria: tracciabilità dell'AI

Mantieni `ai-log/prompts.md` aggiornato durante il lavoro. Per ogni fase significativa, annota in modo sintetico:

- obiettivo o prompt ricevuto;
- output o proposta AI rilevante;
- decisioni approvate dall'utente o dallo sviluppatore;
- correzioni, modifiche o proposte AI scartate;
- verifiche eseguite, inclusi test e controlli manuali.

Non inserire segreti, token, credenziali o contenuti personali nel log.

## Qualità e verifica

- Prima di dichiarare completata una modifica, esegui i controlli appropriati: typecheck, lint, test e/o verifica manuale degli endpoint, in base a ciò che esiste nel progetto.
- Se un test o una verifica fallisce, indaga la causa e correggi il problema prima di dichiarare successo.
- Mantieni il database SQLite locale e i file `.env` fuori dal controllo versione; conserva invece `.env.example` e le migration Prisma.
- Evita bonus e complessità aggiuntiva finché CRUD, validazioni, ricerca/filtri, test e documentazione non sono completi.

## Gestione dipendenze npm

- Non eseguire autonomamente installazioni, rimozioni o aggiornamenti di pacchetti npm.
- Quando una dipendenza è necessaria, indica allo sviluppatore il pacchetto,
  il motivo e il comando npm esatto da eseguire.
- Dopo l'intervento dello sviluppatore, verifica versione, manifesto
  `package.json`, lockfile e comandi di progetto interessati.

## Comunicazione

- Spiega brevemente le decisioni tecniche e le verifiche svolte.
- Evidenzia assunzioni, limiti e punti che richiedono una scelta dell'utente.
- Non usare l'AI come fonte incontestabile: verifica sempre API, configurazioni e codice generato.

</INSTRUCTIONS>
<environment_context>
  <cwd>Q:\ComputerScience\Backend_Notes_Service</cwd>
  <shell>powershell</shell>
  <current_date>2026-10-29</current_date>
  <timezone>Europe/Rome</timezone>
  <filesystem><workspace_roots><root>Q:\ComputerScience\Backend_Notes_Service</root></workspace_roots><permission_profile type="managed"><file_system type="restricted"><entry access="read"><special>:root</special></entry><entry access="write"><path>Q:\ComputerScience\Backend_Notes_Service</path></entry><entry access="write"><special>:slash_tmp</special></entry><entry access="write"><special>:tmpdir</special></entry><entry access="read"><path>Q:\ComputerScience\Backend_Notes_Service\.git</path></entry><entry access="read"><path>Q:\ComputerScience\Backend_Notes_Service\.agents</path></entry><entry access="read"><path>Q:\ComputerScience\Backend_Notes_Service\.codex</path></entry><entry access="read"><path>Q:\ComputerScience\Backend_Notes_Service\.aws</path></entry></file_system></permission_profile></filesystem>
</environment_context>

## 👤 User

<external_codex_apps_open_page>{"page_id":null}</external_codex_apps_open_page>

## 👤 User

# Context from my IDE setup:

## Active file: src/routes/notes.ts

## Open tabs:
- notes.ts: src/routes/notes.ts
- app.ts: src/app.ts
- notes.ts: src/services/notes.ts
- notes.ts: src/schemas/notes.ts
- server.ts: src/server.ts

## My request:

elencami cosa è stato fatto, e quanto è coerente con la richiesta delle guidelines. non tenere conto ad ora del reaadme, che sono mie supposizioni e idee di svilupp. valuta solamente la coerenza e correttezza rispetto al testo guida, e se i criteri, fino ad ora, risultano soddisfatti

## 🤖 Agent

Esamino il codice e i test presenti, confrontandoli con i requisiti effettivamente desumibili dal progetto; escluderò volutamente il README dalla valutazione, come richiesto.

**Output:**

```text
... (163 lines trimmed) ...
package.json      -a----
prisma7.config.ts -a----
README.md         -a----
SPEC.md           -a----
tsconfig.json     -a----



```

> 📊 **Tokens:** primary 6.0%, in=22369, out=260

**Output:**

```text
... (447 lines trimmed) ...
?? src/schemas/
?? src/server.ts
?? src/services/
7d00d30 svolti T1 e T2 del file SPEC.md: - aggiunta dei pacchetti necessari, valdiazione ulteriore dell'architettura - T2: configurazione del data layer prisma. Test di migrations e creazione, test di avvio (vuoto) ma funzionante di Node.js
b20506f Aggiornato il README con info su utilizzo AI Creato il file di specifica SPEC.md
869476a Compilazione delle prime fasi del file README. Definizione di linee guida per l'ai Inserimento di prompt e ricerche fatte con l'AI nell'apposito file
40c1e96 Initial commit

```

> 📊 **Tokens:** primary 6.0%, in=24401, out=137

**Output:**

```text
... (1055 lines trimmed) ...

**Verifiche**

- `npm.cmd run build` completato con successo.
- `npm.cmd test` completato con successo; la suite non contiene ancora file di
  test, quindi Vitest termina correttamente con `--passWithNoTests`.


```

> 📊 **Tokens:** primary 6.0%, in=27692, out=243

## 🤖 Agent

La struttura applicativa copre già il nucleo CRUD, validazioni e filtri; sto verificando ora se ciò è effettivamente compilabile/eseguibile e se i punti richiesti dalla challenge sono dimostrati da test, non solo presenti nel codice.

**Output:**

```text
... (94 lines trimmed) ...
 RUN  v5.0.5 Q:/ComputerScience/Backend_Notes_Service

No test files found, exiting with code 0

include: **/*.{test,spec}.?(c|m)[jt]s?(x)
exclude:  **/node_modules/**, **/.git/**


```

> 📊 **Tokens:** primary 6.0%, in=36304, out=384

**Output:**

```text
... (367 lines trimmed) ...
  28:     "@types/node": "^26.6.6",
  29:     "prisma": "^7.10.1",
  30:     "tsx": "^4.23.15",
  31:     "typescript": "^6.0.3",
  32:     "vitest": "^5.0.5"
  33:   }
  34: }

```

> 📊 **Tokens:** primary 6.0%, in=38008, out=413

**Output:**

```text
... (52 lines trimmed) ...
    }
  ],
  warnings: []
}

Node.js v24.20.0
{"success":false,"issues":[{"field":"title","message":"filtro non supportato"}]}

```

> 📊 **Tokens:** primary 6.0%, in=42818, out=948

## 🤖 Agent

Ho confermato una discrepanza concreta: i filtri `title` e `content` sono implementati nel service, ma rifiutati dalla validazione della query. Completo un controllo HTTP in sola lettura, senza modificare file o dati.

**Output:**

```text
Script completed
Wall time 3.1 seconds
Output:
200

```

> 📊 **Tokens:** primary 6.0%, in=44430, out=220

## 🤖 Agent

Escludendo completamente il README, il progetto è già ben allineato al core della challenge, ma non è ancora “completo” perché manca il requisito di testing essenziale.

Cosa risulta fatto:

- Stack obbligatorio presente e coerente: Node.js, TypeScript strict, Fastify, SQLite tramite Prisma, Vitest.
- Modello `Note` realistico e minimale: titolo, contenuto, autore, contesto, tipo, priorità, stato, timestamp.
- Migration Prisma iniziale presente e SQLite locale correttamente escluso da Git.
- CRUD REST implementato:
  - `POST /notes`
  - `GET /notes`
  - `GET /notes/:id`
  - `PATCH /notes/:id`
  - `DELETE /notes/:id`
- Ricerca testuale `q` su titolo/contenuto e filtri per contesto, tipo, priorità e stato.
- Validazioni manuali: campi obbligatori, enum, priorità 1–5, payload PATCH non vuoto, campi/query non supportati.
- Errori applicativi coerenti: `400` per input non valido, `404` per nota assente, `500` generico per errori inattesi.
- Separazione pulita tra app/server, route, validazione, service e accesso Prisma.
- Log AI presente e strutturato; la scelta di usare Codex è tracciabile.

Verifiche effettuate ora:

- `npm run build` ✅
- `npm test` ✅ tecnicamente, ma Vitest segnala “No test files found”.
- Verifica HTTP read-only con Fastify injection: `GET /notes` → `200`.
- Dipendenze dichiarate e installate correttamente, incluse versioni Prisma allineate.

Valutazione rispetto alle guidelines:

| Criterio | Stato |
|---|---|
| Stack imposto | Soddisfatto |
| Persistenza SQLite + Prisma | Soddisfatto |
| CRUD note | Implementato |
| Ricerca e filtri | Implementato, con una correzione necessaria |
| Validazioni e errori | Implementati |
| Modello dati minimo richiesto | Soddisfatto |
| Migrazione e file ambiente | Soddisfatti |
| Test Vitest utili | Non soddisfatto |
| Tracciabilità AI | Sostanzialmente soddisfatta |

L’unico difetto funzionale concreto individuato è qui: [src/schemas/notes.ts](/Q:/ComputerScience/Backend_Notes_Service/src/schemas/notes.ts:193). `title` e `content` sono previsti nei tipi e implementati nel service, ma non compaiono fra i filtri accettati: quindi `GET /notes?title=...` e `?content=...` restituiscono `400`. Va aggiunto ai filtri supportati oppure vanno rimossi dal contratto e dal service.

Il gap principale resta però l’assenza totale di test. La challenge chiede esplicitamente test su creazione valida, input non validi, modifica, eliminazione, ricerca/filtri e nota inesistente. Il codice è predisposto bene per farli con `Fastify.inject`, ma finché non esistono file `.test.ts`, quel criterio non può dirsi soddisfatto.

In sintesi: architettura e implementazione core sono coerenti e abbastanza solide per un MVP; direi circa **75% della consegna tecnica** completata. Per raggiungere i criteri richiesti mancano soprattutto test API reali e la correzione dei due filtri testuali mirati.

> 📊 **Tokens:** primary 6.0%, in=44675, out=1286
