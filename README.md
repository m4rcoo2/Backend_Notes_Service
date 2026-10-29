# Backend Notes Service

## Descrizione

Backend REST per raccogliere e gestire note operative interne. Una nota può descrivere una richiesta emersa con un cliente, un problema da verificare, una decisione, un'attività o un'informazione utile al team.

Il progetto è un MVP: espone le operazioni essenziali su una singola risorsa, conserva i dati in un database SQLite locale e include test automatici dei comportamenti principali.

## Analisi della richiesta

La richiesta viene interpretata come l'esigenza di un punto unico, semplice e persistente in cui il team possa raccogliere informazioni operative legate a un cliente, a un progetto o a un'attività. Il risultato non vuole essere un prodotto collaborativo completo: rappresenta la base backend di un possibile strumento interno.

Per rendere una nota comprensibile anche a distanza di tempo, sono stati considerati essenziali titolo e contenuto, autore, contesto, tipo e stato. La priorità resta facoltativa: è utile per distinguere ciò che richiede attenzione, ma non deve trasformarsi in un dato obbligatorio quando non aggiunge valore. Identificativo e date sono invece generati dal server, così ogni nota conserva dati tecnici coerenti e non dipende dall'orologio o dalle scelte del client.

L'MVP include creazione, elenco, dettaglio, modifica, eliminazione, ricerca testuale, filtri e persistenza. Restano fuori dal perimetro frontend, utenti, autenticazione, ruoli, paginazione, ordinamento configurabile, allegati e notifiche. Sono funzionalità plausibili in un prodotto reale, ma anticiparle avrebbe aumentato la complessità senza migliorare il flusso essenziale richiesto dalla challenge.

Il campo `context` è volutamente testo libero: può contenere il nome di un cliente, di una commessa, di un progetto o di un'attività. In questo modo la nota può essere collegata rapidamente al suo ambito senza introdurre una tabella clienti e API aggiuntive non richieste. Se il contesto dovesse diventare condiviso, validato o gestito come anagrafica, il modello potrà evolvere in una risorsa dedicata.

Prima di un utilizzo in produzione sarebbe utile chiarire chi può leggere e modificare le note, se serve uno storico delle modifiche, quali siano volumi, tempi di conservazione e regole di backup, se clienti e progetti debbano provenire da un'anagrafica e come vadano ordinati i risultati. Le risposte a queste domande inciderebbero direttamente su modello dati, sicurezza e priorità di sviluppo.

La consegna mantiene alcuni limiti intenzionali: SQLite è un database locale, non sono presenti controllo degli accessi né backup automatici e l'elenco non è paginato. Per un MVP sono compromessi ragionevoli; non sono invece caratteristiche adatte, senza ulteriori interventi, a un servizio esposto pubblicamente.

## Stack utilizzato

- Node.js 20 o successivo, runtime dell'applicazione;
- TypeScript, con compilazione in modalità strict;
- Fastify, per il server HTTP e le route REST;
- SQLite, database locale persistente;
- Prisma ORM, per modello dati, migration e accesso al database;
- Vitest, per i test automatici delle API.

## Installazione

Prerequisiti: Git, Node.js 20+ e npm. Verificare l'ambiente:

```powershell
node --version
npm --version
```

Clonare il repository e installare le versioni bloccate nel lockfile:

```powershell
git clone https://github.com/m4rcoo2/Backend_Notes_Service.git
cd backend-notes-service
npm ci
```

Su Windows, se la policy PowerShell blocca `npm.ps1`, usare `npm.cmd` al posto di `npm` in tutti i comandi seguenti.

## Configurazione ambiente

Creare il file `.env` locale a partire dall'esempio. Per Windows:

```powershell
Copy-Item .env.example .env
```

L'unica variabile richiesta è `DATABASE_URL`:

| Variabile | Obbligatoria | Esempio | Descrizione |
| --- | --- | --- | --- |
| `DATABASE_URL` | Sì | `file:./prisma/dev.db` | Percorso del database SQLite usato da Prisma. |
| `PORT` | No | `3000` | Porta HTTP del server. |
| `HOST` | No | `127.0.0.1` | Interfaccia su cui il server ascolta. |

