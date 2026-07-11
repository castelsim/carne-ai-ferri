"use strict";

/* ================================================================
   CATALOGO — tempi e temperature verificati su: Weber IT/UK,
   USDA/FSIS (sicurezza: manzo/maiale interi 63°C + 3 min riposo,
   macinati 71°C, pollame 74°C), PassioneBBQ, AtuttaGriglia,
   IlMondoDelBarbecue, Macelleria Pompa, Galbani. Ultimo check: 07/2026.

   Campi:
   - tempo:        secondi di cottura (default)
   - gradi:        {rare, media, well} secondi alla baseline di spessore
   - spessoreBase: cm di riferimento per la scala dei tempi
   - flip:         null = una girata a metà | "n-m" = ogni n-m minuti
   - metodo:       diretta | indiretta | mista
   - calore:       alto | medio | medio-basso
   - tempInterna:  target al cuore (testo)
   - riposo:       minuti di riposo prima di servire
   - frigo:        minuti di anticipo fuori dal frigo
   - marinatura:   minuti minimi di marinatura consigliata (0 = nessuna)
   - salaPrima:    true = beneficia della salatura 40+ min prima
   - scheda:       {acquisto, preparazione, brace, cottura, riposo}
   ================================================================ */

const CATEGORIE = [
  { id: "manzo",    nome: "Manzo",        icona: "🐄" },
  { id: "vitello",  nome: "Vitello",      icona: "🐮" },
  { id: "maiale",   nome: "Maiale",       icona: "🐷" },
  { id: "pollo",    nome: "Pollo",        icona: "🐔" },
  { id: "tacchino", nome: "Tacchino",     icona: "🦃" },
  { id: "agnello",  nome: "Agnello",      icona: "🐑" },
  { id: "pesce",    nome: "Pesce & Mare", icona: "🐟" },
  { id: "verdure",  nome: "Verdure",      icona: "🥦" },
];

