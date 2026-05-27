// Tempi verificati da: Weber IT, Cookist, Il Giornale del Cibo, PassioneBBQ, MissVickie
const DURATE = {
  // Manzo
  hamburger:           10 * 60,  // 4-5 min per lato, T_interna 71°C
  tagliata:             5 * 60,  // 2-3 min per lato (taglio sottile ~1cm)
  spiedini_manzo:      10 * 60,  // girare ogni 3 min
  // Maiale
  salsiccia:           18 * 60,  // 15-20 min
  luganega:            12 * 60,  // salsiccia sottile, 10-15 min
  costoletta:          20 * 60,  // ~2cm, 8-10 min per lato
  braciola:             7 * 60,  // sottile ~1cm, 3-4 min per lato
  pancetta:             6 * 60,  // 2-3 min per lato
  wurstel:              8 * 60,  // 6-10 min
  costine:             90 * 60,  // baby back ribs, fuoco indiretto (Weber: 90 min a 150°C)
  // Pollo
  petto_pollo:         12 * 60,  // 5-6 min per lato, T_interna 74°C
  coscia_pollo:        40 * 60,  // 35-45 min indiretto + 5 min diretto finale
  ali_pollo:           28 * 60,  // 25-30 min
  // Agnello
  costolette_agnello:   8 * 60,  // 3-4 min per lato
  spiedini_agnello:    12 * 60,  // 10-14 min, girare ogni 3 min
  // Pesce & Mare
  salmone:              8 * 60,  // filetto 3-4 min per lato (2-3cm)
  gamberoni:            5 * 60,  // 2-3 min per lato
  spada:                8 * 60,  // trancio ~2cm, 3-4 min per lato
  branzino:            25 * 60,  // intero, 10-15 min per lato (fuoco indiretto)
  // Verdure
  zucchine:             8 * 60,  // a fette, 3-5 min per lato
  peperoni:            12 * 60,  // a falde, girare ogni 4 min
  mais:                18 * 60,  // intero, girare ogni 4-5 min
  funghi:              10 * 60,  // 4-5 min per lato
};

// null = singola girata a metà cottura; stringa = intervallo minuti
const FLIP_HINT = {
  hamburger:           null,
  tagliata:            null,
  spiedini_manzo:      "3",
  salsiccia:           "4–5",
  luganega:            "3–4",
  costoletta:          "6–8",
  braciola:            null,
  pancetta:            "2–3",
  wurstel:             "2–3",
  costine:             "20–25",
  petto_pollo:         null,
  coscia_pollo:        "10–12",
  ali_pollo:           "7–8",
  costolette_agnello:  null,
  spiedini_agnello:    "3",
  salmone:             null,
  gamberoni:           null,
  spada:               null,
  branzino:            "10–12",
  zucchine:            null,
  peperoni:            "4",
  mais:                "4–5",
  funghi:              null,
};

const NOMI = {
  hamburger:           "Hamburger",
  tagliata:            "Tagliata",
  spiedini_manzo:      "Spiedini di manzo",
  salsiccia:           "Salsiccia",
  luganega:            "Luganega",
  costoletta:          "Costoletta",
  braciola:            "Braciola",
  pancetta:            "Pancetta",
  wurstel:             "Wurstel",
  costine:             "Costine",
  petto_pollo:         "Petto di pollo",
  coscia_pollo:        "Coscia/sovracoscia",
  ali_pollo:           "Ali di pollo",
  costolette_agnello:  "Costolette di agnello",
  spiedini_agnello:    "Spiedini di agnello",
  salmone:             "Salmone",
  gamberoni:           "Gamberoni",
  spada:               "Spada/Tonno",
  branzino:            "Branzino/Orata",
  zucchine:            "Zucchine",
  peperoni:            "Peperoni",
  mais:                "Mais",
  funghi:              "Funghi",
  bistecca:            "Bistecca",
};

// DOM
const logEl            = document.getElementById("log");
const nextEl           = document.getElementById("next");
const nextStickyEl     = document.getElementById("next-sticky");
const startBtn         = document.getElementById("startBtn");
const resetBtn         = document.getElementById("resetBtn");
const bisteccaCb       = document.querySelector('input.food[value="bistecca"]');
const bisteccaOpts     = document.getElementById('bistecca-opts');
const gradoBistecca    = document.getElementById('grado-bistecca');
const spessoreBistecca = document.getElementById('spessore-bistecca');

