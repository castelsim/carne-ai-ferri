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
   ICONE — set vettoriale line-art disegnato su griglia 64×64.
   Stile "diagramma da macelleria": contorno 4px (classe o),
   dettagli interni 2,5px al 55% (classe d), tutto currentColor.
   GLIFO mappa i tagli che condividono lo stesso disegno.
   ================================================================ */
const ICONE = {
  /* — manzo — */
  bistecca: `<path class="o" d="M12 34 C10 22 20 14 33 14 C46 14 55 22 53 33 C51 44 41 51 29 50 C18 49 14 43 12 34 Z"/><path class="d" d="M17 24 C23 17 31 15 41 16"/><path class="d" d="M24 31 l8 6"/><path class="d" d="M36 26 l6 5"/>`,
  costata: `<path class="o" d="M14 20 C24 10 44 10 52 20 C58 28 56 42 46 50 C36 56 20 54 14 44 C10 37 10 27 14 20 Z"/><path class="d" d="M22 19 H44"/><path class="d" d="M33 19 V43"/>`,
  filetto_manzo: `<circle class="o" cx="32" cy="34" r="16"/><path class="d" d="M17 29 C27 26 37 26 47 29"/><path class="d" d="M17 39 C27 42 37 42 47 39"/>`,
  tagliata: `<path class="o" d="M10 40 C10 30 18 24 30 23 C44 22 54 28 54 36 C54 44 44 48 30 48 C18 48 10 46 10 40 Z"/><path class="d" d="M25 24 L21 47"/><path class="d" d="M35 23 L31 48"/><path class="d" d="M45 26 L41 47"/>`,
  hamburger: `<path class="o" d="M13 27 C13 16 51 16 51 27 L13 27 Z"/><path class="o" d="M12 35 H52"/><path class="o" d="M15 43 H49 C52 43 52 50 49 50 H15 C12 50 12 43 15 43 Z"/><path class="d" d="M23 21 h.2 M31 20 h.2 M39 21 h.2"/>`,
  spiedino: `<path class="o" d="M14 54 L50 10"/><circle class="o" cx="52" cy="8" r="3"/><path class="o" d="M24 35 L31 42 L24 49 L17 42 Z"/><path class="o" d="M32 25 L39 32 L32 39 L25 32 Z"/><path class="o" d="M40 15 L47 22 L40 29 L33 22 Z"/>`,
  picanha: `<path class="o" d="M10 46 L34 14 C38 9 46 11 48 17 L54 38 C56 46 48 52 40 50 Z"/><path class="d" d="M15 44 L37 15"/><path class="d" d="M30 44 l14 -14"/>`,
  bavetta: `<path class="o" d="M10 42 L22 22 H54 L42 42 Z"/><path class="d" d="M18 38 L28 24"/><path class="d" d="M26 38 L36 24"/><path class="d" d="M34 38 L44 24"/>`,
  asado: `<path class="o" d="M12 26 H52 C56 26 56 38 52 38 H12 C8 38 8 26 12 26 Z"/><circle class="d" cx="20" cy="32" r="3.5"/><circle class="d" cx="32" cy="32" r="3.5"/><circle class="d" cx="44" cy="32" r="3.5"/>`,
  /* — vitello — */
  nodino_vitello: `<path class="o" d="M16 20 C28 12 48 14 51 27 C53 37 46 48 34 50 C21 52 12 43 12 31 C12 26 13 23 16 20 Z"/><circle class="d" cx="23" cy="30" r="5"/><path class="d" d="M34 34 l8 5"/>`,
  braciola: `<path class="o" d="M12 27 C12 18 22 13 33 13 C45 13 52 20 52 28 C52 37 43 42 31 42 C20 42 12 36 12 27 Z"/><path class="o" d="M40 41 L45 51 C46 54 51 53 50 49 L46 39"/><circle class="d" cx="24" cy="27" r="4.5"/><path class="d" d="M34 20 l8 3"/>`,
  /* — maiale — */
  salsiccia: `<path class="o" d="M14 40 A18 18 0 1 1 50 40 L42 40 A10 10 0 1 0 22 40 Z"/><path class="o" d="M12 43 l-5 4 M52 43 l5 4"/><path class="d" d="M32 14 V24"/>`,
  luganega: `<path class="o" d="M31 32 a3 3 0 0 1 6 0 a7 7 0 0 1 -14 0 a11 11 0 0 1 22 0 a15 15 0 0 1 -30 0"/><path class="d" d="M8 32 H14 M50 32 H58"/>`,
  salamella: `<path class="o" d="M23 45 L47 37 A9 9 0 0 0 41 20 L17 28 A9 9 0 0 0 23 45 Z"/><path class="o" d="M14 30 l-5 -1"/><path class="o" d="M50 26 l5 -2"/>`,
  costine: `<path class="o" d="M12 22 C24 14 40 14 52 22"/><path class="o" d="M12 42 C24 50 40 50 52 42"/><path class="o" d="M18 23 V43"/><path class="o" d="M27 19 V47"/><path class="o" d="M37 19 V47"/><path class="o" d="M46 23 V43"/>`,
  pancetta: `<path class="o" d="M10 22 C16 17 22 27 28 22 C34 17 40 27 46 22 L54 21 L54 40 C48 45 42 35 36 40 C30 45 24 35 18 40 L10 41 Z"/><path class="d" d="M12 29 C18 24 24 34 30 29 C36 24 42 34 48 29"/><path class="d" d="M12 35 C18 30 24 40 30 35 C36 30 42 40 48 35"/>`,
  wurstel: `<path class="o" d="M19 46 L51 34 A8 8 0 0 0 45 19 L13 31 A8 8 0 0 0 19 46 Z"/><path class="d" d="M25 27 l4 7 M33 24 l4 7 M41 21 l4 7"/>`,
  filetto_maiale: `<path class="o" d="M10 36 C10 28 18 24 28 23 C40 22 52 26 54 31 C55 35 48 39 38 40 C26 42 10 42 10 36 Z"/><path class="d" d="M22 25 V41 M32 24 V41 M42 25 V39"/>`,
  capocollo: `<path class="o" d="M32 18 C46 18 53 25 53 33 C53 41 46 48 32 48 C18 48 11 41 11 33 C11 25 18 18 32 18 Z"/><circle class="d" cx="25" cy="29" r="2.5"/><circle class="d" cx="36" cy="26" r="2.5"/><circle class="d" cx="30" cy="38" r="2.5"/><circle class="d" cx="40" cy="36" r="2.5"/>`,
  bombette: `<path class="o" d="M16 52 L48 12"/><circle class="o" cx="26" cy="40" r="6.5"/><circle class="o" cx="33" cy="31" r="6.5"/><circle class="o" cx="40" cy="22" r="6.5"/>`,
  stinco: `<path class="o" d="M37 20 L43 9"/><circle class="o" cx="45" cy="7" r="3"/><circle class="o" cx="40" cy="5" r="3"/><path class="o" d="M37 20 C50 24 56 36 50 46 C43 55 26 57 17 48 C9 40 12 27 23 22 C28 20 33 19 37 20 Z"/><path class="d" d="M20 44 C26 50 38 50 45 44"/>`,
  /* — pollo / tacchino — */
  petto_pollo: `<path class="o" d="M40 12 C52 18 54 34 46 44 C38 52 24 52 17 44 C11 36 12 26 20 22 C28 18 34 12 40 12 Z"/><path class="d" d="M24 40 C30 44 38 42 42 36"/>`,
  coscia_pollo: `<path class="o" d="M42 12 C53 17 56 31 48 40 C42 47 31 48 25 42 C19 36 20 25 27 18 C31 14 37 10 42 12 Z"/><path class="o" d="M25 42 L16 51"/><circle class="o" cx="12" cy="55" r="4"/><circle class="o" cx="19" cy="58" r="4"/><path class="d" d="M32 20 C27 25 26 32 29 37"/>`,
  ali_pollo: `<path class="o" d="M16 49 L32 37 A6.5 6.5 0 0 0 24 27 L8 39 A6.5 6.5 0 0 0 16 49 Z"/><path class="o" d="M29 38 L45 42 A5 5 0 0 0 47 32 L31 28 A5 5 0 0 0 29 38 Z"/><path class="o" d="M50 41 L57 45"/><path class="d" d="M18 40 l8 -6"/>`,
  galletto: `<path class="o" d="M32 16 C39 16 43 23 43 33 C43 44 39 50 32 50 C25 50 21 44 21 33 C21 23 25 16 32 16 Z"/><path class="o" d="M22 24 C14 22 8 28 10 35 C11 40 16 42 21 40"/><path class="o" d="M42 24 C50 22 56 28 54 35 C53 40 48 42 43 40"/><path class="o" d="M25 49 C22 53 18 56 13 56"/><path class="o" d="M39 49 C42 53 46 56 51 56"/><path class="d" d="M32 22 V44"/>`,
  fesa_tacchino: `<path class="o" d="M17 20 H49 C53 20 55 23 54 27 L51 41 C50 45 47 46 43 46 H17 C13 46 11 43 12 39 L13 25 C13 22 14 20 17 20 Z"/><path class="d" d="M20 27 H46 M19 33 H45 M18 39 H44"/>`,
  /* — agnello — */
  costolette_agnello: `<circle class="o" cx="24" cy="40" r="9"/><path class="o" d="M31 33 L52 12"/><circle class="o" cx="54" cy="10" r="2.5"/><path class="d" d="M18 42 a7 7 0 0 0 10 3"/>`,
  arrosticini: `<path class="o" d="M12 22 H52 M12 32 H52 M12 42 H52"/><path class="d" d="M22 19 V25 M30 19 V25 M38 19 V25 M22 29 V35 M30 29 V35 M38 29 V35 M22 39 V45 M30 39 V45 M38 39 V45"/>`,
  cosciotto_agnello: `<path class="o" d="M14 26 C20 16 36 12 46 18 C54 23 56 34 50 42 C44 50 30 52 20 46 C12 41 10 33 14 26 Z"/><circle class="o" cx="39" cy="29" r="4.5"/><path class="d" d="M19 38 C24 42 30 43 36 41"/><path class="d" d="M22 24 l7 -3"/>`,
  /* — pesce & mare — */
  salmone: `<path class="o" d="M12 22 L52 18 C54 30 46 42 32 46 C22 49 13 44 12 36 Z"/><path class="d" d="M24 21 C25 29 23 37 19 43"/><path class="d" d="M34 20 C35 28 33 36 29 43"/><path class="d" d="M44 19 C45 26 43 33 39 40"/>`,
  gamberoni: `<path class="o" d="M44 14 C58 22 56 40 42 47 C33 51 22 48 18 41 C24 44 32 44 38 40 C46 35 48 24 44 14 Z"/><path class="o" d="M18 41 L10 36 M18 41 L12 47"/><path class="d" d="M44 22 C41 24 38 24 35 23 M46 30 C43 32 40 32 37 31"/><path class="d" d="M44 14 C40 8 32 6 26 8"/>`,
  trancio: `<circle class="o" cx="32" cy="33" r="19"/><circle class="o" cx="32" cy="33" r="3"/><path class="d" d="M15 26 A19 19 0 0 1 32 14"/>`,
  branzino: `<path class="o" d="M10 32 C18 20 38 18 48 26 L56 20 C55 28 55 36 56 44 L48 38 C38 46 18 44 10 32 Z"/><path class="o" d="M20 29 h.2"/><path class="d" d="M26 24 C24 28 24 36 26 40"/>`,
  calamari: `<path class="o" d="M32 8 C38 8 42 14 42 24 L42 34 C42 38 38 40 32 40 C26 40 22 38 22 34 L22 24 C22 14 26 8 32 8 Z"/><path class="o" d="M22 16 L12 22 L22 26"/><path class="o" d="M42 16 L52 22 L42 26"/><path class="o" d="M26 40 C25 46 24 50 20 54 M32 40 V56 M38 40 C39 46 40 50 44 54"/><path class="d" d="M29 40 C28 46 28 49 26 52 M35 40 C36 46 36 49 38 52"/>`,
  sardine: `<path class="o" d="M10 22 C16 15 26 15 31 21 C26 27 16 28 10 22 Z"/><path class="o" d="M31 21 L38 16 M31 21 L38 25"/><path class="o" d="M16 20.5 h.2"/><path class="o" d="M22 40 C28 33 38 33 43 39 C38 45 28 46 22 40 Z"/><path class="o" d="M43 39 L50 34 M43 39 L50 43"/><path class="o" d="M28 38.5 h.2"/>`,
  /* — verdure — */
  zucchine: `<path class="o" d="M31 54 L47 22 A8 8 0 0 0 33 15 L17 47 A8 8 0 0 0 31 54 Z"/><path class="o" d="M41 14 l4 -6"/><path class="d" d="M25 44 L38 20 M31 48 L44 24"/>`,
  peperoni: `<path class="o" d="M32 20 C26 14 15 18 14 28 C13 40 22 50 32 50 C42 50 51 40 50 28 C49 18 38 14 32 20 Z"/><path class="o" d="M32 18 C32 12 36 10 38 10"/><path class="d" d="M24 22 C24 34 26 42 30 48 M40 22 C40 34 38 42 34 48"/>`,
  melanzane: `<path class="o" d="M42 18 C50 24 52 36 44 44 C36 52 22 52 16 44 C11 37 14 28 22 26 C30 24 36 22 42 18 Z"/><path class="o" d="M44 16 C46 12 50 10 54 10"/><path class="d" d="M36 18 C40 14 44 13 48 14"/><path class="d" d="M42 24 C46 20 50 18 53 18"/>`,
  cipolla: `<path class="o" d="M12 40 A20 20 0 0 1 52 40"/><path class="d" d="M18 40 A14 14 0 0 1 46 40"/><path class="d" d="M24 40 A8 8 0 0 1 40 40"/><path class="o" d="M12 40 H52"/><path class="d" d="M28 44 v6 M32 44 v7 M36 44 v6"/>`,
  mais: `<path class="o" d="M32 10 C40 10 44 18 44 32 C44 46 40 54 32 54 C24 54 20 46 20 32 C20 18 24 10 32 10 Z"/><path class="d" d="M27 13 V51 M37 13 V51"/><path class="d" d="M21 22 H43 M20 32 H44 M21 42 H43"/>`,
  funghi: `<path class="o" d="M12 30 C12 16 52 16 52 30 C52 34 46 34 40 34 H24 C18 34 12 34 12 30 Z"/><path class="o" d="M26 34 C26 44 24 50 22 52 H42 C40 50 38 44 38 34"/><path class="d" d="M20 30 V33 M28 31 V34 M36 31 V34 M44 30 V33"/>`,
  radicchio: `<path class="o" d="M14 50 C12 34 20 18 32 12 C34 22 34 30 32 36 C40 30 46 22 50 16 C52 28 46 42 34 48 C28 51 20 52 14 50 Z"/><path class="d" d="M20 46 C24 36 28 26 32 16 M26 48 C32 40 38 30 44 22"/>`,
  patate: `<path class="o" d="M16 32 C14 24 22 16 32 16 C44 16 52 24 50 34 C48 44 38 50 27 48 C18 46 17 40 16 32 Z"/><path class="d" d="M24 26 l2 2 M38 24 l2 2 M30 38 l2 2 M42 34 l2 2 M22 36 l2 2"/>`,
  /* — categorie (teste/simboli) — */
  cat_manzo: `<path class="o" d="M16 14 C10 10 8 18 14 20"/><path class="o" d="M48 14 C54 10 56 18 50 20"/><path class="o" d="M22 16 C26 12 38 12 42 16 C48 20 48 30 44 38 C42 46 36 50 32 50 C28 50 22 46 20 38 C16 30 16 20 22 16 Z"/><path class="d" d="M24 40 C26 46 38 46 40 40"/><path class="d" d="M27 43 h.2 M37 43 h.2"/><path class="d" d="M26 28 h.2 M38 28 h.2"/>`,
  cat_vitello: `<path class="o" d="M22 16 C26 12 38 12 42 16 C48 20 48 30 44 38 C42 46 36 50 32 50 C28 50 22 46 20 38 C16 30 16 20 22 16 Z"/><path class="o" d="M18 22 C12 20 10 25 16 27"/><path class="o" d="M46 22 C52 20 54 25 48 27"/><path class="d" d="M28 14 C30 10 34 10 36 14"/><path class="d" d="M24 40 C26 46 38 46 40 40"/><path class="d" d="M26 28 h.2 M38 28 h.2"/>`,
  cat_maiale: `<path class="o" d="M32 14 C44 14 52 24 52 34 C52 44 44 50 32 50 C20 50 12 44 12 34 C12 24 20 14 32 14 Z"/><path class="o" d="M19 19 L14 9 L26 13"/><path class="o" d="M45 19 L50 9 L38 13"/><path class="o" d="M26 34 C26 29 38 29 38 34 C38 39 26 39 26 34 Z"/><path class="d" d="M29 34 v.2 M35 34 v.2"/><path class="d" d="M23 25 h.2 M41 25 h.2"/>`,
  cat_pollo: `<path class="o" d="M28 14 C28 10 32 10 32 14 C32 10 36 10 36 14 C36 11 40 11 40 15"/><path class="o" d="M26 22 C26 14 40 12 44 20 C46 26 44 30 40 32 C36 34 30 34 27 30 C25 27 25 25 26 22 Z"/><path class="o" d="M44 24 L52 26 L44 29"/><path class="d" d="M40 32 C40 37 36 38 35 34"/><path class="o" d="M34 22 h.2"/>`,
  cat_tacchino: `<path class="o" d="M10 32 A26 26 0 0 1 54 32"/><path class="d" d="M32 48 L14 34 M32 48 L23 22 M32 48 L32 16 M32 48 L41 22 M32 48 L50 34"/><path class="o" d="M32 50 C28 50 26 46 26 41 C26 35 28 32 32 32 C36 32 38 35 38 41 C38 46 36 50 32 50 Z"/><path class="d" d="M38 36 l5 2"/>`,
  cat_agnello: `<path class="o" d="M16 30 C10 30 10 21 18 20 C18 12 30 10 33 16 C38 10 50 14 48 21 C56 22 56 31 48 32 C50 39 41 43 35 39 C31 45 19 43 17 36 C13 36 12 31 16 30 Z"/><path class="o" d="M26 30 C26 24 38 24 38 30 C38 38 34 42 32 42 C30 42 26 38 26 30 Z"/><path class="d" d="M29 30 h.2 M35 30 h.2"/><path class="d" d="M24 27 C20 25 18 29 22 31 M40 27 C44 25 46 29 42 31"/>`,
  cat_pesce: `<path class="o" d="M10 32 C18 20 38 18 48 26 L56 20 C55 28 55 36 56 44 L48 38 C38 46 18 44 10 32 Z"/><path class="o" d="M20 29 h.2"/><path class="d" d="M26 24 C24 28 24 36 26 40"/>`,
  cat_verdure: `<path class="o" d="M16 48 C12 28 28 12 50 14 C52 34 38 50 20 50 C18 50 17 49 16 48 Z"/><path class="d" d="M20 46 C26 36 36 24 46 18"/><path class="d" d="M24 40 C30 40 34 36 36 32 M32 30 C30 26 30 22 32 18"/>`,
};

