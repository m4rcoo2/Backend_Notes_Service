# Backend Notes Service

## Descrizione
La challenge tecnica prevede lo sviluppo di un servizio backend per la gestione di Note Operative interne. 
## Analisi della richiesta
La richiesta dell'utente è quella di realizzare uno strumento aziendale utile a tenere traccia delle informazioni utili per un determinato progetto o cliente all'interno del team. Necessario è, quindi, avere una struttura sensata per il dato informativo principale, ovvero la Nota (vedi il Data Model). L'utente deve poter inserire una nota, con tutti i dettagli informativi del caso, di cui titolo, testo, autore, data di creazione (o di eventuale modifica), stato e contesto sono obbligatori, mentre importanza è un campo opzionale.

Ho deciso di non includere una tabella relativa al campo cliente (o comunque relativa al contesto, come ad esempio potrebbe essere una commessa) in quanto non utile all'implementazione effettiva del servizio.
### Funzionalità previste
Per le funzionalita inserite ho pensato alle neecssita operative reali di una nota. Ho immaginato come se avessi davanti una lavagna cancellabile, che è il file SQLite, in cui ogni utilizzatore puo scrivere, leggere, aggiornare o eliminare una nota su di essa.
Sono quindi previste le seguenti API:
- POST notes per pubblicare una nota, ovvero scrivere sulla lavagna
- GET notes per leggerec tutta la lavagna
- GET notes/:id nel quale si legge una specifica nota
- PATCH notes/:id per andare a modificare una specifica nota. Qui è semplificato, perchè la richiesta deve comprendere anche i campi di modifica
- DELETE notes/:id per cancellare una nota

### Funzionalita non implementate 
Altre funzionalita che ho deciso di considerare ma di *non* implementare sono quelle relative alla proprieta di dato:
un utente autore puo modificare una nota di sua proprieta, ma un utente senza autorizzazioni puo solamente visualizzarla. Per farlo sarebbe necessario introdurre un database di utenti, con vari priviliegi, grazie ai quali possono essere effettuate specifiche operazioni.
### Domande al cliente
Dopmande interessanti che mi sono venute in mente durante la lettura sono:
- durata di conservazione del dato: se una nota non viene mai eliminata manualmente, dopo quanto viene eliminata in automatico? questo dovrebbe terenre conto anche di metriche come ultimo accesso alla nota, in modo da non cancellarle solo sulla base della data di creazione/modifica.
- valutare se è necessario creare ridondanza del file db, che ad ora è presente solo in locale (anche se credo che sia solo una semplificazione di progetto).

### Implementazione
L'implementazione, tenuto conto dei requisiti funzionali proposti, è stata strutturata come segue:
#### Data Model
Per ogni nota, si ha 
- identificativo univoco (ID)
- titolo (title)
- testo (content)
- autore (author)
- data di creazione (creationDate)
- data di modifica (updateDate)
- categoria (type): comprende REQUEST, ISSUE, DECISION, TASK, FOLLOW_UP e INFO.
- cliente o contesto (context): niente tabella Client separata. Il requisito richiede collegamento a cliente o contesto, non una rubrica clienti completa, per questo è un semplice campo testuale.
- importanza (priority): campo numerico da 1 a 5
- stato (status): aperta, in sviluppo, chiusa, archiviata. 


### Criteri di accettazione del MVP

Il MVP è considerato completato quando:

- una nota valida può essere creata, letta, modificata ed eliminata;
- input non validi restituiscono un errore coerente;
- la lettura/modifica di una nota inesistente restituisce `404`;
- la lista supporta ricerca testuale e filtri concordati;
- i dati restano disponibili dopo il riavvio del servizio;
- migration, test e avvio sono riproducibili seguendo il README.

## Stack utilizzato
Come da linee guida della challenge, lo stack applicativo prevede:
- Node.js coem runtime che permette l'esecuzione del servizio in Typescript.
- TypeScript come linguaggio applicativo.
- Fastify si occupa di esporre le API, di gestire le route e di eseguire la validazione.
- SQLite per la creazione di un file DB di tipo SQL.
- Prisma ORM permette di connettere in maniera non articolata typescript e SQLite, per semplificare le operazioni sul DB.
- Vitest per i test.

