(function loadAppFonts() {
  const host = ["fonts", "googleapis", "com"].join(".");
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://${host}/css2?family=Anton&family=Rajdhani:wght@600;700&display=swap`;
  document.head.appendChild(link);
})();

(function injectGameUI() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes kiShake {
      0%, 100% { transform: translate(0, 0); }
      25% { transform: translate(-6px, 4px); }
      50% { transform: translate(6px, -4px); }
      75% { transform: translate(-4px, -2px); }
    }
    @keyframes auraPulse {
      0%, 100% { filter: drop-shadow(0 0 10px var(--aura-color, #ff9900)); }
      50% { filter: drop-shadow(0 0 26px var(--aura-color, #ff9900)); }
    }
    .shake-active { animation: kiShake 0.45s ease; }
    .aura-active { animation: auraPulse 1.8s infinite; }
    .comic-stage {
      background: #101015; border: 2px solid #ff9900;
      border-radius: 12px; padding: 12px; position: relative; overflow: hidden;
    }
    .comic-badge {
      position: absolute; top: 8px; left: 8px; background: #ff9900; color: #0b0b0d;
      font-family: 'Anton', sans-serif; font-size: 0.78rem; padding: 2px 8px; border-radius: 5px;
    }
    .timer-box {
      font-family: 'Anton', sans-serif; font-size: 2.2rem; color: #ffb703;
      letter-spacing: 2px; margin: 4px 0;
    }
    .timer-btn {
      background: #1c1c24; border: 1.5px solid #ff9900; color: #ff9900;
      font-family: 'Anton', sans-serif; font-size: 1rem; padding: 6px 14px;
      border-radius: 8px; cursor: pointer;
    }
    .hud-strip { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 10px; }
    .hud-chip {
      background: #16161c; border: 1px solid #2e2e3a; color: #fff;
      font-family: 'Anton', sans-serif; font-size: 0.85rem; padding: 4px 9px;
      border-radius: 8px; cursor: pointer;
    }
    .hud-chip.senzu-ready { border-color: #52e588; color: #52e588; }
    .hud-chip.senzu-on { background: #52e588; color: #0b0b0d; }
    .trophy-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; text-align: left; }
    .trophy-item {
      background: #101015; border: 1px solid #2c2c38; border-radius: 8px; padding: 8px; opacity: 0.4;
    }
    .trophy-item.unlocked { border-color: #ffb703; opacity: 1; }
  `;
  document.head.appendChild(style);

  const modal = document.createElement("div");
  modal.id = "exercise-modal";
  modal.className = "levelup-overlay hidden";
  modal.innerHTML = `
    <div class="levelup-card" style="max-width: 360px;">
      <span id="ex-modal-tag" class="orange-tag">TECHNIK-GUIDE</span>
      <h2 id="ex-modal-title" class="tall-orange-title small">ÜBUNG</h2>
      <div class="comic-stage">
        <span class="comic-badge">COMIC-VORSCHAU</span>
        <img id="ex-comic-img" style="width:100%;height:135px;object-fit:contain;display:none;" alt="" />
        <div id="ex-comic-svg" style="height:135px;display:grid;place-items:center;"></div>
      </div>
      <p id="ex-modal-tip" class="poster-copy center" style="color:#fff;"></p>
      <div id="ex-timer-area" class="hidden">
        <div id="ex-timer-display" class="timer-box">00:20</div>
        <button id="ex-timer-start" class="timer-btn">TIMER STARTEN</button>
      </div>
      <button id="ex-complete-btn" class="tall-orange-btn">GESCHAFFT (+25 XP)</button>
      <button id="ex-close-btn" class="reset-link">Abbrechen</button>
    </div>
  `;
  document.body.appendChild(modal);

  const trophyModal = document.createElement("div");
  trophyModal.id = "trophy-modal";
  trophyModal.className = "levelup-overlay hidden";
  trophyModal.innerHTML = `
    <div class="levelup-card" style="max-width: 360px;">
      <span class="orange-tag">RUHMESHALLE</span>
      <h2 class="tall-orange-title small">TROPHÄEN</h2>
      <div id="trophy-list" class="trophy-grid"></div>
      <button id="close-trophy" class="tall-orange-btn">SCHLIESSEN</button>
    </div>
  `;
  document.body.appendChild(trophyModal);

  const stage = document.querySelector(".arena-poster-stage");
  if (stage) {
    const hud = document.createElement("div");
    hud.className = "hud-strip";
    hud.innerHTML = `
      <span id="streak-chip" class="hud-chip">🔥 0 TAGE</span>
      <button id="senzu-btn" class="hud-chip senzu-ready">🌱 SENZU (2x KI)</button>
      <button id="boss-btn" class="hud-chip">👹 BOSS-KAMPF</button>
      <button id="trophy-btn" class="hud-chip">🏆 TROPHÄEN</button>
    `;
    stage.prepend(hud);
  }
})();

const CHARACTERS = [
  { id: 1, name: "SON-BLITZ", attack: "SONNEN-KAMEHA", focus: "GANZKÖRPER", bio: "Furchtloser Saiyajin-Krieger.", color: "#ffb703" },
  { id: 2, name: "PRINZ-KI", attack: "FINALER BLITZ", focus: "ARME & BRUST", bio: "Meister der Schwerkraft.", color: "#5ce1e6" },
  { id: 3, name: "CYBER-RED", attack: "FLAMMEN-HIEB", focus: "REAKTION & BAUCH", bio: "High-Tech-Rüstung & Reflexe.", color: "#ff5c77" },
  { id: 4, name: "SHADOW-X", attack: "PHANTOM-SALVE", focus: "BAUCH & BALANCE", bio: "Lautlos wie der Wind.", color: "#c77dff" },
  { id: 5, name: "NOVA-GOLD", attack: "SUPERNOVA", focus: "GANZKÖRPER", bio: "Seine goldene Energie strahlt.", color: "#ffe66d" },
  { id: 6, name: "TITAN-FORCE", attack: "TITANEN-WALL", focus: "ARME & BAUCH", bio: "Verteidiger mit Ki-Schild.", color: "#48cae4" },
  { id: 7, name: "BLITZ-KID", attack: "DONNER-SPRINT", focus: "BEINE & SPEED", bio: "Extrem wendig & schnell.", color: "#ff9e5e" },
  { id: 8, name: "FROST-ZEN", attack: "GLETSCHER-STRAHL", focus: "BAUCH-KRAFT", bio: "Bleibt unter Druck eiskalt.", color: "#72efdd" },
  { id: 9, name: "FLAME-REX", attack: "MAGMA-FAUST", focus: "BRUST & SCHULTERN", bio: "Glühende Kampf-Aura.", color: "#ff6b6b" },
  { id: 10, name: "ULTRA-VEX", attack: "KOMETEN-REGEN", focus: "GANZKÖRPER", bio: "Kosmische Sprungkraft.", color: "#b8c0ff" },
  { id: 11, name: "SOLAR-KAI", attack: "HELIOS-WELLE", focus: "AUSDAUER", bio: "Zieht Kraft aus der Sonne.", color: "#ffd166" },
  { id: 12, name: "DARK-ORION", attack: "ECLIPSE-SCHLAG", focus: "ARME & RÜCKEN", bio: "Einzelgänger mit Wucht.", color: "#80ffdb" },
  { id: 13, name: "AERO-DASH", attack: "WIRBELSTURM", focus: "BEINE & AGILITÄT", bio: "Beherrscht den Himmel.", color: "#64dfdf" },
  { id: 14, name: "OMEGA-GOD", attack: "OMEGA-URKNALL", focus: "ALLE BEREICHE", bio: "Meister aller Techniken.", color: "#ff758f" },
  { id: 15, name: "STURM-GREEN", attack: "OMEGA-STURM", focus: "BEINE & KRAFT", bio: "Smaragdgrüne Natur-Energie.", color: "#52e588" }
];

const STAGE_RULES = [
  { stage: 1, minLevel: 1 }, { stage: 2, minLevel: 2 },
  { stage: 3, minLevel: 4 }, { stage: 4, minLevel: 6 }, { stage: 5, minLevel: 8 }
];

const BOSS_CHALLENGES = [
  { title: "BOSS: SCHWERKRAFT 50x G", sub: "Kombi-Prüfung · Doppel-XP", xp: 120, power: 3000, pose: "plank", sec: 30, isBoss: true, tip: "10 Kniebeugen + 30 Sek. Plank!" },
  { title: "BOSS: MEISTER-PRÜFUNG", sub: "Endboss · Doppel-XP", xp: 140, power: 3500, pose: "benchpress", sec: 25, isBoss: true, tip: "10x Hantelbank-Drücken + 25s Boxen!" },
  { title: "BOSS: GALAXIE-TURNIER", sub: "Finale · Doppel-XP", xp: 160, power: 4000, pose: "jump", sec: 30, isBoss: true, tip: "15 Ausfallschritte + 30s Sprünge!" }
];

const TROPHIES = [
  { id: "t1", icon: "⚡", name: "ERWACHEN", desc: "Stufe 2 erreicht" },
  { id: "t2", icon: "🔥", name: "10.000 KI", desc: "10.000 Ki gesammelt" },
  { id: "t3", icon: "👹", name: "BOSS-JÄGER", desc: "Ersten Boss besiegt" },
  { id: "t4", icon: "📅", name: "DISZIPLIN", desc: "3 Tage Streak" },
  { id: "t5", icon: "💪", name: "BAUCH-STAHL", desc: "Bauch Level 3" },
  { id: "t6", icon: "👑", name: "TEAM-LEADER", desc: "5 Krieger trainiert" }
];
   const BODY_WORKOUTS = {
  arms: {
    label: "TRAINING: ARME & HANTELBANK",
    easy: [
      { title: "12x Kurzhantel-Curls", sub: "Einfach · Hantel-Power", xp: 25, power: 450, pose: "dumbbellcurl", tip: "Hantel ruhig beugen & strecken." },
      { title: "10x Knie-Liegestütze", sub: "Einfach · Basis", xp: 25, power: 400, pose: "kneepushup", tip: "Knie auf Boden, Rücken gerade." },
      { title: "20 Sek. Schattenboxen", sub: "Einfach · Ki-Fäuste", xp: 20, power: 350, pose: "punch", sec: 20, tip: "Schnelle Schläge nach vorn!" }
    ],
    advanced: [
      { title: "12x Hantelbank-Drücken", sub: "Profi · Brust & Arme", xp: 50, power: 1000, pose: "benchpress", tip: "Gewicht über der Brust hochdrücken!" },
      { title: "12x Echte Liegestütze", sub: "Profi · Kamehameha", xp: 45, power: 900, pose: "pushup", tip: "Körper wie ein Brett spannen." },
      { title: "10x Dips am Stuhl", sub: "Profi · Trizeps", xp: 45, power: 950, pose: "dips", tip: "Po dicht am Stuhl absenken." }
    ],
    master: [
      { title: "16x Schweres Bankdrücken", sub: "Meister · 100x G Hantel", xp: 90, power: 2400, pose: "benchpress", tip: "Kontrolliert absenken & hoch!" },
      { title: "22x Tiefe Liegestütze", sub: "Meister · 100x G", xp: 80, power: 2000, pose: "pushup", tip: "Kurz vor Boden abstoppen." },
      { title: "15x Hantel-Schulterdrücken", sub: "Meister · Final-Ki", xp: 85, power: 2200, pose: "dumbbellcurl", tip: "Hanteln über den Kopf stemmen!" }
    ]
  },
  core: {
    label: "TRAINING: BAUCH & RUMPF",
    easy: [
      { title: "20 Sek. Plank", sub: "Einfach · Bauch-Schild", xp: 25, power: 450, pose: "plank", sec: 20, tip: "Bauch und Po fest anspannen!" },
      { title: "10x Crunches", sub: "Einfach · Körpermitte", xp: 25, power: 400, pose: "situp", tip: "Schultern kontrolliert rollen." }
    ],
    advanced: [
      { title: "40 Sek. Plank", sub: "Profi · Goldene Aura", xp: 45, power: 950, pose: "plank", sec: 40, tip: "Ruhig weiteratmen & halten." },
      { title: "16x Hantel-Russian-Twists", sub: "Profi · Saiyajin-Bauch", xp: 50, power: 1000, pose: "dumbbellcurl", tip: "Mit Gewicht von links nach rechts drehen." }
    ],
    master: [
      { title: "70 Sek. Plank", sub: "Meister · Abwehr", xp: 85, power: 2200, pose: "plank", sec: 70, tip: "Unzerstörbare Bauch-Spannung!" },
      { title: "25x Beinheben", sub: "Meister · Götter-Bauch", xp: 80, power: 2100, pose: "legraise", tip: "Beine gestreckt langsam heben." }
    ]
  },
  legs: {
    label: "TRAINING: BEINE & SPRUNGKRAFT",
    easy: [
      { title: "15x Kniebeugen", sub: "Einfach · Fester Stand", xp: 25, power: 450, pose: "squat", tip: "Po weit nach hinten schieben." },
      { title: "25 Sek. Hampelmänner", sub: "Einfach · Speed", xp: 20, power: 350, pose: "jump", sec: 25, tip: "Leichtfüßig auf Fußballen." }
    ],
    advanced: [
      { title: "20x Hantel-Kniebeugen", sub: "Profi · 10x Schwerkraft", xp: 50, power: 1000, pose: "squat", tip: "Hantel vor der Brust halten & tief beugen." },
      { title: "14x Ausfallschritte", sub: "Profi · Ausweichen", xp: 45, power: 900, pose: "lunge", tip: "Großer Schritt nach vorn." }
    ],
    master: [
      { title: "15x Sprung-Kniebeugen", sub: "Meister · Raketen-Start", xp: 85, power: 2300, pose: "jump", tip: "Explosiv abspringen!" },
      { title: "45 Sek. Wandsitzen", sub: "Meister · 100x G", xp: 80, power: 2100, pose: "wallsit", sec: 45, tip: "Knie im 90-Grad-Winkel." }
    ]
  }
};

let state = JSON.parse(localStorage.getItem("zwarriors_neon_v10")) || {
  level: 1, xp: 0, powerLevel: 0,
  carouselIndex: 0, selectedChar: 1,
  selectedStage: 1, selectedPart: "arms",
  difficulty: "easy",
  partXP: { arms: 0, core: 0, legs: 0 },
  streak: 0, lastTrainDate: "",
  senzuDate: "", senzuActive: false,
  bossCounter: 0, bossWins: 0,
  testedChars: []
};

let activeExercise = null;
let timerInterval = null;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function showScreen(id) {
  ["intro-screen", "select-screen", "detail-screen", "arena-screen"].forEach(s => {
    document.getElementById(s).classList.toggle("hidden", s !== id);
  });
}

let sharedAudioCtx = null;
function getAudioCtx() {
  if (!sharedAudioCtx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    if (AudioCtx) sharedAudioCtx = new AudioCtx();
  }
  if (sharedAudioCtx && sharedAudioCtx.state === "suspended") sharedAudioCtx.resume();
  return sharedAudioCtx;
}

document.addEventListener("touchstart", getAudioCtx, { passive: true });
document.addEventListener("click", getAudioCtx, { passive: true });

function playSound(mode = "click") {
  try {
    const ctx = getAudioCtx();
    if (!ctx) return;
    const now = ctx.currentTime;
    if (mode === "select") {
      [780, 1180].forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.18, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.06 + 0.08);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now + idx * 0.06); osc.stop(now + idx * 0.06 + 0.09);
      });
      return;
    }
    if (mode === "done" || mode === "stageup" || mode === "levelup") {
      if (navigator.vibrate) navigator.vibrate([50, 30, 90]);
      const freqs = mode === "stageup" ? [220, 330, 440, 660, 990] :;
      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.22, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.07 + 0.28);
        osc.connect(gain); gain.connect(ctx.destination);
        osc.start(now + idx * 0.07); osc.stop(now + idx * 0.07 + 0.3);
      });
      return;
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, now);
    osc.frequency.exponentialRampToValueAtTime(620, now + 0.16);
    gain.gain.setValueAtTime(0.2, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.19);
    osc.connect(gain); gain.connect(ctx.destination);
    osc.start(now); osc.stop(now + 0.2);
  } catch (e) {}
}
function loadSmartImage(imgEl, baseName, onFail, onSuccess) {
  imgEl.style.display = "none";
  imgEl.classList.remove("clean-alpha");
  imgEl.dataset.cleaned = "";
  imgEl.onload = () => {
    if (baseName.startsWith("c") && imgEl.dataset.cleaned !== baseName) {
      cleanImageBg(imgEl, baseName);
    }
    imgEl.style.display = "block";
    if (onSuccess) onSuccess();
  };
  imgEl.onerror = () => {
    imgEl.onerror = () => {
      imgEl.style.display = "none";
      imgEl.removeAttribute("src");
      if (onFail) onFail();
    };
    imgEl.src = `${baseName}.jpg`;
  };
  imgEl.src = `${baseName}.png`;
}
function getMaxUnlockedStage(lvl) {
  let max = 1;
  STAGE_RULES.forEach(s => { if (lvl >= s.minLevel) max = s.stage; });
  return max;
}

function updateStaggeredCarousel() {
  const total = CHARACTERS.length;
  const idxCurr = (state.carouselIndex + total) % total;
  const idxPrev = (idxCurr - 1 + total) % total;
  const idxNext = (idxCurr + 1) % total;
  const cPrev = CHARACTERS[idxPrev], cCurr = CHARACTERS[idxCurr], cNext = CHARACTERS[idxNext];

  document.getElementById("select-power").textContent = state.powerLevel.toLocaleString("de-DE");
  document.getElementById("card-prev").style.background = cPrev.color;
  document.getElementById("card-curr").style.background = cCurr.color;
  document.getElementById("card-next").style.background = cNext.color;
  document.getElementById("name-curr").textContent = cCurr.name;
  document.getElementById("lvl-curr").textContent = `LVL ${state.level}`;
  document.getElementById("evo-curr").textContent = `STUFE · ${getMaxUnlockedStage(state.level)}`;
  document.getElementById("fb-prev").textContent = `#${String(cPrev.id).padStart(2, "0")}`;
  document.getElementById("fb-curr").textContent = `#${String(cCurr.id).padStart(2, "0")}`;
  document.getElementById("fb-next").textContent = `#${String(cNext.id).padStart(2, "0")}`;

  ["prev", "curr", "next"].forEach((pos, i) => {
    const charObj = [cPrev, cCurr, cNext][i];
    const fb = document.getElementById(`fb-${pos}`);
    const im = document.getElementById(`img-${pos}`);
    fb.style.display = "grid";
    loadSmartImage(im, `c${charObj.id}_s1`, () => { fb.style.display = "grid"; }, () => { fb.style.display = "none"; });
  });
  document.getElementById("scroll-thumb").style.transform = `translateY(${(idxCurr / (total - 1)) * 34}px)`;
}

function stepCarousel(dir) {
  state.carouselIndex = (state.carouselIndex + dir + CHARACTERS.length) % CHARACTERS.length;
  playSound("click");
  updateStaggeredCarousel();
}

let touchStartY = 0, isSwiping = false;
const carouselEl = document.getElementById("staggered-carousel");
carouselEl.addEventListener("touchstart", e => {
  if (e.touches && e.touches.length > 0) { touchStartY = e.touches.clientY; isSwiping = true; }
}, { passive: true });
carouselEl.addEventListener("touchmove", e => { if (isSwiping) e.preventDefault(); }, { passive: false });
carouselEl.addEventListener("touchend", e => {
  if (!isSwiping || !e.changedTouches || e.changedTouches.length === 0) return;
  isSwiping = false;
  const diff = touchStartY - e.changedTouches.clientY;
  if (Math.abs(diff) > 25) stepCarousel(diff > 0 ? 1 : -1);
});

document.getElementById("card-prev").addEventListener("click", () => stepCarousel(-1));
document.getElementById("card-next").addEventListener("click", () => stepCarousel(1));
document.getElementById("card-curr").addEventListener("click", () => {
  playSound("click");
  openCharacterDetails(CHARACTERS[state.carouselIndex].id);
});

function openCharacterDetails(charId) {
  const c = CHARACTERS.find(item => item.id === charId) || CHARACTERS;
  state.selectedChar = c.id;
  document.getElementById("detail-num").textContent = String(c.id).padStart(3, "0");
  document.getElementById("detail-name").textContent = c.name;
  document.getElementById("detail-bio").textContent = c.bio;
  document.getElementById("detail-attack").textContent = c.attack;
  document.getElementById("detail-focus").textContent = c.focus;
  const imgEl = document.getElementById("detail-img");
  const phEl = document.getElementById("detail-placeholder");
  document.getElementById("detail-placeholder-code").textContent = `c${c.id}_s1.png`;
  phEl.classList.add("hidden");
  loadSmartImage(imgEl, `c${c.id}_s1`, () => phEl.classList.remove("hidden"));
  showScreen("detail-screen");
}
function openExerciseModal(ex) {
  activeExercise = ex;
  clearInterval(timerInterval);
  playSound("select");
  const mult = state.senzuActive ? 2 : 1;
  document.getElementById("ex-modal-tag").textContent = ex.isBoss ? "👹 BOSS-HERAUSFORDERUNG" : "TECHNIK-GUIDE";
  document.getElementById("ex-modal-title").textContent = ex.title;
  document.getElementById("ex-modal-tip").textContent = ex.tip || "Volle Körperspannung!";
  document.getElementById("ex-complete-btn").textContent = `GESCHAFFT (+${ex.xp * mult} XP)`;

  const imgEl = document.getElementById("ex-comic-img");
  const svgEl = document.getElementById("ex-comic-svg");
  svgEl.innerHTML = getComicSVG(ex.pose || "punch");
  svgEl.style.display = "grid";
  loadSmartImage(imgEl, `ex_${ex.pose || "punch"}`, () => { svgEl.style.display = "grid"; }, () => { svgEl.style.display = "none"; });

  const timerArea = document.getElementById("ex-timer-area");
  const timerDisp = document.getElementById("ex-timer-display");
  const timerBtn = document.getElementById("ex-timer-start");

  if (ex.sec) {
    let remaining = ex.sec;
    timerArea.classList.remove("hidden");
    const fmt = (s) => `00:${String(Math.max(0, s)).padStart(2, "0")}`;
    timerDisp.textContent = fmt(remaining);
    timerBtn.textContent = "TIMER STARTEN";
    timerBtn.onclick = () => {
      clearInterval(timerInterval);
      timerBtn.textContent = "LÄUFT...";
      timerInterval = setInterval(() => {
        remaining -= 1;
        timerDisp.textContent = fmt(remaining);
        if (remaining <= 0) {
          clearInterval(timerInterval);
          timerDisp.textContent = "FERTIG!";
          timerBtn.textContent = "NEU STARTEN";
          playSound("levelup");
          remaining = ex.sec;
        }
      }, 1000);
    };
  } else {
    timerArea.classList.add("hidden");
  }
  document.getElementById("exercise-modal").classList.remove("hidden");
}

function renderWorkouts() {
  const partData = BODY_WORKOUTS[state.selectedPart] || BODY_WORKOUTS.arms;
  document.getElementById("selected-part-title").textContent = partData.label;
  const list = document.getElementById("workout-list");
  list.innerHTML = "";
  const exercises = partData[state.difficulty] || partData.easy;
  exercises.forEach(ex => {
    const btn = document.createElement("button");
    btn.className = "workout-card";
    btn.innerHTML = `<div><div class="workout-title">${ex.title}</div><div class="workout-sub">${ex.sub}</div></div><span class="xp-tag">+${ex.xp} XP</span>`;
    btn.addEventListener("click", () => openExerciseModal(ex));
    list.appendChild(btn);
  });
  document.querySelectorAll(".body-hotspot").forEach(spot => spot.classList.toggle("active", spot.dataset.part === state.selectedPart));
  document.querySelectorAll(".stat-box").forEach(box => box.classList.toggle("active-box", box.dataset.partBox === state.selectedPart));
  document.querySelectorAll(".diff-tab").forEach(tab => tab.classList.toggle("active", tab.dataset.diff === state.difficulty));
}

function renderTrophies() {
  const coreLvl = 1 + Math.floor((state.partXP.core || 0) / 60);
  const unlockedMap = {
    t1: state.level >= 2, t2: state.powerLevel >= 10000, t3: (state.bossWins || 0) >= 1,
    t4: (state.streak || 0) >= 3, t5: coreLvl >= 3, t6: (state.testedChars || []).length >= 5
  };
  const grid = document.getElementById("trophy-list");
  if (!grid) return;
  grid.innerHTML = "";
  TROPHIES.forEach(t => {
    const ok = !!unlockedMap[t.id];
    const div = document.createElement("div");
    div.className = `trophy-item ${ok ? "unlocked" : ""}`;
    div.innerHTML = `<div style="font-size:1.3rem;">${ok ? t.icon : "🔒"} ${t.name}</div><div style="font-size:0.75rem;color:#aaa;">${t.desc}</div>`;
    grid.appendChild(div);
  });
}

function triggerKiImpact(intense = false) {
  const charObj = CHARACTERS.find(c => c.id === state.selectedChar) || CHARACTERS[0];
  const col = charObj.color || "#ff9900";
  const flash = document.createElement("div");
  flash.className = "ki-screen-flash";
  flash.style.setProperty("--wave-col", col);
  document.body.appendChild(flash);
  setTimeout(() => flash.remove(), 450);

  const scanner = document.querySelector(".fighter-scanner");
  if (scanner) {
    const wave = document.createElement("div");
    wave.className = "ki-shockwave";
    wave.style.setProperty("--wave-col", col);
    scanner.appendChild(wave);
    setTimeout(() => wave.remove(), 700);
  }
  const arena = document.getElementById("arena-screen");
  if (arena && intense) {
    arena.classList.remove("mega-shake-active");
    void arena.offsetWidth;
    arena.classList.add("mega-shake-active");
  }
}
function completeExercise(gainedXP, gainedPower) {
  const oldMax = getMaxUnlockedStage(state.level);
  const mult = state.senzuActive ? 2 : 1;
  const finalXP = gainedXP * mult;
  const finalPower = gainedPower * mult;
  if (state.senzuActive) state.senzuActive = false;

  const today = getTodayKey();
  if (state.lastTrainDate !== today) {
    const yest = new Date(Date.now() - 86400000).toISOString().slice(0, 10);
    state.streak = state.lastTrainDate === yest ? (state.streak || 0) + 1 : 1;
    state.lastTrainDate = today;
  }
  if (!Array.isArray(state.testedChars)) state.testedChars = [];
  if (!state.testedChars.includes(state.selectedChar)) state.testedChars.push(state.selectedChar);

  state.xp += finalXP;
  state.powerLevel += finalPower;
  state.partXP[state.selectedPart] = (state.partXP[state.selectedPart] || 0) + finalXP;

  if (activeExercise && activeExercise.isBoss) {
    state.bossWins = (state.bossWins || 0) + 1;
    state.bossCounter = 0;
  } else {
    state.bossCounter = (state.bossCounter || 0) + 1;
  }

  const stageEl = document.querySelector(".arena-poster-stage");
  if (stageEl) {
    stageEl.classList.remove("shake-active");
    void stageEl.offsetWidth;
    stageEl.classList.add("shake-active");
    triggerKiImpact(state.xp >= state.level * 100 || (activeExercise && activeExercise.isBoss));
  }

  const xpNeeded = state.level * 100;
  if (state.xp >= xpNeeded) {
    state.xp -= xpNeeded;
    state.level += 1;
    const newMax = getMaxUnlockedStage(state.level);
    const badgeEl = document.getElementById("levelup-badge");
    const titleEl = document.getElementById("levelup-title");
    const descEl = document.getElementById("levelup-desc");
    if (newMax > oldMax) {
      state.selectedStage = newMax;
      playSound("stageup");
      badgeEl.textContent = "TRANSFORMATION!";
      titleEl.textContent = `STUFE ${newMax}`;
      descEl.textContent = `Stufe ${newMax} freigeschaltet!`;
    } else {
      playSound("levelup");
      badgeEl.textContent = "LEVEL UP!";
      titleEl.textContent = `LEVEL ${state.level}`;
      descEl.textContent = `Kampfkraft: ${state.powerLevel.toLocaleString("de-DE")}!`;
    }
    document.getElementById("levelup-overlay").classList.remove("hidden");
  } else {
    playSound("done");
  }
  updateUI();
}

function updateUI() {
  const xpNeeded = state.level * 100;
  const maxUnlocked = getMaxUnlockedStage(state.level);
  if (state.selectedStage > maxUnlocked) state.selectedStage = maxUnlocked;

  const charObj = CHARACTERS.find(c => c.id === state.selectedChar) || CHARACTERS[0];
  const baseFile = `c${state.selectedChar}_s${state.selectedStage}`;

  document.getElementById("power-level").textContent = state.powerLevel.toLocaleString("de-DE");
  document.getElementById("char-num").textContent = String(state.selectedChar).padStart(3, "0");
  document.getElementById("fighter-title").textContent = `${charObj.name} · STUFE ${state.selectedStage}`;
  document.getElementById("bg-watermark").textContent = charObj.name;
  document.getElementById("level-label").textContent = `LVL ${state.level}`;
  document.getElementById("xp-text").textContent = `${state.xp} / ${xpNeeded} XP`;

  const pct = Math.min(100, (state.xp / xpNeeded) * 100);
  document.getElementById("ki-bar-fill").style.width = `${pct}%`;

  const calcPartLvl = (xp) => `LVL ${1 + Math.floor((xp || 0) / 60)}`;
  document.getElementById("stat-arms").textContent = calcPartLvl(state.partXP.arms);
  document.getElementById("stat-core").textContent = calcPartLvl(state.partXP.core);
  document.getElementById("stat-legs").textContent = calcPartLvl(state.partXP.legs);

  const streakEl = document.getElementById("streak-chip");
  if (streakEl) streakEl.textContent = `🔥 ${state.streak || 0} TAGE`;

  const senzuBtn = document.getElementById("senzu-btn");
  if (senzuBtn) {
    const usedToday = state.senzuDate === getTodayKey();
    senzuBtn.className = "hud-chip";
    if (state.senzuActive) {
      senzuBtn.classList.add("senzu-on");
      senzuBtn.textContent = "🌱 2x AKTIV!";
    } else if (usedToday) {
      senzuBtn.style.opacity = "0.45";
      senzuBtn.textContent = "🌱 LEER";
    } else {
      senzuBtn.style.opacity = "1";
      senzuBtn.classList.add("senzu-ready");
      senzuBtn.textContent = "🌱 SENZU (2x)";
    }
  }

  loadSmartImage(document.getElementById("header-avatar-img"), `c${state.selectedChar}_s1`, () => {});
  const imgEl = document.getElementById("fighter-img");
  imgEl.style.setProperty("--aura-color", charObj.color);
  imgEl.classList.toggle("aura-active", state.selectedStage >= 2);

  const phEl = document.getElementById("placeholder-box");
  document.getElementById("placeholder-code").textContent = `${baseFile}.png`;
  phEl.classList.add("hidden");
  loadSmartImage(imgEl, baseFile, () => phEl.classList.remove("hidden"));

  const pills = document.getElementById("stage-pills");
  pills.innerHTML = "";
  STAGE_RULES.forEach(s => {
    const unlocked = s.stage <= maxUnlocked;
    const btn = document.createElement("button");
    btn.className = `stage-pill ${s.stage === state.selectedStage ? "active" : ""} ${!unlocked ? "locked" : ""}`;
    btn.textContent = unlocked ? `STUFE ${s.stage}` : `🔒 ${s.stage}`;
    if (unlocked) {
      btn.addEventListener("click", () => {
        state.selectedStage = s.stage;
        playSound("click");
        updateUI();
      });
    }
    pills.appendChild(btn);
  });

  localStorage.setItem("zwarriors_neon_v10", JSON.stringify(state));
}
document.getElementById("senzu-btn")?.addEventListener("click", () => {
  if (state.senzuDate === getTodayKey() || state.senzuActive) return;
  state.senzuDate = getTodayKey();
  state.senzuActive = true;
  playSound("levelup");
  triggerKiImpact(true);
  updateUI();
});

document.getElementById("boss-btn")?.addEventListener("click", () => {
  const boss = BOSS_CHALLENGES[(state.bossWins || 0) % BOSS_CHALLENGES.length];
  openExerciseModal(boss);
});

document.getElementById("trophy-btn")?.addEventListener("click", () => {
  playSound("click");
  renderTrophies();
  document.getElementById("trophy-modal").classList.remove("hidden");
});

document.getElementById("close-trophy")?.addEventListener("click", () => {
  document.getElementById("trophy-modal").classList.add("hidden");
});

document.getElementById("ex-complete-btn").addEventListener("click", () => {
  clearInterval(timerInterval);
  document.getElementById("exercise-modal").classList.add("hidden");
  if (activeExercise) completeExercise(activeExercise.xp, activeExercise.power);
});

document.getElementById("ex-close-btn").addEventListener("click", () => {
  clearInterval(timerInterval);
  document.getElementById("exercise-modal").classList.add("hidden");
});

document.getElementById("enter-app-btn").addEventListener("click", () => {
  playSound("click");
  updateStaggeredCarousel();
  showScreen("select-screen");
});

document.getElementById("back-to-intro").addEventListener("click", () => showScreen("intro-screen"));
document.getElementById("back-to-carousel").addEventListener("click", () => {
  updateStaggeredCarousel();
  showScreen("select-screen");
});

document.getElementById("confirm-fighter-btn").addEventListener("click", () => {
  playSound("levelup");
  updateUI();
  renderWorkouts();
  showScreen("arena-screen");
});

document.getElementById("arena-back-btn").addEventListener("click", () => {
  updateStaggeredCarousel();
  showScreen("select-screen");
});

document.querySelectorAll(".body-hotspot").forEach(spot => {
  spot.addEventListener("click", () => {
    state.selectedPart = spot.dataset.part;
    playSound("click");
    const fImg = document.getElementById("fighter-img");
    if (fImg) {
      fImg.classList.remove("fighter-pop");
      void fImg.offsetWidth;
      fImg.classList.add("fighter-pop");
    }
    renderWorkouts();
  });
});

document.querySelectorAll(".diff-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    state.difficulty = tab.dataset.diff;
    renderWorkouts();
  });
});

document.getElementById("close-levelup").addEventListener("click", () => {
  document.getElementById("levelup-overlay").classList.add("hidden");
});

document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Bei Level 1 neu starten?")) {
    localStorage.removeItem("zwarriors_neon_v10");
    location.reload();
  }
});

loadSmartImage(document.getElementById("intro-hero-img"), "intro_bg", () => {
  loadSmartImage(document.getElementById("intro-hero-img"), "c1_s1", () => {});
});
(function initKidsCampaignSystem() {
  const MIN_EXERCISE_SEC = 20;
  const EXERCISES_PER_TICKET = 3;
  const MAX_TICKETS_PER_DAY = 2;

  function ensureCampaignState() {
    const today = getTodayKey();
    if (state.campaignDate !== today) {
      state.campaignDate = today;
      state.dailyExerciseCount = 0;
      state.dailyTicketsEarned = 0;
      state.battleTickets = 0;
    }
    if (typeof state.campaignStage !== "number") state.campaignStage = 1;
    if (typeof state.battleTickets !== "number") state.battleTickets = 0;
  }

  const battleModal = document.createElement("div");
  battleModal.id = "battle-modal";
  battleModal.className = "levelup-overlay hidden";
  battleModal.innerHTML = `
    <div class="levelup-card" style="max-width: 375px;">
      <span id="battle-stage-tag" class="orange-tag">WELT-LEVEL 1</span>
      <h2 id="battle-game-title" class="tall-orange-title small">KI-STRAHL-DUELL</h2>
      <div id="battle-timer" class="timer-box">15.0s</div>
      <div id="battle-stage" class="battle-stage"></div>
      <div id="battle-extra-ui"></div>
      <p id="battle-status-text" class="poster-copy center" style="color:#fff;"></p>
      <div id="battle-controls"></div>
      <button id="battle-close-btn" class="reset-link">Schließen</button>
    </div>
  `;
  document.body.appendChild(battleModal);

  const hud = document.querySelector(".hud-strip");
  if (hud) {
    const campBtn = document.createElement("button");
    campBtn.id = "campaign-btn";
    campBtn.className = "hud-chip";
    hud.appendChild(campBtn);
  }

  const origOpenExerciseModal = openExerciseModal;
  openExerciseModal = function (ex) {
    origOpenExerciseModal(ex);
    const completeBtn = document.getElementById("ex-complete-btn");
    const mult = state.senzuActive ? 2 : 1;
    const finalLabel = `GESCHAFFT (+${ex.xp * mult} XP)`;
    clearInterval(window._paceGuardInterval);
    completeBtn.disabled = true;

    if (ex.sec) {
      completeBtn.textContent = `⏳ ERST TIMER BEENDEN (${ex.sec}s)`;
      const timerBtn = document.getElementById("ex-timer-start");
      const origClick = timerBtn.onclick;
      timerBtn.onclick = function () {
        if (origClick) origClick();
        let left = ex.sec;
        window._paceGuardInterval = setInterval(() => {
          left -= 1;
          if (left > 0) completeBtn.textContent = `⏳ NOCH ${left} SEK. HALTEN...`;
          else {
            clearInterval(window._paceGuardInterval);
            completeBtn.disabled = false;
            completeBtn.textContent = finalLabel;
          }
        }, 1000);
      };
    } else {
      let waitSec = MIN_EXERCISE_SEC;
      completeBtn.textContent = `⏳ TRAINING LÄUFT (${waitSec}s)`;
      window._paceGuardInterval = setInterval(() => {
        waitSec -= 1;
        if (waitSec > 0) completeBtn.textContent = `⏳ TRAINING LÄUFT (${waitSec}s)`;
        else {
          clearInterval(window._paceGuardInterval);
          completeBtn.disabled = false;
          completeBtn.textContent = finalLabel;
          playSound("select");
        }
      }, 1000);
    }
  };

  document.getElementById("ex-close-btn").addEventListener("click", () => clearInterval(window._paceGuardInterval));

  const origCompleteExercise = completeExercise;
  completeExercise = function (gainedXP, gainedPower) {
    ensureCampaignState();
    state.dailyExerciseCount = (state.dailyExerciseCount || 0) + 1;
    if (state.dailyExerciseCount % EXERCISES_PER_TICKET === 0 && (state.dailyTicketsEarned || 0) < MAX_TICKETS_PER_DAY) {
      state.dailyTicketsEarned += 1;
      state.battleTickets += 1;
      setTimeout(() => {
        playSound("stageup");
        alert(`🎉 3 Übungen geschafft! Neues Spiel-Level (${state.campaignStage}) freigeschaltet!`);
      }, 450);
    }
    origCompleteExercise(gainedXP, gainedPower);
  };

  const origUpdateUI = updateUI;
  updateUI = function () {
    ensureCampaignState();
    origUpdateUI();
    const campBtn = document.getElementById("campaign-btn");
    if (!campBtn) return;
    const progress = state.dailyExerciseCount % EXERCISES_PER_TICKET;
    if (state.battleTickets > 0) {
      campBtn.className = "hud-chip senzu-on";
      campBtn.textContent = `🐉 SPIELEN! (${state.battleTickets}x)`;
    } else if (state.dailyTicketsEarned >= MAX_TICKETS_PER_DAY) {
      campBtn.className = "hud-chip";
      campBtn.style.opacity = "0.5";
      campBtn.textContent = `🐉 TAGESLIMIT (2/2)`;
    } else {
      campBtn.className = "hud-chip";
      campBtn.style.opacity = "1";
      campBtn.textContent = `🐉 SPIEL (${progress}/${EXERCISES_PER_TICKET})`;
    }
  };

   let gameTimer = null;
  let extraTimers = [];
  function stopAllGameLoops() {
    clearInterval(gameTimer);
    extraTimers.forEach(t => clearInterval(t));
    extraTimers = [];
  }

  function startDynamicMiniGame() {
    ensureCampaignState();
    if (state.battleTickets <= 0) {
      if (state.dailyTicketsEarned >= MAX_TICKETS_PER_DAY) alert("Tageslimit erreicht (2/2)! Morgen warten neue Level auf dich.");
      else alert(`Mach noch ${EXERCISES_PER_TICKET - (state.dailyExerciseCount % EXERCISES_PER_TICKET)} Übung(en), um Welt-Level ${state.campaignStage} zu starten!`);
      return;
    }
    state.battleTickets -= 1;
    updateUI();
    stopAllGameLoops();

    const lvl = state.campaignStage;
    const mode = (lvl - 1) % 4;
    const heroBase = `c${state.selectedChar}_s${state.selectedStage}`;
    const enemyId = ((state.selectedChar + lvl + 1) % CHARACTERS.length) + 1;
    const enemyBase = `c${enemyId}_s${Math.min(5, Math.ceil(lvl / 2))}`;

    const stageEl = document.getElementById("battle-stage");
    const extraEl = document.getElementById("battle-extra-ui");
    const ctrlEl = document.getElementById("battle-controls");
    const titleEl = document.getElementById("battle-game-title");
    const timerEl = document.getElementById("battle-timer");
    const statusEl = document.getElementById("battle-status-text");

    document.getElementById("battle-stage-tag").textContent = `WELT-LEVEL ${lvl}`;
    stageEl.innerHTML = "";
    extraEl.innerHTML = "";
    ctrlEl.innerHTML = "";
    battleModal.classList.remove("hidden");

    const finishGame = (won, msg) => {
      stopAllGameLoops();
      ctrlEl.innerHTML = "";
      if (won) {
        playSound("stageup");
        triggerKiImpact(true);
        state.campaignStage += 1;
        state.powerLevel += 1500;
        statusEl.textContent = `🏆 ${msg} Welt-Level ${state.campaignStage} frei (+1.500 KI)!`;
      } else {
        playSound("done");
        statusEl.textContent = `💥 ${msg} Trainiere 3 Übungen für den nächsten Versuch!`;
      }
      updateUI();
    };

    if (mode === 0) {
      titleEl.textContent = "KI-STRAHL-DUELL";
      statusEl.textContent = "Tippe schnell, um deinen Kämpfer vorzuschieben!";
      stageEl.innerHTML = `<img id="g-hero" class="battle-fighter hover-hero" style="left:10px; top:52px;" /><div class="beam-clash-track"><div id="g-beam" class="beam-player"></div></div><div id="g-spark" class="beam-spark-core"></div><img id="g-enemy" class="battle-fighter battle-enemy hover-enemy" style="right:10px; top:52px;" />`;
      ctrlEl.innerHTML = `<button id="g-tap" class="battle-tap-btn">⚡ KAMEHAMEHA FEUERN!</button>`;
      loadSmartImage(document.getElementById("g-hero"), heroBase);
      loadSmartImage(document.getElementById("g-enemy"), enemyBase);
      let pos = 45, time = 15.0;
      const push = 0.4 + lvl * 0.04;
      const updatePos = () => {
        const c = Math.max(0, Math.min(100, pos));
        document.getElementById("g-beam").style.width = `${c}%`;
        document.getElementById("g-spark").style.left = `${c}%`;
        document.getElementById("g-hero").style.left = `${8 + c * 0.25}px`;
      };
      document.getElementById("g-tap").onclick = () => {
        pos += 5.0;
        updatePos();
        if (pos >= 100) finishGame(true, "VOLLTREFFER!");
      };
      gameTimer = setInterval(() => {
        time -= 0.1;
        pos -= push;
        timerEl.textContent = `${Math.max(0, time).toFixed(1)}s`;
        updatePos();
        if (pos <= 0) finishGame(false, "Überwältigt!");
        else if (time <= 0) finishGame(pos >= 50, pos >= 50 ? "STRAHL GEWONNEN!" : "Knapp verloren!");
      }, 100);
    } else if (mode === 1) {
      titleEl.textContent = "ENERGIEBALL-ABWEHR";
      statusEl.textContent = "Tippe auf die fliegenden Energiebälle, bevor sie landen!";
      stageEl.innerHTML = `<img id="g-hero" class="battle-fighter hover-hero" style="left:125px; top:95px;" />`;
      loadSmartImage(document.getElementById("g-hero"), heroBase);
      let score = 0, hits = 0, time = 16.0;
      const targetScore = 8 + Math.min(6, lvl);
      timerEl.textContent = `0 / ${targetScore}`;
      const spawnOrb = () => {
        const orb = document.createElement("div");
        orb.className = "ki-orb-target";
        orb.textContent = "🔥";
        const xPct = 18 + Math.random() * 64;
        let yPct = 8;
        orb.style.left = `${xPct}%`;
        orb.style.top = `${yPct}%`;
        stageEl.appendChild(orb);
        const fall = setInterval(() => {
          yPct += 2.6 + lvl * 0.2;
          orb.style.top = `${yPct}%`;
          if (yPct >= 88) {
            clearInterval(fall);
            orb.remove();
            hits += 1;
            const hEl = document.getElementById("g-hero");
            if (hEl) {
              hEl.classList.add("hit-flash");
              setTimeout(() => hEl.classList.remove("hit-flash"), 280);
            }
            if (hits >= 3) finishGame(false, "3 Einschläge kassiert!");
          }
        }, 50);
        extraTimers.push(fall);
        orb.onclick = () => {
          clearInterval(fall);
          orb.remove();
          playSound("click");
          score += 1;
          timerEl.textContent = `${score} / ${targetScore}`;
          const hEl = document.getElementById("g-hero");
          if (hEl) {
            hEl.style.left = `${Math.max(10, Math.min(240, (xPct / 100) * 280 - 30))}px`;
            hEl.classList.add("dash-hit");
            setTimeout(() => hEl.classList.remove("dash-hit"), 320);
          }
          if (score >= targetScore) finishGame(true, "ALLE BÄLLE ZERSTÖRT!");
        };
      };
      spawnOrb();
      extraTimers.push(setInterval(spawnOrb, Math.max(650, 1150 - lvl * 45)));
      gameTimer = setInterval(() => {
        time -= 0.2;
        if (time <= 0) finishGame(score >= targetScore, "Zeit abgelaufen!");
      }, 200);
          } else if (mode === 2) {
      titleEl.textContent = "ULTRA-INSTINKT KONTER";
      statusEl.textContent = "Springe auf die Seite, wo der Gegner auftaucht!";
      stageEl.innerHTML = `<img id="g-enemy" class="battle-fighter battle-enemy hover-enemy" style="left:125px; top:10px;" /><img id="g-hero" class="battle-fighter hover-hero" style="left:125px; top:100px;" />`;
      ctrlEl.innerHTML = `<div class="battle-controls-row"><button class="battle-tap-btn" data-lane="0">⬅️ LINKS</button><button class="battle-tap-btn" data-lane="1">⬆️ MITTE</button><button class="battle-tap-btn" data-lane="2">➡️ RECHTS</button></div>`;
      loadSmartImage(document.getElementById("g-hero"), heroBase);
      loadSmartImage(document.getElementById("g-enemy"), enemyBase);
      const lanes =;
      let enemyLane = 1, hits = 0, misses = 0;
      const needed = 5;
      timerEl.textContent = `0 / ${needed}`;
      const moveEnemy = () => {
        enemyLane = Math.floor(Math.random() * 3);
        const eEl = document.getElementById("g-enemy");
        if (eEl) eEl.style.left = `${lanes[enemyLane]}px`;
      };
      moveEnemy();
      extraTimers.push(setInterval(moveEnemy, Math.max(850, 1450 - lvl * 50)));
      ctrlEl.querySelectorAll("button").forEach(btn => {
        btn.onclick = () => {
          const chosen = Number(btn.dataset.lane);
          const hEl = document.getElementById("g-hero");
          const eEl = document.getElementById("g-enemy");
          if (hEl) hEl.style.left = `${lanes[chosen]}px`;
          if (chosen === enemyLane) {
            playSound("done");
            hits += 1;
            timerEl.textContent = `${hits} / ${needed}`;
            if (hEl) { hEl.classList.add("dash-hit"); setTimeout(() => hEl.classList.remove("dash-hit"), 300); }
            if (eEl) { eEl.classList.add("hit-flash"); setTimeout(() => eEl.classList.remove("hit-flash"), 280); }
            moveEnemy();
            if (hits >= needed) finishGame(true, "5x PERFEKT GEKONTERT!");
          } else {
            misses += 1;
            if (hEl) { hEl.classList.add("hit-flash"); setTimeout(() => hEl.classList.remove("hit-flash"), 280); }
            if (misses >= 3) finishGame(false, "Zu oft daneben gesprungen!");
          }
        };
      });
    } else {
      titleEl.textContent = "SUPER-FINISHER";
      statusEl.textContent = "Stoppe den Ki-Zeiger im grünen Bereich (3 Treffer)!";
      stageEl.innerHTML = `<img id="g-hero" class="battle-fighter hover-hero" style="left:25px; top:55px;" /><img id="g-enemy" class="battle-fighter battle-enemy hover-enemy" style="right:25px; top:55px;" />`;
      extraEl.innerHTML = `<div class="gauge-track"><div class="gauge-sweetspot"></div><div id="g-needle" class="gauge-needle" style="left:0%;"></div></div>`;
      ctrlEl.innerHTML = `<button id="g-stop" class="battle-tap-btn">💥 JETZT ZUSCHLAGEN!</button>`;
      loadSmartImage(document.getElementById("g-hero"), heroBase);
      loadSmartImage(document.getElementById("g-enemy"), enemyBase);
      let needle = 0, dir = 1, hits = 0, tries = 0;
      timerEl.textContent = `0 / 3 TREFFER`;
      const speed = 2.6 + lvl * 0.25;
      gameTimer = setInterval(() => {
        needle += dir * speed;
        if (needle >= 98) { needle = 98; dir = -1; }
        if (needle <= 0) { needle = 0; dir = 1; }
        const nEl = document.getElementById("g-needle");
        if (nEl) nEl.style.left = `${needle}%`;
      }, 25);
      document.getElementById("g-stop").onclick = () => {
        tries += 1;
        const hEl = document.getElementById("g-hero");
        const eEl = document.getElementById("g-enemy");
        if (needle >= 38 && needle <= 62) {
          playSound("done");
          hits += 1;
          timerEl.textContent = `${hits} / 3 TREFFER`;
          if (hEl) { hEl.classList.add("dash-hit"); setTimeout(() => hEl.classList.remove("dash-hit"), 320); }
          if (eEl) { eEl.classList.add("hit-flash"); setTimeout(() => eEl.classList.remove("hit-flash"), 280); }
          if (hits >= 3) finishGame(true, "3x VOLLTREFFER!");
        } else {
          playSound("click");
          if (hEl) { hEl.classList.add("hit-flash"); setTimeout(() => hEl.classList.remove("hit-flash"), 280); }
          if (tries >= 5) finishGame(false, "Zu viele Fehlversuche!");
        }
      };
    }
  }

  document.getElementById("campaign-btn")?.addEventListener("click", startDynamicMiniGame);
  document.getElementById("battle-close-btn").addEventListener("click", () => {
    stopAllGameLoops();
    battleModal.classList.add("hidden");
  });
  updateUI();
})();

updateStaggeredCarousel();
updateUI();
renderWorkouts();