const GLIFO = {
  costata: "costata", spiedini_manzo: "spiedino", spiedini_vitello: "spiedino",
  spiedini_maiale: "spiedino", spiedini_pollo: "spiedino", spiedini_tacchino: "spiedino",
  spiedini_agnello: "spiedino",
  tagliata_vitello: "tagliata", braciola_vitello: "braciola", braciola: "braciola",
  costoletta: "braciola", salsiccia_vitello: "salsiccia",
  hamburger_tacchino: "hamburger", coscia_tacchino: "coscia_pollo",
  spada: "trancio",
};

function svgIcona(chiave, extra) {
  const markup = ICONE[chiave];
  if (!markup) return "";
  return `<svg class="ico${extra ? " " + extra : ""}" viewBox="0 0 64 64" aria-hidden="true">${markup}</svg>`;
}

function iconaItem(item) {
  return svgIcona(GLIFO[item.id] || item.id) || `<span class="ico-emoji">${item.icona}</span>`;
}

function chipItem(item) {
  return `<span class="chip chip-${item.categoria}">${iconaItem(item)}</span>`;
}

/* ================================================================
   STATO
   ================================================================ */
const selezione = new Set();
const opzioni = {};        // per gli alimenti con grado+spessore
CATALOGO.filter(i => i.gradi).forEach(i => {
  opzioni[i.id] = { grado: i.id === "costata" ? "rare" : "media", spessore: i.spessoreBase };
});