`.env` e i file SQLite restano locali e sono ignorati da Git. Non inserire segreti in `.env.example`.

## Database e migration

Il modello Prisma è in `prisma/schema.prisma`; la migration iniziale è versionata in `prisma/migrations/`. Il modello contiene una sola entità, `Note`:

| Campo | Descrizione |
| --- | --- |
| `id` | Identificativo CUID generato dal server. |
| `title`, `content` | Oggetto e testo della nota. |
| `author` | Persona che registra la nota. |
| `context` | Cliente, progetto, commessa o attività a cui si riferisce. |
| `type` | `REQUEST`, `ISSUE`, `DECISION`, `TASK`, `FOLLOW_UP` oppure `INFO`. |
| `priority` | Facoltativa; intero da 1 a 5. |
| `status` | `OPEN`, `IN_PROGRESS`, `CLOSED` oppure `ARCHIVED`. |
| `createdAt`, `updatedAt` | Timestamp generati e aggiornati dal server. |

Dopo l'installazione, generare il client Prisma e applicare le migration:

```powershell
npm run prisma:generate
npm run prisma:deploy
```

Per creare una nuova migration durante lo sviluppo, dopo aver modificato lo schema:

```powershell
npm run prisma:migrate -- --name descrizione_modifica
```

Il database `prisma/dev.db` viene creato localmente e non va versionato. Su macOS o Linux, per copiare l'ambiente usare `cp .env.example .env`.

## Avvio del progetto

Per lo sviluppo:

```powershell
npm run dev
```

Il server è disponibile in `http://127.0.0.1:3000`, salvo configurazione diversa di `HOST` o `PORT`. Per compilare ed eseguire il codice compilato:

```powershell
npm run build
npm start
```

Il servizio non implementa autenticazione. Non impostare `HOST=0.0.0.0` né esporre il servizio fuori dalla rete locale senza prima introdurre le protezioni necessarie.

## Test

```powershell
npm test
```

La suite usa `Fastify.inject`: le richieste vengono inviate direttamente all'applicazione Fastify, senza aprire una porta HTTP. Questo mantiene i test rapidi e concentrati sul contratto delle API. Prima dell'esecuzione Prisma applica le migration a `prisma/test.db`, un database separato da quello di sviluppo: ogni test può creare e rimuovere dati senza modificare le note locali.

I cinque test scelti coprono i comportamenti che rendono affidabile il flusso principale:

- la creazione di una nota valida verifica che i dati siano persistiti e che il server generi ID e timestamp;
- un payload con priorità non valida e una `PATCH` vuota verificano che l'API rifiuti richieste ambigue o fuori contratto prima di scrivere nel database;
- l'aggiornamento parziale verifica che una modifica non sovrascriva involontariamente i campi non inviati;
- ricerca e filtri combinati verificano che le note possano essere recuperate in modo utile nel lavoro quotidiano;
- la nota inesistente e l'eliminazione verificano la risposta `404` e confermano che una nota eliminata non sia più leggibile.

La suite non mira alla copertura totale del codice: è pensata per proteggere i comportamenti richiesti e i punti in cui una regressione sarebbe più visibile per chi usa l'API.

Per una verifica completa dopo un clone:

```powershell
npm run prisma:generate
npm run prisma:deploy
npm run build
npm test
```

## API disponibili

Base URL: `http://127.0.0.1:3000`. Le richieste con body devono inviare `Content-Type: application/json`.

| Metodo | Endpoint | Esito positivo | Errori gestiti |
| --- | --- | --- | --- |
| `POST` | `/notes` | `201` e nota creata | `400` payload non valido |
| `GET` | `/notes` | `200` e lista di note | `400` filtri non validi |
| `GET` | `/notes/:id` | `200` e nota richiesta | `400` ID vuoto; `404` assente |
| `PATCH` | `/notes/:id` | `200` e nota aggiornata | `400` ID o payload non validi; `404` assente |
| `DELETE` | `/notes/:id` | `204` senza body | `400` ID vuoto; `404` assente |

### Payload delle note