const CATALOGO = [

  /* ---------------- MANZO ---------------- */
  {
    id: "bistecca", nome: "Bistecca", categoria: "manzo", icona: "🥩",
    gradi: { rare: 8 * 60, media: 10 * 60, well: 12 * 60 }, spessoreBase: 2.5,
    flip: null, metodo: "diretta", calore: "alto",
    tempInterna: "50-52°C al sangue · 56-58°C media · 66°C+ ben cotta",
    riposo: 5, frigo: 30, marinatura: 0, salaPrima: true,
    scheda: {
      acquisto: "Controfiletto o entrecôte da 2,5 cm di spessore, con un bordo di grasso. Se possibile frollata almeno 15 giorni.",
      preparazione: "Fuori dal frigo 30-60 min prima. Asciugala bene con carta da cucina. Sala abbondante 40+ min prima oppure subito prima di grigliarla — mai nella mezz'ora intermedia, quando il sale tira fuori i succhi senza riassorbirli. Pepe solo a fine cottura (bruciato diventa amaro).",
      brace: "Cottura diretta a fuoco alto: la mano a 10 cm dalla griglia resiste 2-3 secondi. Griglia pulita, unta con carta e olio, ben calda prima di appoggiare la carne.",
      cottura: "Una sola girata a metà tempo. Non premerla e non bucarla. Col termometro al cuore: esci 2-3°C prima del target, salgono col riposo (50-52°C al sangue · 56-58°C media · 66°C+ ben cotta). Sicurezza USDA: 63°C + 3 min di riposo.",
      riposo: "5 min su un tagliere, coperta larga con alluminio (non sigillata: la crosta resta asciutta).",
    },
  },
  {
    id: "costata", nome: "Costata / Fiorentina", categoria: "manzo", icona: "🥩",
    gradi: { rare: 10 * 60, media: 14 * 60, well: 18 * 60 }, spessoreBase: 4,
    flip: null, metodo: "mista", calore: "alto",
    tempInterna: "50-52°C al sangue (tradizione) · 55-58°C media",
    riposo: 8, frigo: 60, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Costata con osso da 4 cm, o fiorentina (con filetto) da 5-6 cm e 1-1,5 kg. Frollatura 20+ giorni: chiedi al macellaio.",
      preparazione: "Fuori dal frigo 60 min prima: con questi spessori è fondamentale, altrimenti il cuore resta freddo. Asciugala bene. Tradizione toscana: nessun condimento prima, sale in scaglie e olio solo a fine cottura.",
      brace: "Due zone e brace abbondante: fuoco vivo per la crosta, zona indiretta per finire senza bruciare. Griglia a 8-10 cm dalla brace.",
      cottura: "4-5 min per lato a fuoco vivo senza mai toccarla, una sola girata. Se è una fiorentina alta, finisci 5-10 min 'in piedi' appoggiata sull'osso: porta a temperatura il cuore proteggendo la carne. Termometro: 50-52°C al sangue (come vuole la tradizione), 55-58°C media.",
      riposo: "8-10 min sotto alluminio largo. Poi stacca i filetti dall'osso, affetta e ricomponi per servire.",
    },
  },
  {
    id: "tagliata", nome: "Tagliata", categoria: "manzo", icona: "🥩",
    tempo: 5 * 60, flip: null, metodo: "diretta", calore: "alto",
    tempInterna: "50-52°C: al cuore resta rosata",
    riposo: 4, frigo: 20, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Controfiletto o sottofiletto da 1-1,5 cm: sottile, cuoce in fretta.",
      preparazione: "Fuori dal frigo 20 min prima, asciugata. Sala subito prima di grigliare: sui tagli sottili la salatura anticipata non serve.",
      brace: "Diretta a fuoco vivo: deve fare crosta subito, il cuore resta rosato.",
      cottura: "2-3 min per lato, una sola girata. Fuori dal fuoco appena fa la crosta: dentro deve restare al sangue.",
      riposo: "3-5 min, poi affetta contro fibra e condisci sul piatto: olio, sale grosso, rucola e grana o solo rosmarino.",
    },
  },
  {
    id: "hamburger", nome: "Hamburger", categoria: "manzo", icona: "🍔",
    tempo: 10 * 60, flip: null, metodo: "diretta", calore: "alto",
    tempInterna: "71°C sempre (carne macinata, USDA)",
    riposo: 0, frigo: 15, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Macinato di manzo con 15-20% di grasso (troppo magro = asciutto). Medaglioni da 2 cm, 150-200 g.",
      preparazione: "Forma i medaglioni senza impastare troppo e premi una fossetta al centro col pollice: in cottura non si gonfiano. Non salare l'impasto (diventa gommoso): sala la superficie subito prima di grigliare.",
      brace: "Diretta a fuoco alto. Griglia ben oliata: il macinato si attacca facilmente.",
      cottura: "4-5 min per lato, una girata sola. MAI schiacciarlo con la paletta: butti i succhi sulla brace. Il macinato va sempre a 71°C al cuore (USDA): niente rosa al centro. Formaggio nell'ultimo minuto.",
      riposo: "Nessuno: componi il panino e servi.",
    },
  },
  {
    id: "spiedini_manzo", nome: "Spiedini di manzo", categoria: "manzo", icona: "🍢",
    tempo: 10 * 60, flip: "3", metodo: "diretta", calore: "medio",
    tempInterna: "58-60°C",
    riposo: 3, frigo: 20, marinatura: 30, salaPrima: false,
    scheda: {
      acquisto: "Cubi regolari di 2,5-3 cm da scamone o controfiletto: pezzi uniformi cuociono uniformi.",
      preparazione: "Marinatura 30 min-2 h (olio, aglio, rosmarino) facoltativa; asciuga bene prima di grigliare. Spiedi di legno: a bagno in acqua 30 min per non farli bruciare. Non stipare i pezzi: lascia 2-3 mm tra i cubi.",
      brace: "Diretta a calore medio.",
      cottura: "10 min circa girando ogni 3: ogni faccia deve rosolare. Verdure intercalate solo se a cottura rapida (peperone, cipolla).",
      riposo: "2-3 min e servi.",
    },
  },
  {
    id: "picanha", nome: "Picanha a fette", categoria: "manzo", icona: "🥩",
    tempo: 14 * 60, flip: "2-3", metodo: "diretta", calore: "medio",
    tempInterna: "50-54°C al cuore",
    riposo: 10, frigo: 30, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Picanha (punta di sella) con il suo strato di grasso da 1-1,5 cm: non farlo togliere. Fette da 3-4 cm tagliate contro fibra.",
      preparazione: "Fuori dal frigo 30 min prima. Solo sale grosso poco prima di grigliare, come in Brasile. Sullo spiedo: piega le fette a C con il grasso all'esterno.",
      brace: "Diretta a calore medio (brace stabilizzata a 160-180°C). Il grasso che cola fa fiammate: tieni pronta una zona libera dove spostare le fette.",
      cottura: "2-3 min per lato girando spesso, in totale ~14 min, fino a 50-54°C al cuore. Chiudi con un'ultima passata sul lato del grasso per renderlo croccante.",
      riposo: "10 min, poi affetta sottile contro fibra.",
    },
  },
  {
    id: "filetto_manzo", nome: "Filetto", categoria: "manzo", icona: "🥩",
    gradi: { rare: 8 * 60, media: 10 * 60, well: 13 * 60 }, spessoreBase: 3.5,
    flip: null, metodo: "diretta", calore: "alto",
    tempInterna: "48-50°C al sangue · 54-56°C media (magro: mai oltre)",
    riposo: 5, frigo: 30, marinatura: 0, salaPrima: true,
    scheda: {
      acquisto: "Medaglioni dal cuore del filetto, 3-4 cm, legati con lo spago per tenere la forma. Il taglio più tenero (e caro) del manzo.",
      preparazione: "Fuori dal frigo 30 min prima. Sala 40+ min prima o subito prima; un filo d'olio: è magrissimo e senza grasso di protezione.",
      brace: "Diretta a fuoco alto per la crosta, bordo della brace per finire.",
      cottura: "2-3 min per faccia a fuoco vivo, poi sposta al bordo fino al target. Senza grasso interno si asciuga oltre la media: 48-50°C al sangue, 54-56°C media, stop.",
      riposo: "5 min, con una noce di burro sopra se vuoi il tocco da ristorante.",
    },
  },
  {
    id: "bavetta", nome: "Bavetta", categoria: "manzo", icona: "🥩",
    tempo: 10 * 60, flip: null, metodo: "diretta", calore: "alto",
    tempInterna: "52-55°C: al sangue/media, mai oltre",
    riposo: 8, frigo: 30, marinatura: 60, salaPrima: false,
    scheda: {
      acquisto: "Bavetta (flank steak): taglio piatto della pancia con fibre lunghe ed evidenti, 700 g-1 kg intera. Economica e saporitissima.",
      preparazione: "Marinatura 1 h+ (olio, salsa di soia o limone, aglio): le fibre aperte la assorbono benissimo. Asciugare bene prima della griglia.",
      brace: "Diretta a fuoco vivo.",
      cottura: "4-5 min per lato, una girata. Va tenuta al sangue/media (52-55°C): oltre le fibre si stringono e diventa dura.",
      riposo: "8-10 min, poi SEMPRE affettata sottile perpendicolare alle fibre lunghe: è il segreto per averla tenera.",
    },
  },
  {
    id: "asado", nome: "Asado / Biancostato", categoria: "manzo", icona: "🥩",
    tempo: 15 * 60, flip: "3-4", metodo: "diretta", calore: "medio",
    tempInterna: "70°C+: qui si va ben cotti, grasso croccante",
    riposo: 5, frigo: 30, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Biancostato/asado di manzo a fette sottili (1-1,5 cm) tagliate ATTRAVERSO le costine, stile 'banderita' argentina.",
      preparazione: "Solo sale grosso prima di grigliare, alla maniera argentina.",
      brace: "Diretta a calore medio e costante.",
      cottura: "12-15 min girando ogni 3-4. Al contrario delle bistecche qui si va BEN cotti (70°C+): il grasso deve diventare croccante e la carne staccarsi dall'ossicino.",
      riposo: "5 min.",
    },
  },

  /* ---------------- VITELLO ---------------- */
  {
    id: "nodino_vitello", nome: "Nodino di vitello", categoria: "vitello", icona: "🥩",
    tempo: 12 * 60, flip: null, metodo: "diretta", calore: "medio",
    tempInterna: "60-62°C appena rosato (sicurezza USDA 63°C)",
    riposo: 5, frigo: 30, marinatura: 0, salaPrima: true,
    scheda: {
      acquisto: "Nodino (la 'fiorentina' del vitello: costoletta con osso a T) da 2,5-3 cm, carne rosa chiaro e compatta.",
      preparazione: "Fuori dal frigo 30 min prima. Sala 40+ min prima o subito prima; un filo d'olio perché il vitello è magro.",
      brace: "Diretta a calore medio-alto; oltre i 3 cm finisci in zona indiretta.",
      cottura: "5-6 min per lato, una girata. Il vitello è più delicato del manzo: appena rosato al cuore (60-62°C) è al suo meglio, ben oltre si asciuga.",
      riposo: "5 min coperto.",
    },
  },
  {
    id: "braciola_vitello", nome: "Braciola di vitello", categoria: "vitello", icona: "🥩",
    tempo: 7 * 60, flip: null, metodo: "diretta", calore: "medio",
    tempInterna: "60-62°C: centro appena rosato",
    riposo: 3, frigo: 20, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Braciola o fettina di vitello da 1-1,5 cm, con o senza osso.",
      preparazione: "Fuori dal frigo 20 min prima, asciutta; olio leggero e sale subito prima di grigliare.",
      brace: "Diretta a calore medio-alto: è sottile, serve crosta veloce.",
      cottura: "3-4 min per lato, una girata. Fuori appena il centro è rosato: il vitello sottile si asciuga in un attimo.",
      riposo: "2-3 min.",
    },
  },
  {
    id: "tagliata_vitello", nome: "Tagliata di vitello", categoria: "vitello", icona: "🥩",
    tempo: 6 * 60, flip: null, metodo: "diretta", calore: "alto",
    tempInterna: "56-58°C: rosata",
    riposo: 4, frigo: 20, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Controfiletto o noce di vitello da ~2 cm, da affettare dopo la cottura.",
      preparazione: "Fuori dal frigo 20 min prima, asciugata. Sala subito prima.",
      brace: "Diretta a fuoco vivo.",
      cottura: "2-3 min per lato, una girata: crosta fuori, rosata dentro (56-58°C).",
      riposo: "4 min, poi affetta contro fibra: olio, limone, rucola e scaglie di grana.",
    },
  },
  {
    id: "spiedini_vitello", nome: "Spiedini di vitello", categoria: "vitello", icona: "🍢",
    tempo: 10 * 60, flip: "3", metodo: "diretta", calore: "medio",
    tempInterna: "62°C",
    riposo: 3, frigo: 20, marinatura: 30, salaPrima: false,
    scheda: {
      acquisto: "Cubi regolari di 2,5 cm da noce o sottofesa di vitello.",
      preparazione: "Marinatura 30 min (olio, limone, salvia o rosmarino): il vitello magro la ringrazia. Spiedi di legno a bagno 30 min.",
      brace: "Diretta a calore medio.",
      cottura: "~10 min girando ogni 3. Appena rosato al centro: 62°C.",
      riposo: "3 min.",
    },
  },
  {
    id: "salsiccia_vitello", nome: "Salsiccia di vitello", categoria: "vitello", icona: "🌭",
    tempo: 14 * 60, flip: "4-5", metodo: "diretta", calore: "medio",
    tempInterna: "71°C (carne macinata)",
    riposo: 2, frigo: 15, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Salsiccia di vitello: più magra e delicata di quella di maiale.",
      preparazione: "Non bucarla. Un filo d'olio sulla superficie: essendo magra tende ad attaccarsi.",
      brace: "Diretta a calore medio, senza fiamma.",
      cottura: "12-15 min girando ogni 4-5. Da macinato va a 71°C, ma essendo magra non oltre: si asciuga prima di quella di maiale.",
      riposo: "2 min.",
    },
  },

  /* ---------------- MAIALE ---------------- */
  {
    id: "salsiccia", nome: "Salsiccia", categoria: "maiale", icona: "🌭",
    tempo: 18 * 60, flip: "4-5", metodo: "mista", calore: "medio",
    tempInterna: "71-74°C: al taglio niente rosa, succhi chiari",
    riposo: 3, frigo: 15, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Salsiccia fresca di puro suino. Calcola 2 a testa.",
      preparazione: "NON bucherellarla: perde i succhi, si asciuga e il grasso che cola incendia la brace. Fuori dal frigo 15-20 min prima.",
      brace: "Calore medio, mai fiamma viva: l'esterno brucia e l'interno resta crudo. Ideale in due tempi: prima in zona dolce/indiretta, poi rosolatura finale vicino alla brace.",
      cottura: "15-20 min girando ogni 4-5. Pronta a 71-74°C al cuore: al taglio niente rosa e succhi chiari.",
      riposo: "2-3 min e in tavola.",
    },
  },
  {
    id: "luganega", nome: "Luganega", categoria: "maiale", icona: "🌭",
    tempo: 12 * 60, flip: "3-4", metodo: "diretta", calore: "medio",
    tempInterna: "71°C",
    riposo: 2, frigo: 15, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Luganega fresca a metro, 150-200 g a testa.",
      preparazione: "Arrotolala a chiocciola e bloccala con due spiedi incrociati: resta piatta, si gira in un gesto e cuoce uniforme. Non bucarla.",
      brace: "Diretta a calore medio, senza fiamme.",
      cottura: "10-14 min girando ogni 3-4 (o a metà se a chiocciola). È sottile: cuoce prima della salsiccia normale. 71°C al cuore.",
      riposo: "2 min e servi.",
    },
  },
  {
    id: "salamella", nome: "Salamella", categoria: "maiale", icona: "🌭",
    tempo: 16 * 60, flip: "4-5", metodo: "mista", calore: "medio",
    tempInterna: "71°C",
    riposo: 3, frigo: 15, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Salamella mantovana fresca (macinato grosso di suino). 1-2 a testa.",
      preparazione: "Spennella con poco olio perché non si attacchi. Non bucarla: il grasso è il suo condimento.",
      brace: "Due tempi: 10-12 min a calore moderato perché il calore arrivi al cuore, poi 2-4 min vicino alla brace per la crosta.",
      cottura: "~16 min totali girando ogni 4-5. Pronta a 71°C: soda al tatto, niente rosa al taglio.",
      riposo: "2-3 min, perfetta nel pane.",
    },
  },
  {
    id: "costine", nome: "Costine", categoria: "maiale", icona: "🦴",
    tempo: 90 * 60, flip: "20-25", metodo: "indiretta", calore: "medio-basso",
    tempInterna: "88-92°C tra le ossa per averle tenere",
    riposo: 10, frigo: 30, marinatura: 60, salaPrima: false,
    scheda: {
      acquisto: "Rack intero di costine. Fatti togliere la pleura (la membrana lucida sul lato osso) dal macellaio, o strappala tu aiutandoti con carta assorbente.",
      preparazione: "Rub 1 h prima (o la sera prima, in frigo scoperto): sale, pepe, paprika dolce, zucchero di canna, aglio in polvere. Fuori dal frigo 30 min prima di cuocere.",
      brace: "Indiretta a ~150°C con coperchio: tutta la brace su un lato, costine sull'altro, lato osso in giù. Rabbocca carbonella dopo ~45 min.",
      cottura: "~90 min girando ogni 20-25. Pronte quando la carne si è ritirata di ~1 cm dall'osso e sollevando il rack con le pinze la superficie si crepa. Termometro tra le ossa: 88-92°C. Salsa BBQ solo negli ultimi 10 min: prima brucerebbe.",
      riposo: "10 min coperte, poi taglia tra le ossa.",
    },
  },
  {
    id: "pancetta", nome: "Pancetta", categoria: "maiale", icona: "🥓",
    tempo: 6 * 60, flip: "2-3", metodo: "diretta", calore: "medio",
    tempInterna: "croccante fuori, il grasso deve diventare trasparente",
    riposo: 0, frigo: 10, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Pancetta fresca a fette da almeno 5 mm (troppo sottile brucia e basta).",
      preparazione: "Nessuna: è già condita dal suo grasso. Niente olio.",
      brace: "Diretta a calore medio ma in zona 'controllabile': il grasso che cola fa fiammate, tieni le pinze in mano e una zona libera a fianco.",
      cottura: "2-3 min per lato girando spesso: deve diventare dorata e croccante, con il grasso trasparente.",
      riposo: "Nessuno: servila calda e croccante.",
    },
  },
  {
    id: "braciola", nome: "Braciola", categoria: "maiale", icona: "🥩",
    tempo: 7 * 60, flip: null, metodo: "diretta", calore: "alto",
    tempInterna: "62-63°C + 3 min riposo (USDA)",
    riposo: 3, frigo: 20, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Braciola sottile (~1 cm), con o senza osso.",
      preparazione: "Fuori dal frigo 20 min prima, asciugata, un filo d'olio e sale subito prima. Taglia il bordo di grasso in 2-3 punti: non si arriccia.",
      brace: "Diretta a fuoco medio-alto.",
      cottura: "3-4 min per lato, una girata. È sottile: 62-63°C al cuore e via, oltre diventa asciutta.",
      riposo: "3 min e servi.",
    },
  },
  {
    id: "costoletta", nome: "Costoletta", categoria: "maiale", icona: "🥩",
    tempo: 10 * 60, flip: null, metodo: "diretta", calore: "medio",
    tempInterna: "62-63°C + 3 min riposo (USDA): leggermente rosata è giusta",
    riposo: 3, frigo: 20, marinatura: 0, salaPrima: true,
    scheda: {
      acquisto: "Costoletta (braciola con osso) da ~2 cm.",
      preparazione: "Fuori dal frigo 20-30 min prima. Sala 40 min prima o subito prima. Incidi il grasso sul bordo per non farla arricciare.",
      brace: "Diretta a calore medio; se molto spessa finisci in zona indiretta.",
      cottura: "4-5 min per lato, una girata. Fuori a 62-63°C: il maiale moderno leggermente rosato al centro è sicuro (USDA 63°C + riposo) e resta succoso. Ben oltre = suola.",
      riposo: "3-5 min coperta.",
    },
  },
  {
    id: "wurstel", nome: "Wurstel", categoria: "maiale", icona: "🌭",
    tempo: 8 * 60, flip: "2-3", metodo: "diretta", calore: "medio",
    tempInterna: "va solo scaldato: è già cotto",
    riposo: 0, frigo: 0, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Wurstel di suino o pollo, formato grande da griglia.",
      preparazione: "Taglietti diagonali superficiali facoltativi: si apre a fisarmonica e fa più crosta.",
      brace: "Diretta a calore medio.",
      cottura: "6-10 min girando ogni 2-3: è precotto, serve solo scaldarlo al cuore e marcarlo fuori.",
      riposo: "Nessuno.",
    },
  },
  {
    id: "filetto_maiale", nome: "Filetto di maiale", categoria: "maiale", icona: "🥩",
    tempo: 22 * 60, flip: "5-6", metodo: "mista", calore: "medio",
    tempInterna: "62-63°C: rosato al centro = succoso e sicuro (USDA)",
    riposo: 5, frigo: 30, marinatura: 0, salaPrima: true,
    scheda: {
      acquisto: "Filetto di maiale intero (400-500 g), pulito dalla pellicina argentata (chiedi al macellaio: cruda è gommosa).",
      preparazione: "Sale 40+ min prima, o un rub leggero (paprika, aglio, pepe); un filo d'olio.",
      brace: "Mista: rosolatura in diretta, poi zona indiretta per finire.",
      cottura: "~8 min in diretta girandolo sui 4 'lati', poi 12-15 min in indiretta fino a 62-63°C al cuore. Rosato al centro è perfetto: stracotto è il modo classico di rovinarlo.",
      riposo: "5 min, poi a medaglioni spessi.",
    },
  },
  {
    id: "capocollo", nome: "Capocollo a fette", categoria: "maiale", icona: "🥩",
    tempo: 9 * 60, flip: null, metodo: "diretta", calore: "medio",
    tempInterna: "68-70°C: il grasso interno deve sciogliersi",
    riposo: 3, frigo: 20, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Capocollo/coppa fresca a fette da 1,5-2 cm: venato di grasso, è tra i tagli più riconoscenti sulla brace.",
      preparazione: "Niente olio (è già grasso), sale leggero: è saporito di suo.",
      brace: "Diretta a calore medio; il grasso può fare fiammate, tieni una zona libera.",
      cottura: "4-5 min per lato. Al contrario dei tagli magri, qui serve arrivare a 68-70°C: il grasso interno si scioglie ed è quello che lo rende morbido.",
      riposo: "3 min.",
    },
  },
  {
    id: "bombette", nome: "Bombette pugliesi", categoria: "maiale", icona: "🧆",
    tempo: 16 * 60, flip: "5", metodo: "mista", calore: "medio",
    tempInterna: "72-75°C: maiale sicuro e cuore di formaggio fuso",
    riposo: 2, frigo: 20, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Bombette pronte dal macellaio (involtini di capocollo ripieni di caciocavallo o canestrato), o falle tu: fetta sottile di capocollo, formaggio, sale, pepe, prezzemolo, chiuse a pallina.",
      preparazione: "Infilale ben strette su uno spiedo d'acciaio: si girano tutte insieme e non si aprono.",
      brace: "Brace calda ma MAI fiamma viva, meglio con zona indiretta: il grasso e il formaggio che colano si carbonizzano sul fuoco diretto.",
      cottura: "15-20 min girando lo spiedo ogni 5. Pronte a 72-75°C: dorate fuori, cuore di formaggio fuso e filante.",
      riposo: "2 min: il formaggio dentro scotta.",
    },
  },
  {
    id: "spiedini_maiale", nome: "Spiedini di maiale", categoria: "maiale", icona: "🍢",
    tempo: 12 * 60, flip: "3", metodo: "diretta", calore: "medio",
    tempInterna: "63-65°C",
    riposo: 3, frigo: 20, marinatura: 30, salaPrima: false,
    scheda: {
      acquisto: "Cubi di 2,5 cm da coppa (più succosa) o lonza (più magra).",
      preparazione: "Marinatura 30 min+ (olio, aglio, rosmarino, paprika). Spiedi di legno a bagno 30 min. Pezzi non stipati.",
      brace: "Diretta a calore medio.",
      cottura: "10-14 min girando ogni 3. La coppa perdona, la lonza no: fuori a 63-65°C.",
      riposo: "3 min.",
    },
  },
  {
    id: "stinco", nome: "Stinco (precotto)", categoria: "maiale", icona: "🍖",
    tempo: 28 * 60, flip: "5-6", metodo: "mista", calore: "medio",
    tempInterna: "già cotto: portalo a 70°C+ al cuore, cotenna croccante",
    riposo: 5, frigo: 30, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Stinco di maiale PRECOTTO (sottovuoto): quello crudo alla brace richiede 3 ore, non è da grigliata.",
      preparazione: "Asciugalo, massaggialo con olio e paprika. Prepara una glassa (miele+senape, o birra e miele) per il finale.",
      brace: "Mista: prevalentemente zona media/indiretta, rotazioni frequenti.",
      cottura: "25-30 min girando ogni 5-6 finché la cotenna è croccante e il cuore ben caldo (70°C+). Glassa solo negli ultimi 5-10 min: prima brucia.",
      riposo: "5 min.",
    },
  },

  /* ---------------- POLLO ---------------- */
  {
    id: "petto_pollo", nome: "Petto di pollo", categoria: "pollo", icona: "🍗",
    tempo: 12 * 60, flip: null, metodo: "diretta", calore: "medio",
    tempInterna: "74°C sempre (pollame, USDA)",
    riposo: 3, frigo: 20, marinatura: 30, salaPrima: false,
    scheda: {
      acquisto: "Petti interi o a fette spesse (2 cm). Fette sottili si seccano subito.",
      preparazione: "Batti leggermente la parte più spessa per uniformare lo spessore. Contro la secchezza: marinatura 30 min+ (olio, limone, erbe) oppure salamoia rapida 30 min (1 l acqua + 60 g sale), poi asciugare.",
      brace: "Diretta a calore medio: il fuoco alto lo asciuga fuori prima che sia cotto dentro.",
      cottura: "5-6 min per lato, una girata. Il pollame va SEMPRE a 74°C al cuore (USDA): niente rosa, succhi chiari. Termometro nel punto più spesso.",
      riposo: "3-5 min coperto.",
    },
  },
  {
    id: "coscia_pollo", nome: "Coscia / sovracoscia", categoria: "pollo", icona: "🍗",
    tempo: 30 * 60, flip: "10-12", metodo: "mista", calore: "medio",
    tempInterna: "75-80°C all'articolazione",
    riposo: 5, frigo: 20, marinatura: 30, salaPrima: false,
    scheda: {
      acquisto: "Cosce o sovracosce con pelle e osso: restano succose e sono il taglio più adatto alla brace.",
      preparazione: "Marinatura 30 min+ (olio, limone, paprika, aglio) o solo sale mezz'ora prima. Asciuga la pelle: più asciutta = più croccante.",
      brace: "Mista: parte in zona indiretta (~180°C, coperchio se c'è), rosolatura finale sulla brace. Pelle verso l'alto all'inizio.",
      cottura: "25-35 min girando ogni 10-12. Il grasso della pelle fa fiammate in diretta: tienila d'occhio. Pronta a 75-80°C vicino all'osso, succhi chiari quando la punzecchi all'articolazione.",
      riposo: "5 min.",
    },
  },
  {
    id: "ali_pollo", nome: "Ali di pollo", categoria: "pollo", icona: "🍗",
    tempo: 18 * 60, flip: "5-6", metodo: "mista", calore: "medio",
    tempInterna: "74°C+ (meglio 80°C: più tenere)",
    riposo: 0, frigo: 15, marinatura: 30, salaPrima: false,
    scheda: {
      acquisto: "Ali intere o già divise ai giunti (più comode da girare e servire).",
      preparazione: "Marinatura o rub 30 min+ (paprika affumicata, aglio, pepe). Asciutte prima di andare in griglia.",
      brace: "Indiretta a calore medio per la maggior parte del tempo, finitura diretta di 2-3 min per la pelle croccante.",
      cottura: "15-20 min girando ogni 5-6. A 74°C sono sicure, a 80°C il collagene si scioglie e sono più tenere. Salsa piccante/BBQ solo a fine cottura.",
      riposo: "Nessuno: in tavola calde.",
    },
  },
  {
    id: "galletto", nome: "Galletto alla diavola", categoria: "pollo", icona: "🐔",
    tempo: 50 * 60, flip: "10-15", metodo: "indiretta", calore: "medio",
    tempInterna: "80°C sotto l'articolazione della coscia",
    riposo: 8, frigo: 30, marinatura: 60, salaPrima: false,
    scheda: {
      acquisto: "Galletto (500-600 g) già aperto a libro — 'spatchcock' — o fattelo aprire dal macellaio lungo lo sterno.",
      preparazione: "Schiaccialo bene con il palmo o un batticarne. Marinata 1 h+ (anche la sera prima): olio, limone, peperoncino, rosmarino, aglio, pepe nero abbondante. Fuori dal frigo 30 min prima.",
      brace: "Indiretta a calore medio (~180°C) con coperchio, oppure griglia alta su brace dolce. Un peso sopra (mattone avvolto in alluminio) lo tiene aderente e uniforme.",
      cottura: "~50 min: parte 15 min lato pelle in giù, poi gira ogni 10-15. Attento alle fiammate della marinata oleosa. Pronto a 80°C sotto l'articolazione della coscia, succhi chiari.",
      riposo: "8-10 min prima di dividerlo.",
    },
  },
  {
    id: "spiedini_pollo", nome: "Spiedini di pollo", categoria: "pollo", icona: "🍢",
    tempo: 12 * 60, flip: "3", metodo: "diretta", calore: "medio",
    tempInterna: "74°C (pollame, USDA)",
    riposo: 0, frigo: 15, marinatura: 30, salaPrima: false,
    scheda: {
      acquisto: "Meglio cubi di sovracoscia (2-3 cm): più succosa del petto e perdona qualche minuto in più.",
      preparazione: "Marinatura 30 min+ (yogurt o olio-limone-paprika rende tenerissimo). Spiedi di legno a bagno 30 min. Pezzi uniformi, non stipati.",
      brace: "Diretta a calore medio.",
      cottura: "10-12 min girando ogni 3, spennellando con la marinata avanzata (mai negli ultimi 3 min: deve cuocere). Sempre 74°C al cuore.",
      riposo: "Nessuno.",
    },
  },

  /* ---------------- TACCHINO ---------------- */
  {
    id: "fesa_tacchino", nome: "Fesa di tacchino", categoria: "tacchino", icona: "🍗",
    tempo: 12 * 60, flip: null, metodo: "diretta", calore: "medio",
    tempInterna: "74°C sempre (pollame, USDA)",
    riposo: 3, frigo: 20, marinatura: 30, salaPrima: false,
    scheda: {
      acquisto: "Fesa a fette spesse 2 cm: le fettine sottili da scaloppina sulla brace diventano suole.",
      preparazione: "È la carne che si secca più facilmente: salamoia 30 min (1 l acqua + 60 g sale) o marinatura con olio e limone, poi asciugare.",
      brace: "Diretta a calore medio.",
      cottura: "5-6 min per lato, una girata. Pollame: sempre 74°C al cuore, ma toglila appena ci arriva.",
      riposo: "3-5 min coperto.",
    },
  },
  {
    id: "coscia_tacchino", nome: "Fuso / coscia di tacchino", categoria: "tacchino", icona: "🍗",
    tempo: 45 * 60, flip: "10-12", metodo: "indiretta", calore: "medio",
    tempInterna: "80°C all'osso",
    riposo: 5, frigo: 30, marinatura: 30, salaPrima: false,
    scheda: {
      acquisto: "Fusi di tacchino da 500-700 g l'uno: uno basta per 2 persone.",
      preparazione: "Marinatura o rub 30 min+ (paprika, aglio, rosmarino). Pelle asciutta = pelle croccante.",
      brace: "Indiretta (~180°C) con coperchio; finitura di 5 min in diretta per la pelle.",
      cottura: "40-50 min girando ogni 10-12. È un pezzo grosso: pronto a 80°C vicino all'osso, succhi chiari.",
      riposo: "5-8 min, poi affetta la polpa dall'osso.",
    },
  },
  {
    id: "spiedini_tacchino", nome: "Spiedini di tacchino", categoria: "tacchino", icona: "🍢",
    tempo: 13 * 60, flip: "3", metodo: "diretta", calore: "medio",
    tempInterna: "74°C (pollame, USDA)",
    riposo: 0, frigo: 15, marinatura: 30, salaPrima: false,
    scheda: {
      acquisto: "Cubi di fesa o di coscia disossata da 2,5-3 cm (la coscia resta più succosa).",
      preparazione: "Marinatura 30 min+ obbligatoria per la fesa (yogurt o olio-limone). Spiedi di legno a bagno.",
      brace: "Diretta a calore medio.",
      cottura: "11-14 min girando ogni 3. Sempre 74°C al cuore.",
      riposo: "Nessuno.",
    },
  },
  {
    id: "hamburger_tacchino", nome: "Hamburger di tacchino", categoria: "tacchino", icona: "🍔",
    tempo: 12 * 60, flip: null, metodo: "diretta", calore: "medio",
    tempInterna: "74°C sempre (macinato di pollame, USDA)",
    riposo: 0, frigo: 15, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Macinato di tacchino non troppo magro (meglio con un po' di coscia), medaglioni da 2 cm.",
      preparazione: "Fossetta al centro col pollice; un filo d'olio sulla superficie (è più magro del manzo e si attacca).",
      brace: "Diretta a calore medio: a fuoco alto si asciuga fuori prima di essere sicuro dentro.",
      cottura: "5-6 min per lato, una girata, mai schiacciarlo. Macinato di pollame: 74°C SEMPRE, zero rosa.",
      riposo: "Nessuno: nel panino.",
    },
  },

  /* ---------------- AGNELLO ---------------- */
  {
    id: "costolette_agnello", nome: "Costolette d'agnello", categoria: "agnello", icona: "🥩",
    tempo: 10 * 60, flip: null, metodo: "diretta", calore: "alto",
    tempInterna: "55-58°C media (rosata): il suo punto giusto",
    riposo: 5, frigo: 20, marinatura: 30, salaPrima: false,
    scheda: {
      acquisto: "Costolette da 2,5-3 cm, o sottili 'a scottadito' (allora dimezza i tempi).",
      preparazione: "Marinatura facoltativa 30 min (olio, aglio, rosmarino, timo) o solo sale prima di grigliare. Fuori dal frigo 20-30 min prima.",
      brace: "Diretta a fuoco vivo.",
      cottura: "4-6 min per lato (Weber: 10-12 min totali per 2,5-3 cm). L'agnello dà il meglio rosato: 55-58°C al cuore. Le scottadito sottili: 2 min per lato e si mangiano con le dita.",
      riposo: "5 min coperte.",
    },
  },
  {
    id: "spiedini_agnello", nome: "Spiedini d'agnello", categoria: "agnello", icona: "🍢",
    tempo: 12 * 60, flip: "3", metodo: "diretta", calore: "medio",
    tempInterna: "58-60°C",
    riposo: 3, frigo: 20, marinatura: 30, salaPrima: false,
    scheda: {
      acquisto: "Cubi di spalla o cosciotto da 2,5-3 cm.",
      preparazione: "Marinatura 30 min-2 h: olio, limone, aglio, origano o cumino. Asciugare prima della griglia. Spiedi di legno a bagno 30 min.",
      brace: "Diretta a calore medio.",
      cottura: "10-14 min girando ogni 3. Rosato dentro: 58-60°C.",
      riposo: "3 min.",
    },
  },
  {
    id: "arrosticini", nome: "Arrosticini", categoria: "agnello", icona: "🍢",
    tempo: 9 * 60, flip: "2-3", metodo: "diretta", calore: "medio",
    tempInterna: "cotti quando cambiano colore: non devono seccarsi",
    riposo: 0, frigo: 10, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Arrosticini di pecora tradizionali: cubetti da ~1 cm su spiedo sottile. Calcola 8-10 a testa (spariscono).",
      preparazione: "Niente: la tradizione abruzzese li vuole nudi. Niente marinatura, niente olio. Sale SOLO a fine cottura.",
      brace: "Brace viva ma non forte, senza fiamma, carne a 3-5 cm. La fornacella (canalina) è l'ideale; su griglia normale allineali fitti, uno accanto all'altro, con i manici fuori dalla brace.",
      cottura: "2-3 min per lato: gira quando la carne passa dal rosso al bruno e 'suda'. Due girate per lato bastano, 8-10 min totali. Non devono asciugarsi.",
      riposo: "Zero: si servono bollenti, a mazzetti, appena escono.",
    },
  },
  {
    id: "cosciotto_agnello", nome: "Cosciotto a fette", categoria: "agnello", icona: "🥩",
    tempo: 12 * 60, flip: null, metodo: "diretta", calore: "medio",
    tempInterna: "58-60°C rosato",
    riposo: 5, frigo: 30, marinatura: 30, salaPrima: false,
    scheda: {
      acquisto: "Fette di cosciotto ('steak' d'agnello) da 2,5 cm, con il piccolo osso centrale.",
      preparazione: "Marinatura 30 min-2 h (olio, aglio, rosmarino, limone) o solo sale. Fuori dal frigo 30 min prima.",
      brace: "Diretta a calore medio-alto.",
      cottura: "5-6 min per lato, una girata. Rosato al cuore (58-60°C): è lì che l'agnello dà il meglio.",
      riposo: "5 min coperte.",
    },
  },

  /* ---------------- PESCE & MARE ---------------- */
  {
    id: "salmone", nome: "Salmone", categoria: "pesce", icona: "🐟",
    tempo: 8 * 60, flip: null, metodo: "diretta", calore: "medio",
    tempInterna: "50-55°C: si sfalda ma resta umido",
    riposo: 0, frigo: 10, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Filetti con pelle da 2-3 cm: la pelle protegge e tiene insieme il pezzo.",
      preparazione: "Asciuga benissimo, olio su entrambi i lati, sale. Griglia pulitissima, oliata e ben calda: è l'unico modo per non farlo attaccare.",
      brace: "Diretta a calore medio.",
      cottura: "Parte lato pelle in giù 4-5 min, poi UNA sola girata delicata con paletta larga, 3 min dall'altro lato. Pronto a 50-55°C o quando si sfalda alla forchetta restando umido.",
      riposo: "Nessuno: servilo subito.",
    },
  },
  {
    id: "gamberoni", nome: "Gamberoni", categoria: "pesce", icona: "🦐",
    tempo: 5 * 60, flip: null, metodo: "diretta", calore: "alto",
    tempInterna: "pronti quando rosa e opachi",
    riposo: 0, frigo: 10, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Gamberoni interi con guscio: protegge la carne dal calore diretto.",
      preparazione: "Facoltativo: incidi il dorso e togli il filetto nero. Olio, aglio e prezzemolo 15 min prima. Su spiedini si girano in un gesto.",
      brace: "Diretta a fuoco vivo, pochi minuti.",
      cottura: "2-3 min per lato: pronti appena diventano rosa e opachi. Stracotti = gommosi, il rischio vero è tenerli troppo.",
      riposo: "Nessuno: con una spruzzata di limone appena tolti.",
    },
  },
  {
    id: "spada", nome: "Spada / Tonno", categoria: "pesce", icona: "🐠",
    tempo: 8 * 60, flip: null, metodo: "diretta", calore: "alto",
    tempInterna: "spada 55-60°C · tonno anche 45-50°C (rosato)",
    riposo: 0, frigo: 10, marinatura: 20, salaPrima: false,
    scheda: {
      acquisto: "Tranci da ~2 cm, compatti.",
      preparazione: "Marinatura breve (max 20-30 min: il limone 'cuoce' il pesce): olio, limone, origano. Asciugare prima della griglia.",
      brace: "Diretta a fuoco vivo, griglia pulita e oliata.",
      cottura: "3-4 min per lato, una girata. Spada ben cotto ma umido (55-60°C); tonno anche rosato al cuore (45-50°C) se è di qualità.",
      riposo: "Nessuno, con salmoriglio o olio e limone.",
    },
  },
  {
    id: "branzino", nome: "Branzino / Orata", categoria: "pesce", icona: "🐟",
    tempo: 25 * 60, flip: "10-12", metodo: "indiretta", calore: "medio",
    tempInterna: "60°C nel punto più spesso; l'occhio diventa bianco",
    riposo: 3, frigo: 10, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Pesce intero da 400-600 g a testa, eviscerato. NON farlo squamare: le squame proteggono la pelle sulla griglia.",
      preparazione: "Asciuga dentro e fuori, 2-3 incisioni oblique sui fianchi, erbe e limone nel ventre, olio fuori. La gratella doppia (a libro) rende le girate senza rischi.",
      brace: "Indiretta o brace dolce: il pesce intero ha bisogno di tempo senza bruciare fuori.",
      cottura: "10-15 min per lato, UNA sola girata con due palette (o gratella a libro). Pronto quando l'occhio è bianco, la pinna dorsale si sfila senza resistenza e la carne si stacca dalla lisca.",
      riposo: "3 min, poi sfiletta al tavolo.",
    },
  },
  {
    id: "calamari", nome: "Calamari", categoria: "pesce", icona: "🦑",
    tempo: 5 * 60, flip: null, metodo: "diretta", calore: "alto",
    tempInterna: "opachi e arricciati = pronti; oltre = gomma",
    riposo: 0, frigo: 10, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Calamari freschi già puliti, di misura media; i ciuffi infilzali su uno spiedino.",
      preparazione: "Asciugali BENISSIMO (l'acqua li fa bollire invece che grigliare), olio e sale; sui corpi grandi incisioni leggere a griglia.",
      brace: "Fuoco vivo, griglia rovente: cottura lampo.",
      cottura: "2-3 min per lato: appena diventano opachi e si arricciano sono pronti. La regola dei calamari: o 3 minuti o 30 — tutto quello in mezzo è gomma.",
      riposo: "Nessuno: olio, limone, prezzemolo e in tavola.",
    },
  },
  {
    id: "sardine", nome: "Sardine", categoria: "pesce", icona: "🐟",
    tempo: 6 * 60, flip: null, metodo: "diretta", calore: "alto",
    tempInterna: "pelle croccante, carne che si stacca dalla lisca",
    riposo: 0, frigo: 10, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Sardine fresche intere, lucide e sode: 5-6 a testa. Per la brace non serve squamarle né pulirle.",
      preparazione: "Solo asciugate, olio e sale grosso. Una gratella a libro rende la girata un gesto solo.",
      brace: "Fuoco vivo.",
      cottura: "2-3 min per lato: pelle abbrustolita e carne che si stacca dalla lisca. Sono gli arrosticini del mare: si mangiano con le dita.",
      riposo: "Nessuno.",
    },
  },

  /* ---------------- VERDURE ---------------- */
  {
    id: "zucchine", nome: "Zucchine", categoria: "verdure", icona: "🥒",
    tempo: 8 * 60, flip: null, metodo: "diretta", calore: "medio",
    tempInterna: "morbide con righe marcate",
    riposo: 0, frigo: 0, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Zucchine medie, sode.",
      preparazione: "Fette longitudinali da ~1 cm (le rondelle cadono tra le griglie). Olio leggero prima; sale DOPO la cottura, o tirano fuori acqua.",
      brace: "Diretta a calore medio.",
      cottura: "3-5 min per lato: righe marcate e centro cedevole ma non molle.",
      riposo: "Condite da calde assorbono meglio: olio, sale, menta o aceto.",
    },
  },
  {
    id: "peperoni", nome: "Peperoni", categoria: "verdure", icona: "🫑",
    tempo: 12 * 60, flip: "4", metodo: "diretta", calore: "medio",
    tempInterna: "morbidi, pelle abbrustolita",
    riposo: 0, frigo: 0, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Peperoni carnosi (rossi e gialli reggono meglio dei verdi).",
      preparazione: "A falde larghe pulite dai semi, con un filo d'olio. Interi se poi li vuoi spellare.",
      brace: "Diretta a calore medio.",
      cottura: "10-12 min a falde girando ogni 4. Interi: 15-20 min girando spesso finché la pelle è nera ovunque → chiusi 10 min in un sacchetto e la pelle viene via da sola.",
      riposo: "Con olio, sale, aglio e basilico da tiepidi.",
    },
  },
  {
    id: "melanzane", nome: "Melanzane", categoria: "verdure", icona: "🍆",
    tempo: 8 * 60, flip: null, metodo: "diretta", calore: "medio",
    tempInterna: "centro cedevole",
    riposo: 0, frigo: 0, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Melanzane lunghe o tonde, sode e lucide.",
      preparazione: "Fette da ~1 cm. Spennella d'olio poco prima di grigliare (assorbono come spugne: non esagerare). Sale dopo.",
      brace: "Diretta a calore medio.",
      cottura: "3-4 min per lato: righe marcate, centro morbido. Crude al centro sono spugnose: meglio un minuto in più.",
      riposo: "Da calde con olio, aglio, prezzemolo o menta.",
    },
  },
  {
    id: "cipolla", nome: "Cipolla", categoria: "verdure", icona: "🧅",
    tempo: 14 * 60, flip: "4-5", metodo: "diretta", calore: "medio",
    tempInterna: "morbida e dolce, bordi caramellati",
    riposo: 0, frigo: 0, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Cipolle rosse (Tropea) o dorate, medie.",
      preparazione: "Rondelle spesse 1,5 cm infilzate di piatto con uno stuzzicadenti: non si sfaldano sulla griglia. Olio leggero.",
      brace: "Diretta a calore medio, o al bordo della brace.",
      cottura: "12-15 min girando ogni 4-5: deve ammorbidirsi e caramellare ai bordi senza bruciare.",
      riposo: "Con olio e aceto balsamico da tiepida.",
    },
  },
  {
    id: "mais", nome: "Mais", categoria: "verdure", icona: "🌽",
    tempo: 18 * 60, flip: "4-5", metodo: "diretta", calore: "medio",
    tempInterna: "chicchi dorati e teneri",
    riposo: 0, frigo: 0, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Pannocchie fresche o precotte sottovuoto (dimezzano i tempi).",
      preparazione: "Fresche: sbucciate e oliate. Precotte: solo olio, vanno soprattutto marcate.",
      brace: "Diretta a calore medio.",
      cottura: "15-20 min girando ogni 4-5 (precotte: 8-10 min) finché i chicchi sono dorati.",
      riposo: "Con burro e sale, o olio e peperoncino, da calde.",
    },
  },
  {
    id: "funghi", nome: "Funghi", categoria: "verdure", icona: "🍄",
    tempo: 10 * 60, flip: null, metodo: "diretta", calore: "medio",
    tempInterna: "morbidi e succosi",
    riposo: 0, frigo: 0, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Cappelle grandi: portobello o champignon giganti.",
      preparazione: "Togli il gambo, pulisci con panno umido (non lavarli: assorbono acqua). Olio, aglio e prezzemolo nella cappella.",
      brace: "Diretta a calore medio.",
      cottura: "4-5 min per lato partendo con le lamelle in su: il succo resta nella cappella. Pronti quando morbidi al centro.",
      riposo: "Nessuno.",
    },
  },
  {
    id: "radicchio", nome: "Radicchio", categoria: "verdure", icona: "🥬",
    tempo: 7 * 60, flip: null, metodo: "diretta", calore: "medio",
    tempInterna: "cuore morbido, foglie esterne bruciacchiate",
    riposo: 0, frigo: 0, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Radicchio tardivo di Treviso o lungo precoce, sodo.",
      preparazione: "A quarti nel senso della lunghezza, mantenendo il torsolo: tiene insieme le foglie. Olio e sale prima.",
      brace: "Diretta a calore medio.",
      cottura: "3-4 min per lato: le foglie esterne bruciacchiate ci stanno, il cuore deve ammorbidirsi.",
      riposo: "Da caldo con olio buono e una goccia di balsamico; l'amaro col fumo è il suo bello.",
    },
  },
  {
    id: "patate", nome: "Patate", categoria: "verdure", icona: "🥔",
    tempo: 12 * 60, flip: "4-5", metodo: "diretta", calore: "medio",
    tempInterna: "crosta dorata, interno morbido",
    riposo: 0, frigo: 0, marinatura: 0, salaPrima: false,
    scheda: {
      acquisto: "Patate a pasta gialla, di misura media e uniforme.",
      preparazione: "Il trucco: lessale 10 min con la buccia (mezze cotte), poi a fette spesse 1,5 cm con olio, sale e rosmarino. Alternativa zero-sbatti: intere nel cartoccio di alluminio, direttamente NELLA brace, 40-45 min.",
      brace: "Diretta a calore medio (fette) o dentro la brace (cartoccio).",
      cottura: "10-14 min girando ogni 4-5: crosta dorata e interno morbido alla forchetta.",
      riposo: "Nessuno.",
    },
  },
];