let wakeLock  = null;
let audioCtx  = null;
let regia     = null;   // stato della regia (piano attivo)

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
    head.innerHTML = `<span class="chip chip-${cat.id}">${svgIcona("cat_" + cat.id) || cat.icona}</span>
      <span class="cat-titolo">${cat.nome}</span>
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
        ${chipItem(item)}
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
  aggiornaQuando();
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
  aggiornaQuando();
  salvaStato();
}

function aggiornaContatore() {
  const ok = document.getElementById("okBtn");
  if (ok) ok.disabled = selezione.size === 0 || regia !== null;
}

/* ================================================================
   SCHEDA ALIMENTO (bottom sheet)
   ================================================================ */
const overlayEl = document.getElementById("scheda-overlay");

function apriScheda(id) {
  const item = byId[id];
  if (!item) return;
  const s = item.scheda;
  document.getElementById("scheda-titolo").innerHTML = `${chipItem(item)} ${item.nome}`;
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
   SINTESI OPERATIVA — raggruppa i tagli del carrello per trattamento
   (una marinata unica, la salatura anticipata insieme, ecc.)
   TRATT: classificazione per i tagli senza marinatura/salaPrima.
   NOTE_PREP: promemoria breve per riga (fallback: niente nota).
   ================================================================ */
const TRATT = {
  costata: "nudo",      tagliata: "salesubito",  hamburger: "salesubito",
  picanha: "salesubito", asado: "salesubito",
  braciola_vitello: "salesubito", tagliata_vitello: "salesubito", salsiccia_vitello: "olio",
  salsiccia: "nudo",    luganega: "nudo",        salamella: "olio",
  pancetta: "nudo",     braciola: "salesubito",  wurstel: "nudo",
  capocollo: "salesubito", bombette: "nudo",     stinco: "olio",
  hamburger_tacchino: "olio",
  arrosticini: "nudo",
  salmone: "olio", gamberoni: "olio", branzino: "olio", calamari: "olio", sardine: "olio",
  zucchine: "olio", peperoni: "olio", melanzane: "olio", cipolla: "olio",
  mais: "olio", funghi: "olio", radicchio: "olio", patate: "olio",
};

const NOTE_PREP = {
  bistecca: "sale abbondante su tutti i lati, poi su una gratella a temperatura ambiente",
  costata: "tradizione: niente prima — sale in scaglie e olio a fine cottura",
  filetto_manzo: "sale 40+ min prima; un filo d'olio (è magrissimo)",
  tagliata: "sala subito prima: è sottile",
  hamburger: "sala solo la superficie, mai l'impasto; fossetta al centro",
  spiedini_manzo: "olio, aglio, rosmarino",
  picanha: "solo sale grosso, come in Brasile",
  bavetta: "olio, soia (o limone) e aglio: le fibre aperte la assorbono",
  asado: "solo sale grosso",
  nodino_vitello: "sale 40+ min prima; filo d'olio",
  braciola_vitello: "olio leggero e sale subito prima",
  tagliata_vitello: "sala subito prima",
  spiedini_vitello: "olio, limone, salvia o rosmarino",
  salsiccia_vitello: "filo d'olio; NON bucarla",
  salsiccia: "niente: NON bucarla",
  luganega: "a chiocciola con due spiedi incrociati; non bucarla",
  salamella: "pennellata d'olio; non bucarla",
  costine: "rub: sale, pepe, paprika dolce, zucchero di canna, aglio; via la pleura",
  pancetta: "niente: è già condita dal suo grasso",
  braciola: "filo d'olio e sale subito prima; incidi il bordo di grasso",
  costoletta: "sale 40+ min prima; incidi il grasso sul bordo",
  wurstel: "taglietti diagonali facoltativi",
  filetto_maiale: "sale o rub 40+ min prima; via la pellicina argentata",
  capocollo: "solo sale leggero, niente olio",
  bombette: "infilale ben strette su uno spiedo d'acciaio",
  spiedini_maiale: "olio, aglio, rosmarino, paprika",
  stinco: "olio e paprika; prepara la glassa (miele+senape) per il finale",
  petto_pollo: "salamoia 30 min (1 l acqua + 60 g sale) o marinata olio-limone-erbe",
  coscia_pollo: "olio, limone, paprika, aglio; pelle ben asciutta",
  ali_pollo: "rub: paprika affumicata, aglio, pepe",
  galletto: "olio, limone, peperoncino, rosmarino, aglio; schiacciato bene",
  spiedini_pollo: "yogurt oppure olio-limone-paprika",
  fesa_tacchino: "salamoia 30 min o marinata olio-limone",
  coscia_tacchino: "rub o marinata: paprika, aglio, rosmarino",
  spiedini_tacchino: "yogurt o olio-limone (obbligatoria per la fesa)",
  hamburger_tacchino: "filo d'olio; fossetta al centro",
  costolette_agnello: "olio, aglio, rosmarino, timo",
  spiedini_agnello: "olio, limone, aglio, origano o cumino",
  arrosticini: "tradizione: nudi — sale SOLO a fine cottura",
  cosciotto_agnello: "olio, aglio, rosmarino, limone",
  salmone: "asciuga benissimo; olio e sale; griglia pulitissima",
  gamberoni: "olio, aglio e prezzemolo 15 min prima",
  spada: "olio-limone-origano, max 20-30 min (il limone lo 'cuoce')",
  branzino: "erbe e limone nel ventre, olio fuori; NON squamarlo",
  calamari: "asciugali BENISSIMO, olio e sale",
  sardine: "olio e sale grosso; gratella a libro",
  zucchine: "olio prima, sale DOPO la cottura",
  peperoni: "a falde con un filo d'olio",
  melanzane: "pennellata d'olio poco prima (assorbono), sale dopo",
  cipolla: "rondelle da 1,5 cm con stuzzicadenti; olio leggero",
  mais: "sbucciate e oliate",
  funghi: "olio, aglio e prezzemolo nella cappella; non lavarli",
  radicchio: "a quarti col torsolo; olio e sale prima",
  patate: "prelessate 10 min con la buccia, poi a fette con olio e rosmarino",
};

function gruppoDi(item) {
  if (item.marinatura >= 60) return "marinata60";
  if (item.marinatura > 0)   return "marinata30";
  if (item.salaPrima)        return "sale40";
  return TRATT[item.id] || "salesubito";
}

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
const shareCarBtn = document.getElementById("condividi-carrello");

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
    shareCarBtn.classList.add("hidden");
    return;
  }

  const { totale, righe, contorni } = calcolaSpesa();

  const righeHtml = righe.map(r => `
    <li>
      <span class="car-icona">${chipItem(r.item)}</span>
      <span class="car-nome">${r.item.nome}</span>
      <span class="car-qta">${fmtPeso(r.crudo)}${r.pezzi ? ` <em>(≈ ${r.pezzi} ${r.unita})</em>` : ""}</span>
      <button type="button" class="car-x" data-rimuovi="${r.item.id}" aria-label="Togli ${r.item.nome}">✕</button>
    </li>`).join("");

  const contorniHtml = contorni.length ? `
    <li class="car-contorni">
      <span class="car-icona"><span class="chip chip-verdure">${svgIcona("cat_verdure")}</span></span>
      <span class="car-nome">Contorni: ${contorni.map(c => c.nome).join(", ")}</span>
      <span class="car-qta"><em>~200 g a testa in tutto</em></span>
      <span></span>
    </li>` : "";

  carrelloEl.innerHTML = `
    <ul class="car-lista">${righeHtml}${contorniHtml}</ul>
    ${righe.length ? `<p class="car-totale">Carne/pesce da comprare in totale: <strong>~${fmtPeso(righe.reduce((s, r) => s + r.crudo, 0))}</strong> (fabbisogno netto ${fmtPeso(totale)})</p>` : ""}`;

  carrelloEl.insertAdjacentHTML("beforeend", repartiHtml());

  carrelloEl.querySelectorAll("[data-rimuovi]").forEach(btn =>
    btn.addEventListener("click", () => toggleItem(btn.dataset.rimuovi)));

  shareCarBtn.classList.remove("hidden");
}


/* ================================================================
   SPESA PRECISA — dispensa/aromi (senza doppioni) e attrezzatura.
   ING: dizionario ingredienti (u = unità contabile, q = quantità
   fissa, altrimenti "q.b."). AROMI: cosa serve per ogni taglio;
   le voci contabili sono [id, quantità].
   ================================================================ */
const ING = {
  olio: { n: "Olio extravergine" }, sale: { n: "Sale grosso + fino" }, pepe: { n: "Pepe nero" },
  limone: { n: "Limoni", u: "" }, aglio: { n: "Aglio", u: "spicchi" },
  rosmarino: { n: "Rosmarino", u: "rametti" }, timo: { n: "Timo", u: "rametti" },
  salvia: { n: "Salvia", u: "rametti" }, origano: { n: "Origano" }, menta: { n: "Menta" },
  prezzemolo: { n: "Prezzemolo" }, basilico: { n: "Basilico" },
  paprika: { n: "Paprika dolce" }, paprikaAff: { n: "Paprika affumicata" },
  peperoncino: { n: "Peperoncino" }, soia: { n: "Salsa di soia" },
  yogurt: { n: "Yogurt bianco", q: "1 vasetto" }, miele: { n: "Miele" }, senape: { n: "Senape" },
  salsabbq: { n: "Salsa BBQ", q: "1 bottiglia" }, zucchero: { n: "Zucchero di canna" },
  agliopolvere: { n: "Aglio in polvere" }, burro: { n: "Burro" }, aceto: { n: "Aceto balsamico" },
  rucola: { n: "Rucola", q: "1 busta" }, grana: { n: "Grana in scaglie" },
  panini: { n: "Panini", q: "1 a testa" }, formaggio: { n: "Formaggio a fette (facolt.)" },
};

const AROMI = {
  bistecca: ["sale", "pepe", "olio"],
  costata: ["sale", "olio"],
  filetto_manzo: ["sale", "pepe", "olio", "burro"],
  tagliata: ["sale", "olio", "rucola", "grana"],
  hamburger: ["sale", "olio", "panini", "formaggio"],
  spiedini_manzo: ["olio", ["aglio", 1], ["rosmarino", 1], "sale", "pepe"],
  picanha: ["sale"],
  bavetta: ["olio", "soia", ["aglio", 1], "sale"],
  asado: ["sale"],
  nodino_vitello: ["sale", "olio", "pepe"],
  braciola_vitello: ["olio", "sale"],
  tagliata_vitello: ["olio", "sale", ["limone", 1], "rucola"],
  spiedini_vitello: ["olio", ["limone", 1], ["salvia", 1], "sale"],
  salsiccia_vitello: ["olio"],
  salsiccia: ["panini"],
  luganega: [],
  salamella: ["olio", "panini"],
  costine: ["sale", "pepe", "paprika", "zucchero", "agliopolvere", "salsabbq"],
  pancetta: [],
  braciola: ["olio", "sale"],
  costoletta: ["sale", "olio"],
  wurstel: ["senape", "panini"],
  filetto_maiale: ["sale", "paprika", "agliopolvere", "pepe", "olio"],
  capocollo: ["sale"],
  bombette: [],
  spiedini_maiale: ["olio", ["aglio", 1], ["rosmarino", 1], "paprika", "sale"],
  stinco: ["olio", "paprika", "miele", "senape"],
  petto_pollo: ["olio", ["limone", 1], "sale"],
  coscia_pollo: ["olio", ["limone", 1], "paprika", ["aglio", 1], "sale"],
  ali_pollo: ["paprikaAff", "agliopolvere", "pepe", "sale"],
  galletto: ["olio", ["limone", 1], "peperoncino", ["rosmarino", 1], ["aglio", 2], "pepe", "sale"],
  spiedini_pollo: ["yogurt", ["limone", 1], "paprika", "sale"],
  fesa_tacchino: ["sale", "olio", ["limone", 1]],
  coscia_tacchino: ["paprika", ["aglio", 1], ["rosmarino", 1], "olio", "sale"],
  spiedini_tacchino: ["yogurt", ["limone", 1], "sale"],
  hamburger_tacchino: ["olio", "sale", "panini"],
  costolette_agnello: ["olio", ["aglio", 1], ["rosmarino", 1], ["timo", 1], "sale"],
  spiedini_agnello: ["olio", ["limone", 1], ["aglio", 1], "origano", "sale"],
  arrosticini: ["sale"],
  cosciotto_agnello: ["olio", ["aglio", 1], ["rosmarino", 1], ["limone", 1], "sale"],
  salmone: ["olio", "sale", ["limone", 1]],
  gamberoni: ["olio", ["aglio", 1], "prezzemolo", ["limone", 1], "sale"],
  spada: ["olio", ["limone", 1], "origano", "sale"],
  branzino: ["olio", ["limone", 1], ["rosmarino", 1], ["timo", 1], "sale"],
  calamari: ["olio", "sale", ["limone", 1], "prezzemolo"],
  sardine: ["olio", "sale"],
  zucchine: ["olio", "sale", "menta"],
  peperoni: ["olio", "sale", ["aglio", 1], "basilico"],
  melanzane: ["olio", "sale", ["aglio", 1], "prezzemolo"],
  cipolla: ["olio", "sale", "aceto"],
  mais: ["burro", "sale"],
  funghi: ["olio", ["aglio", 1], "prezzemolo", "sale"],
  radicchio: ["olio", "sale", "aceto"],
  patate: ["olio", "sale", ["rosmarino", 1]],
};

const CON_SPIEDI_LEGNO = ["spiedini_manzo", "spiedini_vitello", "spiedini_maiale",
  "spiedini_pollo", "spiedini_tacchino", "spiedini_agnello"];

function spesaDispensa(items) {
  const acc = {};   // id -> {tot, per:[nomi]}
  items.forEach(item => {
    (AROMI[item.id] || []).forEach(voce => {
      const [id, n] = Array.isArray(voce) ? voce : [voce, 0];
      if (!acc[id]) acc[id] = { tot: 0, per: [] };
      acc[id].tot += n;
      if (!acc[id].per.includes(item.nome)) acc[id].per.push(item.nome);
    });
  });
  return Object.entries(acc).map(([id, a]) => {
    const d = ING[id];
    const q = d.q ? d.q : (d.u !== undefined && a.tot > 0 ? `${a.tot}${d.u ? " " + d.u : ""}` : "q.b.");
    const per = a.per.length <= 2 && items.length > 1 ? a.per.slice(0, 2).join(", ") : "";
    return { nome: d.n, q, per };
  });
}

function spesaAttrezzi(items) {
  const out = [];
  const maxTotMin = items.length ? Math.max(...items.map(totaleSec)) / 60 : 0;
  const indiretta = items.some(i => i.metodo !== "diretta");
  let kg = Math.max(2, Math.ceil((maxTotMin + 30) / 40)) + (indiretta ? 1 : 0);
  kg = Math.min(kg, 6);
  out.push({ nome: "Carbonella", q: `~${kg} kg`, per: indiretta ? "serve anche la zona indiretta" : "" });
  const nSpiedi = items.filter(i => CON_SPIEDI_LEGNO.includes(i.id)).length;
  if (nSpiedi) out.push({ nome: "Spiedi di legno", q: "6-8", per: "a bagno 30 min prima" });
  if (items.some(i => i.id === "luganega")) out.push({ nome: "Spiedi lunghi ×2", q: "", per: "luganega a chiocciola" });
  if (items.some(i => i.riposo > 0)) out.push({ nome: "Alluminio", q: "1 rotolo", per: "riposo della carne" });
  if (items.some(i => i.id === "cipolla")) out.push({ nome: "Stuzzicadenti", q: "", per: "rondelle di cipolla" });
  if (items.some(i => i.id === "branzino" || i.id === "sardine")) out.push({ nome: "Gratella a libro", q: "", per: "pesce da girare in un gesto" });
  if (items.some(i => i.id === "galletto")) out.push({ nome: "Mattone avvolto in alluminio", q: "", per: "peso sul galletto" });
  out.push({ nome: "Termometro a lettura istantanea", q: "", per: "consigliato" });
  return out;
}

function repartoHtml(titolo, righe, nota) {
  if (!righe.length) return "";
  const li = righe.map(r => `<li><span>${r.nome}${r.per ? ` <span class="per">· ${r.per}</span>` : ""}</span><span class="q">${r.q}</span></li>`).join("");
  return `<div class="reparto"><h4>${titolo}${nota ? ` <span class="per">${nota}</span>` : ""}</h4><ul>${li}</ul></div>`;
}

function repartiHtml() {
  const items = [...selezione].map(id => byId[id]);
  if (!items.length) return "";
  return repartoHtml("🧂 Dispensa &amp; aromi", spesaDispensa(items), "(salta quello che hai già)") +
         repartoHtml("🔥 Attrezzatura", spesaAttrezzi(items));
}

function listaSpesaTesto() {
  const { adulti, bambini, righe, contorni } = calcolaSpesa();
  const items = [...selezione].map(id => byId[id]);
  const r = [];
  r.push(`Lista spesa griglia — ${adulti} adulti${bambini ? ` + ${bambini} bambini` : ""}`);
  if (righe.length) {
    r.push("", "🥩 DAL MACELLAIO");
    righe.forEach(x => r.push(`• ${x.item.nome}: ${fmtPeso(x.crudo)}${x.pezzi ? ` (circa ${x.pezzi} ${x.unita})` : ""}`));
  }
  if (contorni.length) {
    r.push("", "🥬 ORTOLANO");
    r.push(`• ${contorni.map(c => c.nome).join(", ")} (~200 g a testa in tutto)`);
  }
  const disp = spesaDispensa(items);
  if (disp.length) {
    r.push("", "🧂 DISPENSA & AROMI (salta ciò che hai già)");
    disp.forEach(d => r.push(`• ${d.nome}: ${d.q}${d.per ? ` (${d.per})` : ""}`));
  }
  r.push("", "🔥 ATTREZZATURA");
  spesaAttrezzi(items).forEach(a => r.push(`• ${a.nome}${a.q ? `: ${a.q}` : ""}${a.per ? ` (${a.per})` : ""}`));
  return r.join("\n");
}

/* ================================================================
   QUANDO SI MANGIA — giorno (default oggi) + ora → OK
   ================================================================ */
const giornoEl    = document.getElementById("giorno-pranzo");
const oraEl       = document.getElementById("ora-pranzo");
const okBtn       = document.getElementById("okBtn");
const quandoRiep  = document.getElementById("quando-riepilogo");
const avvisoEl    = document.getElementById("avviso");

function dataLocaleISO(d) {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

const oggiISO = dataLocaleISO(new Date());
giornoEl.value = oggiISO;
giornoEl.min = oggiISO;

function targetEpoch() {
  if (!giornoEl.value || !oraEl.value) return null;
  const [h, m] = oraEl.value.split(":").map(Number);
  const [Y, M, D] = giornoEl.value.split("-").map(Number);
  return new Date(Y, M - 1, D, h, m, 0, 0).getTime();
}

function fmtGiorno(epoch) {
  const d = new Date(epoch);
  return dataLocaleISO(d) === oggiISO ? "oggi"
    : d.toLocaleDateString("it-IT", { weekday: "long", day: "numeric", month: "long" });
}

function aggiornaQuando() {
  if (regia) return;
  const items = [...selezione].map(id => byId[id]);
  if (!items.length) { quandoRiep.textContent = "Prima riempi il carrello."; return; }
  const T = targetEpoch();
  if (!T) { quandoRiep.textContent = "Imposta l'ora del pranzo."; return; }
  const maxTot = Math.max(...items.map(totaleSec));
  const inizioPrep = T - maxTot * 1000 + (passiPreparazione(items)[0]?.off ?? 0) * 1000;
  let txt = `Si mangia ${fmtGiorno(T)} alle ${formatTime(new Date(T))} · primi preparativi alle ${formatTime(new Date(inizioPrep))} · prima carne sulla griglia alle ${formatTime(new Date(T - maxTot * 1000))}.`;
  if (inizioPrep < Date.now() && T > Date.now()) {
    txt += " ⚠ Sei già oltre l'inizio: con OK il piano parte subito e l'ora del pranzo slitta.";
  }
  quandoRiep.textContent = txt;
}

[giornoEl, oraEl].forEach(el => el.addEventListener("input", () => { aggiornaQuando(); salvaStato(); }));

function mostraAvviso(txt) {
  avvisoEl.textContent = txt;
  avvisoEl.classList.remove("hidden");
  setTimeout(() => avvisoEl.classList.add("hidden"), 3500);
}

/* ================================================================
   REGIA — modello ibrido (C):
   - preparazione ELASTICA: suona all'ora del passaggio e ri-suona
     ogni minuto finché non premi "Fatto"; se il ritardo supera il
     margine del passaggio, tutto il piano futuro slitta e l'ora
     del pranzo si aggiorna (ricalcolo onesto).
   - cottura SUL BINARIO: metti/gira/togli seguono l'orologio,
     "Fatto" è solo spunta/silenzia — così tutto arriva in tavola
     insieme e il link condiviso resta sincronizzato senza server.
   ================================================================ */
const regiaSez   = document.getElementById("regia-sez");
const passoEl    = document.getElementById("passo");
const regiaBanner = document.getElementById("regia-banner");
const logEl      = document.getElementById("log");
const nextStickyEl = document.getElementById("next-sticky");
const annullaBtn = document.getElementById("annullaBtn");
const sharePianoBtn = document.getElementById("sharePianoBtn");

let regiaTicker = null;
let confermaAnnulla = null;

function passiPreparazione(items) {
  const p = [];
  const mar60 = items.filter(i => i.marinatura >= 60);
  const mar30 = items.filter(i => i.marinatura > 0 && i.marinatura < 60);
  const dett = list => list.map(i => `${i.nome}: ${NOTE_PREP[i.id] || ""}`).join(" · ");

  if (mar60.length) p.push({ off: -100 * 60, margine: 15 * 60, icona: "🥣",
    titolo: `Prepara marinata/rub e metti a marinare: ${mar60.map(i => i.nome).join(", ")}`,
    dett: dett(mar60) + (mar60.length > 1 ? " — una ciotola unica, poi dividi nei sacchetti." : "") });
  if (mar30.length) p.push({ off: -70 * 60, margine: 15 * 60, icona: "🥣",
    titolo: `Metti a marinare (~30 min): ${mar30.map(i => i.nome).join(", ")}`, dett: dett(mar30) });
  if (items.some(i => CON_SPIEDI_LEGNO.includes(i.id)))
    p.push({ off: -50 * 60, margine: 20 * 60, icona: "💧", titolo: "Metti a bagno gli spiedi di legno",
      dett: "30 min in acqua: non bruceranno sulla brace." });
  const daSalare = items.filter(i => i.salaPrima);
  if (daSalare.length) p.push({ off: -45 * 60, margine: 15 * 60, icona: "🧂",
    titolo: `Sala in anticipo: ${daSalare.map(i => i.nome).join(", ")}`, dett: dett(daSalare) });
  const indiretta = items.some(i => i.metodo !== "diretta");
  p.push({ off: -40 * 60, margine: 5 * 60, icona: "🔥",
    titolo: "Accendi la carbonella (ciminiera piena)",
    dett: `Pronta in ~20 min.${indiretta ? " Abbondante: ti servirà anche una zona indiretta." : ""}` });
  const gruppiFrigo = {};
  items.filter(i => i.frigo > 0).forEach(i => (gruppiFrigo[i.frigo] = gruppiFrigo[i.frigo] || []).push(i));
  Object.keys(gruppiFrigo).map(Number).sort((a, b) => b - a).forEach(min => {
    p.push({ off: -min * 60, margine: Math.max(5 * 60, min * 20), icona: "🧊",
      titolo: `Fuori dal frigo: ${gruppiFrigo[min].map(i => i.nome).join(", ")}`,
      dett: "A temperatura ambiente cuoce uniforme." });
  });
  p.push({ off: -10 * 60, margine: 3 * 60, icona: "🔥",
    titolo: indiretta ? "Stendi la brace in DUE ZONE" : "Stendi la brace",
    dett: indiretta ? "Forte da un lato, l'altro lato libero per l'indiretta." : "Una zona forte e un bordo dolce per gestire le fiammate." });
  p.push({ off: -5 * 60, margine: 2 * 60, icona: "🧹",
    titolo: "Spazzola la griglia, ungila e falla scaldare", dett: "Carta da cucina e olio, sopra la brace." });
  return p.sort((a, b) => a.off - b.off);
}

function costruisciEventi(items) {
  const maxTot = Math.max(...items.map(totaleSec));
  const eventi = [];
  items.forEach(item => {
    const cott  = cotturaSec(item);
    const start = maxTot - totaleSec(item);
    const end   = start + cott;
    eventi.push({ off: start, tipo: "metti", titolo: `Metti ${item.nome} (${fmtMin(cott)}, ${item.metodo})`, dett: NOTE_PREP[item.id] || "" });
    const avgMin = averageRange(item.flip);
    const interval = avgMin ? Math.round(avgMin * 60) : null;
    if (interval) {
      const guard = Math.max(30, Math.round(interval * 0.3));
      for (let t = start + interval; t < end - guard; t += interval)
        eventi.push({ off: t, tipo: "gira", titolo: `Gira ${item.nome} (ogni ${item.flip} min)`, dett: "" });
    } else {
      eventi.push({ off: start + Math.round(cott / 2), tipo: "gira", titolo: `Gira ${item.nome}`, dett: "" });
    }
    eventi.push({ off: end, tipo: "togli",
      titolo: item.riposo > 0 ? `Togli ${item.nome} — riposo ${item.riposo} min sotto alluminio` : `Togli ${item.nome} — pronto!`, dett: "" });
  });
  const prio = { metti: 0, gira: 1, togli: 2 };
  eventi.sort((a, b) => a.off !== b.off ? a.off - b.off : (prio[a.tipo] ?? 9) - (prio[b.tipo] ?? 9));
  eventi.push({ off: maxTot, tipo: "finale", titolo: "TUTTO PRONTO! In tavola!", dett: "" });
  return eventi;
}

function pianoRegia(items) {
  const prep = passiPreparazione(items).map(p => ({ ...p, fase: "prep", tipo: "prep" }));
  const cott = costruisciEventi(items).map(e => ({ ...e, fase: "cottura", margine: 0, icona: e.tipo === "finale" ? "🍽" : "🔥" }));
  return [...prep, ...cott].map(e => ({ ...e, fatto: false, fired: false, lastRing: 0 }));
}

function avviaRegia(T, opts = {}) {
  const items = [...selezione].map(id => byId[id]);
  if (!items.length || !T) return false;
  const maxTot = Math.max(...items.map(totaleSec));
  let base = opts.base ?? T - maxTot * 1000;
  const eventi = pianoRegia(items);

  if (opts.base === undefined) {
    const primo = base + eventi[0].off * 1000;
    if (primo < Date.now()) {
      const delta = Date.now() - primo;
      base += delta;
      T += delta;
    }
  }
  eventi.forEach(e => { e.abs = base + e.off * 1000; });
  (opts.fatti || []).forEach(i => { if (eventi[i]) { eventi[i].fatto = true; eventi[i].fired = true; } });
  // passato: niente beep; la cottura è sul binario quindi si spunta da sola,
  // e per l'ospite anche la preparazione (non può agire sul passato)
  eventi.forEach(e => {
    if (e.abs < Date.now()) {
      e.fired = true;
      if (e.fase === "cottura" || opts.ospite) e.fatto = true;
    }
  });

  regia = { T, base, eventi, ospite: !!opts.ospite, maxTot, sliTot: 0 };

  document.getElementById("okBtn").disabled = true;
  giornoEl.disabled = oraEl.disabled = true;
  regiaSez.classList.remove("hidden");
  renderRegiaBanner();
  renderTimelineRegia();
  if (!regia.ospite) {
    requestWakeLock();
    if ("Notification" in window && Notification.permission === "default") Notification.requestPermission();
  }
  if (regiaTicker) clearInterval(regiaTicker);
  regiaTicker = setInterval(tickRegia, 500);
  tickRegia();
  salvaStato();
  regiaSez.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

function passoCorrente() {
  return regia.eventi.find(e => !e.fatto) || null;
}

function tickRegia() {
  if (!regia) return;
  const now = Date.now();
  const evs = regia.eventi;

  evs.forEach((e, i) => {
    if (!e.fired && e.abs <= now) {
      e.fired = true;
      aggiungiLog(e.titolo);
      playBeep(e.fase === "prep" ? "prep" : e.tipo);
      if (navigator.vibrate) navigator.vibrate(e.tipo === "finale" ? [200, 100, 200, 100, 400] : [150, 70, 150]);
      sendNotifica(e.titolo);
      // cottura sul binario: gli eventi precedenti di cottura si spuntano da soli
      if (e.fase === "cottura") evs.forEach((p, j) => { if (j < i && p.fase === "cottura" && !p.fatto) segnaFatto(j, false); });
      const li = document.getElementById(`tl-${i}`);
      if (li) li.classList.add("fired");
    }
  });

  const cur = passoCorrente();

  // suoneria insistente sui passaggi di preparazione scaduti
  if (cur && cur.fase === "prep" && cur.fired && !regia.ospite && now - cur.abs > 55000) {
    if (now - cur.lastRing > 60000) { cur.lastRing = now; playBeep("prep"); if (navigator.vibrate) navigator.vibrate([150, 70, 150]); }
  }

  renderPasso(cur, now);

  if (!cur) {                                   // finale raggiunto e spuntato
    clearInterval(regiaTicker); regiaTicker = null;
    releaseWakeLock();
  }
}

function segnaFatto(idx, manuale) {
  const e = regia.eventi[idx];
  if (!e || e.fatto) return;
  e.fatto = true;
  const li = document.getElementById(`tl-${idx}`);
  if (li) { li.classList.add("done"); li.querySelector("input").checked = true; }

  // preparazione elastica: oltre il margine, tutto il futuro slitta
  if (manuale && e.fase === "prep" && !regia.ospite && e.fired) {
    const ritardo = (Date.now() - e.abs) / 1000;
    const sli = Math.max(0, ritardo - e.margine);
    if (sli > 30) {
      regia.eventi.forEach(x => { if (!x.fatto) x.abs += sli * 1000; });
      regia.T += sli * 1000;
      regia.base += sli * 1000;      // così link e ripristino ricostruiscono gli orari futuri giusti
      regia.sliTot += sli;
      aggiungiLog(`⏲ Ritardo oltre il margine: il piano slitta di ${Math.round(sli / 60)} min — si mangia alle ${formatTime(new Date(regia.T))}. Se hai condiviso il piano, rimanda il link.`);
      renderRegiaBanner();
      renderTimelineRegia();
    }
  }
  salvaStato();
}

function premiFatto() {
  if (!regia) return;
  const idx = regia.eventi.findIndex(e => !e.fatto);
  if (idx === -1) return;
  segnaFatto(idx, true);
  tickRegia();
}

function renderRegiaBanner() {
  regiaBanner.innerHTML = `🍽 Si mangia <strong>${fmtGiorno(regia.T)} alle ${formatTime(new Date(regia.T))}</strong>` +
    ` · prima carne sulla griglia alle ${formatTime(new Date(regia.base))}` +
    (regia.sliTot > 30 ? ` · <span class="slittato">piano slittato di ${Math.round(regia.sliTot / 60)} min</span>` : "");
}

function renderPasso(cur, now) {
  if (!cur) {
    passoEl.innerHTML = `<div class="passo finita"><div class="cosa">🍽 Tutto in tavola — buon appetito!</div></div>`;
    nextStickyEl.classList.add("hidden");
    return;
  }
  const idx = regia.eventi.indexOf(cur);
  const nPrep = regia.eventi.filter(e => e.fase === "prep").length;
  const posTxt = cur.fase === "prep"
    ? `Preparazione · passaggio ${idx + 1} di ${nPrep}`
    : `Cottura · in tavola alle ${formatTime(new Date(regia.T))}`;

  let quando, extra = "", fattoLabel = "✓ Fatto";
  if (cur.abs > now) {
    quando = `alle ${formatTime(new Date(cur.abs))} · tra ${formatSeconds(Math.ceil((cur.abs - now) / 1000))}`;
    fattoLabel = "✓ Fatto in anticipo";
  } else {
    const rit = Math.floor((now - cur.abs) / 1000);
    quando = `${formatTime(new Date(cur.abs))} — ADESSO 🔔${rit >= 60 ? ` · +${Math.floor(rit / 60)} min` : ""}`;
    if (cur.fase === "prep" && rit > cur.margine) {
      extra = `<div class="dett ritardo">Oltre il margine: al "Fatto" il pranzo slitta alle ${formatTime(new Date(regia.T + (rit - cur.margine) * 1000))}.</div>`;
    } else if (cur.fase === "prep" && rit > 30) {
      extra = `<div class="dett">Nei margini: hai ancora ${formatSeconds(cur.margine - rit)} senza spostare il pranzo.</div>`;
    }
  }

  passoEl.innerHTML = `
    <div class="passo${cur.fired && cur.abs <= now ? " due" : ""}">
      <span class="fase-tag">${posTxt}</span>
      <div class="cosa">${cur.icona || "🔥"} ${cur.titolo}</div>
      <div class="quando">${quando}</div>
      ${cur.dett ? `<div class="dett">${cur.dett}</div>` : ""}
      ${extra}
      <button type="button" class="fatto" onclick="premiFatto()">${fattoLabel}</button>
    </div>`;

  nextStickyEl.innerHTML = `<span>${cur.titolo}</span><span class="tempo">${cur.abs > now ? formatSeconds(Math.ceil((cur.abs - now) / 1000)) : "ORA 🔔"}</span>`;
}

function renderTimelineRegia() {
  const list = document.getElementById("timeline-list");
  list.innerHTML = "";
  let faseCorr = "";
  regia.eventi.forEach((e, i) => {
    if (e.fase !== faseCorr) {
      faseCorr = e.fase;
      const h = document.createElement("li");
      h.className = "fase-sep";
      h.textContent = faseCorr === "prep" ? "— Preparazione —" : "— Cottura —";
      list.appendChild(h);
    }
    const li = document.createElement("li");
    li.id = `tl-${i}`;
    if (e.fatto) li.classList.add("done");
    li.innerHTML = `<input type="checkbox" disabled${e.fatto ? " checked" : ""}><span>${formatTime(new Date(e.abs))} — ${e.titolo}</span>`;
    list.appendChild(li);
  });
}

/* --- OK / Annulla --- */
document.getElementById("okBtn").addEventListener("click", () => {
  const T = targetEpoch();
  if (!selezione.size) { mostraAvviso("Il carrello è vuoto."); return; }
  if (!T) { mostraAvviso("Imposta giorno e ora del pranzo."); return; }
  if (T < Date.now()) { mostraAvviso("Quell'ora è già passata: scegli un orario futuro."); return; }
  initAudio();
  avviaRegia(T);
});

annullaBtn.addEventListener("click", () => {
  if (!confermaAnnulla) {
    annullaBtn.textContent = "Confermi? Tocca ancora";
    confermaAnnulla = setTimeout(() => { confermaAnnulla = null; annullaBtn.textContent = "⏹ Annulla"; }, 3000);
    return;
  }
  clearTimeout(confermaAnnulla); confermaAnnulla = null;
  annullaBtn.textContent = "⏹ Annulla";
  if (regiaTicker) { clearInterval(regiaTicker); regiaTicker = null; }
  regia = null;
  regiaSez.classList.add("hidden");
  nextStickyEl.classList.add("hidden");
  logEl.innerHTML = "";
  giornoEl.disabled = oraEl.disabled = false;
  aggiornaContatore();
  aggiornaQuando();
  releaseWakeLock();
  salvaStato();
});

/* ================================================================
   CONDIVISIONI — link senza server (base64url nell'hash)
   #p= piano/regia (per tutti: passaggi sincronizzati sull'orologio)
   #c= carrello (chi cucina riparte da qui)   #g= legacy sessioni v3
   ================================================================ */
function b64urlEncode(obj) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(obj))))
    .replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function b64urlDecode(str) {
  const b64 = str.replace(/-/g, "+").replace(/_/g, "/");
  return JSON.parse(decodeURIComponent(escape(atob(b64))));
}

function opzioniPayload(items) {
  const o = {};
  items.filter(i => i.gradi).forEach(i => { o[i.id] = [opzioni[i.id].grado, opzioni[i.id].spessore]; });
  return Object.keys(o).length ? o : undefined;
}

async function condividiTesto(testo, btn, etichetta) {
  if (navigator.share) {
    try { await navigator.share({ text: testo }); return; } catch (_) { /* annullato: fallback */ }
  }
  let ok = false;
  try { await navigator.clipboard.writeText(testo); ok = true; }
  catch (_) {
    const ta = document.createElement("textarea");
    ta.value = testo; document.body.appendChild(ta);
    ta.select(); try { ok = document.execCommand("copy"); } catch (_) {}
    ta.remove();
  }
  btn.textContent = ok ? "Copiato: incolla su WhatsApp ✓" : "Copia non riuscita";
  setTimeout(() => { btn.textContent = etichetta; }, 2500);
}

shareCarBtn.addEventListener("click", () => {
  if (!selezione.size) return;
  condividiTesto(listaSpesaTesto(), shareCarBtn, "📤 Condividi la lista della spesa");
});

function linkPiano() {
  const items = [...selezione].map(id => byId[id]);
  const dati = { i: items.map(i => i.id), T: regia.T, b: regia.base };
  const o = opzioniPayload(items);
  if (o) dati.o = o;
  return `${location.href.split("#")[0]}#p=${b64urlEncode(dati)}`;
}

