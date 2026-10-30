# Backend Notes Service

## Descrizione

Backend REST per raccogliere e gestire note operative interne. Una nota può descrivere una richiesta emersa con un cliente, un problema da verificare, una decisione, un'attività o un'informazione utile al team.

Il progetto è un MVP: espone le operazioni essenziali su una singola risorsa, conserva i dati in un database SQLite locale e include test automatici dei comportamenti principali.

## Analisi della richiesta

La richiesta è stata interpretata come l'esigenza di un punto unico, semplice e persistente in cui il team possa raccogliere informazioni operative legate a un cliente, a un progetto o a un'attività. Il risultato non vuole essere un prodotto collaborativo completo: rappresenta infatti la base backend di un possibile strumento interno.

### Modello dati: la Nota
Per rendere una nota comprensibile anche a distanza di tempo, sono stati considerati essenziali titolo e contenuto, autore, contesto, tipo e stato. La priorità è considerata facoltativa: è utile per distinguere ciò che richiede attenzione, ma non deve trasformarsi in un dato obbligatorio quando non aggiunge valore. Identificativo e date sono invece generati dal server, così ogni nota conserva dati tecnici coerenti e non dipende dall'orologio o dalle scelte del client.

Il campo `context` è volutamente testo libero: può contenere il nome di un cliente, di una commessa, di un progetto o di un'attività. In questo modo la nota può essere collegata rapidamente al suo ambito senza introdurre una tabella clienti e API aggiuntive non richieste. Se il contesto dovesse diventare condiviso, validato o gestito come anagrafica, il modello potrà evolvere in una risorsa dedicata.

### Funzionalita inserite:
L'MVP include creazione, elenco, dettaglio, modifica, eliminazione, ricerca testuale, filtri e persistenza. Restano fuori dal perimetro frontend, utenti, autenticazione, ruoli, paginazione, ordinamento configurabile, allegati e notifiche. Sono funzionalità plausibili in un prodotto reale, ma anticiparle avrebbe aumentato la complessità senza migliorare il flusso essenziale richiesto dalla challenge.

### Valutazioni implementative:
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
cd Backend_Notes_Service
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

Su macOS o Linux, per copiare l'ambiente usare
```bash
cp .env.example .env
```

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

Il database `prisma/dev.db` viene creato localmente e non va versionato. 

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

Per una verifica completa dopo un clone:

```powershell
npm run prisma:generate
npm run prisma:deploy
npm run build
npm test
```
Altrimenti, se gia buildato:

```powershell
npm test
```

La suite usa `Fastify.inject`: le richieste vengono inviate direttamente all'applicazione Fastify, senza aprire una porta HTTP. Questo mantiene i test rapidi e concentrati sul contratto delle API. Prima dell'esecuzione Prisma applica le migration a `prisma/test.db`, un database separato da quello di sviluppo: ogni test può creare e rimuovere dati senza modificare le note locali.

I quattordici test coprono il flusso principale e i principali confini del contratto:

- creazione valida, ID e timestamp generati dal server, dettaglio di una nota esistente e `priority` omessa;
- creazione e aggiornamento parziale, conservazione dei campi non inviati e aggiornamento di `updatedAt`;
- `404` per risorse inesistenti e per la lettura dopo un'eliminazione;
- ricerca in titolo e contenuto, filtri combinati e lista vuota quando non esistono risultati;
- rifiuto di body, PATCH e filtri non validi, inclusi campi sconosciuti, enum errati, priorità fuori intervallo o di tipo errato e query string vuote;
- normalizzazione degli spazi iniziali e finali, limiti minimi e massimi dei campi testuali e body JSON malformato.

La suite non mira alla copertura totale del codice: non simula errori interni di Prisma né concorrenza tra richieste, ma protegge i comportamenti richiesti e i punti in cui una regressione sarebbe più visibile per chi usa l'API.


## API disponibili

Base URL: `http://127.0.0.1:3000`. Le richieste con body devono inviare `Content-Type: application/json`.

| Metodo | Endpoint | Esito positivo | Errori gestiti |
| --- | --- | --- | --- |
| `POST` | `/notes` | `201` e nota creata | `400` payload non valido |
| `GET` | `/notes` | `200` e lista di note | `400` filtri non validi |
| `GET` | `/notes/id` | `200` e nota richiesta | `400` ID vuoto; `404` assente |
| `PATCH` | `/notes/id` | `200` e nota aggiornata | `400` ID o payload non validi; `404` assente |
| `DELETE` | `/notes/id` | `204` senza body | `400` ID vuoto; `404` assente |

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

