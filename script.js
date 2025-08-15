// Durate (secondi) per ogni alimento "standard"
const DURATE = {
  pollo:   25 * 60,  // 1500
  costine: 20 * 60,  // 1200
  salsicce:12 * 60,  // 720
  pancetta: 6 * 60   // 360
};

// UI
const logEl    = document.getElementById("log");
const nextEl   = document.getElementById("next");
const startBtn = document.getElementById("startBtn");
const bisteccaCb    = document.querySelector('input.food[value="bistecca"]');
const bisteccaOpts  = document.getElementById('bistecca-opts');
const gradoBistecca = document.getElementById('grado-bistecca');

let sequenza = [];    // eventi costruiti dinamicamente
let ticker   = null;  // setInterval per countdown
let startTs  = null;  // timestamp avvio
let nextIdx  = 0;     // indice prossimo evento
let timeouts = [];    // riferimenti setTimeout per reset

// mostra/nascondi opzioni bistecca in base al toggle
if (bisteccaCb && bisteccaOpts) {
  const toggleBisteccaOpts = () => {
    bisteccaOpts.classList.toggle('hidden', !bisteccaCb.checked);
  };
  bisteccaCb.addEventListener('change', toggleBisteccaOpts);
  toggleBisteccaOpts(); // stato iniziale
}

startBtn.addEventListener("click", () => {
  // prendi le selezioni dalla checklist
  const selezioni = Array.from(document.querySelectorAll(".food:checked")).map(i => i.value);
  if (selezioni.length === 0) {
    alert("Seleziona almeno un alimento da cuocere.");
    return;
  }

  // reset UI e timer precedenti
  logEl.innerHTML = "";
  nextEl.innerHTML = "";
  timeouts.forEach(t => clearTimeout(t));
  timeouts = [];
  if (ticker) clearInterval(ticker);

  // calcola la durata massima: finiremo tutto quando finisce il più lungo
  const maxDur = Math.max(...selezioni.map(n => durata(n)));

  // costruisci eventi: Metti (all'offset), Gira (a metà), Togli (alla fine)
  const eventi = [];
  selezioni.forEach(nome => {
    const tot   = durata(nome);
    const start = maxDur - tot;              // offset di avvio per finire insieme
    const gira  = start + Math.round(tot/2); // metà cottura
    const end   = start + tot;               // fine cottura

    eventi.push({ tempo: start, msg: `Metti ${nome.toUpperCase()} sulla griglia (${Math.round(tot/60)} min totali)` });
    eventi.push({ tempo: gira,  msg: `Gira ${nome.toUpperCase()}` });
    eventi.push({ tempo: end,   msg: `Togli ${nome.toUpperCase()} (pronto)` });
  });

  // ordina cronologicamente e aggiungi evento finale
  eventi.sort((a,b) => a.tempo - b.tempo);
  eventi.push({ tempo: maxDur, msg: "TUTTO PRONTO! Servire 🔥🍖" });

  // salva sequenza e avvia scheduling
  sequenza = eventi;
  startTs  = Date.now();
  nextIdx  = 0; // assicura che il primo evento mostrato sia quello a tempo 0

  sequenza.forEach((ev, i) => {
    const id = setTimeout(() => {
      aggiungiLog(ev.msg);
      avvisa(ev.msg);
      if (i === nextIdx) nextIdx++;
      if (i === sequenza.length - 1) {
        if (ticker) clearInterval(ticker);
        aggiornaNext();
      }
    }, Math.max(0, ev.tempo) * 1000);
    timeouts.push(id);
  });

  // avvia/aggiorna il countdown del prossimo evento
  ticker = setInterval(aggiornaNext, 250);
  aggiornaNext();
});

function durata(item) {
  if (item === 'bistecca') {
    const grado = (gradoBistecca && bisteccaCb && bisteccaCb.checked) ? gradoBistecca.value : 'medium';
    if (grado === 'rare')   return 5 * 60;   // ~5 min totali
    if (grado === 'well')   return 10 * 60;  // ~10 min totali
    return 8 * 60;                           // medium ~8 min totali
  }
  return DURATE[item];
}

function aggiornaNext() {
  if (!sequenza.length || startTs === null) return;
  const elapsed = (Date.now() - startTs) / 1000; // secondi dall'avvio

  // Trova il primo evento non ancora scattato (tempo >= elapsed)
  let i = sequenza.findIndex(ev => ev.tempo >= elapsed);
  if (i === -1) {
    nextIdx = sequenza.length;
    nextEl.innerHTML = `<span class="titolo">Prossimo evento</span><div class="tempo">Completato ✅</div>`;
    return;
  }
  nextIdx = i;

  const ev = sequenza[nextIdx];
  const remaining = Math.max(0, Math.ceil(ev.tempo - elapsed));
  nextEl.innerHTML = `
    <span class="titolo">Prossimo evento</span>
    <div>${ev.msg}</div>
    <div class="tempo">Tra: ${formatSeconds(remaining)}</div>
  `;
}

function aggiungiLog(testo) {
  const div = document.createElement("div");
  div.textContent = `${formatTime(new Date())} → ${testo}`;
  logEl.appendChild(div);
  logEl.scrollTop = logEl.scrollHeight;
}

function avvisa(testo) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(testo);
  }
  const beep = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  beep.play().catch(() => {});
}

function formatTime(date) {
  return date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatSeconds(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// Permesso notifiche al caricamento
if ("Notification" in window) {
  Notification.requestPermission();
}