function testoPiano() {
  const righe = regia.eventi
    .filter(e => e.fase === "prep" || e.tipo === "metti" || e.tipo === "finale")
    .map(e => `${formatTime(new Date(e.abs))} — ${e.titolo}`);
  return `🔥 Grigliata di ${fmtGiorno(regia.T)} — si mangia alle ${formatTime(new Date(regia.T))}\n${righe.join("\n")}\n\nSegui la regia in diretta (ogni passaggio, sincronizzato):`;
}

sharePianoBtn.addEventListener("click", () => {
  if (!regia) return;
  condividiTesto(`${testoPiano()}\n${linkPiano()}`, sharePianoBtn, "📤 Condividi il piano");
});

function bannerOspite(html) {
  const b = document.createElement("div");
  b.className = "ospite-banner";
  b.innerHTML = html;
  regiaSez.insertBefore(b, regiaSez.firstChild.nextSibling);
}

function caricaSelezione(dati) {
  const ids = (dati.i || []).filter(id => byId[id]);
  if (!ids.length) return false;
  if (dati.o) Object.entries(dati.o).forEach(([id, [grado, spessore]]) => {
    if (!opzioni[id]) return;
    opzioni[id].grado = grado;
    const s = parseFloat(spessore);
    if (isFinite(s) && s > 0) opzioni[id].spessore = s;
    const opts = document.getElementById(`opts-${id}`);
    if (opts) { opts.querySelector("select").value = opzioni[id].grado; opts.querySelector("input").value = opzioni[id].spessore; }
    aggiornaTempoCard(byId[id]);
  });
  ids.forEach(id => { if (!selezione.has(id)) toggleItem(id); });
  new Set(ids.map(id => byId[id].categoria)).forEach(cat => {
    const acc = gridEl.querySelector(`.cat-acc[data-cat="${cat}"]`);
    if (acc && !acc.classList.contains("open")) {
      acc.classList.add("open");
      acc.querySelector(".cat-head").setAttribute("aria-expanded", "true");
    }
  });
  return true;
}

