# AI Log

## Tool utilizzato

Codex desktop, usato direttamente nella directory locale del repository.

## Prompt principali

### Prompt 1 — Analisi iniziale

**Prompt**

> Prima di iniziare a scrivere codice, serve un brainstorming riepilogativo:
> spiegazione semplice e completa dello stack, gestione dei file e degli output
> dell'AI, definizione del necessario e planning di implementazione.

**Output rilevante**

- Ruoli chiariti per Node.js, TypeScript, Fastify, SQLite, Prisma e Vitest.
- Proposto un MVP con una sola risorsa `Note`, CRUD, ricerca, filtri,
  validazioni e test essenziali.
- Esclusi dal perimetro iniziale frontend, autenticazione e bonus non necessari.
- Proposto un piano in tre giorni: setup e CRUD, validazioni/test, documentazione
  e verifica finale.

**Decisioni prese dallo sviluppatore**

Il progetto partirà dall'MVP, privilegiando semplicità, test e documentazione.

### Prompt 2 — Tracciabilità dell'uso AI

**Prompt**

> Come strutturare il log di Codex e se basta copiare il link della chat.

**Output rilevante**

È stato chiarito che il link alla chat è solo un riferimento facoltativo: la
traccia principale deve essere un file versionato nel repository con prompt,
output rilevanti, decisioni umane e correzioni.

**Decisione presa dallo sviluppatore**

Usare Codex come assistente AI e mantenere questo file aggiornato durante le
fasi significative.

### Prompt 3 — Istruzioni persistenti per l'AI

**Prompt**

> Generare un file di istruzioni per l'AI che imponga l'aggiornamento del README.

**Output rilevante**

Creato `AGENTS.md` con regole per leggere le istruzioni di progetto, mantenere
README e AI log coerenti, eseguire verifiche e non introdurre complessità non
richiesta.

### Prompt 4 — Revisione del modello dati nel README

**Prompt**

> Analizzare anche la prima parte del README e confermare che i campi
> individuati nel documento siano completi.

**Output rilevante**

Il modello previsto copre gli elementi minimi richiesti: argomento (`title` e
`content`), collegamento (`client`), tipo (`type`), importanza (`priority`),
stato (`status`) e date (`createdAt`, `updatedAt`). È stata rilevata una sola
incoerenza da risolvere: l'analisi ammette un cliente oppure un contesto, mentre
il modello prevede solo `client`.

**Correzione del processo**

Dopo la revisione non è stato aggiornato subito questo log, nonostante la regola
di `AGENTS.md`. Il record viene aggiunto ora; nelle fasi successive il log verrà
aggiornato contestualmente alla conclusione della fase.

## Risposte o output rilevanti

L'analisi iniziale è stata integrata nel README, distinguendo funzionalità
pianificate da funzionalità effettivamente implementate.

## Decisioni prese da me

- Usare lo stack obbligatorio senza alternative.
- Non dichiarare nel README elementi pianificati come già implementati.
- Aggiornare README e questo log in ogni fase significativa.

## Codice generato dall'AI che ho modificato

Nessun codice applicativo generato in questa fase. Sono stati creati solo
documenti di progetto e istruzioni.

## Errori o limiti dell'AI che ho corretto

È stato rilevato che il primo `AGENTS.md` era stato creato per errore dentro
`ai-log/`. Il file è stato spostato nella radice del repository, dove Codex può
individuarlo come istruzione di progetto. Le future proposte AI saranno
verificate con typecheck, test e controlli manuali prima dell'accettazione.

### Prompt 7 — Validazione e specifica iniziale

**Prompt**

> Validare l'architettura proposta prima di creare i file applicativi e,
> dopo approvazione, creare una specifica spiegandone il contenuto.

**Output rilevante**

- La separazione tra avvio, route, schemi, servizi e Prisma è stata confermata
  adatta al MVP.
- È stata proposta `SPEC.md` con contratto HTTP, modello, vincoli, invarianti
  controllabili e attività ordinate.
- È stata uniformata la terminologia su `context` come collegamento testuale
  della nota, senza una tabella clienti.

**Decisione approvata dallo sviluppatore**

Creare la sola `SPEC.md` e attendere l'approvazione esplicita prima di
inizializzare il progetto o generare file applicativi.

### Prompt 5 — Documentazione API essenziale

**Prompt**

> Chiarire come descrivere le API nel README senza sovraccaricare il documento
> e valutare le mancanze nella sezione attuale.

**Output rilevante**

La tabella degli endpoint è una buona base, ma la versione finale dovrà indicare
payload di creazione/modifica, query parameter, codici HTTP, forma delle
risposte e pochi esempi reali. Non è necessaria una specifica OpenAPI completa.

### Prompt 6 — Guida alla documentazione e correzione del processo

**Prompt**

> Chiarire cosa inserire nella documentazione delle API e quanto dettagliare
> l'analisi della richiesta; segnalata inoltre l'omissione dell'aggiornamento
> del log richiesto da `AGENTS.md`.

**Output rilevante**

- Individuate incoerenze tra modello e API: `context`/`category` nel modello,
  ma `client`/`type` nella tabella e nei filtri.
- Chiarito che la sezione API deve documentare il contratto esterno del servizio
  con endpoint, input, query, risposte, errori ed esempi, senza spiegare
  l'implementazione interna.
- Chiarito che l'analisi della richiesta deve motivare le scelte di scope e
  modello, non duplicare payload e dettagli degli endpoint.

