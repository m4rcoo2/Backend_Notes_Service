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