/* ================================================================
   SPESA — dati per il calcolo delle quantità da comprare.
   peso  = grammi medi a pezzo (null = si compra a peso)
   resa  = frazione commestibile (osso/guscio/scarto escluso)
   unita = etichetta plurale dei pezzi
   Le verdure non sono in mappa: contorni, fuori dal budget carne.
   ================================================================ */
const SPESA = {
  bistecca:           { peso: 300,  resa: 0.95, unita: "bistecche" },
  costata:            { peso: 1000, resa: 0.55, unita: "costate" },
  tagliata:           { peso: null, resa: 1,    unita: null },
  hamburger:          { peso: 180,  resa: 1,    unita: "hamburger" },
  spiedini_manzo:     { peso: 150,  resa: 1,    unita: "spiedini" },
  picanha:            { peso: 300,  resa: 0.95, unita: "fette" },
  filetto_manzo:      { peso: 200,  resa: 1,    unita: "medaglioni" },
  bavetta:            { peso: null, resa: 1,    unita: null },
  asado:              { peso: 250,  resa: 0.6,  unita: "fette" },
  nodino_vitello:     { peso: 350,  resa: 0.75, unita: "nodini" },
  braciola_vitello:   { peso: 200,  resa: 0.9,  unita: "braciole" },
  tagliata_vitello:   { peso: null, resa: 1,    unita: null },
  spiedini_vitello:   { peso: 150,  resa: 1,    unita: "spiedini" },
  salsiccia_vitello:  { peso: 100,  resa: 1,    unita: "salsicce" },
  salsiccia:          { peso: 100,  resa: 1,    unita: "salsicce" },
  luganega:           { peso: null, resa: 1,    unita: null },
  salamella:          { peso: 120,  resa: 1,    unita: "salamelle" },
  costine:            { peso: 1200, resa: 0.45, unita: "rack" },
  pancetta:           { peso: 50,   resa: 1,    unita: "fette" },
  braciola:           { peso: 150,  resa: 0.9,  unita: "braciole" },
  costoletta:         { peso: 250,  resa: 0.8,  unita: "costolette" },
  wurstel:            { peso: 100,  resa: 1,    unita: "wurstel" },
  filetto_maiale:     { peso: 450,  resa: 0.95, unita: "filetti" },
  capocollo:          { peso: 180,  resa: 1,    unita: "fette" },
  bombette:           { peso: 60,   resa: 1,    unita: "bombette" },
  spiedini_maiale:    { peso: 150,  resa: 1,    unita: "spiedini" },
  stinco:             { peso: 700,  resa: 0.6,  unita: "stinchi" },
  petto_pollo:        { peso: 250,  resa: 1,    unita: "petti" },
  coscia_pollo:       { peso: 300,  resa: 0.65, unita: "cosce" },
  ali_pollo:          { peso: 100,  resa: 0.55, unita: "ali" },
  galletto:           { peso: 550,  resa: 0.6,  unita: "galletti" },
  spiedini_pollo:     { peso: 150,  resa: 1,    unita: "spiedini" },
  fesa_tacchino:      { peso: 200,  resa: 1,    unita: "fette" },
  coscia_tacchino:    { peso: 600,  resa: 0.7,  unita: "fusi" },
  spiedini_tacchino:  { peso: 150,  resa: 1,    unita: "spiedini" },
  hamburger_tacchino: { peso: 150,  resa: 1,    unita: "hamburger" },
  costolette_agnello: { peso: 100,  resa: 0.65, unita: "costolette" },
  spiedini_agnello:   { peso: 150,  resa: 1,    unita: "spiedini" },
  arrosticini:        { peso: 30,   resa: 0.95, unita: "arrosticini" },
  cosciotto_agnello:  { peso: 280,  resa: 0.85, unita: "fette" },
  salmone:            { peso: 200,  resa: 1,    unita: "tranci" },
  gamberoni:          { peso: 60,   resa: 0.5,  unita: "gamberoni" },
  spada:              { peso: 200,  resa: 1,    unita: "tranci" },
  branzino:           { peso: 500,  resa: 0.5,  unita: "pesci" },
  calamari:           { peso: 150,  resa: 0.85, unita: "calamari" },
  sardine:            { peso: 50,   resa: 0.6,  unita: "sardine" },
};

