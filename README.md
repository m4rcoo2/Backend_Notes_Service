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

Prerequisito: Node.js 20 o successivo.

```bash
npm install
```

## Configurazione ambiente

Creare il file `.env` a partire dall'esempio:

```bash
Copy-Item .env.example .env
```

`DATABASE_URL` indica il percorso del database SQLite locale. Il file `.env` e
il database non vengono versionati.

## Database e migration

Lo schema e la migration Prisma saranno aggiunti nella fase successiva. Quando
presenti, si applicheranno con:

```bash
npm run prisma:migrate
```

## Avvio del progetto

Il comando previsto per l'avvio in sviluppo è:

```bash
npm run dev
```

Diventerà operativo dopo l'implementazione del server e delle route.

## Test

```bash
npm test
```

La configurazione Vitest è già disponibile; i test sulle API saranno aggiunti
insieme all'applicazione.

## API previste

Base URL: `http://localhost:3000`

Tutte le richieste con body usano `Content-Type: application/json`.

### Endpoint

| Metodo | Endpoint | Input | Risposta |
| --- | --- | --- | --- |
| `POST` | `/notes` | Body JSON con i campi della nota | `201` e nota creata |
| `GET` | `/notes` | Filtri query opzionali | `200` e lista di note |
| `GET` | `/notes/:id` | ID della nota | `200` e nota; `404` se assente |
| `PATCH` | `/notes/:id` | Uno o più campi modificabili | `200` e nota aggiornata; `404` se assente |
| `DELETE` | `/notes/:id` | ID della nota | `204`; `404` se assente |

### Creazione e modifica

`POST /notes` richiede tutti i campi necessari alla nota.
`PATCH /notes/:id` accetta uno o più campi modificabili.
Essempio:
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
| `q` | Cerca in `title` e `content`. |
| `context` | Filtra per cliente, progetto o attività. |
| `type` | Filtra per tipo di nota. |
| `priority` | Filtra per livello di priorità da 1 a 5. |
| `status` | Filtra per stato. |

I filtri sono combinabili: una nota viene restituita solo se soddisfa
tutti i filtri inviati.

### Errori
| Codice | Quando viene restituito |
| --- | --- |
| `400` | Payload, parametri o valori non validi. |
| `404` | Nota non trovata. |

### Esempi di richieste

    curl -X POST http://localhost:3000/notes \
    -H "Content-Type: application/json" \
    -d '{ ... }'
    curl "http://localhost:3000/notes?status=OPEN&priority=4"

## Esempi di richieste previste

## Scelte implementative

## Uso dell'AI
Per questo progetto è stato utilizzato un piano Codex con GPT-5.6 terra con effort Medio.
Inizialmente è stato usato per fare brainstorming, per comprendere meglio alcuni concetti poco chiari e per aiutarmi nella spiegazione delle componenti dello stack applicativo.
una volta chiariti gli elementi di dubbio, ho iniziato a formare il Data Model, chiedendo conferma a seguito per capire se la struttura rispettasse i vincoli tecnici richiesti.
Una volta fatto ciò ho integrato documenti guida all'AI, come AGENTS.md e, successivamente, SPEC.md, che uso spesso per imporre vincoli tecnici non troppo rigidi ma che mi pernmettano di non uscire dalle richieste.

## Limiti noti

## Miglioramenti futuri
