// Durate (secondi) per ogni alimento "standard"
const DURATE = {
  pollo:   45 * 60,   // circa 45 min
  costine: 75 * 60,   // circa 75 min
  salsicce:18 * 60,   // circa 18 min
  pancetta: 7 * 60    // circa 7 min
};

// Indizi di girata per la timeline (griglia a legna - bronse)
const FLIP_HINT = {
  pollo: "7–10",
  costine: "10–15",
  salsicce: "3–4",
  pancetta: "2–3"
};

function averageRangeMinutes(str) {
  if (!str) return null;
  const norm = String(str).replace('–', '-');
  const parts = norm.split('-').map(s => parseFloat(String(s).trim().replace(',', '.')));
  if (!isFinite(parts[0])) return null;
  if (!isFinite(parts[1])) return parts[0];
  return (parts[0] + parts[1]) / 2;
}

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
let activeIdx = -1;   // indice evento evidenziato in timeline

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

  // disabilita il bottone durante l'esecuzione
  startBtn.disabled = true;

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
    const end   = start + tot;

    const flipTxt = FLIP_HINT[nome] ? ` (girare ogni ${FLIP_HINT[nome]} min)` : "";

    // METTI all'offset calcolato
    eventi.push({ tempo: start, type: 'metti', msg: `Metti ${nome.toUpperCase()} sulla griglia (${Math.round(tot/60)} min totali)` });

    // GIRA ripetuto: usa la media dell'intervallo (es. "7–10" -> 8.5 min)
    const avgMin = averageRangeMinutes(FLIP_HINT[nome]);
    const flipInterval = avgMin ? Math.round(avgMin * 60) : null; // sec

    if (flipInterval && flipInterval > 0) {
      let t = start + flipInterval;
      // non arrivare troppo vicino alla fine: lascia almeno 30s (o 30% dell'intervallo)
      const guard = Math.max(30, Math.round(flipInterval * 0.3));
      while (t < end - guard) {
        eventi.push({ tempo: t, type: 'gira', msg: `Gira ${nome.toUpperCase()}${flipTxt}` });
        t += flipInterval;
      }
    } else {
      // Fallback: una girata a metà
      const mid = start + Math.round(tot / 2);
      eventi.push({ tempo: mid, type: 'gira', msg: `Gira ${nome.toUpperCase()}${flipTxt}` });
    }

    // TOGLI alla fine
    eventi.push({ tempo: end, type: 'togli', msg: `Togli ${nome.toUpperCase()} (pronto)` });
  });

  const prio = { metti: 0, gira: 1, togli: 2, finale: 3 };
  eventi.sort((a, b) => {
    if (a.tempo !== b.tempo) return a.tempo - b.tempo;
    const pa = prio[a.type] ?? 99;
    const pb = prio[b.type] ?? 99;
    return pa - pb;
  });

  // evento finale
  eventi.push({ tempo: maxDur, type: 'finale', msg: "TUTTO PRONTO! Servire 🔥🍖" });

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
        // riabilita il bottone a fine sequenza
        startBtn.disabled = false;
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
    li.dataset.index = String(i);

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

  // evidenzia l'evento prossimo in timeline
  if (activeIdx !== nextIdx) {
    if (activeIdx >= 0) {
      const prev = document.getElementById(`tl-${activeIdx}`);
      if (prev) prev.classList.remove('active');
    }
    const cur = document.getElementById(`tl-${nextIdx}`);
    if (cur) cur.classList.add('active');
    activeIdx = nextIdx;
  }

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
    try { new Notification(testo); } catch(_){}
  }
  try {
    const beep = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
    beep.play().catch(() => {});
  } catch(_){}
  if (navigator.vibrate) {
    try { navigator.vibrate([150, 70, 150]); } catch(_){}
  }
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