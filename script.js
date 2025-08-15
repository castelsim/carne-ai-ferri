

// Sequenza scaletta grigliata (tempi in secondi dall'avvio)
const sequenza = [
  { tempo: 0, msg: "Metti POLLO sulla griglia (25 min totali)" },
  { tempo: 300, msg: "Metti COSTINE sulla griglia (20 min totali)" },
  { tempo: 600, msg: "Metti SALSICCE (12 min totali)" },
  { tempo: 1200, msg: "Metti PANCETTA (6 min totali)" },
  { tempo: 780, msg: "Gira POLLO" },
  { tempo: 900, msg: "Gira COSTINE" },
  { tempo: 1020, msg: "Gira SALSICCE" },
  { tempo: 1260, msg: "Gira PANCETTA" },
  { tempo: 1500, msg: "TUTTO PRONTO! Servire 🔥🍖" }
];

let ticker = null;        // setInterval per il countdown live
let startTs = null;       // timestamp di avvio (ms)
let nextIdx = 0;          // indice del prossimo evento per countdown
let timeouts = [];        // riferimento ai setTimeout per poterli resettare

const logEl = document.getElementById("log");
const nextEl = document.getElementById("next");
const startBtn = document.getElementById("startBtn");

startBtn.addEventListener("click", () => {
  // reset UI
  logEl.innerHTML = "";
  nextEl.innerHTML = "";
  // reset timers precedenti
  timeouts.forEach(t => clearTimeout(t));
  timeouts = [];
  if (ticker) clearInterval(ticker);

  // avvio
  startTs = Date.now();
  nextIdx = 0;

  // programma TUTTI gli eventi (notifiche + log)
  sequenza.forEach((evento, i) => {
    const id = setTimeout(() => {
      aggiungiLog(evento.msg);
      avvisa(evento.msg);
      // quando scatta un evento che stiamo mostrando come "prossimo", passa al successivo
      if (i === nextIdx) nextIdx++;
      // se abbiamo finito tutti gli eventi, ferma il ticker
      if (i === sequenza.length - 1) {
        if (ticker) clearInterval(ticker);
        aggiornaNext(); // mostrerà "Completato"
      }
    }, evento.tempo * 1000);
    timeouts.push(id);
  });

  // avvia ticker del countdown
  ticker = setInterval(aggiornaNext, 250);
  aggiornaNext(); // aggiorna subito
});

function aggiornaNext() {
  const elapsed = (Date.now() - startTs) / 1000; // in secondi
  // se tutti gli eventi sono passati
  if (nextIdx >= sequenza.length) {
    nextEl.innerHTML = `<span class="titolo">Prossimo evento</span><div class="tempo">Completato ✅</div>`;
    return;
  }
  // se l'evento "prossimo" è già passato (per sicurezza), avanza finché serve
  while (nextIdx < sequenza.length && elapsed >= sequenza[nextIdx].tempo) {
    nextIdx++;
  }
  if (nextIdx >= sequenza.length) {
    nextEl.innerHTML = `<span class="titolo">Prossimo evento</span><div class="tempo">Completato ✅</div>`;
    return;
  }
  const evento = sequenza[nextIdx];
  const remaining = Math.max(0, Math.ceil(evento.tempo - elapsed));
  nextEl.innerHTML = `
    <span class="titolo">Prossimo evento</span>
    <div>${evento.msg}</div>
    <div class="tempo">Tra: ${formatSeconds(remaining)}</div>
  `;
}

function aggiungiLog(testo) {
  const div = document.createElement("div");
  div.textContent = `${formatTime(new Date())} → ${testo}`;
  logEl.appendChild(div);
  // scroll in basso se necessario
  logEl.scrollTop = logEl.scrollHeight;
}

function avvisa(testo) {
  if ("Notification" in window && Notification.permission === "granted") {
    new Notification(testo);
  }
  const beep = new Audio("https://actions.google.com/sounds/v1/alarms/beep_short.ogg");
  // silenzio errori autoplay su iOS: prova a riprodurre solo dopo interazione (il click su start c'è stato)
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

// Richiesta permesso notifiche al caricamento
if ("Notification" in window) {
  Notification.requestPermission();
}