In creazione sono obbligatori tutti i campi eccetto `priority`. Il server rifiuta `id`, `createdAt`, `updatedAt` e altri campi sconosciuti. I valori testuali vengono privati degli spazi iniziali e finali.

| Campo | Regola |
| --- | --- |
| `title` | Stringa non vuota, massimo 200 caratteri. |
| `content` | Stringa non vuota, massimo 10.000 caratteri. |
| `author` | Stringa non vuota, massimo 120 caratteri. |
| `context` | Stringa non vuota, massimo 200 caratteri. |
| `type` | Uno dei sei valori elencati nel modello dati. |
| `priority` | Opzionale; intero da 1 a 5. |
| `status` | Uno dei quattro valori elencati nel modello dati. |

`PATCH /notes/:id` accetta almeno un campo modificabile fra quelli sopra. Non è possibile inviare un body vuoto né modificare direttamente ID e timestamp.

Una nota restituita dal server ha questa forma:

```json
{
  "id": "cm...",
  "title": "Verificare accesso al portale",
  "content": "Il cliente segnala un errore durante il login.",
  "author": "Mario Rossi",
  "context": "Acme S.r.l.",
  "type": "ISSUE",
  "priority": 4,
  "status": "OPEN",
  "createdAt": "2026-10-29T10:00:00.000Z",
  "updatedAt": "2026-10-29T10:00:00.000Z"
}
```

### Ricerca e filtri

`GET /notes` accetta i seguenti parametri opzionali. Tutti i filtri forniti sono combinati con AND; `q` cerca il testo in `title` oppure in `content`.

| Parametro | Regola |
| --- | --- |
| `q` | Ricerca parziale in titolo o contenuto. |
| `title` | Ricerca parziale nel solo titolo. |
| `content` | Ricerca parziale nel solo contenuto. |
| `context` | Corrispondenza esatta con il contesto. |
| `type` | Tipo di nota supportato. |
| `priority` | Intero da 1 a 5. |
| `status` | Stato di nota supportato. |

Un parametro sconosciuto, vuoto o fuori contratto restituisce `400`.

### Errori

Gli errori applicativi hanno `error` e `message`. Gli errori di validazione includono anche `issues`, una lista con campo e motivo.

```json
{
  "error": "VALIDATION_ERROR",
  "message": "La richiesta contiene dati non validi",
  "issues": [
    { "field": "priority", "message": "deve essere un intero tra 1 e 5" }
  ]
}
```

| Codice | Significato |
| --- | --- |
| `400` | Richiesta, ID o filtro non validi. |
| `404` | Nota non trovata. |
| `500` | Errore interno non previsto; i dettagli non vengono esposti. |

## Esempi di richieste

Con il server avviato, in Windows PowerShell usare `Invoke-RestMethod` per evitare le differenze di quoting di `curl`:

```powershell
$body = @{
  title = "Verificare accesso al portale"
  content = "Il cliente segnala un errore durante il login."
  author = "Mario Rossi"
  context = "Acme S.r.l."
  type = "ISSUE"
  priority = 4
  status = "OPEN"
} | ConvertTo-Json

Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:3000/notes" -ContentType "application/json" -Body $body
```

Ricerca testuale con filtri combinati:

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:3000/notes?q=login&context=Acme%20S.r.l.&status=OPEN"
```

In Bash, Git Bash o WSL gli stessi esempi possono essere eseguiti con `curl`:

```bash
curl -X POST http://127.0.0.1:3000/notes \
  -H 'Content-Type: application/json' \
  --data '{"title":"Verificare accesso al portale","content":"Il cliente segnala un errore durante il login.","author":"Mario Rossi","context":"Acme S.r.l.","type":"ISSUE","priority":4,"status":"OPEN"}'

