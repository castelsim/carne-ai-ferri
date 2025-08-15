// Durate (secondi) per ogni alimento "standard"
const DURATE = {
  pollo:   25 * 60,  // 1500
  costine: 20 * 60,  // 1200
  salsicce:12 * 60,  // 720
  pancetta: 6 * 60   // 360
};

// Indizi di girata per la timeline
const FLIP_HINT = {
  pollo: "6–8",
  costine: "5–6",
  salsicce: "4–5",
  pancetta: "2–3"
};

// UI
const logEl    = document.getElementById("log");
const nextEl   = document.getElementById("next");
const startBtn = document.getElementById("startBtn");
const bisteccaCb    = document.querySelector('input.food[value="bistecca"]');
const bisteccaOpts  = document.getElementById('bistecca-opts');
const gradoBistecca = document.getElementById('grado-bistecca');

let sequenza = [];    // eventi (ordinati)
let ticker   = null;  // interval per countdown
let startTs  = null;  // timestamp avvio
let nextIdx  = 0;     // indice prossimo evento
let timeouts = [];    // per reset

// mostra/nascondi opzioni bistecca
if (bisteccaCb && bisteccaOpts) {
  const toggleBisteccaOpts = () => {
    bisteccaOpts.classList.toggle('hidden', !bisteccaCb.checked);
  };
  bisteccaCb.addEventListener('change', toggleBisteccaOpts);
  toggleBisteccaOpts();
}

startBtn.addEventListener("click", () => {
  const selezioni = Array.from(document.querySelectorAll(".food:checked")).map(i => i.value);
  if (selezioni.length === 0) {
    alert("Seleziona almeno un alimento da cuocere.");
    return;
  }

  // reset
  logEl.innerHTML = "";
  nextEl.innerHTML = "";
  clearAll();

  const maxDur = Math.max(...selezioni.map(n => durata(n)));

  // costruzione eventi Metti/Gira/Togli
  const eventi = [];
  selezioni.forEach(nome => {
    const tot   = durata(nome);
    const start = maxDur - tot;
    const gira  = start + Math.round(tot/2);
    const end   = start + tot;

    const flipTxt = FLIP_HINT[nome] ? ` (girare ogni ${FLIP_HINT[nome]} min)` : "";

    eventi.push({ tempo: start, msg: `Metti ${nome.toUpperCase()} sulla griglia (${Math.round(tot/60)} min totali)` });
    eventi.push({ tempo: gira,  msg: `Gira ${nome.toUpperCase()}${flipTxt}` });
    eventi.push({ tempo: end,   msg: `Togli ${nome.toUpperCase()} (pronto)` });
  });

  eventi.sort((a,b) => a.tempo - b.tempo);
  eventi.push({ tempo: maxDur, msg: "TUTTO PRONTO! Servire 🔥🍖" });

  // salva e avvia
  sequenza = eventi;
  startTs  = Date.now();
  nextIdx  = 0;

  // --- TIMELINE COMPLETA SUBITO ---
  renderTimeline(sequenza);

  // schedule notifiche/log + flag timeline
  sequenza.forEach((ev, i) => {
    const id = setTimeout(() => {
      aggiungiLog(ev.msg);
      avvisa(ev.msg);

      // spunta nella timeline
      const li = document.getElementById(`tl-${i}`);
      if (li) {
        li.classList.add('done');
        const c = li.querySelector('input[type="checkbox"]');
        if (c) c.checked = true;
      }

      if (i === sequenza.length - 1) {
        if (ticker) clearInterval(ticker);
        aggiornaNext();
      }
    }, Math.max(0, ev.tempo) * 1000);
    timeouts.push(id);
  });

  // countdown
  ticker = setInterval(aggiornaNext, 250);
  aggiornaNext();
});

function renderTimeline(eventi) {
  const list = document.getElementById('timeline-list');
  if (!list) return;
  list.innerHTML = "";
  eventi.forEach((ev, i) => {
    const li = document.createElement('li');
    li.id = `tl-${i}`;

    const cb = document.createElement('input');
    cb.type = 'checkbox';
    cb.disabled = true;

    const label = document.createElement('span');
    // Mostra anche l'orario atteso dell'evento
    const when = startTs ? formatTime(new Date(startTs + ev.tempo * 1000)) : "";
    label.textContent = when ? `${when} — ${ev.msg}` : ev.msg;

    li.appendChild(cb);
    li.appendChild(label);
    list.appendChild(li);
  });
}

function durata(item) {
  if (item === 'bistecca') {
    const grado = (gradoBistecca && bisteccaCb && bisteccaCb.checked) ? gradoBistecca.value : 'medium';
    if (grado === 'rare')   return 5 * 60;
    if (grado === 'well')   return 10 * 60;
    return 8 * 60; // medium
  }
  return DURATE[item];
}

function aggiornaNext() {
  if (!sequenza.length || startTs === null) return;
  const elapsed = (Date.now() - startTs) / 1000;

  // primo evento non ancora avvenuto
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

function clearAll() {
  timeouts.forEach(t => clearTimeout(t));
  timeouts = [];
  if (ticker) clearInterval(ticker);
}

// permessi notifiche
if ("Notification" in window) {
  Notification.requestPermission();
}