const byId = Object.fromEntries(CATALOGO.map(c => [c.id, c]));

/* ================================================================
   STATO
   ================================================================ */
const selezione = new Set();
const opzioni = {};        // per gli alimenti con grado+spessore
CATALOGO.filter(i => i.gradi).forEach(i => {
  opzioni[i.id] = { grado: i.id === "costata" ? "rare" : "media", spessore: i.spessoreBase };
});

let sequenza  = [];
let ticker    = null;
let startTs   = null;
let timeouts  = [];
let activeIdx = -1;
let wakeLock  = null;
let audioCtx  = null;
let confermaFermaTimer = null;

/* ================================================================
   DURATA / UTILS
   ================================================================ */
function cotturaSec(item) {
  if (item.gradi) {
    const o = opzioni[item.id];
    const base = item.gradi[o.grado] || item.gradi.media;
    return Math.round(base * (o.spessore / item.spessoreBase));
  }
  return item.tempo;
}

function totaleSec(item) {           // cottura + riposo (sync sull'ora di servizio)
  return cotturaSec(item) + item.riposo * 60;
}

function fmtMin(sec) {
  return `${Math.round(sec / 60)} min`;
}

function averageRange(str) {
  if (!str) return null;
  const parts = String(str).split("-").map(s => parseFloat(s.trim()));
  if (!isFinite(parts[0])) return null;
  return isFinite(parts[1]) ? (parts[0] + parts[1]) / 2 : parts[0];
}