curl 'http://127.0.0.1:3000/notes?q=login&context=Acme%20S.r.l.&status=OPEN'
```

## Scelte implementative

- **Una sola risorsa e contesto libero.** Il dominio viene mantenuto attorno a `Note`; `context` è una stringa e non una relazione con una tabella clienti. La scelta riduce il numero di concetti da gestire e lascia spazio a una futura evoluzione solo se l'anagrafica diventerà realmente necessaria.
- **Responsabilità separate.** Le route Fastify gestiscono HTTP e codici di risposta, gli schemi controllano e normalizzano l'input, mentre il servizio usa Prisma per leggere e scrivere. Ogni parte ha quindi un compito riconoscibile: il codice resta più leggibile e i test possono verificare l'API senza dipendere dall'avvio del server.
- **Validazioni esplicite e proporzionate.** I controlli sono implementati nel progetto senza aggiungere una libreria ulteriore. Verificano campi ammessi, lunghezza delle stringhe, valori degli enum, intervallo della priorità e assenza di una `PATCH` vuota. Per un MVP sono regole piccole ma visibili, facili da modificare e sufficienti a non salvare dati incoerenti.
- **Schema riproducibile.** Prisma descrive il modello e registra la sua creazione nelle migration. Il client viene creato una sola volta e riutilizzato dall'applicazione, mentre le migration permettono a chi riceve il repository di ricostruire lo stesso database locale senza procedure manuali.
- **Errori prevedibili per chi integra l'API.** Le situazioni attese hanno risposte distinte: `400` per dati non validi, `404` per una nota assente e `500` per un errore inatteso. In particolare, gli errori interni non espongono dettagli tecnici al client; questo rende il contratto più chiaro e riduce informazioni non necessarie nella risposta.

## Uso dell'AI

Codex desktop è stato usato direttamente nella cartella del repository come strumento di confronto durante il lavoro, non come sostituto delle decisioni progettuali. Il suo utilizzo ha seguito un percorso progressivo: prima chiarire lo stack e il perimetro dell'MVP, poi ragionare sul modello dati e sulla struttura dell'applicazione, infine revisionare validazioni, test e documentazione.

L'AI mi ha aiutato a formulare alternative e a evidenziare punti da verificare, come per esempio la distinzione fra cliente e `context`, i campi minimi della nota, la separazione fra route, validazione e persistenza, e la coerenza tra filtri documentati e filtri realmente accettati. Le proposte sono state confrontate con la challenge e mantenute solo quando utili al requisito; sono state invece escluse funzionalità premature, come autenticazione, OpenAPI, Docker o una tabella clienti, perché non necessarie al flusso richiesto.

Il lavoro non si è fermato alla generazione di una proposta, ma ha seguito anche la verifica e la validazione. Build TypeScript, test Vitest e verifiche manuali delle API sono stati usati per controllare il risultato; gli errori emersi hanno portato a correzioni del percorso SQLite, dei filtri testuali, dell'handler degli errori e del setup di test su Windows. `ai-log/prompts.md` conserva i prompt principali, gli output rilevanti, le decisioni adottate, le proposte corrette o scartate e le verifiche svolte. 

Come descritto nel file AGENTS.md, Codex ha programmato seguendo task revisionati continuamente da me. La revisione unmana è fondamentale, a mio parere, per evitare di introdurre funzionalita che una intelligenza artificiale ritiene utili ma che sono superflue e, a lungo termine, difficilmente manutenibli.

## Limiti noti

- Non esistono autenticazione, autorizzazione o proprietà della nota: chi raggiunge il servizio può leggere e modificare tutte le note.
- SQLite è appropriato per un MVP locale, non per più istanze concorrenti o alta disponibilità.
- L'elenco non offre paginazione, ordinamento esplicito né limite dei risultati.
- Non sono presenti audit log, soft delete, allegati, notifiche, health check, Docker o specifica OpenAPI.
- Non sono previste policy di conservazione, backup o ripristino del database.

## Miglioramenti futuri

- Introdurre identità, ruoli e autorizzazioni prima di esporre il servizio a utenti reali.
- Definire insieme al cliente un'anagrafica di clienti e progetti se il testo libero del contesto non fosse più sufficiente.
- Aggiungere paginazione, ordinamento e indici quando il volume dei dati lo richiederà.
- Integrare audit trail, soft delete, backup, osservabilità e logging strutturato.
- Valutare un database server per scenari multiutente e pubblicare una specifica OpenAPI quando servirà un'integrazione formale.