function bootPiano() {
  const m = location.hash.match(/#p=([A-Za-z0-9\-_]+)/);
  if (!m) return false;
  let dati; try { dati = b64urlDecode(m[1]); } catch (_) { return false; }
  if (!dati || !isFinite(dati.T) || !isFinite(dati.b)) return false;
  document.body.classList.add("ospite");     // PRIMA di caricare: l'ospite non deve toccare il salvataggio locale
  if (!caricaSelezione(dati)) { document.body.classList.remove("ospite"); return false; }
  avviaRegia(dati.T, { base: dati.b, ospite: true });
  bannerOspite(`🔥 <strong>Regia condivisa</strong> — si mangia ${fmtGiorno(dati.T)} alle ${formatTime(new Date(dati.T))}. Ogni passaggio qui sotto è sincronizzato sull'orologio; "Fatto" spegne solo la tua suoneria.`);
  return true;
}

function bootOspiteLegacy() {           // vecchi link #g= (solo cottura)
  const m = location.hash.match(/#g=([A-Za-z0-9\-_]+)/);
  if (!m) return false;
  let dati; try { dati = b64urlDecode(m[1]); } catch (_) { return false; }
  if (!dati || !Array.isArray(dati.i) || !isFinite(dati.t)) return false;
  document.body.classList.add("ospite");
  if (!caricaSelezione(dati)) { document.body.classList.remove("ospite"); return false; }
  const items = [...selezione].map(id => byId[id]);
  const maxTot = Math.max(...items.map(totaleSec));
  avviaRegia(dati.t + maxTot * 1000, { base: dati.t, ospite: true });
  regia.eventi = regia.eventi.filter(e => e.fase === "cottura");   // il vecchio link era solo timer
  renderTimelineRegia();
  bannerOspite(`🔥 <strong>Griglia condivisa</strong> — avviata alle ${formatTime(new Date(dati.t))}.`);
  return true;
}

function bootCarrello() {
  const m = location.hash.match(/#c=([A-Za-z0-9\-_]+)/);
  if (!m) return false;
  let dati; try { dati = b64urlDecode(m[1]); } catch (_) { return false; }
  if (!dati || !Array.isArray(dati.i)) return false;
  if (!caricaSelezione(dati)) return false;
  if (Array.isArray(dati.p)) {
    const [a, b, ap, co] = dati.p;
    if (a !== undefined) adultiEl.value = a;
    if (b !== undefined) bambiniEl.value = b;
    if (ap === "normale" || ap === "abbondante") appetitoEl.value = ap;
    if (co === "pochi" || co === "abbondanti") contorniEl.value = co;
  }
  if (typeof dati.h === "string" && /^\d{2}:\d{2}$/.test(dati.h)) oraEl.value = dati.h;
  aggiornaCarrello();
  const sez = document.getElementById("carrello-sez");
  const b = document.createElement("div");
  b.className = "ospite-banner";
  b.innerHTML = `📦 <strong>Spesa condivisa</strong> — carrello caricato: qui sotto quantità e lista della spesa. Poi imposta l'ora e premi OK.`;
  sez.insertBefore(b, sez.firstChild);
  sez.scrollIntoView({ behavior: "smooth", block: "start" });
  return true;
}

/* ================================================================
   PERSISTENZA — un reload non perde né carrello né regia
   ================================================================ */
const LS_KEY = "carneaiferri.stato.v5";

function salvaStato() {
  if (document.body.classList.contains("ospite")) return;
  try {
    const stato = {
      sel: [...selezione],
      opz: opzioniPayload([...selezione].map(id => byId[id])),
      p: [adultiEl.value, bambiniEl.value, appetitoEl.value, contorniEl.value],
      g: giornoEl.value, h: oraEl.value,
      regia: regia && !regia.ospite ? { T: regia.T, b: regia.base, f: regia.eventi.map((e, i) => e.fatto ? i : -1).filter(i => i >= 0), s: regia.sliTot } : null,
    };
    localStorage.setItem(LS_KEY, JSON.stringify(stato));
  } catch (_) {}
}

function caricaStato() {
  let st;
  try { st = JSON.parse(localStorage.getItem(LS_KEY)); } catch (_) { return; }
  if (!st) return;
  if (Array.isArray(st.p)) {
    const [a, b, ap, co] = st.p;
    if (a !== undefined) adultiEl.value = a;
    if (b !== undefined) bambiniEl.value = b;
    if (ap) appetitoEl.value = ap;
    if (co) contorniEl.value = co;
  }
  if (st.g && st.g >= oggiISO) giornoEl.value = st.g;
  if (st.h) oraEl.value = st.h;
  if (Array.isArray(st.sel) && st.sel.length) caricaSelezione({ i: st.sel, o: st.opz });
  if (st.regia && isFinite(st.regia.T) && st.regia.T > Date.now() - 2 * 3600 * 1000) {
    avviaRegia(st.regia.T, { base: st.regia.b, fatti: st.regia.f || [] });
    if (regia) regia.sliTot = st.regia.s || 0;
    renderRegiaBanner();
  }
}

[adultiEl, bambiniEl, appetitoEl, contorniEl].forEach(el => el.addEventListener("input", salvaStato));

/* ================================================================
   AUDIO / WAKE LOCK / NOTIFICHE / LOG
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
  if (document.visibilityState === "visible" && regia && !wakeLock && !regia.ospite) requestWakeLock();
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
      const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.frequency.value = f;
      const t = audioCtx.currentTime + i * 0.18;
      g.gain.setValueAtTime(0.35, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.5);
      o.start(t); o.stop(t + 0.5);
    });
    return;
  }
  if (type === "prep") {                          // doppio squillo per la preparazione
    [0, 0.45].forEach(dt => {
      const o = audioCtx.createOscillator(); const g = audioCtx.createGain();
      o.connect(g); g.connect(audioCtx.destination);
      o.frequency.value = 988;
      const t = audioCtx.currentTime + dt;
      g.gain.setValueAtTime(0.4, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
      o.start(t); o.stop(t + 0.3);
    });
    return;
  }
  const freqs = { metti: 660, gira: 880, togli: 1100 };
  const osc = audioCtx.createOscillator(); const gain = audioCtx.createGain();
  osc.connect(gain); gain.connect(audioCtx.destination);
  osc.frequency.value = freqs[type] || 880;
  gain.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.35);
  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + 0.35);
}

document.addEventListener("click", initAudio, { once: true });

function sendNotifica(testo) {
  if ("Notification" in window && Notification.permission === "granted") {
    try { new Notification("Griglia", { body: testo }); } catch (_) {}
  }
}

function aggiungiLog(testo) {
  const div = document.createElement("div");
  div.textContent = `${formatTimeSec(new Date())} → ${testo}`;
  logEl.prepend(div);
}

/* sticky: visibile quando la card del passo esce dallo schermo */
new IntersectionObserver(([entry]) => {
  if (regia) nextStickyEl.classList.toggle("hidden", entry.isIntersecting);
}, { threshold: 0 }).observe(passoEl);

/* ================================================================
   INIT
   ================================================================ */
renderCatalogo();
aggiornaContatore();
aggiornaCarrello();
const daLink = bootPiano() || bootOspiteLegacy() || bootCarrello();
if (!daLink && !location.hash) caricaStato();
aggiornaQuando();