La configurazione usa i pacchetti `fastify` e `@prisma/client` in esecuzione,
oltre a `prisma`, `typescript`, `tsx`, `vitest` e `@types/node` per sviluppo,
build, migration e test.

## Installazione

Prerequisiti: Git e Node.js 20 o successivo (include npm). Per verificare la
versione installata:

```bash
node --version
npm --version
```

Su un nuovo dispositivo, clonare il repository e installare esattamente le
dipendenze bloccate nel lockfile:

```bash
git clone <URL_DEL_REPOSITORY>
cd backend-notes-service
npm ci
```

`npm ci` usa `package-lock.json` e rende riproducibile l'installazione. Se il
repository viene invece ricevuto come cartella o archivio Git, entrare nella
cartella radice del progetto e lanciare soltanto `npm ci`.

Su PowerShell, se l'esecuzione di `npm` viene bloccata dalla policy locale,
usare `npm.cmd` al posto di `npm` (per esempio `npm.cmd ci`).

## Configurazione ambiente

Creare il file `.env` a partire dall'esempio:

```bash
Copy-Item .env.example .env
```

`DATABASE_URL` indica il percorso del database SQLite locale
(`file:./prisma/dev.db`). Il file `.env` e il database non vengono versionati.

Variabili disponibili:

| Variabile | Obbligatoria | Valore predefinito | Scopo |
| --- | --- | --- | --- |
| `DATABASE_URL` | Sì | — | URL SQLite usato da Prisma. Per lo sviluppo usare `file:./prisma/dev.db`. |
| `PORT` | No | `3000` | Porta HTTP del servizio. |
| `HOST` | No | `127.0.0.1` | Interfaccia su cui il server rimane in ascolto. |

Non inserire segreti nel file `.env.example`; per questo MVP contiene solo il
percorso locale del database.

## Database e migration

Il modello `Note` è definito in `prisma/schema.prisma`; la migration iniziale è
versionata in `prisma/migrations/`. Il database locale `prisma/dev.db` viene
creato localmente e resta escluso da Git.

Per applicare tutte le migration già versionate:

```bash
npm run prisma:deploy
```

Generare il client Prisma prima del build o dell'avvio, in particolare dopo un
clone pulito o dopo una modifica dello schema:

```bash
npm run prisma:generate
```

Per creare una nuova migration durante lo sviluppo, dopo una modifica allo
schema:

```bash
npm run prisma:migrate -- --name descrizione_modifica
```

Per preparare un nuovo dispositivo la sequenza completa è quindi:

```bash
npm ci
Copy-Item .env.example .env
npm run prisma:generate
npm run prisma:deploy
npm run build
```

Su macOS/Linux sostituire il secondo comando con `cp .env.example .env`.
Il file `prisma/dev.db` verrà creato localmente dalla migration; non deve essere
aggiunto a Git. Le migration e `.env.example`, invece, fanno parte della
consegna e sono versionati.

## Avvio del progetto

Il comando previsto per l'avvio in sviluppo è:

```bash
npm run dev
```

Il server espone `http://127.0.0.1:3000` salvo configurazione diversa di
`HOST` o `PORT`. Il comando resta attivo e riavvia il processo quando cambiano
i file TypeScript.

Per simulare l'esecuzione di produzione dopo il build:

```bash
npm run build
npm start
```

Per renderlo raggiungibile da altri dispositivi della rete locale impostare,
solo se necessario e con le adeguate regole di rete, `HOST=0.0.0.0`. Il servizio
non implementa autenticazione: non esporlo pubblicamente in questa forma.

## Test

```bash
npm test
```

La suite Vitest esegue cinque test API tramite `Fastify.inject`, senza aprire
una porta HTTP. Prima dei test viene applicata la migration a
`prisma/test.db`, separato dal database di sviluppo. I casi verificano:

- creazione valida con ID e timestamp assegnati dal server;
- payload non valido e PATCH vuota;
- modifica parziale;
- ricerca e combinazione dei filtri, inclusi `title` e `content`;
- nota inesistente ed eliminazione.

Il database di test è locale e ignorato da Git. Per una verifica completa su un
nuovo dispositivo, dopo la preparazione del database eseguire:

```bash
npm run build
npm test
```

## API disponibili

Base URL: `http://localhost:3000`

Tutte le richieste con body usano `Content-Type: application/json`.

### Endpoint

| Metodo | Endpoint | Input | Risposta |
| --- | --- | --- | --- |
| `POST` | `/notes` | Body JSON con i campi della nota | `201` e nota creata; `400` se non valida |
| `GET` | `/notes` | Filtri query opzionali | `200` e lista di note; `400` se i filtri non sono validi |
| `GET` | `/notes/:id` | ID della nota | `200` e nota; `404` se assente |
| `PATCH` | `/notes/:id` | Uno o più campi modificabili | `200` e nota aggiornata; `400` o `404` |
| `DELETE` | `/notes/:id` | ID della nota | `204`; `404` se assente |

### Creazione e modifica

Ogni risposta di successo che contiene una nota ha questa forma:

| Campo | Tipo | Gestione |
| --- | --- | --- |
| `id` | stringa | Generato dal server. |
| `title` | stringa, 1–200 caratteri | Obbligatorio in creazione. |
| `content` | stringa, 1–10.000 caratteri | Obbligatorio in creazione. |
| `author` | stringa, 1–120 caratteri | Obbligatorio in creazione. |
| `context` | stringa, 1–200 caratteri | Obbligatorio in creazione. |
| `type` | enum | `REQUEST`, `ISSUE`, `DECISION`, `TASK`, `FOLLOW_UP`, `INFO`. |
| `priority` | intero opzionale | Se presente, da `1` a `5`. |
| `status` | enum | `OPEN`, `IN_PROGRESS`, `CLOSED`, `ARCHIVED`. |
| `createdAt` | data ISO 8601 | Generata dal server. |
| `updatedAt` | data ISO 8601 | Generata dal server e aggiornata a ogni PATCH. |

`POST /notes` richiede tutti i campi eccetto `priority`; `id`, `createdAt` e
`updatedAt` non vengono accettati dal client. `PATCH /notes/:id` accetta un
sottoinsieme non vuoto dei soli campi modificabili (`title`, `content`,
`author`, `context`, `type`, `priority`, `status`). I valori testuali sono
ripuliti dagli spazi iniziali e finali; i campi sconosciuti o vuoti sono rifiutati.

Esempio di payload per la creazione:
```json
{
  "title": "Verificare accesso al portale",
  "content": "Il cliente segnala un errore durante il login.",
  "author": "Mario Rossi",
  "context": "Acme S.r.l.",
  "type": "ISSUE",
  "priority": 4,
  "status": "OPEN"
}
```

### Ricerca e filtri
| Parametro | Descrizione |
| --- | --- |
| `q` | Ricerca parziale in `title` **oppure** `content`. |
| `title` | Ricerca parziale nel solo titolo. |
| `content` | Ricerca parziale nel solo contenuto. |
| `context` | Corrispondenza esatta con cliente, progetto o attività. |
| `type` | Uno dei tipi di nota supportati. |
| `priority` | Filtra per livello di priorità da 1 a 5. |
| `status` | Uno degli stati di nota supportati. |

I filtri sono combinabili: `q` applica una OR interna fra titolo e contenuto,
mentre tutti i filtri forniti sono poi combinati con AND. Un filtro sconosciuto,
vuoto o con valore fuori contratto restituisce `400`.

### Errori
| Codice | Quando viene restituito |
| --- | --- |
| `400` | Payload, parametri o valori non validi. |
| `404` | Nota non trovata. |
| `500` | Errore interno non previsto. |

Gli errori applicativi hanno almeno `error` e `message`. Per gli errori di
validazione la risposta include inoltre `issues`, con campo e motivo:

```json
{
  "error": "VALIDATION_ERROR",
  "message": "La richiesta contiene dati non validi",
  "issues": [{ "field": "priority", "message": "deve essere un intero tra 1 e 5" }]
}
```

## Esempi di richieste

Per mantenere gli esempi semplici e in linea con le linee guida, ne sono
riportati due: uno di creazione e uno di ricerca. In Windows PowerShell usare `curl.exe`, perché
`curl` è un alias di `Invoke-WebRequest`. `--%` ferma il parsing di PowerShell;
le virgolette del JSON restano quindi valide per il binario cURL.

```powershell
# Creazione
curl.exe -X POST http://127.0.0.1:3000/notes -H "Content-Type: application/json" -d "{"title":"Verificare accesso al portale","content":"Il cliente segnala un errore durante il login.","author":"Mario Rossi","context":"Acme S.r.l.","type":"ISSUE","priority":4,"status":"OPEN"}"

# Ricerca generica con filtri combinati
curl.exe --% http://127.0.0.1:3000/notes?q=login&context=Acme%20S.r.l.&status=OPEN
```

In Bash, Git Bash o WSL sostituire `curl.exe --%` con `curl` e usare il JSON
senza le barre inverse prima delle virgolette.

## Scelte implementative

- Il dominio usa una sola risorsa `Note`: `context` resta un campo testuale,
  evitando una tabella clienti non necessaria ai requisiti del MVP.
- Le route Fastify gestiscono HTTP e delegano regole di input agli schemi e
  persistenza ai servizi Prisma. Questa separazione rende le responsabilità
  leggibili e le API testabili senza avviare il server.
- Le validazioni sono implementate nel progetto, senza introdurre una libreria
  aggiuntiva: proteggono limiti testuali, enum, priorità, campi sconosciuti e
  PATCH vuote.
- Prisma gestisce schema e migration SQLite; una sola istanza del client viene
  condivisa dall'applicazione per evitare connessioni duplicate durante lo
  sviluppo.
- Le note assenti vengono tradotte in `404`; errori di input in `400`; gli
  errori inattesi non espongono dettagli interni al client.

## Uso dell'AI
Per questo progetto è stato utilizzato un piano Codex con GPT-5.6 terra con effort Medio.
Inizialmente è stato usato per fare brainstorming, per comprendere meglio alcuni concetti poco chiari e per aiutarmi nella spiegazione delle componenti dello stack applicativo.
una volta chiariti gli elementi di dubbio, ho iniziato a formare il Data Model, chiedendo conferma a seguito per capire se la struttura rispettasse i vincoli tecnici richiesti.
Una volta fatto ciò ho integrato documenti guida all'AI, come AGENTS.md e, successivamente, SPEC.md, che uso spesso per imporre vincoli tecnici non troppo rigidi ma che mi pernmettano di non uscire dalle richieste.

## Limiti noti

- Non sono presenti autenticazione, autorizzazione o proprietà della nota:
  chi raggiunge il servizio può leggere e modificare tutte le note.
- SQLite è adatto al contesto locale della challenge, non a un'installazione
  distribuita con più istanze concorrenti o esigenze di alta disponibilità.
- La lista non include paginazione, ordinamento esplicito o limiti di risultato.
- Non sono disponibili OpenAPI, Docker, audit log, soft delete o endpoint di
  health check; sono esclusi dal perimetro MVP.
- Il servizio non applica una policy di conservazione o backup del database.

## Miglioramenti futuri

- Introdurre utenti, ruoli e autenticazione prima di una pubblicazione esterna.
- Aggiungere paginazione, ordinamento e indici mirati quando il volume di note
  lo renderà necessario.
- Sostituire o affiancare SQLite con un database server per scenari multiutente
  e predisporre backup, osservabilità e logging strutturato.
- Pubblicare una specifica OpenAPI e aggiungere test di integrazione su un
  ambiente di deployment.
- Valutare soft delete, audit trail e regole di conservazione insieme al cliente.
