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

### Prompt 12 — T3: validazione, Prisma e servizi

**Obiettivo approvato**

> Aggiungere tipi/validazioni delle note, singola istanza Prisma e logica
> applicativa CRUD/ricerca prima delle route HTTP.

**Decisioni applicate**

- Il client Prisma viene generato sotto `src/generated/`, ignorato da Git e
  incluso nel build TypeScript con percorsi coerenti.
- Le validazioni sono manuali e senza nuove dipendenze: campi obbligatori,
  enum, priorità `1..5`, payload PATCH non vuoto e filtri supportati.
- Il servizio traduce l'assenza di una nota in `NoteNotFoundError`; T4 lo
  mapperà alla risposta HTTP `404`.

**Verifica e correzione**

- PowerShell ha bloccato l'esecuzione di `npm.ps1` per policy locale prima di
  raggiungere i comandi di progetto. Il problema è ambientale, non legato ai
  moduli T3; la verifica prosegue usando `npm.cmd`.

- Il primo controllo manuale del servizio non è partito perché PowerShell ha
  espanso `$disconnect` nel comando inline. Nessun modulo applicativo è stato
  eseguito o modificato; il comando viene ripetuto con l'escape corretto.

- Anche il secondo comando inline ha perso le virgolette nella shell. Per
  isolare la verifica dal quoting PowerShell viene usato un file TypeScript
  temporaneo, eliminato dopo l'esecuzione.

**Esito T3**

- Client Prisma rigenerato in `src/generated/`, mantenuto fuori dal controllo
  versione.
- Verifica manuale del servizio riuscita: create, ricerca `q` con filtri,
  update, delete e `NoteNotFoundError` dopo eliminazione.
- `npm.cmd run build` e `npm.cmd test` terminano con successo; il file di
  verifica temporaneo è stato rimosso.

### Prompt 13 — T4: API Fastify e filtri aggiornati

**Obiettivo approvato**

> Esporre il CRUD REST con Fastify, rispettando i filtri aggiornati nella
> documentazione e nella specifica.

**Decisioni applicate**

- I filtri `title` e `content` si aggiungono a `q`, `context`, `type`,
  `priority` e `status`; `q` cerca trasversalmente, gli altri filtri si
  combinano con AND.
- Le route delegano validazione ai schema e persistenza ai service.
- L'app converte input non validi in `400`, note assenti in `404` e errori non
  previsti in `500`, senza esporre dettagli interni.

**Correzione di compilazione**

- Il typecheck ha segnalato che l'errore ricevuto dall'handler Fastify è
  `unknown`. È stato introdotto il type guard `isBadRequestError`, che accede a
  `statusCode` e `message` solo dopo avere verificato forma e tipi.

**Esito T4**

- Verificate tramite Fastify injection: creazione `201`, input non valido
  `400`, lista con filtri, nota assente `404`, PATCH vuota `400`, update `200`,
  delete `204` e GET dopo delete `404`.
- La nota temporanea usata dalla verifica è stata rimossa; build, test e
  controllo del diff terminano con successo.

### Prompt 14 — T5: test API e correzione filtri testuali

**Problema segnalato e correzione**

- Il validatore della lista dichiarava `title` e `content` nei tipi, ma non li
  accettava tra i query parameter. Sono stati aggiunti ai filtri supportati e
  alla normalizzazione, in coerenza con README, SPEC e servizio.

**Decisioni applicate**

- I test usano `Fastify.inject`, senza aprire una porta HTTP.
- Prima del test viene applicata la migration al database isolato
  `prisma/test.db`; il database di sviluppo non viene modificato.
- I casi coprono create, input invalidi, update, ricerca/filtri, delete e
  nota inesistente, come richiesto dalle linee guida.

**Correzione del test harness**

- Vitest su Windows non può avviare `npm.cmd` con `execFileSync`. Il setup del
  database di test ora invoca direttamente la CLI Prisma tramite l'eseguibile
  Node, evitando un wrapper di shell e mantenendo l'isolamento del database.

**Esito T5**

- `npm.cmd test` esegue cinque test API, tutti superati, sul database isolato.
- `npm.cmd run build` continua a terminare con successo.

### Prompt 13 — Filtri testuali mirati

**Prompt**

> Applicare filtri che consentano di cercare separatamente nel titolo e nel
> contenuto, mantenendo la ricerca generica disponibile.

**Decisioni applicate**

