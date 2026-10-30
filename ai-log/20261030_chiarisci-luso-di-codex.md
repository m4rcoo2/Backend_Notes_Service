# Chiarisci l’uso di Codex

```yaml
Source: rollout-2026-10-28T17-53-27-01a1836c-ecc8-7621-888b-63579aa3bd1e_01a1836e-4f83-7f52-b830-e0b0afd30a89.jsonl
Date: 2026-10-28T16:53:27.463Z
CWD: Q:\ComputerScience\Backend_Notes_Service
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

## Comunicazione

- Spiega brevemente le decisioni tecniche e le verifiche svolte.
- Evidenzia assunzioni, limiti e punti che richiedono una scelta dell'utente.
- Non usare l'AI come fonte incontestabile: verifica sempre API, configurazioni e codice generato.

</INSTRUCTIONS>
<environment_context>
  <cwd>Q:\ComputerScience\Backend_Notes_Service</cwd>
  <shell>powershell</shell>
  <current_date>2026-10-28</current_date>
  <timezone>Europe/Rome</timezone>
  <filesystem><workspace_roots><root>Q:\ComputerScience\Backend_Notes_Service</root><root>C:\Users\utente\.codex\visualizations\2026\10\28\01a1836c-ecc8-7621-888b-63579aa3bd1e</root></workspace_roots><permission_profile type="disabled"><file_system type="unrestricted" /></permission_profile></filesystem>
</environment_context>

## 👤 User

devo capire se l'utilizzo di codex è un problme aper questa implementazione,d ato che forse richiedono l'uso di u una AI solamente gratuita, e codex deriva da una ai a pagamento. tu come la interpreti?
leggiti il file guidelines prima di rispondere

## 🤖 Agent

Controllo le linee guida del repository per basare l’interpretazione sul testo effettivo, senza modificare alcun file.

**Output:**

```text
... (7 lines trimmed) ...
-a---          28/10/2026    15:54           2392 .gitignore
-a---          28/10/2026    17:26           3219 AGENTS.md
-a---          28/10/2026    15:57          10119 Guidelines.md
-a---          28/10/2026    17:44           4504 README.md
README.md
AGENTS.md


```

**Output:**

```text
... (10 lines trimmed) ...
-a---          28/10/2026    15:54           2392 .gitignore
-a---          28/10/2026    17:26           3219 AGENTS.md
-a---          28/10/2026    15:57          10119 Guidelines.md
-a---          28/10/2026    17:44           4504 README.md
README.md
AGENTS.md


```

> 📊 **Tokens:** primary 0.0%, in=33276, out=169

**Output:**

```text
... (370 lines trimmed) ...
## Note Finali

Non cercare di impressionarci con complessita' inutile.

Una soluzione semplice, chiara, testata e ben spiegata vale piu' di una soluzione ampia ma fragile.

La cosa piu' importante e' vedere come lavori: come capisci il problema, come usi gli strumenti, come verifichi il risultato e come rendi il progetto comprensibile per chi lo riceve.

```

**Output:**

```text
... (373 lines trimmed) ...
## Note Finali

Non cercare di impressionarci con complessita' inutile.

Una soluzione semplice, chiara, testata e ben spiegata vale piu' di una soluzione ampia ma fragile.

La cosa piu' importante e' vedere come lavori: come capisci il problema, come usi gli strumenti, come verifichi il risultato e come rendi il progetto comprensibile per chi lo riceve.

```

> 📊 **Tokens:** primary 0.0%, in=33636, out=76

**Output:**

```text
... (73 lines trimmed) ...

## Comunicazione

- Spiega brevemente le decisioni tecniche e le verifiche svolte.
- Evidenzia assunzioni, limiti e punti che richiedono una scelta dell'utente.
- Non usare l'AI come fonte incontestabile: verifica sempre API, configurazioni e codice generato.


```

**Output:**

```text
... (76 lines trimmed) ...

## Comunicazione

- Spiega brevemente le decisioni tecniche e le verifiche svolte.
- Evidenzia assunzioni, limiti e punti che richiedono una scelta dell'utente.
- Non usare l'AI come fonte incontestabile: verifica sempre API, configurazioni e codice generato.


```

> 📊 **Tokens:** primary 0.0%, in=36153, out=231

## 🤖 Agent

Sì: io lo considererei un rischio di conformità, anche se le linee guida non vietano esplicitamente Codex o gli strumenti a pagamento.

Il passaggio decisivo è: “usa uno strumento che conosci, che puoi attivare gratuitamente”. Inoltre propongono Gemini CLI proprio perché disponibile con un piano gratuito. Le alternative citano strumenti “gratuiti o personali”, ma nel contesto della challenge l’intento sembra essere: niente dipendenza da un abbonamento AI a pagamento per poter svolgere il lavoro.

Quindi:

- usare Codex, se incluso in un piano a pagamento, potrebbe essere percepito come contrario allo spirito della richiesta;
- non è automaticamente scorretto se avevi già accesso personale, perché menzionano anche strumenti “personali”;
- però è meno difendibile di Gemini CLI e potrebbe aprire una domanda evitabile in valutazione.

La scelta più sicura è usare Gemini CLI gratuito come strumento principale e documentarlo in `ai-log/prompts.md`. Se hai già usato Codex, non dichiarare il falso: registra in modo trasparente il suo contributo e specifica che le decisioni, le verifiche e il codice finale sono stati revisionati da te. Se vuoi eliminare ogni ambiguità, chiederei direttamente al recruiter una conferma scritta, con una domanda breve tipo: “È accettabile usare Codex con un account personale già attivo, oppure preferite esclusivamente strumenti attivabili gratuitamente?”

> 📊 **Tokens:** primary 0.0%, in=37192, out=317