`PATCH /notes/id` accetta almeno un campo modificabile fra quelli sopra. Non è possibile inviare un body vuoto né modificare direttamente ID e timestamp.

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

Con il server avviato, la sequenza seguente mostra almeno una volta ogni operazione disponibile. Gli esempi usano la stessa nota: il suo identificativo viene salvato in `$noteId` dopo la creazione e riutilizzato per dettaglio, modifica ed eliminazione.

In Windows PowerShell usare `Invoke-RestMethod`, così non si incontrano le differenze di quoting dell'alias `curl`.

### 1. Creare una nota — `POST /notes`

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

$created = Invoke-RestMethod -Method Post -Uri "http://127.0.0.1:3000/notes" -ContentType "application/json" -Body $body
$noteId = $created.id
$created
```

La risposta ha stato `201` e contiene la nota, compreso l'ID generato dal server.

### 2. Elencare e filtrare le note — `GET /notes`

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:3000/notes?q=login&context=Acme%20S.r.l.&status=OPEN"
```

Questo `GET` cerca `login` in titolo o contenuto e lo combina con `context` e `status`. 

Per ottenere tutte le note basta chiamare `http://127.0.0.1:3000/notes` senza query string:

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:3000/notes"
```

### 3. Leggere una nota per ID — `GET /notes/:id`

```powershell
Invoke-RestMethod -Uri "http://127.0.0.1:3000/notes/$noteId"
```
Dove `$noteId` è L'ID della nota che si vuole analizzare.

### 4. Aggiornare parzialmente una nota — `PATCH /notes/:id`

```powershell
$updateBody = @{
  status = "IN_PROGRESS"
  priority = 5
} | ConvertTo-Json

Invoke-RestMethod -Method Patch -Uri "http://127.0.0.1:3000/notes/$noteId" -ContentType "application/json" -Body $updateBody
```

Sono inviati solo i campi da modificare; gli altri valori della nota restano invariati.

### 5. Eliminare una nota — `DELETE /notes/:id`

```powershell
Invoke-RestMethod -Method Delete -Uri "http://127.0.0.1:3000/notes/$noteId"
```

L'operazione restituisce `204 No Content`, quindi non produce un body di risposta. Dopo l'eliminazione, una richiesta `GET /notes/$noteId` restituisce `404`.
### Comandi di esempio per Linux/MacOS 
In Bash, Git Bash o WSL, la stessa sequenza può essere eseguita con `curl`. Sostituire `ID_RESTITUITO_DAL_POST` con il valore `id` presente nella risposta del primo comando.

```bash
curl -X POST http://127.0.0.1:3000/notes -H 'Content-Type: application/json' --data '{"title":"Verificare accesso al portale","content":"Il cliente segnala un errore durante il login.","author":"Mario Rossi","context":"Acme S.r.l.","type":"ISSUE","priority":4,"status":"OPEN"}'

curl 'http://127.0.0.1:3000/notes?q=login&context=Acme%20S.r.l.&status=OPEN'

curl "http://127.0.0.1:3000/notes/ID_RESTITUITO_DAL_POST"

curl -X PATCH "http://127.0.0.1:3000/notes/ID_RESTITUITO_DAL_POST" -H 'Content-Type: application/json' --data '{"status":"IN_PROGRESS","priority":5}'