**Correzione del processo**

Il log viene aggiornato contestualmente a questa fase, come richiesto dalle
istruzioni del repository.

### Prompt 8 — Revisione della specifica

**Prompt**

> Riesaminare `T1` e assicurare coerenza della specifica con README e linee
> guida della challenge.

**Output e decisioni approvate**

- `T1` è stata resa esplicita: include solo configurazione, `.env.example` e
  ignore mirato; schema, API e test restano nelle attività successive.
- `priority` è opzionale nel payload e nel modello, ma se presente è un intero
  da 1 a 5.
- L'endpoint non richiesto `GET /health` è stato escluso.
- Lo stato `DONE` è stato sostituito da `CLOSED`, coerente con la descrizione
  della nota chiusa nel README.

### Prompt 9 — Task T1: configurazione del progetto

**Obiettivo approvato**

> Inizializzare configurazione Node.js, TypeScript e Vitest, aggiungere
> `.env.example`, rendere il `.gitignore` specifico per SQLite e documentare i
> comandi reali, senza introdurre schema Prisma o API.

**Decisioni applicate**

- Node.js 20 o successivo; moduli ESM e TypeScript strict.
- Gli script distinguono sviluppo, build, avvio, test e comandi Prisma.
- Il lockfile npm sarà versionato per rendere le dipendenze riproducibili.
- I file SQLite generati da Prisma sono esclusi, mentre migration e
  `.env.example` restano tracciati.

**Verifica e correzione**

Il primo controllo ha rilevato che le dipendenze non erano state installate:
`npm ls` era vuoto e il comando Vitest non era disponibile. Non è un difetto del
codice; l'installazione verrà ripetuta e verificata esplicitamente prima di
completare la task.

**Verifica successiva**

- Node.js `v24.20.0` e npm `11.19.0` sono disponibili.
- Fastify, Prisma CLI e Vitest sono presenti; `npm test` termina correttamente
  senza test, come configurato per questa fase.
- Mancano `@prisma/client`, `typescript`, `tsx` e `@types/node`; per questo
  `npm run build` fallisce perché il comando `tsc` non è disponibile.
- Il pacchetto `sqlite` è presente ma non è necessario: il requisito richiede
  SQLite tramite Prisma, non una seconda libreria di accesso al database.

**Controllo dopo l'installazione**

- `typescript`, `tsx`, `@types/node` e `@prisma/client` risultano disponibili.
- Il manifesto non dichiara `prisma`, mentre `node_modules` contiene una CLI
  Prisma `8.0.0-rc.28` estranea al lockfile e non compatibile con
  `@prisma/client 7.10.1`; la dipendenza dovrà essere riallineata prima di T2.
- Il build raggiunge TypeScript ma segnala che non esistono ancora file sotto
  `src/`: è previsto fino alla creazione del primo modulo applicativo.

**Correzione della configurazione**

- Dopo l'allineamento di `prisma` e `@prisma/client` alla versione `7.10.1`,
  il solo errore residuo era `TS18003`, causato da una cartella `src/` vuota.
- È stato aggiunto `src/project.d.ts`: una dichiarazione senza logica che rende
  verificabile TypeScript senza anticipare schema, servizi o route.
- Il caso è stato registrato come `B2` e l'invariante `V10` richiede che il
  build della baseline termini con successo.

**Esito T1**

- `npm run build` termina con successo.
- `npm test` termina con successo; non esistono ancora test applicativi, che
  saranno introdotti nella task T5.
- `npm ls --depth=0` conferma le dipendenze dichiarate, incluse versioni Prisma
  e client allineate alla `7.10.1`.

### Prompt 10 — Autorità sulle dipendenze npm

**Decisione dello sviluppatore**

Le installazioni, rimozioni e gli aggiornamenti npm devono essere eseguiti
esclusivamente dallo sviluppatore. L'agente deve indicare pacchetto, motivo e
comando esatto, quindi verificare l'esito dopo l'intervento manuale.

### Prompt 11 — T2: modello e migration Prisma

**Obiettivo approvato**

> Definire il modello Prisma della nota e creare la prima migration SQLite.

**Decisioni applicate**

- Verificati Prisma CLI, Prisma Client e adapter SQLite alla versione `7.10.1`.
- Modello `Note` unico con ID CUID, titolo, contenuto, autore, contesto, tipo,
  priorità opzionale, stato e timestamp automatici.
- `NoteType` e `NoteStatus` mantengono i valori esposti nel README e nella
  SPEC; il vincolo numerico `1..5` di `priority` sarà applicato ai payload
  nella task dedicata alle validazioni.

**Correzione di configurazione**

- Il tentativo iniziale di migration ha restituito un errore generico dello
  schema engine. La diagnostica ha ricondotto il problema al percorso SQLite:
  `file:./dev.db` era risolto dalla configurazione Prisma rispetto alla radice,
  mentre l'ignore mirato copre `prisma/*.db`.
- `DATABASE_URL` è stata uniformata a `file:./prisma/dev.db` in `.env` e
  `.env.example`; la cartella e le regole Git ora coincidono.

**Esito T2**

- Migration iniziale `20261028232035_init` creata e applicata; `prisma/dev.db`
  rimane locale e ignorato.
- `prisma migrate status` conferma database e migration allineati; validazione
  schema, generazione client, build e test terminano con successo.
- Aggiunto `prisma:deploy` per applicare migration già versionate e documentata
  la generazione esplicita del client richiesta da Prisma 7.
