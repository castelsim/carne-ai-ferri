# Design — Catalogo professionale con schede e piano di preparazione

**Data:** 2026-07-11
**Stato:** approvato da Simone (sessione 11/07)

## Obiettivo

Rendere l'app professionale: catalogo ampliato di carni con scheda completa di
preparazione e cottura per ogni alimento, selezione facile di ciò che si è
acquistato, piano di preparazione generato automaticamente prima del timer
sincronizzato esistente.

## Architettura

- Stack invariato: HTML + CSS + JS vanilla, GitHub Pages, nessun build.
- `script.js` diventa data-driven: un unico array `CATALOGO` con tutti i
  metadati per alimento; le card della griglia di selezione si generano da JS.
- Il motore di sincronizzazione resta quello attuale (eventi metti/gira/togli,
  Web Audio, wake lock, notifiche, sticky banner, timeline).

## Modello dati per alimento

```
id, nome, categoria, icona, note breve card,
tempoSec (o funzione di grado+spessore per bistecca/costata),
flip (null = una girata a metà | "n-m" = ogni n-m minuti),
metodo (diretta | indiretta | mista), calore (alto | medio | medio-basso),
coperchio (bool), tempInterna (°C target), riposoMin, anticipoFrigoMin,
scheda: { acquisto, preparazione, brace, cottura, riposo }
```

## Catalogo (33 alimenti)

- **Manzo:** bistecca*, costata/fiorentina* (nuova), tagliata, hamburger,
  spiedini, picanha a fette (nuova)
- **Maiale:** salsiccia, luganega, salamella (nuova), costine, pancetta,
  braciola, costoletta, wurstel
- **Pollo:** petto, coscia/sovracoscia, ali, galletto alla diavola (nuovo),
  spiedini di pollo (nuovi)
- **Agnello:** costolette, spiedini, arrosticini (nuovi)
- **Pesce & Mare:** salmone, gamberoni, spada/tonno, branzino/orata
- **Verdure:** zucchine, peperoni, melanzane (nuove), cipolla (nuova), mais,
  funghi

\* con opzioni grado di cottura + spessore in cm.

## Sincronizzazione con riposo (novità)

Il target di sincronizzazione diventa **l'ora di servizio**: gli alimenti con
riposo escono dalla griglia prima e riposano mentre gli altri finiscono.

```
totale(item)   = cottura + riposo
T_servizio     = max(totale)
metti(item)    = T_servizio − totale(item)
togli(item)    = metti + cottura   (messaggio: "togli e lascia riposare X min")
finale         = T_servizio ("Servire tutto")
```

## Piano di preparazione generato

Dopo la selezione, "Genera piano" mostra una checklist ordinata a ritroso
rispetto all'inizio cottura: accensione carbonella (ciminiera ~20 min + 10 di
distribuzione → 30-40 min prima), due zone se serve indiretta, carne fuori dal
frigo (anticipo max tra i selezionati), salatura, preparazione griglia.
Campo opzionale "Pronto alle HH:MM" → la checklist mostra orari assoluti e
l'ora a cui premere Avvia.

## Scheda alimento

Pulsante ℹ︎ sulla card apre una scheda (bottom sheet) con 5 sezioni:
Acquisto / Preparazione / Brace / Cottura (con temperatura interna) / Riposo.

## Design visivo

Chiaro ad alto contrasto (uso all'aperto in pieno sole), coerente con gli
altri micro-tool. Badge metodo (diretta/indiretta) e tempo su ogni card.

## Fuori scope

PWA/service worker, localStorage, foto, tema scuro.

## Fonti dati cottura

Weber IT/UK, USDA/FSIS (temperature di sicurezza: manzo-maiale interi 63°C +
3 min riposo, macinati 71°C, pollame 74°C), PassioneBBQ, AtuttaGriglia,
Dissapore/IlMondoDelBarbecue (galletto), Macelleria Pompa/Arrosticini Shop
(arrosticini), Galbani/GianniMacelar (salamella), tempi 24 alimenti esistenti
già verificati Weber (27/05/2026).