// State
let sequenza  = [];
let ticker    = null;
let startTs   = null;
let timeouts  = [];
let activeIdx = -1;
let wakeLock  = null;
let audioCtx  = null;

// ─── Wake Lock ────────────────────────────────────────────────
async function requestWakeLock() {
  if (!('wakeLock' in navigator)) return;
  try {
    wakeLock = await navigator.wakeLock.request('screen');
    wakeLock.addEventListener('release', () => { wakeLock = null; });
  } catch(_) {}
}

function releaseWakeLock() {
  if (wakeLock) { wakeLock.release(); wakeLock = null; }
}

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible' && startTs !== null && !wakeLock) {
    requestWakeLock();
  }
});

// ─── Audio (Web Audio API) ────────────────────────────────────
function initAudio() {
  if (!audioCtx) {
    try { audioCtx = new (window.AudioContext || window.webkitAudioContext)(); } catch(_) {}
  }
}

function playBeep(type) {
  initAudio();
  if (!audioCtx) return;
  if (type === 'finale') {
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

document.addEventListener('click', initAudio, { once: true });

// ─── Bistecca ─────────────────────────────────────────────────
function updateBisteccaLabel() {
  const min = Math.round(durata('bistecca') / 60);
  const label = document.getElementById('bistecca-time-label');
  if (label) label.textContent = `~${min} min`;
}

if (bisteccaCb && bisteccaOpts) {
  const toggle = () => bisteccaOpts.classList.toggle('hidden', !bisteccaCb.checked);
  bisteccaCb.addEventListener('change', toggle);
  toggle();
}
if (gradoBistecca) gradoBistecca.addEventListener('change', updateBisteccaLabel);
if (spessoreBistecca) spessoreBistecca.addEventListener('input', updateBisteccaLabel);

// ─── Sticky banner ────────────────────────────────────────────
new IntersectionObserver(([entry]) => {
  if (startTs !== null) nextStickyEl.classList.toggle('hidden', entry.isIntersecting);
}, { threshold: 0 }).observe(nextEl);

// ─── Start ────────────────────────────────────────────────────
startBtn.addEventListener("click", () => {
  const selezioni = Array.from(document.querySelectorAll(".food:checked")).map(i => i.value);
  if (selezioni.length === 0) { alert("Seleziona almeno un alimento."); return; }

  initAudio();
  startBtn.disabled = true;
  resetBtn.classList.remove('hidden');
  logEl.innerHTML = "";
  nextEl.innerHTML = "";
  clearAll();
  activeIdx = -1;

  const maxDur = Math.max(...selezioni.map(durata));
  const eventi = [];

  selezioni.forEach(nome => {
    const tot      = durata(nome);
    const start    = maxDur - tot;
    const end      = start + tot;
    const flipTxt  = FLIP_HINT[nome] ? ` (ogni ${FLIP_HINT[nome]} min)` : "";

    const label = NOMI[nome] || nome;
    eventi.push({ tempo: start, type: 'metti', msg: `Metti ${label} (${Math.round(tot / 60)} min)` });

    const avgMin     = averageRange(FLIP_HINT[nome]);
    const interval   = avgMin ? Math.round(avgMin * 60) : null;

    if (interval) {
      const guard = Math.max(30, Math.round(interval * 0.3));
      for (let t = start + interval; t < end - guard; t += interval) {
        eventi.push({ tempo: t, type: 'gira', msg: `Gira ${label}${flipTxt}` });
      }
    } else {
      eventi.push({ tempo: start + Math.round(tot / 2), type: 'gira', msg: `Gira ${label}` });
    }

    eventi.push({ tempo: end, type: 'togli', msg: `Togli ${label} — pronto!` });
  });

  const prio = { metti: 0, gira: 1, togli: 2, finale: 3 };
  eventi.sort((a, b) => a.tempo !== b.tempo ? a.tempo - b.tempo : (prio[a.type] ?? 9) - (prio[b.type] ?? 9));
  eventi.push({ tempo: maxDur, type: 'finale', msg: "TUTTO PRONTO! Servire!" });

  sequenza = eventi;
  startTs  = Date.now();

  renderTimeline(sequenza);
  requestWakeLock();

  sequenza.forEach((ev, i) => {
    const id = setTimeout(() => {
      aggiungiLog(ev.msg);
      playBeep(ev.type);
      if (navigator.vibrate) navigator.vibrate(ev.type === 'finale' ? [200, 100, 200, 100, 400] : [150, 70, 150]);
      sendNotifica(ev.msg);

      const li = document.getElementById(`tl-${i}`);
      if (li) { li.classList.add('done'); li.querySelector('input[type="checkbox"]').checked = true; }

      if (i === sequenza.length - 1) {
        clearInterval(ticker); ticker = null;
        aggiornaNext();
        startBtn.disabled = false;
        releaseWakeLock();
      }
    }, Math.max(0, ev.tempo) * 1000);
    timeouts.push(id);
  });

  ticker = setInterval(aggiornaNext, 250);
  aggiornaNext();
});

// ─── Reset ────────────────────────────────────────────────────
resetBtn.addEventListener("click", () => {
  if (!confirm("Fermare la cottura in corso?")) return;
  clearAll();
  startTs = null; sequenza = []; activeIdx = -1;
  logEl.innerHTML = "";
  nextEl.innerHTML = "";
  nextStickyEl.classList.add('hidden');
  document.getElementById('timeline-list').innerHTML = "";
  startBtn.disabled = false;
  resetBtn.classList.add('hidden');
  releaseWakeLock();
});

// ─── Timeline ─────────────────────────────────────────────────
function renderTimeline(eventi) {
  const list = document.getElementById('timeline-list');
  list.innerHTML = "";
  eventi.forEach((ev, i) => {
    const li = document.createElement('li');
    li.id = `tl-${i}`;
    const cb = document.createElement('input');
    cb.type = 'checkbox'; cb.disabled = true;
    const span = document.createElement('span');
    const when = startTs ? formatTime(new Date(startTs + ev.tempo * 1000)) : "";
    span.textContent = when ? `${when} — ${ev.msg}` : ev.msg;
    li.appendChild(cb); li.appendChild(span);
    list.appendChild(li);
  });
}

// ─── Countdown ────────────────────────────────────────────────
function aggiornaNext() {
  if (!sequenza.length || startTs === null) return;
  const elapsed = (Date.now() - startTs) / 1000;
  const i = sequenza.findIndex(ev => ev.tempo >= elapsed);

  if (i === -1) {
    nextEl.innerHTML = `<span class="titolo">Prossimo evento</span><div class="tempo">Completato ✅</div>`;
    nextStickyEl.classList.add('hidden');
    return;
  }

  if (activeIdx !== i) {
    document.getElementById(`tl-${activeIdx}`)?.classList.remove('active');
    document.getElementById(`tl-${i}`)?.classList.add('active');
    activeIdx = i;
  }

  const ev        = sequenza[i];
  const remaining = Math.max(0, Math.ceil(ev.tempo - elapsed));
  const html      = `<span class="titolo">Prossimo evento</span><div>${ev.msg}</div><div class="tempo">${formatSeconds(remaining)}</div>`;
  nextEl.innerHTML = html;
  nextStickyEl.innerHTML = `<span>${ev.msg}</span><span class="tempo">${formatSeconds(remaining)}</span>`;
}

function aggiungiLog(testo) {
  const div = document.createElement("div");
  div.textContent = `${formatTime(new Date())} → ${testo}`;
  logEl.prepend(div);
}

function sendNotifica(testo) {
  if ("Notification" in window && Notification.permission === "granted") {
    try { new Notification("Griglia", { body: testo }); } catch(_) {}
  }
}

// ─── Utils ────────────────────────────────────────────────────
function durata(item) {
  if (item === 'bistecca') {
    const grado    = gradoBistecca ? gradoBistecca.value : 'medium';
    const spessore = spessoreBistecca ? (parseFloat(spessoreBistecca.value) || 2.5) : 2.5;
    const base     = grado === 'rare' ? 5 * 60 : grado === 'well' ? 10 * 60 : 8 * 60;
    return Math.round(base * (spessore / 2.5));
  }
  return DURATE[item] || 15 * 60;
}

function averageRange(str) {
  if (!str) return null;
  const parts = str.replace('–', '-').split('-').map(s => parseFloat(s.trim()));
  if (!isFinite(parts[0])) return null;
  return isFinite(parts[1]) ? (parts[0] + parts[1]) / 2 : parts[0];
}

function formatTime(date) {
  return date.toLocaleTimeString("it-IT", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatSeconds(sec) {
  return `${Math.floor(sec / 60)}:${String(sec % 60).padStart(2, "0")}`;
}

function clearAll() {
  timeouts.forEach(clearTimeout);
  timeouts = [];
  if (ticker) { clearInterval(ticker); ticker = null; }
}

if ("Notification" in window && Notification.permission === "default") {
  Notification.requestPermission();
}