- Aggiunti i query parameter opzionali `title` e `content`: entrambi eseguono
  una ricerca parziale solo nel campo corrispondente.
- `q` resta una scorciatoia di ricerca trasversale su `title` oppure `content`.
- Tutti i filtri forniti restano combinati con AND; la sola OR interna resta
  quella di `q`.
- Aggiornati contratto in `SPEC.md` e documentazione API nel README.

**Verifiche**

- `npm.cmd run build` completato con successo.
- `npm.cmd test` completato con successo; la suite non contiene ancora file di
  test, quindi Vitest termina correttamente con `--passWithNoTests`.

### Prompt 15 — T6: documentazione finale e riproducibilità

**Obiettivo approvato**

> Completare il README senza modificare l'analisi e il flusso di ragionamento
> già scritti, spiegando implementazione, validazione e avvio su un altro
> dispositivo.

**Decisioni applicate**

- Aggiornate solo le sezioni operative, API, esempi, scelte implementative,
  limiti e miglioramenti futuri; la parte iniziale di analisi resta invariata.
- Documentata la sequenza riproducibile: clone, `npm ci`, copia di `.env`,
  generazione del client Prisma, applicazione migration, build, test e avvio.
- Documentati modello dati, vincoli di validazione, tutti i filtri, forma degli
  errori, database di test isolato e limiti effettivi dell'MVP.

**Verifiche eseguite**

- Il README contiene tutte le 14 sezioni richieste dalla challenge e ogni
  comando, endpoint, filtro e vincolo documentato corrisponde al codice.
- `npm.cmd run build` completato con successo.
- `npm.cmd test` completato con successo: 1 file e 5 test API superati.
- `git diff --check` completato senza errori; i soli avvisi riguardano la
  conversione CRLF prevista da Git.
- Le regole locali di Git ignorano `prisma/dev.db`, `prisma/test.db` e
  `src/generated/`. Un avviso di permesso sul file di ignore globale dell'utente
  è esterno al repository e non modifica l'esito delle regole locali.

### Prompt 16 — Correzione esempi di test manuale in PowerShell

**Problema segnalato**

> In PowerShell `curl -X`, `-H` e `-d` restituiscono errori di parametro o
> comando non riconosciuto, con il servizio già in esecuzione.

**Causa e correzione applicata**