function formatTime(date) {
  return date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit" });
}

function formatTimeSec(date) {
  return date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatSeconds(sec) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

/* ================================================================
   RENDER CATALOGO — accordion per animale/categoria + ricerca
   ================================================================ */
const gridEl   = document.getElementById("food-grid");
const searchEl = document.getElementById("search");

function renderCatalogo() {
  gridEl.innerHTML = "";
  CATEGORIE.forEach(cat => {
    const items = CATALOGO.filter(c => c.categoria === cat.id);
    if (!items.length) return;

    const acc = document.createElement("div");
    acc.className = "cat-acc";
    acc.dataset.cat = cat.id;

    const head = document.createElement("button");
    head.type = "button";
    head.className = "cat-head";
    head.setAttribute("aria-expanded", "false");
    head.innerHTML = `<span class="cat-titolo">${cat.icona} ${cat.nome}</span>
      <span class="cat-count">${items.length} tagli</span>
      <span class="cat-chev" aria-hidden="true">▾</span>`;
    head.addEventListener("click", () => {
      const aperta = acc.classList.toggle("open");
      head.setAttribute("aria-expanded", String(aperta));
    });

    const body = document.createElement("div");
    body.className = "cat-body";
    const grid = document.createElement("div");
    grid.className = "food-grid";
    body.appendChild(grid);

    items.forEach(item => {
      const card = document.createElement("div");
      card.className = "food-card";
      card.dataset.id = item.id;
      card.setAttribute("role", "checkbox");
      card.setAttribute("aria-checked", "false");
      card.tabIndex = 0;

      card.innerHTML = `
        <span class="food-icon">${item.icona}</span>
        <span class="food-name">${item.nome}</span>
        <span class="food-time" data-time="${item.id}">${fmtMin(cotturaSec(item))}</span>
        <span class="food-badges">
          <span class="badge badge-${item.metodo}">${item.metodo}</span>
          <span class="badge badge-calore">${item.calore}</span>
        </span>
        <button type="button" class="info-btn" data-info="${item.id}"
                aria-label="Scheda ${item.nome}">i</button>`;

      card.addEventListener("click", (e) => {
        if (e.target.closest(".info-btn")) return;
        toggleItem(item.id, card);
      });
      card.addEventListener("keydown", (e) => {
        if (e.key === " " || e.key === "Enter") { e.preventDefault(); toggleItem(item.id, card); }
      });

      grid.appendChild(card);
      if (item.gradi) grid.appendChild(buildOpzioni(item));
    });

    acc.appendChild(head);
    acc.appendChild(body);
    gridEl.appendChild(acc);
  });

  gridEl.querySelectorAll(".info-btn").forEach(btn => {
    btn.addEventListener("click", () => apriScheda(btn.dataset.info));
  });
}

/* --- ricerca per nome taglio o categoria/animale --- */
function normalizza(s) {
  return s.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

const nomiCategorie = Object.fromEntries(CATEGORIE.map(c => [c.id, normalizza(c.nome)]));

function applicaRicerca() {
  const q = normalizza(searchEl.value.trim());

  gridEl.querySelectorAll(".cat-acc").forEach(acc => {
    const catId    = acc.dataset.cat;
    const catMatch = q && nomiCategorie[catId].includes(q);
    let visibili = 0;

    acc.querySelectorAll(".food-card").forEach(card => {
      const item  = byId[card.dataset.id];
      const match = !q || catMatch ||
        normalizza(item.nome).includes(q) || normalizza(item.id).includes(q);
      card.classList.toggle("nascosta", !match);
      const opts = document.getElementById(`opts-${item.id}`);
      if (opts) opts.classList.toggle("nascosta", !match);
      if (match) visibili++;
    });

    acc.classList.toggle("nascosta", visibili === 0);
    if (q && visibili > 0) {
      acc.classList.add("open");
      acc.querySelector(".cat-head").setAttribute("aria-expanded", "true");
    }
  });
}

searchEl.addEventListener("input", applicaRicerca);

function buildOpzioni(item) {
  const wrap = document.createElement("div");
  wrap.className = "item-opts hidden";
  wrap.id = `opts-${item.id}`;
  wrap.innerHTML = `
    <label>Cottura:
      <select data-grado="${item.id}">
        <option value="rare"${opzioni[item.id].grado === "rare" ? " selected" : ""}>Al sangue</option>
        <option value="media"${opzioni[item.id].grado === "media" ? " selected" : ""}>Media</option>
        <option value="well"${opzioni[item.id].grado === "well" ? " selected" : ""}>Ben cotta</option>
      </select>
    </label>
    <label>Spessore:
      <span class="thickness-input">
        <input type="number" data-spessore="${item.id}" min="1" max="8" step="0.5"
               value="${opzioni[item.id].spessore}"> cm
      </span>
    </label>`;
  wrap.querySelector("select").addEventListener("change", (e) => {
    opzioni[item.id].grado = e.target.value;
    aggiornaTempoCard(item);
  });
  wrap.querySelector("input").addEventListener("input", (e) => {
    const v = parseFloat(e.target.value);
    if (isFinite(v) && v > 0) opzioni[item.id].spessore = v;
    aggiornaTempoCard(item);
  });
  return wrap;
}

function aggiornaTempoCard(item) {
  const el = gridEl.querySelector(`[data-time="${item.id}"]`);
  if (el) el.textContent = fmtMin(cotturaSec(item));
  aggiornaPiano();
}

function toggleItem(id, card) {
  if (selezione.has(id)) selezione.delete(id); else selezione.add(id);
  const sel = selezione.has(id);
  if (!card) card = gridEl.querySelector(`.food-card[data-id="${id}"]`);
  if (card) {
    card.classList.toggle("selected", sel);
    card.setAttribute("aria-checked", String(sel));
  }
  const opts = document.getElementById(`opts-${id}`);
  if (opts) opts.classList.toggle("hidden", !sel);
  aggiornaContatore();
  aggiornaCarrello();
  aggiornaPiano();
}

function aggiornaContatore() {
  const n = selezione.size;
  document.getElementById("sel-count").textContent =
    n === 0 ? "Nessun alimento selezionato" :
    n === 1 ? "1 alimento selezionato" : `${n} alimenti selezionati`;
  document.getElementById("startBtn").disabled = n === 0 || startTs !== null;
}

/* ================================================================
   SCHEDA ALIMENTO (bottom sheet)
   ================================================================ */
const overlayEl = document.getElementById("scheda-overlay");

function apriScheda(id) {
  const item = byId[id];
  if (!item) return;
  const s = item.scheda;
  document.getElementById("scheda-titolo").textContent = `${item.icona} ${item.nome}`;
  document.getElementById("scheda-meta").innerHTML = `
    <span class="badge badge-${item.metodo}">${item.metodo}</span>
    <span class="badge badge-calore">calore ${item.calore}</span>
    <span class="badge badge-tempo">⏱ ${fmtMin(cotturaSec(item))}${item.riposo ? ` + ${item.riposo} riposo` : ""}</span>`;
  document.getElementById("scheda-corpo").innerHTML = `
    <section><h4>🛒 Acquisto</h4><p>${s.acquisto}</p></section>
    <section><h4>🔪 Preparazione</h4><p>${s.preparazione}</p></section>
    <section><h4>🔥 Brace</h4><p>${s.brace}</p></section>
    <section><h4>⏱ Cottura</h4><p>${s.cottura}</p>
      <p class="temp-target">🌡 Temperatura interna: <strong>${item.tempInterna}</strong></p></section>
    <section><h4>🕰 Riposo</h4><p>${s.riposo}</p></section>`;
  overlayEl.classList.remove("hidden");
  document.body.classList.add("no-scroll");
}

function chiudiScheda() {
  overlayEl.classList.add("hidden");
  document.body.classList.remove("no-scroll");
}

overlayEl.addEventListener("click", (e) => { if (e.target === overlayEl) chiudiScheda(); });
document.getElementById("scheda-close").addEventListener("click", chiudiScheda);
document.addEventListener("keydown", (e) => { if (e.key === "Escape") chiudiScheda(); });

/* ================================================================
   CARRELLO + QUANTITÀ DA COMPRARE
   Dosi (fonti IT): 300 g/adulto di carne netta (450 g appetito forte),
   bambini 50%, −20% se contorni e pane abbondanti. La quota si divide
   tra i "secondi" nel carrello; SPESA converte in peso crudo e pezzi.
   ================================================================ */
const carrelloEl  = document.getElementById("carrello");
const adultiEl    = document.getElementById("q-adulti");
const bambiniEl   = document.getElementById("q-bambini");
const appetitoEl  = document.getElementById("q-appetito");
const contorniEl  = document.getElementById("q-contorni");
const copiaBtn    = document.getElementById("copia-lista");

[adultiEl, bambiniEl, appetitoEl, contorniEl].forEach(el =>
  el.addEventListener("input", aggiornaCarrello));

function arrotonda50(g) {
  return Math.max(50, Math.round(g / 50) * 50);
}

function fmtPeso(g) {
  return g >= 1000 ? `${(g / 1000).toFixed(1).replace(".", ",").replace(",0", "")} kg` : `${g} g`;
}

function calcolaSpesa() {
  const adulti  = Math.max(0, parseInt(adultiEl.value, 10) || 0);
  const bambini = Math.max(0, parseInt(bambiniEl.value, 10) || 0);
  const base    = appetitoEl.value === "abbondante" ? 450 : 300;
  let totale    = adulti * base + bambini * base * 0.5;
  if (contorniEl.value === "abbondanti") totale *= 0.8;

  const items    = [...selezione].map(id => byId[id]);
  const secondi  = items.filter(i => SPESA[i.id]);
  const contorni = items.filter(i => !SPESA[i.id]);
  const quota    = secondi.length ? totale / secondi.length : 0;

  const righe = secondi.map(item => {
    const sp    = SPESA[item.id];
    const crudo = arrotonda50(quota / sp.resa);
    const pezzi = sp.peso ? Math.max(1, Math.round(crudo / sp.peso)) : null;
    return { item, crudo, pezzi, unita: sp.unita };
  });

  return { adulti, bambini, totale: Math.round(totale), righe, contorni };
}

function aggiornaCarrello() {
  if (selezione.size === 0) {
    carrelloEl.innerHTML = `<p class="piano-vuoto">Il carrello è vuoto: seleziona i tagli qui sopra.</p>`;
    copiaBtn.classList.add("hidden");
    return;
  }

  const { totale, righe, contorni } = calcolaSpesa();

  const righeHtml = righe.map(r => `
    <li>
      <span class="car-icona">${r.item.icona}</span>
      <span class="car-nome">${r.item.nome}</span>
      <span class="car-qta">${fmtPeso(r.crudo)}${r.pezzi ? ` <em>(≈ ${r.pezzi} ${r.unita})</em>` : ""}</span>
      <button type="button" class="car-x" data-rimuovi="${r.item.id}" aria-label="Togli ${r.item.nome}">✕</button>
    </li>`).join("");

  const contorniHtml = contorni.length ? `
    <li class="car-contorni">
      <span class="car-icona">🥗</span>
      <span class="car-nome">Contorni: ${contorni.map(c => c.nome).join(", ")}</span>
      <span class="car-qta"><em>~200 g a testa in tutto</em></span>
      <span></span>
    </li>` : "";

  carrelloEl.innerHTML = `
    <ul class="car-lista">${righeHtml}${contorniHtml}</ul>
    ${righe.length ? `<p class="car-totale">Carne/pesce da comprare in totale: <strong>~${fmtPeso(righe.reduce((s, r) => s + r.crudo, 0))}</strong> (fabbisogno netto ${fmtPeso(totale)})</p>` : ""}`;

  carrelloEl.querySelectorAll("[data-rimuovi]").forEach(btn =>
    btn.addEventListener("click", () => toggleItem(btn.dataset.rimuovi)));

  copiaBtn.classList.toggle("hidden", righe.length === 0);
}

function listaSpesaTesto() {
  const { adulti, bambini, righe, contorni } = calcolaSpesa();
  const testa = `Lista spesa griglia — ${adulti} adulti${bambini ? ` + ${bambini} bambini` : ""}`;
  const corpo = righe.map(r =>
    `• ${r.item.nome}: ${fmtPeso(r.crudo)}${r.pezzi ? ` (circa ${r.pezzi} ${r.unita})` : ""}`).join("\n");
  const coda = contorni.length ? `\nContorni: ${contorni.map(c => c.nome).join(", ")} (~200 g a testa in tutto)` : "";
  return `${testa}\n${corpo}${coda}`;
}

copiaBtn.addEventListener("click", async () => {
  const testo = listaSpesaTesto();
  let ok = false;
  try { await navigator.clipboard.writeText(testo); ok = true; }
  catch (_) {
    const ta = document.createElement("textarea");
    ta.value = testo; document.body.appendChild(ta);
    ta.select(); try { ok = document.execCommand("copy"); } catch (_) {}
    ta.remove();
  }
  copiaBtn.textContent = ok ? "Copiata ✓" : "Copia non riuscita";
  setTimeout(() => { copiaBtn.textContent = "📋 Copia lista della spesa"; }, 2000);
});

/* ================================================================
   PIANO DI PREPARAZIONE
   ================================================================ */
const pianoEl      = document.getElementById("piano");
const prontoAlleEl = document.getElementById("pronto-alle");

prontoAlleEl.addEventListener("input", aggiornaPiano);

function taskPreparazione(items) {
  // minuti PRIMA dell'inizio cottura → descrizione
  const tasks = [];

  const gruppiMar = {};
  items.filter(i => i.marinatura > 0).forEach(i => {
    const key = i.marinatura >= 60 ? 60 : 30;
    (gruppiMar[key] = gruppiMar[key] || []).push(i.nome);
  });
  if (gruppiMar[60]) tasks.push({ min: 100, txt: `Prepara marinata/rub per: ${gruppiMar[60].join(", ")} (serve ~1 h — ancora meglio se fatto ieri sera)` });
  if (gruppiMar[30]) tasks.push({ min: 70, txt: `Prepara e metti a marinare: ${gruppiMar[30].join(", ")} (~30 min di marinatura)` });

  const daSalare = items.filter(i => i.salaPrima);
  if (daSalare.length) tasks.push({ min: 45, txt: `Sala bene: ${daSalare.map(i => i.nome).join(", ")} — con 40+ min il sale penetra (in alternativa, sala subito prima di grigliare)` });

  const serveIndiretta = items.some(i => i.metodo !== "diretta");
  tasks.push({ min: 40, txt: `Accendi la carbonella: ciminiera piena, pronta in ~20 min${serveIndiretta ? ". Abbondante: ti servirà anche una zona indiretta" : ""}` });

  const gruppiFrigo = {};
  items.filter(i => i.frigo > 0).forEach(i => {
    (gruppiFrigo[i.frigo] = gruppiFrigo[i.frigo] || []).push(i.nome);
  });
  Object.keys(gruppiFrigo).map(Number).sort((a, b) => b - a).forEach(min => {
    tasks.push({ min, txt: `Fuori dal frigo: ${gruppiFrigo[min].join(", ")}` });
  });

  tasks.push({ min: 10, txt: serveIndiretta
    ? "Stendi la brace in DUE ZONE: forte da un lato, l'altro lato libero (indiretta)"
    : "Stendi la brace: una zona forte e un bordo più dolce per gestire le fiammate" });
  tasks.push({ min: 5, txt: "Spazzola la griglia, ungila con carta e olio, lasciala scaldare sulla brace" });
  tasks.push({ min: 0, txt: "Premi ▶ Avvia: il timer mette ogni pezzo al momento giusto perché finisca tutto insieme" });

  return tasks.sort((a, b) => b.min - a.min);
}

function aggiornaPiano() {
  const items = [...selezione].map(id => byId[id]);
  if (!items.length) {
    pianoEl.innerHTML = `<p class="piano-vuoto">Seleziona qui sopra cosa hai comprato: il piano si genera da solo.</p>`;
    return;
  }

  const maxTot = Math.max(...items.map(totaleSec));
  const primo  = items.find(i => totaleSec(i) === maxTot);

  // orario target facoltativo
  let avvio = null;
  const hhmm = prontoAlleEl.value;
  if (hhmm) {
    const [h, m] = hhmm.split(":").map(Number);
    const target = new Date(); target.setHours(h, m, 0, 0);
    if (target.getTime() < Date.now()) target.setDate(target.getDate() + 1);
    avvio = new Date(target.getTime() - maxTot * 1000);
  }

  const clock = (minPrima) => {
    if (!avvio) return `${minPrima} min prima`;
    return formatTime(new Date(avvio.getTime() - minPrima * 60000));
  };

  const tasks = taskPreparazione(items);
  const righe = tasks.map(t =>
    `<li><span class="piano-ora">${t.min === 0 ? (avvio ? formatTime(avvio) : "ora zero") : clock(t.min)}</span><span>${t.txt}</span></li>`
  ).join("");

  pianoEl.innerHTML = `
    <div class="piano-sommario">
      Cottura più lunga: <strong>${primo.nome}</strong> (${fmtMin(cotturaSec(primo))}${primo.riposo ? ` + ${primo.riposo} min riposo` : ""})
      → dall'avvio a in tavola: <strong>${fmtMin(maxTot)}</strong>${avvio ? ` · premi Avvia alle <strong>${formatTime(avvio)}</strong>` : ""}
    </div>
    <ol class="piano-lista">${righe}</ol>`;
}

/* ================================================================
   TIMER SINCRONIZZATO (target = ora di servizio, riposo incluso)
   ================================================================ */
const logEl        = document.getElementById("log");
const nextEl       = document.getElementById("next");
const nextStickyEl = document.getElementById("next-sticky");
const startBtn     = document.getElementById("startBtn");
const resetBtn     = document.getElementById("resetBtn");
const avvisoEl     = document.getElementById("avviso");

startBtn.addEventListener("click", () => {
  const items = [...selezione].map(id => byId[id]);
  if (!items.length) { mostraAvviso("Seleziona almeno un alimento."); return; }

  initAudio();
  if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();

  startBtn.disabled = true;
  resetBtn.classList.remove("hidden");
  logEl.innerHTML = "";
  clearAll();
  activeIdx = -1;

  const maxTot = Math.max(...items.map(totaleSec));
  const eventi = [];

  items.forEach(item => {
    const cott  = cotturaSec(item);
    const start = maxTot - totaleSec(item);
    const end   = start + cott;

    eventi.push({ tempo: start, type: "metti", msg: `Metti ${item.nome} (${fmtMin(cott)}, ${item.metodo})` });

    const avgMin   = averageRange(item.flip);
    const interval = avgMin ? Math.round(avgMin * 60) : null;
    if (interval) {
      const guard = Math.max(30, Math.round(interval * 0.3));
      for (let t = start + interval; t < end - guard; t += interval) {
        eventi.push({ tempo: t, type: "gira", msg: `Gira ${item.nome} (ogni ${item.flip} min)` });
      }
    } else {
      eventi.push({ tempo: start + Math.round(cott / 2), type: "gira", msg: `Gira ${item.nome}` });
    }

    eventi.push({
      tempo: end, type: "togli",
      msg: item.riposo > 0
        ? `Togli ${item.nome} — in riposo ${item.riposo} min sotto alluminio`
        : `Togli ${item.nome} — pronto!`,
    });
  });

  const prio = { metti: 0, gira: 1, togli: 2, finale: 3 };
  eventi.sort((a, b) => a.tempo !== b.tempo ? a.tempo - b.tempo : (prio[a.type] ?? 9) - (prio[b.type] ?? 9));
  eventi.push({ tempo: maxTot, type: "finale", msg: "TUTTO PRONTO! In tavola!" });

  sequenza = eventi;
  startTs  = Date.now();

  renderTimeline(sequenza);
  requestWakeLock();

  sequenza.forEach((ev, i) => {
    const id = setTimeout(() => {
      aggiungiLog(ev.msg);
      playBeep(ev.type);
      if (navigator.vibrate) navigator.vibrate(ev.type === "finale" ? [200, 100, 200, 100, 400] : [150, 70, 150]);
      sendNotifica(ev.msg);

      const li = document.getElementById(`tl-${i}`);
      if (li) { li.classList.add("done"); li.querySelector("input").checked = true; }

      if (i === sequenza.length - 1) {
        clearInterval(ticker); ticker = null;
        aggiornaNext();
        startTs = null;
        startBtn.disabled = selezione.size === 0;
        resetBtn.classList.add("hidden");
        releaseWakeLock();
      }
    }, Math.max(0, ev.tempo) * 1000);
    timeouts.push(id);
  });

  ticker = setInterval(aggiornaNext, 250);
  aggiornaNext();
  document.getElementById("cottura").scrollIntoView({ behavior: "smooth", block: "start" });
});

/* Ferma con doppia conferma inline (niente dialog) */
resetBtn.addEventListener("click", () => {
  if (!resetBtn.classList.contains("conferma")) {
    resetBtn.classList.add("conferma");
    resetBtn.textContent = "Confermi? Tocca ancora";
    confermaFermaTimer = setTimeout(() => ripristinaFerma(), 3000);
    return;
  }
  clearTimeout(confermaFermaTimer);
  ripristinaFerma();
  clearAll();
  startTs = null; sequenza = []; activeIdx = -1;
  logEl.innerHTML = "";
  nextEl.innerHTML = "";
  nextStickyEl.classList.add("hidden");
  document.getElementById("timeline-list").innerHTML = "";
  startBtn.disabled = selezione.size === 0;
  resetBtn.classList.add("hidden");
  releaseWakeLock();
});

function ripristinaFerma() {
  resetBtn.classList.remove("conferma");
  resetBtn.textContent = "⏹ Ferma";
}

function mostraAvviso(txt) {
  avvisoEl.textContent = txt;
  avvisoEl.classList.remove("hidden");
  setTimeout(() => avvisoEl.classList.add("hidden"), 3000);
}

/* ================================================================
   TIMELINE / COUNTDOWN / LOG
   ================================================================ */
function renderTimeline(eventi) {
  const list = document.getElementById("timeline-list");
  list.innerHTML = "";
  eventi.forEach((ev, i) => {
    const li = document.createElement("li");
    li.id = `tl-${i}`;
    const cb = document.createElement("input");
    cb.type = "checkbox"; cb.disabled = true;
    const span = document.createElement("span");
    const when = startTs ? formatTime(new Date(startTs + ev.tempo * 1000)) : "";
    span.textContent = when ? `${when} — ${ev.msg}` : ev.msg;
    li.appendChild(cb); li.appendChild(span);
    list.appendChild(li);
  });
}

function aggiornaNext() {
  if (!sequenza.length || startTs === null) return;
  const elapsed = (Date.now() - startTs) / 1000;
  const i = sequenza.findIndex(ev => ev.tempo >= elapsed);

  if (i === -1) {
    nextEl.innerHTML = `<span class="titolo">Prossimo passo</span><div class="tempo">Completato ✔</div>`;
    nextStickyEl.classList.add("hidden");
    return;
  }

  if (activeIdx !== i) {
    document.getElementById(`tl-${activeIdx}`)?.classList.remove("active");
    document.getElementById(`tl-${i}`)?.classList.add("active");
    activeIdx = i;
  }

  const ev        = sequenza[i];
  const remaining = Math.max(0, Math.ceil(ev.tempo - elapsed));
  nextEl.innerHTML = `<span class="titolo">Prossimo passo</span><div>${ev.msg}</div><div class="tempo">${formatSeconds(remaining)}</div>`;
  nextStickyEl.innerHTML = `<span>${ev.msg}</span><span class="tempo">${formatSeconds(remaining)}</span>`;
}

function aggiungiLog(testo) {
  const div = document.createElement("div");
  div.textContent = `${formatTimeSec(new Date())} → ${testo}`;
  logEl.prepend(div);
}

function sendNotifica(testo) {
  if ("Notification" in window && Notification.permission === "granted") {
    try { new Notification("Griglia", { body: testo }); } catch (_) {}
  }
}

function clearAll() {
  timeouts.forEach(clearTimeout);
  timeouts = [];
  if (ticker) { clearInterval(ticker); ticker = null; }
}

/* ================================================================
   WAKE LOCK / AUDIO
   ================================================================ */
async function requestWakeLock() {
  if (!("wakeLock" in navigator)) return;
  try {
    wakeLock = await navigator.wakeLock.request("screen");
    wakeLock.addEventListener("release", () => { wakeLock = null; });
  } catch (_) {}
}

function releaseWakeLock() {
  if (wakeLock) { wakeLock.release(); wakeLock = null; }
}

document.addEventListener("visibilitychange", () => {
  if (document.visibilityState === "visible" && startTs !== null && !wakeLock) requestWakeLock();
});

function initAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch (_) {}
  }
}

function playBeep(type) {
  initAudio();
  if (!audioCtx) return;
  if (type === "finale") {
    [523, 659, 784].forEach((f, i) => {
      const o = audioCtx.createOscillator();
      const g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.frequency.value = f;
      const t = audioCtx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.35, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      o.start(t); o.stop(t + 0.5);
    });
    return;
  }
  const freqs = { metti: 660, gira: 880, togli: 1100 };
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.frequency.value = freqs[type] || 880;
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.35);
}

document.addEventListener("click", initAudio, { once: true });

/* ================================================================
   STICKY BANNER + INIT
   ================================================================ */
new IntersectionObserver(([entry]) => {
  if (startTs !== null) nextStickyEl.classList.toggle("hidden", entry.isIntersecting);
}, { threshold: 0 }).observe(document.getElementById("next"));

renderCatalogo();
aggiornaContatore();
aggiornaCarrello();
aggiornaPiano();
