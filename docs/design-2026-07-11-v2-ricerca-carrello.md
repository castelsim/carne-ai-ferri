# Design v2 — Ricerca, accordion, carrello e calcolo quantità

**Data:** 2026-07-11 · **Stato:** approvato da Simone (stessa sessione della v1)

## Novità rispetto alla v1

1. **Ricerca** in cima alla selezione: filtra live per nome taglio o
   categoria/animale (normalizzazione minuscole+accenti). Le categorie con
   risultati si aprono da sole, le altre spariscono.
2. **Accordion per animale/categoria** (8): Manzo, **Vitello** (nuova),
   Maiale, Pollo, **Tacchino** (nuova), Agnello, Pesce & Mare, Verdure.
   Chiuse di default con conteggio tagli; dentro, le card come in v1.
3. **Catalogo 32 → 55 tagli.** Nuovi:
   - Manzo: filetto (grado+spessore), bavetta, asado/biancostato
   - Vitello: nodino, **braciola di vitello**, tagliata, spiedini, salsiccia
   - Maiale: filetto, capocollo, bombette pugliesi, spiedini, stinco precotto
   - Tacchino: fesa, fuso/coscia, spiedini, hamburger
   - Agnello: cosciotto a fette · Pesce: calamari, sardine · Verdure: radicchio, patate
4. **Carrello** (sezione 2): lista dei selezionati con ✕, sincronizzata con le card.
5. **Calcolo quantità** sul carrello. Input: adulti, bambini, appetito,
   contorni. Dosi (fonti IT: Forma Carni, GrillExperience, My-Barbecue):
   300 g/adulto netto (450 g appetito forte), bambini 50%, −20% con contorni
   abbondanti. Ripartizione equa tra i "secondi" nel carrello; per ogni taglio
   la mappa `SPESA` (peso medio pezzo, resa post-osso/scarto, unità) converte
   la quota in **peso da comprare + numero pezzi**. Verdure fuori dal budget.
   Bottone **Copia lista della spesa**.
6. Piano e timer invariati; sezioni rinumerate 1-4.

## Rese usate (principali)

fiorentina 0,55 · costine 0,45 · ali 0,55 · cosce pollo 0,65 · galletto 0,6 ·
branzino 0,5 · gamberoni 0,5 · sardine 0,6 · stinco 0,6 · nodino vitello 0,75 ·
senz'osso 0,9-1.

## Fonti v2

Dosi: formacarni.it, grillexperience.it, my-barbecue.com. Nodino vitello:
Sfizioso/Braciamiancora (60°C al punto). Bombette: PassioneBBQ + Weber IT
(15-20 min, 72-75°C, no fiamma viva). Il resto: Weber IT/UK + USDA come v1.