- In Windows PowerShell `curl` è un alias di `Invoke-WebRequest`, non il
  binario cURL; inoltre `\` non è un carattere di continuazione di riga.
- Il README ora propone comandi PowerShell copiabili basati su
  `Invoke-RestMethod` e conserva un esempio `curl` solo per Bash, Git Bash e
  WSL. Documenta anche l'uso esplicito di `curl.exe` come alternativa.

**Verifiche eseguite**

- `GET /notes` con `Invoke-RestMethod` ha risposto correttamente dal servizio
  già in esecuzione (lista vuota, `200`).
- Il ciclo PowerShell `POST` (`201`), `PATCH` (`200`) e `DELETE` (`204`) ha
  completato correttamente usando `Invoke-RestMethod`; la nota temporanea è
  stata eliminata.
- `git diff --check` completato senza errori; nessuna modifica a dipendenze o
  al comportamento applicativo.

### Prompt 17 — Allineamento degli esempi alle linee guida

**Richiesta e decisione**

> Riesaminare la sezione di test manuale per attenersi alle istruzioni della
> challenge.

- `Guidelines.md` consente esempi `curl` o un formato semplice; il documento
  di pianificazione del progetto raccomanda due soli esempi: creazione e
  ricerca.
- Il README è stato ridotto a questi due esempi `curl.exe`, validi in Windows
  PowerShell. Non usa più `Invoke-RestMethod` né esempi aggiuntivi di PATCH e
  DELETE.

**Correzione e verifica**

- La prima prova del comando `curl.exe` ha restituito `400`: Windows cURL ha
  ricevuto un body senza le virgolette JSON, perché PowerShell ricompone gli
  argomenti dei programmi nativi.
- Gli esempi ora usano `curl.exe --%` e le virgolette JSON escape. La creazione
  ha restituito `201` e la ricerca con filtri `200`; la nota temporanea della
  verifica è stata eliminata con `204`.
- In Bash, Git Bash o WSL sostituire `curl.exe --%` con `curl` e rimuovere gli
  escape davanti alle virgolette JSON.

### Prompt 18 — Valutazione di chiamate API più strutturate

**Richiesta**

> Valutare alternative al comando cURL PowerShell con JSON incorporato, per
> rendere l'invio di una nuova nota più leggibile e manutenibile.

**Esito della valutazione**

- Le linee guida consentono esplicitamente esempi cURL, file `.http`, Postman
  collection o un altro formato semplice: non impongono il JSON nel comando.
- La soluzione consigliata è mantenere `POST /notes` e il suo body JSON,
  separando il payload in un file `.json` oppure in un file `.http`; non serve
  modificare endpoint, schema Prisma o validazioni.
- `Invoke-RestMethod` con oggetto PowerShell e `ConvertTo-Json` è una valida
  alternativa per inserimenti interattivi su Windows. OpenAPI è un bonus
  opzionale, utile solo se si vuole anche una specifica formale/interattiva.
- Se verranno modificati contratto API o artefatti di test, aggiornare nello
  stesso intervento SPEC, README, test e questo log.

### Prompt 19 — Payload strutturato eseguibile dal terminale

**Richiesta e decisione**

> Documentare il formato strutturato nel README, senza vincolare chi riceve il
> progetto a estensioni VS Code, e consentire l'invio da terminale.

- Aggiunto `requests/create-note.json`, con un payload POST valido, separato
  dal comando di invio.
- Il README usa come percorso principale `Invoke-RestMethod -InFile` in
  Windows PowerShell e documenta l'equivalente `curl --data-binary @file` per
  shell compatibili. Nessuna dipendenza npm, estensione IDE o modifica al
  contratto HTTP è necessaria.
- I file `.http` sono citati come opzione ammessa ma non costituiscono il
  percorso documentato, perché richiedono un client dedicato per essere
  eseguiti.

### Prompt 20 - Riesame completo del README e lessico unificato

**Richiesta**

> Rivalutare e riformattare il README, anche ripartendo dalla sua struttura,
> affinche sia una documentazione completa per chi deve comprendere, avviare e
> valutare l'applicazione. Mantenere l'analisi dei requisiti personale e umana.

**Lavoro svolto e decisioni applicate**

- Il README e stato riscritto a partire dal comportamento effettivo di API,
  validatori, schema Prisma, script npm e test, eliminando duplicazioni e
  terminologia incoerente.
- Il lessico ora usa in modo costante `nota`, `contesto`, `tipo`, `stato`,
  `priorita`, `creazione`, `aggiornamento`, `ricerca` e `filtri`.
- L'analisi iniziale e stata mantenuta in prima persona e separata dal contratto
  tecnico: spiega interpretazione del problema, scelte di perimetro,
  assunzioni, domande al cliente e limiti del MVP.
- Sono state rese piu esplicite la sequenza di installazione, la configurazione
  dell'ambiente, il ciclo delle migration, i dati di test isolati, i vincoli dei
  payload, i filtri combinabili e la forma degli errori.
- Gli esempi manuali usano `Invoke-RestMethod` in PowerShell e `curl` in Bash,
  Git Bash o WSL. Non viene citato alcun file di richiesta non presente nel
  repository.

**Verifiche**

- `npm.cmd run build` completato con successo.
- `npm.cmd test` completato con successo: 1 file e 5 test superati.
- Il README contiene tutte le 14 sezioni richieste dalle linee guida e non
  documenta endpoint o funzionalita non implementati.

### Prompt 22 - Valutazione della copertura degli edge case

**Richiesta**

> I cinque test effettuati coprono tutti gli edge case possibili? Quali casi
> d'uso importanti mancano?

**Esito della revisione**

- Ispezionati il file di test, route, validatori, servizio Prisma e invarianti
  della specifica, senza modificare il comportamento dell'applicazione.
- I cinque test proteggono il flusso principale CRUD, la ricerca con filtri,
  la PATCH parziale, alcune validazioni e il ciclo di eliminazione.
- Non rappresentano una copertura completa: sono stati individuati casi da
  aggiungere per validazioni di confine e tipi errati, campi sconosciuti,
  priorita opzionale, 404 su PATCH/DELETE, filtri non validi o senza risultati,
  ricerca titolo/contenuto separata e controllo di `updatedAt`.

**Implementazione e verifiche**

- Aggiunti sei test al file `tests/notes.test.ts`; la suite passa da 5 a 11
  casi e verifica il contratto senza modificare l'API.
- Coperti GET di una nota esistente, `priority` facoltativa, limiti del titolo,
  validazioni di body e filtri, protezione dei campi gestiti dal server,
  ricerche per campo, lista vuota, 404 su PATCH/DELETE e `updatedAt` in PATCH.
- Aggiornato il README: la sezione Test indica ora 11 test e la copertura
  estesa delle validazioni.
- Eseguiti con successo `npm.cmd test` (11 test) e `npm.cmd run build`.

### Prompt 21 - Approfondimento narrativo di analisi, test e AI

**Richiesta e indicazioni dello sviluppatore**

> Rendere piu approfondite le sezioni Analisi della richiesta, Test, Scelte
> implementative e Uso dell'AI. Il README deve restare tecnico, ma le parti
> esplicative devono essere piu morbide; evitare la prima persona e spiegare
> soprattutto il motivo dei test e delle scelte.

**Decisioni applicate**

- Le quattro sezioni sono state riscritte in una terza persona discorsiva:
  tecnica nei termini necessari, ma orientata a chi non ha seguito il progetto.
- La sezione Test ora collega ogni caso al comportamento e al rischio che
  intende verificare, senza affermare una copertura totale del codice.
- Le scelte implementative spiegano il compromesso fra semplicità dell'MVP,
  chiarezza delle responsabilità, validazione, riproducibilità e contratto
  degli errori.
- La sezione Uso dell'AI descrive il percorso seguito, il ruolo consultivo
  dello strumento, i controlli applicati alle proposte e il contenuto
  ricostruibile di questo log, in coerenza con le linee guida della challenge.

**Verifiche**

- Riesaminate le indicazioni delle linee guida sull'analisi iniziale, sui test
  essenziali e sulla tracciabilità dell'uso dell'AI.
- Verificata la coerenza delle descrizioni con test, codice e documentazione
  già presenti; nessuna modifica al comportamento dell'applicazione.

### Prompt 24 — Implementazione dei test di edge case

**Richiesta**

> Implementare i test di edge case individuati nella revisione della copertura
> e aggiornare il README con lo stato reale della suite.

**Decisioni applicate**

- Mantenuti i test già presenti e aggiunti casi per normalizzazione delle
  stringhe, confini dei campi testuali, tipi errati, campi sconosciuti, PATCH
  invalide senza scritture, JSON malformato e filtri fuori contratto.
- Il README ora documenta la suite di 14 test e precisa gli ambiti non simulati
  (errori interni Prisma e concorrenza), senza modificare il contratto API.

**Verifiche**

- `npm.cmd test` completato con successo: 14 test superati.
- `npm.cmd run build` completato con successo.
- `git diff --check` eseguito senza errori di whitespace.

### Prompt 23 — Copertura operativa completa degli esempi README

**Richiesta**

> Il README, come guida operativa, deve mostrare almeno una volta tutti i casi
> d'uso e i metodi disponibili, per validare l'applicazione e capire come
> inviare le richieste.

**Decisioni applicate**

- Verificate le route effettivamente esposte: `POST /notes`, `GET /notes`,
  `GET /notes/:id`, `PATCH /notes/:id` e `DELETE /notes/:id`.
- Gli esempi PowerShell ora formano un flusso completo: creazione, salvataggio
  dell'ID restituito, elenco filtrato, dettaglio, aggiornamento parziale ed
  eliminazione.
- Aggiunti gli equivalenti comandi `curl` per Bash, Git Bash e WSL; l'ID del
  risultato della creazione è indicato esplicitamente come valore da sostituire.
- Documentato che `DELETE` restituisce `204` senza body e che la lettura dopo
  l'eliminazione restituisce `404`.

**Verifiche**

- Confrontati endpoint, metodi, payload e codici di risposta degli esempi con
  `src/routes/notes.ts` e con le validazioni in `src/schemas/notes.ts`.
- Nessuna modifica al comportamento dell'applicazione, alle dipendenze o alla
  configurazione.
- `npm.cmd run build` completato con successo.
- Il primo `npm.cmd test` ha superato il timeout di 10 secondi nel setup Prisma
  e non ha eseguito i test; il comando ripetuto è passato in 6,39 secondi.
  Il controllo manuale di `prisma migrate deploy` ha richiesto 1,45 secondi:
  l'episodio è stato classificato come rallentamento transitorio di avvio, non
  come regressione dell'API, e registrato come `B10` in `SPEC.md`.
