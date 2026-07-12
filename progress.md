# carne-ai-ferri

**URL live:** https://castelsim.github.io/carne-ai-ferri/  
**Repo:** https://github.com/castelsim/carne-ai-ferri  
**Tipo:** Web app statica (GitHub Pages)  
**Lingua:** HTML + CSS + Vanilla JS (nessun build)

---

## Cosa fa

Assistente professionale per la cottura alla brace. L'utente seleziona gli
alimenti acquistati; l'app fornisce per ognuno una **scheda completa**
(acquisto, preparazione, brace, cottura con temperatura interna, riposo),
genera il **piano di preparazione** della giornata (marinature, salatura,
accensione carbonella, uscita dal frigo, due zone) e sincronizza le cotture
con un timer perché **tutto arrivi in tavola insieme**, riposo incluso.

---

## Stato attuale (12-07-2026, v5) — LA REGIA + PWA

### Flusso in 4 fasi (ridisegno del 12-07)
1. **Scegli i tagli** (ricerca + accordion, invariato)
2. **Carrello e lista della spesa**: quantità automatiche sulle persone +
   spesa precisa a reparti — macellaio (pesi+pezzi), ortolano, dispensa&aromi
   senza doppioni (mappe ING/AROMI, "Limoni 2 · galletto, spiedini"),
   attrezzatura (carbonella stimata, spiedi, alluminio, gratella, mattone,
   termometro). "Condividi la lista della spesa" = SOLO spesa.
3. **Quando si mangia?**: giorno (default oggi) + ora → riepilogo orari →
   **OK — avvia la regia** (con preavviso ⚠ se si è già oltre)