curl -X DELETE "http://127.0.0.1:3000/notes/ID_RESTITUITO_DAL_POST"
```

## Scelte implementative

- **Una sola risorsa, con un contesto volutamente libero.** Il perimetro iniziale ruota attorno a `Note`, perché il bisogno da coprire è raccogliere e ritrovare informazioni operative, non costruire un sistema completo per clienti, progetti e utenti. Per questo `context` è una stringa: può rappresentare subito un cliente, una commessa, un progetto o un'attività senza richiedere anagrafiche, relazioni e endpoint aggiuntivi. Una tabella dedicata avrebbe senso solo dopo aver chiarito se tali dati debbano essere condivisi, validati e governati; introdurla nell'MVP avrebbe aumentato la complessità senza rispondere a un requisito emerso.

- **Modello piccolo, ma con le informazioni necessarie per lavorare sulle note.** Titolo e contenuto descrivono la nota, mentre autore, contesto, tipo e stato permettono di capirla e classificarla anche a distanza di tempo. La priorità è opzionale perché è utile solo quando serve distinguere l'urgenza; renderla obbligatoria avrebbe costretto a inserire un valore artificiale per quelle note che non hanno una reale importanza. ID e timestamp sono invece generati dal server: il client non può creare identificativi incoerenti né alterare le date tecniche della risorsa.

- **Responsabilità separate per mantenere il contratto leggibile e verificabile.** Le route Fastify ricevono la richiesta e stabiliscono la risposta HTTP; gli schemi validano e normalizzano l'input; il servizio contiene le operazioni CRUD e di ricerca; Prisma resta confinato al livello di persistenza. Questa divisione è nata per poter introdurre e controllare il comportamento di ogni singolo layer: prima modello e migration, poi validazione e servizi, infine route e mapping degli errori. Riduce anche il rischio che una modifica ai dettagli del database modifichi accidentalmente il contratto HTTP e consente ai test di usare `Fastify.inject` senza aprire una porta di rete.

- **Validazioni manuali, esplicite e proporzionate al dominio.** Non è stata aggiunta una libreria dedicata perché le regole richieste sono circoscritte e facilmente leggibili nel progetto: campi ammessi e obbligatori, stringhe non vuote con limiti di lunghezza, enum supportati, priorità intera fra 1 e 5, query parameter noti e `PATCH` non vuota. Le validazioni normalizzano anche gli spazi iniziali e finali prima della persistenza. La scelta non è soltanto di semplicità: mantiene visibili le regole dell'API e impedisce di salvare dati parziali o incoerenti. La revisione dei filtri `title` e `content`, inizialmente dichiarati ma non accettati dal validatore, ha inoltre confermato la necessità di verificare insieme documentazione, validazione, servizio e test.

- **Ricerca utile senza anticipare requisiti di scala.** `q` cerca trasversalmente in titolo e contenuto, mentre i filtri mirati e quelli di classificazione si combinano con AND. Questa soluzione copre sia una ricerca rapida sia la consultazione di note appartenenti a uno specifico contesto, tipo, priorità o stato. Non sono stati introdotti paginazione, ordinamento configurabile o indici aggiuntivi perché mancano requisiti su volume e modalità di consultazione: sono miglioramenti appropriati quando l'uso reale dimostrerà che servono.

- **Database locale riproducibile, non un artefatto da trasferire.** Prisma descrive il modello e registra la sua evoluzione nelle migration versionate; chi clona il repository genera il client e applica le migration per ricreare il database SQLite locale. Durante la configurazione è stato inoltre allineato `DATABASE_URL` a `file:./prisma/dev.db`, così il percorso effettivo del database coincide con le regole Git che lo escludono: migration e configurazione restano consegnabili, mentre dati locali e file SQLite associati non vengono pubblicati.

- **Errori prevedibili senza esporre dettagli interni.** Il servizio rende esplicita l'assenza di una nota tramite un errore applicativo, che le route trasformano in `404`; input e filtri non validi diventano `400`; le condizioni inattese restano `500`. L'handler controlla la forma dell'errore prima di leggerne le proprietà, perché in TypeScript un errore ricevuto può essere di tipo sconosciuto. In questo modo il client riceve un contratto stabile e messaggi utili, mentre dettagli di Prisma o dell'ambiente rimangono nei log del server invece di essere esposti nella risposta.

## Uso dell'AI

Codex desktop è stato usato direttamente nella cartella del repository come strumento di confronto durante il lavoro, non come sostituto delle decisioni progettuali. Il suo utilizzo ha seguito un percorso progressivo: prima chiarire lo stack e il perimetro dell'MVP, poi ragionare sul modello dati e sulla struttura dell'applicazione, infine revisionare validazioni, test e documentazione.

L'AI mi ha aiutato a formulare alternative e a evidenziare punti da verificare, come per esempio la distinzione fra cliente e `context`, i campi minimi della nota, la separazione fra route, validazione e persistenza, e la coerenza tra filtri documentati e filtri realmente accettati. Le proposte sono state confrontate con la challenge e mantenute solo quando utili al requisito; sono state invece escluse funzionalità premature, come autenticazione, OpenAPI, Docker o una tabella clienti, perché non necessarie al flusso richiesto.

Il lavoro non si è fermato alla generazione di una proposta, ma ha seguito anche la verifica e la validazione. Build TypeScript, test Vitest e verifiche manuali delle API sono stati usati per controllare il risultato; gli errori emersi hanno portato a correzioni del percorso SQLite, dei filtri testuali, dell'handler degli errori e del setup di test su Windows. `ai-log/prompts.md` conserva i prompt principali, gli output rilevanti, le decisioni adottate, le proposte corrette o scartate e le verifiche svolte. 

Come descritto nel file AGENTS.md, Codex ha programmato seguendo task revisionati continuamente da me. La revisione unmana è fondamentale, a mio parere, per evitare di introdurre funzionalità che una intelligenza artificiale ritiene utili ma che sono superflue e, a lungo termine, difficilmente manutenibli.

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