4. **Regia** (modello C ibrido scelto su mockup in Chrome):
   - preparazione ELASTICA: suona al passaggio, ri-suona ogni minuto,
     "Fatto" oltre il margine fa slittare piano e ora del pranzo
   - cottura SUL BINARIO: orologio, "Fatto" solo spunta → tutto insieme
   - card passaggio corrente + timeline a fasi + log
   - **Condividi il piano** (#p=): ogni telefono ricalcola gli stessi orari,
     cottura identica garantita; ospite read-only con Fatto locale
   - persistenza localStorage (reload non perde nulla); retro-compat #c=/#g=

### Griglia aperta + costine (fix 12-07 pomeriggio)
- Schede riscritte per GRIGLIA APERTA sulla brace (il coperchio è solo
  alternativa tra parentesi): costine, coscia pollo, galletto, fuso tacchino
- Costine sdoppiate: Rosticciana (separate, ~30 min diretta) e Rack intero
  (60-75 min zona dolce) → catalogo a 55 tagli
- Scelta salsa BBQ per costine/rosticciana, default AL NATURALE: pannello
  sulla card, salsa in lista spesa solo se scelta, evento 'Spennella la
  glassa' in regia 10 min prima del togli; scelta nei link e nel salvataggio

### PWA
manifest + service worker cache-first (VERSIONE in sw.js da allineare al ?v=)
+ icone dal glifo bistecca: installabile sulla home, offline, standalone.
Notifiche a telefono bloccato = servirebbero push server (escluso): durante
la regia lo schermo resta acceso col wake lock.

---

## Storico v4 (11-07-2026) — icone SVG, sintesi operativa, condivisioni

### Alimenti supportati — 54 in 8 categorie (data-driven, `CATALOGO` in script.js)
| Categoria | Alimenti |
|---|---|
| Manzo (9) | Bistecca*, Costata/Fiorentina*, Filetto*, Tagliata, Hamburger, Spiedini, Picanha, Bavetta, Asado/Biancostato |
| Vitello (5) | Nodino, Braciola, Tagliata, Spiedini, Salsiccia di vitello |
| Maiale (13) | Salsiccia, Luganega, Salamella, Costine, Pancetta, Braciola, Costoletta, Wurstel, Filetto, Capocollo, Bombette pugliesi, Spiedini, Stinco precotto |
| Pollo (5) | Petto, Coscia/sovracoscia, Ali, Galletto alla diavola, Spiedini |
| Tacchino (4) | Fesa, Fuso/coscia, Spiedini, Hamburger di tacchino |
| Agnello (4) | Costolette, Spiedini, Arrosticini, Cosciotto a fette |
| Pesce & Mare (6) | Salmone, Gamberoni, Spada/Tonno, Branzino/Orata, Calamari, Sardine |
| Verdure (8) | Zucchine, Peperoni, Melanzane, Cipolla, Mais, Funghi, Radicchio, Patate |

\* = opzioni grado di cottura (al sangue/media/ben cotta) + spessore in cm.

### Novità v2 (stessa giornata)
- **Ricerca live** per nome taglio o animale (normalizzazione accenti/maiuscole)
- **Accordion per animale**: categorie chiuse di default con conteggio tagli
- **Carrello** sincronizzato con la selezione (✕ per togliere)
- **Calcolo quantità da comprare**: adulti/bambini/appetito/contorni →
  300 g netti a testa (450 abbondante, bambini 50%, −20% contorni abbondanti);
  ripartizione sui tagli con resa post-osso (mappa `SPESA`: peso medio pezzo,
  resa, unità) → peso crudo da comprare + numero pezzi per taglio
- **Copia lista della spesa** (clipboard con fallback)
- Fonti dosi: Forma Carni, GrillExperience, My-Barbecue

### v4 (stessa giornata) — icone SVG, sintesi operativa, condivisione carrello
- **Icone vettoriali**: 45+ glifi line-art disegnati a mano (griglia 64×64,
  contorno 4px, dettagli 2,5px al 55%), chip con tinta per categoria; emoji
  sostituiti ovunque (card, categorie, schede, carrello); revisione visiva
  con 13 glifi ridisegnati
- **Sintesi operativa** sotto il carrello (opzione A scelta su mockup in
  Chrome): blocchi per trattamento condiviso (marinatura/rub 1h, marinatura
  breve, salatura anticipata, sale subito, solo olio, niente) + promemoria
  acquisto; il testo copiato include lista spesa + COME PREPARARLO
- **Condivisione carrello** `#c=`: link per chi cucina con selezione, opzioni,
  persone e orario precaricati (banner, accordion aperti, pronto per Avvia);
  bottone unico "Condividi spesa e preparazione" (il tasto Copia è stato
  rimosso: lo share sheet include già la copia, e il link fa da salvataggio
  del progetto griglia)
- Cache-busting `?v=20260711f` — test: 58/58 PASS

### Condivisione sessione (v3, stessa giornata) — zero server
- A cottura avviata: bottone **"📤 Condividi la griglia"** → share sheet
  nativo (WhatsApp) con programma testuale + link; fallback copia
- Il link codifica tagli+opzioni+ora avvio in `#g=` (base64url); il timer è
  **deterministico**, quindi ogni telefono ricalcola la stessa timeline in
  locale — nessun backend
- **Modalità ospite**: banner "in corso" con orario di servizio, countdown e
  timeline live, eventi passati già spuntati, controlli nascosti; link aperto
  a cottura finita → "completata"
- Limite noto (accettato): condivisione "a fotografia" — se il griller ferma
  o cambia, i link già inviati non si aggiornano
- Refactor motore: `costruisciEventi()` + `pianificaEventi(t0)` con t0 anche
  nel passato

Fonti: Weber IT/UK, USDA/FSIS (macinati 71°C, pollame 74°C, tagli interi
63°C+riposo), PassioneBBQ, AtuttaGriglia, IlMondoDelBarbecue, Macelleria
Pompa, Galbani. Ricerca aggiornata 11-07-2026.

### Novità della riscrittura
- **Schede per alimento** (pulsante ℹ︎ → bottom sheet): 5 sezioni — Acquisto,
  Preparazione, Brace (diretta/indiretta, intensità), Cottura (tempi, girate,
  temperatura interna target), Riposo
- **Piano di preparazione generato** dalla selezione, con orari assoluti se si
  imposta "Voglio mangiare alle HH:MM" (calcola anche quando premere Avvia)
- **Sync sull'ora di servizio**: il timer considera cottura + riposo; i tagli
  che riposano escono prima e riposano mentre il resto finisce
- **Badge** metodo (diretta/indiretta/mista) e calore su ogni card
- Restyle chiaro ad alto contrasto (leggibile in pieno sole), niente più
  alert/confirm (avvisi inline + doppia conferma su Ferma)

### Features tecniche invariate
Web Audio (beep metti/gira/togli/finale), Wake Lock, notifiche browser +
vibrazione, sticky banner countdown, timeline con checkbox, cache-busting
`?v=20260711`.

### Verifica
Test end-to-end headless con puppeteer-core (Chrome di sistema): 59/59 PASS
in v4 (catalogo 54, icone SVG, sintesi operativa, condivisione carrello e sessione, accordion, ricerca, carrello e quantità, lista spesa,
opzioni grado/spessore, piano, schede, offset di sync col riposo, doppia
conferma Ferma, condivisione + modalità ospite con determinismo host/ospite,
zero errori console). Script di test nello scratchpad di sessione (non nel repo).

---

## Storia modifiche

### 12-07-2026 (v5.1) — Griglia aperta + rosticciana/rack + scelta salsa
- Fix fonti coperchio-chiuso; 55 tagli; `?v=20260712b`; 52/52 test

### 12-07-2026 (v5) — La regia della grigliata + PWA
- Flusso unico ora-del-pranzo → OK → passaggi guidati; spesa a reparti con
  aromi/attrezzatura; link #p=; localStorage; manifest+SW+icone
- Cache-busting `?v=20260712a` — 47/47 test (suite su http locale)

### 11-07-2026 (v4) — Icone SVG, sintesi operativa, condivisione carrello
- 45+ glifi vettoriali line-art, chip per categoria; sintesi per trattamento;
  link #c= per chi cucina — cache-busting `?v=20260711e`, 59/59 test

### 11-07-2026 (v3) — Condivisione sessione via link, modalità ospite
- Share sheet nativo + link deterministico `#g=` senza server
- Cache-busting `?v=20260711c`

### 11-07-2026 (v2) — Ricerca + accordion + carrello (docs/design-2026-07-11-v2-*.md)
- Catalogo 32 → 54 tagli, 8 categorie (+Vitello, +Tacchino)
- Ricerca live, accordion per animale, carrello con calcolo quantità e lista spesa
- Cache-busting `?v=20260711b`

### 11-07-2026 — Riscrittura professionale (design in docs/design-2026-07-11-*.md)
- Catalogo 24 → 32 alimenti, data-driven
- Schede complete per alimento + piano di preparazione + sync col riposo
- Restyle chiaro professionale

### 27-05-2026 — Riscrittura griglia card
- 24 alimenti Weber-verified, opzioni bistecca, Web Audio, Wake Lock, sticky banner

---

## Bug noti / prossimi passi

- [ ] Notifica push su iOS richiede PWA con service worker
- [ ] Possibile salvataggio selezione in localStorage
- [ ] Valutare icone anche per gli 8 animali in versioni più dettagliate
