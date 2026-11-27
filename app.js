(function loadAppFonts() {
  const host = Array.of("fonts", "googleapis", "com").join(".");
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

const CHARACTERS = Array.of(
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
);

const STAGE_RULES = Array.of(
  { stage: 1, minLevel: 1 }, { stage: 2, minLevel: 2 },
  { stage: 3, minLevel: 4 }, { stage: 4, minLevel: 6 }, { stage: 5, minLevel: 8 }
);

const BOSS_CHALLENGES = Array.of(
  { title: "BOSS: SCHWERKRAFT 50x G", sub: "Kombi-Prüfung · Doppel-XP", xp: 120, power: 3000, pose: "plank", sec: 30, isBoss: true, tip: "10 Kniebeugen + 30 Sek. Plank!" },
  { title: "BOSS: MEISTER-PRÜFUNG", sub: "Endboss · Doppel-XP", xp: 140, power: 3500, pose: "benchpress", sec: 25, isBoss: true, tip: "10x Hantelbank-Drücken + 25s Boxen!" },
  { title: "BOSS: GALAXIE-TURNIER", sub: "Finale · Doppel-XP", xp: 160, power: 4000, pose: "jump", sec: 30, isBoss: true, tip: "15 Ausfallschritte + 30s Sprünge!" }
);

const TROPHIES = Array.of(
  { id: "t1", icon: "⚡", name: "ERWACHEN", desc: "Stufe 2 erreicht" },
  { id: "t2", icon: "🔥", name: "10.000 KI", desc: "10.000 Ki gesammelt" },
  { id: "t3", icon: "👹", name: "BOSS-JÄGER", desc: "Ersten Boss besiegt" },
  { id: "t4", icon: "📅", name: "DISZIPLIN", desc: "3 Tage Streak" },
  { id: "t5", icon: "💪", name: "BAUCH-STAHL", desc: "Bauch Level 3" },
  { id: "t6", icon: "👑", name: "TEAM-LEADER", desc: "5 Krieger trainiert" }
);
   const BODY_WORKOUTS = {
  arms: {
    label: "TRAINING: ARME & HANTELBANK",
    easy: Array.of(
      { title: "12x Kurzhantel-Curls", sub: "Einfach · Hantel-Power", xp: 25, power: 450, pose: "dumbbellcurl", tip: "Hantel ruhig beugen & strecken." },
      { title: "10x Knie-Liegestütze", sub: "Einfach · Basis", xp: 25, power: 400, pose: "kneepushup", tip: "Knie auf Boden, Rücken gerade." },
      { title: "20 Sek. Schattenboxen", sub: "Einfach · Ki-Fäuste", xp: 20, power: 350, pose: "punch", sec: 20, tip: "Schnelle Schläge nach vorn!" }
    ),
    advanced: Array.of(
      { title: "12x Hantelbank-Drücken", sub: "Profi · Brust & Arme", xp: 50, power: 1000, pose: "benchpress", tip: "Gewicht über der Brust hochdrücken!" },
      { title: "12x Echte Liegestütze", sub: "Profi · Kamehameha", xp: 45, power: 900, pose: "pushup", tip: "Körper wie ein Brett spannen." },
      { title: "10x Dips am Stuhl", sub: "Profi · Trizeps", xp: 45, power: 950, pose: "dips", tip: "Po dicht am Stuhl absenken." }
    ),
    master: Array.of(
      { title: "16x Schweres Bankdrücken", sub: "Meister · 100x G Hantel", xp: 90, power: 2400, pose: "benchpress", tip: "Kontrolliert absenken & hoch!" },
      { title: "22x Tiefe Liegestütze", sub: "Meister · 100x G", xp: 80, power: 2000, pose: "pushup", tip: "Kurz vor Boden abstoppen." },
      { title: "15x Hantel-Schulterdrücken", sub: "Meister · Final-Ki", xp: 85, power: 2200, pose: "dumbbellcurl", tip: "Hanteln über den Kopf stemmen!" }
    )
  },
  core: {
    label: "TRAINING: BAUCH & RUMPF",
    easy: Array.of(
      { title: "20 Sek. Plank", sub: "Einfach · Bauch-Schild", xp: 25, power: 450, pose: "plank", sec: 20, tip: "Bauch und Po fest anspannen!" },
      { title: "10x Crunches", sub: "Einfach · Körpermitte", xp: 25, power: 400, pose: "situp", tip: "Schultern kontrolliert rollen." }
    ),
    advanced: Array.of(
      { title: "40 Sek. Plank", sub: "Profi · Goldene Aura", xp: 45, power: 950, pose: "plank", sec: 40, tip: "Ruhig weiteratmen & halten." },
      { title: "16x Hantel-Russian-Twists", sub: "Profi · Saiyajin-Bauch", xp: 50, power: 1000, pose: "dumbbellcurl", tip: "Mit Gewicht von links nach rechts drehen." }
    ),
    master: Array.of(
      { title: "70 Sek. Plank", sub: "Meister · Abwehr", xp: 85, power: 2200, pose: "plank", sec: 70, tip: "Unzerstörbare Bauch-Spannung!" },
      { title: "25x Beinheben", sub: "Meister · Götter-Bauch", xp: 80, power: 2100, pose: "legraise", tip: "Beine gestreckt langsam heben." }
    )
  },
  legs: {
    label: "TRAINING: BEINE & SPRUNGKRAFT",
    easy: Array.of(
      { title: "15x Kniebeugen", sub: "Einfach · Fester Stand", xp: 25, power: 450, pose: "squat", tip: "Po weit nach hinten schieben." },
      { title: "25 Sek. Hampelmänner", sub: "Einfach · Speed", xp: 20, power: 350, pose: "jump", sec: 25, tip: "Leichtfüßig auf Fußballen." }
    ),
    advanced: Array.of(
      { title: "20x Hantel-Kniebeugen", sub: "Profi · 10x Schwerkraft", xp: 50, power: 1000, pose: "squat", tip: "Hantel vor der Brust halten & tief beugen." },
      { title: "14x Ausfallschritte", sub: "Profi · Ausweichen", xp: 45, power: 900, pose: "lunge", tip: "Großer Schritt nach vorn." }
    ),
    master: Array.of(
      { title: "15x Sprung-Kniebeugen", sub: "Meister · Raketen-Start", xp: 85, power: 2300, pose: "jump", tip: "Explosiv abspringen!" },
      { title: "45 Sek. Wandsitzen", sub: "Meister · 100x G", xp: 80, power: 2100, pose: "wallsit", sec: 45, tip: "Knie im 90-Grad-Winkel." }
    )
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
  testedChars: Array.of()
};

let activeExercise = null;
let timerInterval = null;

function getTodayKey() {
  return new Date().toISOString().slice(0, 10);
}

function showScreen(id) {
  Array.of("intro-screen", "select-screen", "detail-screen", "arena-screen").forEach(s => {
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
      Array.of(780, 1180).forEach((freq, idx) => {
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
      if (navigator.vibrate) navigator.vibrate(Array.of(50, 30, 90));
      const freqs = mode === "stageup" ? Array.of(220, 330, 440, 660, 990) : Array.of(330, 440, 660, 880);
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
function getComicSVG(pose) {
  const cObj = CHARACTERS.find(c => c.id === state.selectedChar) || CHARACTERS.at(0);
  const auraCol = cObj.color || "#ff9900";
  const bg = `<defs>
    <radialGradient id="kiAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${auraCol}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${auraCol}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="giGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${auraCol}"/>
      <stop offset="100%" stop-color="#e85d04"/>
    </linearGradient>
  </defs>
  <ellipse cx="130" cy="70" rx="95" ry="48" fill="url(#kiAura)"/>
  <line x1="20" y1="112" x2="240" y2="112" stroke="#3a3a48" stroke-width="3" stroke-linecap="round"/>`;

  const hair = (x, y, rot = 0) => `<g transform="translate(${x},${y}) rotate(${rot})">
    <polygon points="-10,-6 -22,-18 -6,-13 -12,-28 0,-16 6,-30 10,-15 22,-22 12,-8 20,-2 8,2" fill="#141418" stroke="${auraCol}" stroke-width="1.2"/>
    <circle cx="2" cy="2" r="9" fill="#f4c095" stroke="#141418" stroke-width="1.5"/>
  </g>`;

  const svgs = {
    benchpress: `<svg viewBox="0 0 260 125" width="235" height="120">${bg}
      <rect x="65" y="84" width="115" height="10" rx="4" fill="#4a4e69"/>
      <line x1="80" y1="94" x2="80" y2="112" stroke="#8d99ae" stroke-width="6"/>
      <line x1="165" y1="94" x2="165" y2="112" stroke="#8d99ae" stroke-width="6"/>
      <polyline points="155,80 185,84 195,110" stroke="#1d3557" stroke-width="12" fill="none" stroke-linecap="round"/>
      <path d="M95,78 L155,78" stroke="url(#giGrad)" stroke-width="15" stroke-linecap="round"/>
      <line x1="120" y1="74" x2="120" y2="34" stroke="#f4c095" stroke-width="9" stroke-linecap="round"/>
      <line x1="88" y1="34" x2="152" y2="34" stroke="#adb5bd" stroke-width="5" stroke-linecap="round"/>
      <rect x="82" y="22" width="10" height="24" rx="2" fill="${auraCol}"/>
      <rect x="148" y="22" width="10" height="24" rx="2" fill="${auraCol}"/>
      ${hair(78, 72, -80)}</svg>`,
    dumbbellcurl: `<svg viewBox="0 0 260 125" width="235" height="120">${bg}
      <polyline points="118,76 108,108" stroke="#1d3557" stroke-width="13" stroke-linecap="round"/>
      <polyline points="134,76 144,108" stroke="#1d3557" stroke-width="13" stroke-linecap="round"/>
      <path d="M126,40 L126,76" stroke="url(#giGrad)" stroke-width="18" stroke-linecap="round"/>
      <polyline points="132,46 154,64 166,44" stroke="#f4c095" stroke-width="9" stroke-linecap="round" fill="none"/>
      <line x1="154" y1="44" x2="178" y2="44" stroke="#adb5bd" stroke-width="5"/>
      <rect x="150" y="36" width="7" height="16" rx="2" fill="${auraCol}"/>
      <rect x="175" y="36" width="7" height="16" rx="2" fill="${auraCol}"/>
      ${hair(126, 23, 0)}</svg>`,
    pushup: `<svg viewBox="0 0 260 125" width="235" height="120">${bg}
      <path d="M48,106 L108,88 L164,66" stroke="#1d3557" stroke-width="13" stroke-linecap="round" fill="none"/>
      <path d="M108,88 L166,65" stroke="url(#giGrad)" stroke-width="16" stroke-linecap="round" fill="none"/>
      <path d="M162,68 L156,90 L164,108" stroke="#f4c095" stroke-width="9" stroke-linecap="round" fill="none"/>
      ${hair(182, 58, 18)}</svg>`,
    kneepushup: `<svg viewBox="0 0 260 125" width="235" height="120">${bg}
      <polyline points="42,92 84,106 122,82" stroke="#1d3557" stroke-width="13" stroke-linecap="round" fill="none"/>
      <path d="M122,82 L172,62" stroke="url(#giGrad)" stroke-width="16" stroke-linecap="round"/>
      <path d="M168,65 L164,90 L170,108" stroke="#f4c095" stroke-width="9" stroke-linecap="round" fill="none"/>
      ${hair(188, 54, 18)}</svg>`,
    dips: `<svg viewBox="0 0 260 125" width="235" height="120">${bg}
      <polyline points="55,110 55,64 95,64 95,110" stroke="#555" stroke-width="5" fill="none"/>
      <polyline points="124,84 162,86 184,108" stroke="#1d3557" stroke-width="13" stroke-linecap="round" fill="none"/>
      <path d="M116,46 L124,84" stroke="url(#giGrad)" stroke-width="16" stroke-linecap="round"/>
      <polyline points="116,48 92,62" stroke="#f4c095" stroke-width="8" stroke-linecap="round" fill="none"/>
      ${hair(116, 30, 0)}</svg>`,
    plank: `<svg viewBox="0 0 260 125" width="235" height="120">${bg}
      <path d="M45,104 L112,88 L174,74" stroke="#1d3557" stroke-width="13" stroke-linecap="round" fill="none"/>
      <path d="M112,88 L176,73" stroke="url(#giGrad)" stroke-width="16" stroke-linecap="round" fill="none"/>
      <polyline points="172,76 168,104 190,104" stroke="#f4c095" stroke-width="9" stroke-linecap="round" fill="none"/>
      ${hair(194, 68, 12)}</svg>`,
    situp: `<svg viewBox="0 0 260 125" width="235" height="120">${bg}
      <polyline points="126,104 162,74 188,106" stroke="#1d3557" stroke-width="13" stroke-linecap="round" fill="none"/>
      <path d="M126,104 L104,58" stroke="url(#giGrad)" stroke-width="17" stroke-linecap="round"/>
      ${hair(98, 42, -18)}</svg>`,
    legraise: `<svg viewBox="0 0 260 125" width="235" height="120">${bg}
      <path d="M68,104 L124,104" stroke="url(#giGrad)" stroke-width="16" stroke-linecap="round"/>
      <path d="M124,104 L176,46" stroke="#1d3557" stroke-width="13" stroke-linecap="round"/>
      ${hair(52, 98, -75)}</svg>`,
    squat: `<svg viewBox="0 0 260 125" width="235" height="120">${bg}
      <polyline points="122,76 154,84 134,108" stroke="#1d3557" stroke-width="13" stroke-linecap="round" fill="none"/>
      <path d="M128,42 L120,76" stroke="url(#giGrad)" stroke-width="17" stroke-linecap="round"/>
      ${hair(130, 26, 0)}</svg>`,
    lunge: `<svg viewBox="0 0 260 125" width="235" height="120">${bg}
      <polyline points="124,74 162,76 162,108" stroke="#1d3557" stroke-width="13" stroke-linecap="round" fill="none"/>
      <polyline points="124,74 96,102 72,104" stroke="#1d3557" stroke-width="12" stroke-linecap="round" fill="none"/>
      <path d="M124,38 L124,74" stroke="url(#giGrad)" stroke-width="17" stroke-linecap="round"/>
      ${hair(124, 22, 0)}</svg>`,
    wallsit: `<svg viewBox="0 0 260 125" width="235" height="120">${bg}
      <line x1="94" y1="14" x2="94" y2="112" stroke="${auraCol}" stroke-width="5" stroke-linecap="round"/>
      <polyline points="104,76 146,76 146,108" stroke="#1d3557" stroke-width="13" stroke-linecap="round" fill="none"/>
      <path d="M104,38 L104,76" stroke="url(#giGrad)" stroke-width="17" stroke-linecap="round"/>
      ${hair(106, 22, 0)}</svg>`,
    punch: `<svg viewBox="0 0 260 125" width="235" height="120">${bg}
      <polyline points="104,76 86,108" stroke="#1d3557" stroke-width="13" stroke-linecap="round"/>
      <polyline points="108,76 130,108" stroke="#1d3557" stroke-width="13" stroke-linecap="round"/>
      <path d="M106,40 L106,76" stroke="url(#giGrad)" stroke-width="18" stroke-linecap="round"/>
      <line x1="108" y1="48" x2="174" y2="46" stroke="#f4c095" stroke-width="9" stroke-linecap="round"/>
      <polygon points="188,46 218,36 208,46 218,56" fill="${auraCol}"/>
      ${hair(106, 24, 0)}</svg>`,
    jump: `<svg viewBox="0 0 260 125" width="235" height="120">${bg}
      <polyline points="128,68 108,94" stroke="#1d3557" stroke-width="12" stroke-linecap="round"/>
      <polyline points="132,68 152,94" stroke="#1d3557" stroke-width="12" stroke-linecap="round"/>
      <path d="M130,34 L130,68" stroke="url(#giGrad)" stroke-width="17" stroke-linecap="round"/>
      ${hair(130, 19, 0)}</svg>`
  };
  return Reflect.get(svgs, pose) || svgs.punch;
}
const _croppedCache = new Map();

function cleanImageBg(imgEl, baseName) {
  try {
    if (_croppedCache.has(baseName)) {
      imgEl.dataset.cleaned = baseName;
      imgEl.classList.add("clean-alpha");
      imgEl.src = _croppedCache.get(baseName);
      return;
    }
    const w = imgEl.naturalWidth;
    const h = imgEl.naturalHeight;
    if (!w || !h) return;
    const cv = document.createElement("canvas");
    cv.width = w; cv.height = h;
    const ctx = cv.getContext("2d");
    ctx.drawImage(imgEl, 0, 0);
    const img = ctx.getImageData(0, 0, w, h);
    const d = img.data;
    const r0 = d.at(0), g0 = d.at(1), b0 = d.at(2), a0 = d.at(3);
    const isWhite = a0 > 200 && r0 > 215 && g0 > 215 && b0 > 215;
    const isBlack = a0 > 200 && r0 < 45 && g0 < 45 && b0 < 45;
    if (isWhite || isBlack) {
      const vis = new Uint8Array(w * h);
      const q = new Int32Array(w * h);
      let head = 0, tail = 0;
      const push = (x, y) => {
        if (x < 0 || x >= w || y < 0 || y >= h) return;
        const p = y * w + x;
        if (vis.at(p)) return;
        const i = p * 4;
        if (isWhite) {
          const mn = Math.min(d.at(i), d.at(i + 1), d.at(i + 2));
          if (mn > 220) { vis.set(Array.of(1), p); q.set(Array.of(p), tail++); }
          else if (mn > 190) { d.set(Array.of(Math.min(d.at(i + 3), (224 - mn) * 8)), i + 3); }
        } else {
          const mx = Math.max(d.at(i), d.at(i + 1), d.at(i + 2));
          if (mx < 36) { vis.set(Array.of(1), p); q.set(Array.of(p), tail++); }
          else if (mx < 62) { d.set(Array.of(Math.min(d.at(i + 3), (mx - 34) * 9)), i + 3); }
        }
      };
      for (let x = 0; x < w; x++) { push(x, 0); push(x, h - 1); }
      for (let y = 0; y < h; y++) { push(0, y); push(w - 1, y); }
      while (head < tail) {
        const p = q.at(head++);
        d.set(Array.of(0), p * 4 + 3);
        const x = p % w, y = (p - x) / w;
        push(x + 1, y); push(x - 1, y); push(x, y + 1); push(x, y - 1);
      }
      ctx.putImageData(img, 0, 0);
    }
    let minX = w, minY = h, maxX = 0, maxY = 0;
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (d.at((y * w + x) * 4 + 3) > 20) {
          if (x < minX) minX = x; if (x > maxX) maxX = x;
          if (y < minY) minY = y; if (y > maxY) maxY = y;
        }
      }
    }
    if (maxX > minX && maxY > minY) {
      const cropW = maxX - minX + 1, cropH = maxY - minY + 1;
      const cropCv = document.createElement("canvas");
      cropCv.width = cropW; cropCv.height = cropH;
      cropCv.getContext("2d").drawImage(cv, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
      const dataUrl = cropCv.toDataURL("image/png");
      _croppedCache.set(baseName, dataUrl);
      imgEl.dataset.cleaned = baseName;
      imgEl.classList.add("clean-alpha");
      imgEl.src = dataUrl;
    }
  } catch (e) {}
}

function loadSmartImage(imgEl, baseName, onFail, onSuccess) {
  if (!imgEl) return;
  imgEl.dataset.targetBase = baseName;
  if (_croppedCache.has(baseName)) {
    imgEl.dataset.cleaned = baseName;
    imgEl.classList.add("clean-alpha");
    imgEl.src = _croppedCache.get(baseName);
    imgEl.style.display = "block";
    if (onSuccess) onSuccess();
    return;
  }
  imgEl.removeAttribute("src");
  imgEl.style.display = "none";
  imgEl.classList.remove("clean-alpha");
  imgEl.dataset.cleaned = "";
  imgEl.onload = () => {
    if (imgEl.dataset.targetBase !== baseName) return;
    if (baseName.startsWith("c") && imgEl.dataset.cleaned !== baseName) cleanImageBg(imgEl, baseName);
    imgEl.style.display = "block";
    if (onSuccess) onSuccess();
  };
  imgEl.onerror = () => {
    if (imgEl.dataset.targetBase !== baseName) return;
    imgEl.onerror = () => {
      if (imgEl.dataset.targetBase !== baseName) return;
      imgEl.style.display = "none";
      imgEl.removeAttribute("src");
      if (onFail) onFail();
    };
    imgEl.src = `${baseName}.jpg`;
  };
  imgEl.src = `${baseName}.png`;
}

setTimeout(() => {
  CHARACTERS.forEach(c => {
    const pre = new Image();
    loadSmartImage(pre, `c${c.id}_s1`);
  });
}, 350);
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
  const cPrev = CHARACTERS.at(idxPrev), cCurr = CHARACTERS.at(idxCurr), cNext = CHARACTERS.at(idxNext);

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

  const trio = Array.of(cPrev, cCurr, cNext);
  Array.of("prev", "curr", "next").forEach((pos, i) => {
    const charObj = trio.at(i);
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
  if (e.touches && e.touches.length > 0) { touchStartY = e.touches.item(0).clientY; isSwiping = true; }
}, { passive: true });
carouselEl.addEventListener("touchmove", e => { if (isSwiping) e.preventDefault(); }, { passive: false });
carouselEl.addEventListener("touchend", e => {
  if (!isSwiping || !e.changedTouches || e.changedTouches.length === 0) return;
  isSwiping = false;
  const diff = touchStartY - e.changedTouches.item(0).clientY;
  if (Math.abs(diff) > 25) stepCarousel(diff > 0 ? 1 : -1);
});

document.getElementById("card-prev").addEventListener("click", () => stepCarousel(-1));
document.getElementById("card-next").addEventListener("click", () => stepCarousel(1));
document.getElementById("card-curr").addEventListener("click", () => {
  playSound("click");
  openCharacterDetails(CHARACTERS.at(state.carouselIndex).id);
});

function openCharacterDetails(charId) {
  const c = CHARACTERS.find(item => item.id === charId) || CHARACTERS.at(0);
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
  const activePart = state.selectedPart === "core" ? BODY_WORKOUTS.core : (state.selectedPart === "legs" ? BODY_WORKOUTS.legs : BODY_WORKOUTS.arms);
  document.getElementById("selected-part-title").textContent = activePart.label;
  const list = document.getElementById("workout-list");
  list.innerHTML = "";
  const exercises = state.difficulty === "master" ? activePart.master : (state.difficulty === "advanced" ? activePart.advanced : activePart.easy);
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
    t4: (state.streak || 0) >= 3, t5: coreLvl >= 3, t6: (state.testedChars || Array.of()).length >= 5
  };
  const grid = document.getElementById("trophy-list");
  if (!grid) return;
  grid.innerHTML = "";
  TROPHIES.forEach(t => {
    const ok = !!Reflect.get(unlockedMap, t.id);
    const div = document.createElement("div");
    div.className = `trophy-item ${ok ? "unlocked" : ""}`;
    div.innerHTML = `<div style="font-size:1.3rem;">${ok ? t.icon : "🔒"} ${t.name}</div><div style="font-size:0.75rem;color:#aaa;">${t.desc}</div>`;
    grid.appendChild(div);
  });
}

function triggerKiImpact(intense = false) {
  const charObj = CHARACTERS.find(c => c.id === state.selectedChar) || CHARACTERS.at(0);
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
  if (!Array.isArray(state.testedChars)) state.testedChars = Array.of();
  if (!state.testedChars.includes(state.selectedChar)) state.testedChars.push(state.selectedChar);

  state.xp += finalXP;
  state.powerLevel += finalPower;
  const prevPartXP = Reflect.get(state.partXP, state.selectedPart) || 0;
  Reflect.set(state.partXP, state.selectedPart, prevPartXP + finalXP);

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

  const charObj = CHARACTERS.find(c => c.id === state.selectedChar) || CHARACTERS.at(0);
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
  const boss = BOSS_CHALLENGES.at((state.bossWins || 0) % BOSS_CHALLENGES.length);
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
(function initDbzLegendsSystem() {
  const MIN_EXERCISE_SEC = 15;
  const EXERCISES_PER_TICKET = 2;
  const MAX_TICKETS_PER_DAY = 4;

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

  const ticketModal = document.createElement("div");
  ticketModal.id = "ticket-unlock-modal";
  ticketModal.className = "levelup-overlay hidden";
  ticketModal.innerHTML = `
    <div class="levelup-card" style="max-width: 350px; border-color:#ffb703;">
      <span class="orange-tag">🐉 TURNIER-PORTAL GEÖFFNET</span>
      <h2 id="ticket-modal-title" class="tall-orange-title small">WELT-LEVEL 1</h2>
      <p id="ticket-modal-desc" class="poster-copy center" style="color:#fff;">
        Training erledigt! Starte jetzt deinen HD-Kampf!
      </p>
      <button id="ticket-play-now" class="tall-orange-btn">⚔️ JETZT KÄMPFEN!</button>
      <button id="ticket-later-btn" class="reset-link">Später spielen</button>
    </div>
  `;
  document.body.appendChild(ticketModal);

  const battleModal = document.createElement("div");
  battleModal.id = "battle-modal";
  battleModal.className = "levelup-overlay hidden";
  battleModal.innerHTML = `
    <div class="levelup-card" style="max-width: 390px; padding: 14px; border-color:#ffb703;">
      <div class="gta-wanted-bar">
        <span id="gta-mode-label" class="gta-mode-tag">TURNIER DER KRAFT</span>
        <div class="gta-right">
          <span id="gta-stars-label" class="gta-stars">★☆☆☆☆</span>
          <button id="lg-mute-btn" class="lg-mute-btn" type="button" aria-pressed="false" aria-label="Kampf-Sound stummschalten">🔊</button>
        </div>
      </div>
      <div class="legends-hud">
        <div>
          <div id="lg-hero-name" class="legends-name">SON-BLITZ</div>
          <div class="hp-wrap"><div id="lg-hero-hp" class="hp-fill"></div></div>
        </div>
        <span id="battle-stage-tag" class="orange-tag">LVL 1</span>
        <div style="text-align:right;">
          <div id="lg-enemy-name" class="legends-name">GEGNER</div>
          <div class="hp-wrap"><div id="lg-enemy-hp" class="hp-fill enemy"></div></div>
        </div>
      </div>
      <canvas id="legends-canvas" width="356" height="245"></canvas>
      <div class="ki-charge-row">
        <span style="font-family:'Anton';font-size:0.8rem;color:#ffb703;">KI</span>
        <div class="ki-charge-track"><div id="lg-ki-fill" class="ki-charge-fill"></div></div>
        <span id="lg-ki-num" style="font-family:'Anton';font-size:0.8rem;color:#fff;">55</span>
      </div>
      <div id="lg-controls-area" class="legends-cards"></div>
      <button id="lg-charge-btn" class="timer-btn" style="width:100%;margin-top:4px;">⚡ KI AUFLADEN (+30 KI)</button>
      <button id="battle-close-btn" class="reset-link">Arena verlassen</button>
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
      completeBtn.textContent = "⏳ ERST TIMER BEENDEN";
      const timerBtn = document.getElementById("ex-timer-start");
      const origClick = timerBtn.onclick;
      timerBtn.onclick = function () {
        if (origClick) origClick();
        let left = ex.sec;
        window._paceGuardInterval = setInterval(() => {
          left -= 1;
          if (left <= 0) {
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
        document.getElementById("ticket-modal-title").textContent = `WELT-LEVEL ${state.campaignStage}`;
        document.getElementById("ticket-modal-desc").textContent = `Ticket ${state.dailyTicketsEarned}/${MAX_TICKETS_PER_DAY} heute frei! Starte den Kampf!`;
        document.getElementById("ticket-play-now").classList.remove("hidden");
        ticketModal.classList.remove("hidden");
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
      campBtn.textContent = `🐉 KAMPF! (${state.battleTickets}x)`;
    } else if (state.dailyTicketsEarned >= MAX_TICKETS_PER_DAY) {
      campBtn.className = "hud-chip";
      campBtn.style.opacity = "0.5";
      campBtn.textContent = `🐉 LIMIT (4/4)`;
    } else {
      campBtn.className = "hud-chip";
      campBtn.style.opacity = "1";
      campBtn.textContent = `🐉 KAMPF (${progress}/${EXERCISES_PER_TICKET})`;
    }
  };
  // ===== KAMPF-GRAFIK (Parallax-Hintergrund, Aura, Energiestrahlen) =====
  const TAU = Math.PI * 2;

  function hexToRgba(hex, a) {
    const h = String(hex || "#ffffff").replace("#", "");
    const full = h.length === 3 ? h.split("").map(c => c + c).join("") : h.padEnd(6, "f");
    const n = parseInt(full.slice(0, 6), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  }

  // Eigene Arena-Bilder (arena_1.jpg bis arena_3.jpg) haben Vorrang – erst beim ersten Kampf laden
  let arenaImages = null;
  function getArenaImage(world) {
    if (!arenaImages) {
      arenaImages = Array.of(1, 2, 3).map(n => {
        const img = new Image();
        img.src = `arena_${n}.jpg`;
        return img;
      });
    }
    const img = arenaImages.at(world);
    return img && img.complete && img.naturalWidth > 0 ? img : null;
  }

  const STAGE_THEMES = Array.of(
    { // 0: Weltraum-Turnier
      sky: Array.of("#2a1250", "#150c2c", "#07070c"), stars: 1,
      sun: { x: 0.78, y: 0.2, r: 19, core: "#f3e8ff", col: "#c77dff" },
      hills: Array.of("#3a2d5c", "#2a2142", "#18132a"), haze: "#7b5cc4",
      ground: Array.of("#2c283d", "#1b1926", "#0b0a10"), grid: "#b980ff"
    },
    { // 1: Canyon im Sonnenuntergang
      sky: Array.of("#1d3557", "#c06c5a", "#f4a261"), stars: 0.45,
      sun: { x: 0.7, y: 0.5, r: 30, core: "#fff3d6", col: "#ff9e5e" },
      hills: Array.of("#a86a45", "#7a4528", "#4f2a17"), haze: "#f4a261",
      ground: Array.of("#9c6644", "#6f452c", "#2b1910"), grid: "#ffd2a0"
    },
    { // 2: Grüne Planeten-Ebene
      sky: Array.of("#0b525b", "#1b9aaa", "#72efdd"), stars: 0.3,
      sun: { x: 0.24, y: 0.22, r: 22, core: "#ffffff", col: "#fffbe0" },
      hills: Array.of("#3fb5a5", "#228277", "#145a52"), haze: "#9ff5e6",
      ground: Array.of("#2ec4b6", "#1b7a6e", "#0a2e2a"), grid: "#d6fff6"
    }
  );

  const STAR_FIELD = Array.from({ length: 70 }, (_, i) => ({
    x: Math.random(), y: Math.random() * 0.6,
    s: 0.6 + Math.random() * 1.6, ph: Math.random() * TAU,
    sp: 0.6 + Math.random() * 1.8, big: i % 9 === 0
  }));

  function ridge(x, seed) {
    return Math.sin(x * 0.011 + seed) * 0.5
      + Math.sin(x * 0.027 + seed * 2.3) * 0.3
      + Math.sin(x * 0.063 + seed * 4.1) * 0.2;
  }

  function drawVignette(ctx, w, h) {
    const vg = ctx.createRadialGradient(w * 0.5, h * 0.48, h * 0.3, w * 0.5, h * 0.5, w * 0.72);
    vg.addColorStop(0, "rgba(0, 0, 0, 0)");
    vg.addColorStop(1, "rgba(0, 0, 0, 0.68)");
    ctx.fillStyle = vg;
    ctx.fillRect(0, 0, w, h);
  }

  function drawStageBackground(ctx, w, h, scrollX, worldIdx, t) {
    const world = ((worldIdx % 3) + 3) % 3;

    const custom = getArenaImage(world);
    if (custom) {
      const s = Math.max(w / custom.naturalWidth, h / custom.naturalHeight);
      const dw = custom.naturalWidth * s, dh = custom.naturalHeight * s;
      ctx.drawImage(custom, (w - dw) / 2, (h - dh) / 2, dw, dh);
      drawVignette(ctx, w, h);
      return;
    }

    const th = STAGE_THEMES.at(world);
    const groundY = h * 0.68;

    // Himmel
    const sky = ctx.createLinearGradient(0, 0, 0, groundY);
    th.sky.forEach((c, i) => sky.addColorStop(i / (th.sky.length - 1), c));
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, w, h);

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // Funkelnde Sterne (minimaler Parallax)
    STAR_FIELD.forEach(st => {
      const tw = 0.5 + 0.5 * Math.sin(t * 0.003 * st.sp + st.ph);
      const a = th.stars * (0.25 + tw * 0.75);
      if (a < 0.04) return;
      const sx = (((st.x * w - scrollX * 0.03) % w) + w) % w;
      const sy = st.y * h;
      ctx.fillStyle = `rgba(255, 255, 255, ${a})`;
      ctx.beginPath(); ctx.arc(sx, sy, st.s * (0.7 + tw * 0.5), 0, TAU); ctx.fill();
      if (st.big && tw > 0.6) {
        ctx.strokeStyle = `rgba(255, 255, 255, ${a * 0.6})`;
        ctx.lineWidth = 0.8;
        const L = 4 + tw * 4;
        ctx.beginPath();
        ctx.moveTo(sx - L, sy); ctx.lineTo(sx + L, sy);
        ctx.moveTo(sx, sy - L); ctx.lineTo(sx, sy + L);
        ctx.stroke();
      }
    });

    // Große Sonne mit Glow
    const sun = th.sun;
    const sunX = sun.x * w + Math.sin(scrollX * 0.002) * 6;
    const sunY = sun.y * h;
    const glowR = sun.r * (4.2 + Math.sin(t / 700) * 0.3);
    const glow = ctx.createRadialGradient(sunX, sunY, sun.r * 0.6, sunX, sunY, glowR);
    glow.addColorStop(0, hexToRgba(sun.col, 0.55));
    glow.addColorStop(0.4, hexToRgba(sun.col, 0.18));
    glow.addColorStop(1, hexToRgba(sun.col, 0));
    ctx.fillStyle = glow;
    ctx.beginPath(); ctx.arc(sunX, sunY, glowR, 0, TAU); ctx.fill();
    ctx.restore();

    const disc = ctx.createRadialGradient(sunX - sun.r * 0.25, sunY - sun.r * 0.25, 1, sunX, sunY, sun.r);
    disc.addColorStop(0, sun.core);
    disc.addColorStop(1, sun.col);
    ctx.fillStyle = disc;
    ctx.beginPath(); ctx.arc(sunX, sunY, sun.r, 0, TAU); ctx.fill();

    // Drei Bergschichten mit unterschiedlicher Scroll-Geschwindigkeit
    const LAYERS = Array.of(
      { speed: 0.08, base: 74, amp: 26, seed: 1.7, haze: 0.45 },
      { speed: 0.2, base: 50, amp: 20, seed: 4.2, haze: 0.22 },
      { speed: 0.45, base: 28, amp: 13, seed: 8.9, haze: 0 }
    );
    LAYERS.forEach((L, i) => {
      const off = scrollX * L.speed;
      ctx.beginPath();
      ctx.moveTo(0, groundY + 1);
      for (let x = 0; x <= w + 6; x += 6) {
        ctx.lineTo(x, groundY - L.base - ridge(x + off, L.seed) * L.amp);
      }
      ctx.lineTo(w, groundY + 1);
      ctx.closePath();
      const mg = ctx.createLinearGradient(0, groundY - L.base - L.amp, 0, groundY);
      mg.addColorStop(0, th.hills.at(i));
      mg.addColorStop(1, hexToRgba(th.haze, 0.2 + L.haze * 0.5));
      ctx.fillStyle = th.hills.at(i);
      ctx.fill();
      ctx.fillStyle = mg;
      ctx.globalAlpha = 0.35 + L.haze;
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.strokeStyle = "rgba(255, 255, 255, 0.1)";
      ctx.lineWidth = 1;
      ctx.stroke();
    });

    // Boden
    const ground = ctx.createLinearGradient(0, groundY, 0, h);
    th.ground.forEach((c, i) => ground.addColorStop(i / (th.ground.length - 1), c));
    ctx.fillStyle = ground;
    ctx.fillRect(0, groundY, w, h - groundY);

    // Scrollendes Perspektiv-Gitter
    ctx.save();
    ctx.beginPath(); ctx.rect(0, groundY, w, h - groundY); ctx.clip();
    const gridFade = ctx.createLinearGradient(0, groundY, 0, h);
    gridFade.addColorStop(0, hexToRgba(th.grid, 0));
    gridFade.addColorStop(1, hexToRgba(th.grid, 0.38));
    ctx.strokeStyle = gridFade;
    ctx.lineWidth = 1;
    const vx = w * 0.5, spacing = 34, squeeze = 0.12;
    const gOff = ((scrollX % spacing) + spacing) % spacing;
    ctx.beginPath();
    for (let xb = -w * 1.6 - gOff; xb <= w * 2.6; xb += spacing) {
      ctx.moveTo(vx + (xb - vx) * squeeze, groundY);
      ctx.lineTo(xb, h);
    }
    for (let k = 1; k <= 7; k++) {
      const y = groundY + (h - groundY) * Math.pow(k / 7, 1.8);
      ctx.moveTo(0, y); ctx.lineTo(w, y);
    }
    ctx.stroke();
    ctx.restore();

    // Leuchtende Horizontlinie
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    ctx.strokeStyle = hexToRgba(th.grid, 0.55);
    ctx.lineWidth = 1.5;
    ctx.beginPath(); ctx.moveTo(0, groundY); ctx.lineTo(w, groundY); ctx.stroke();
    ctx.restore();

    drawVignette(ctx, w, h);
  }

  // Leuchtrand: einfarbige Silhouette einmal pro Bild/Farbe vorberechnen
  function getRimSprite(img, color, dw, dh) {
    const key = `${img.src}|${color}|${Math.round(dw)}x${Math.round(dh)}`;
    if (img._rimKey === key) return img._rimCanvas;
    const c = document.createElement("canvas");
    c.width = Math.max(1, Math.round(dw * 2));
    c.height = Math.max(1, Math.round(dh * 2));
    const g = c.getContext("2d");
    g.drawImage(img, 0, 0, c.width, c.height);
    g.globalCompositeOperation = "source-in";
    g.fillStyle = color;
    g.fillRect(0, 0, c.width, c.height);
    img._rimKey = key;
    img._rimCanvas = c;
    return c;
  }

  // Figur im Original-Seitenverhältnis, Füße auf feetY
  function drawFighterUnstretched(ctx, img, cx, feetY, opts) {
    const { color = "#ffb703", flip = false, t = 0, maxW = 84, maxH = 115 } = opts || {};
    const ready = !!(img && img.complete && img.naturalWidth > 0);
    let dw = maxW * 0.72, dh = maxH;
    if (ready) {
      const s = Math.min(maxW / img.naturalWidth, maxH / img.naturalHeight);
      dw = img.naturalWidth * s;
      dh = img.naturalHeight * s;
    }
    const midY = feetY - dh * 0.5;

    ctx.save();
    ctx.globalCompositeOperation = "lighter";

    // Boden-Schein
    const fg = ctx.createRadialGradient(cx, feetY, 2, cx, feetY, dw * 0.8);
    fg.addColorStop(0, hexToRgba(color, 0.45));
    fg.addColorStop(1, hexToRgba(color, 0));
    ctx.save();
    ctx.translate(cx, feetY); ctx.scale(1, 0.25); ctx.translate(-cx, -feetY);
    ctx.fillStyle = fg;
    ctx.beginPath(); ctx.arc(cx, feetY, dw * 0.8, 0, TAU); ctx.fill();
    ctx.restore();

    // Pulsierende Aura
    const pulse = 1 + Math.sin(t / 110) * 0.06;
    const rx = dw * 0.78 * pulse;
    const ry = dh * 0.64 * pulse;
    const ag = ctx.createRadialGradient(cx, midY, 2, cx, midY, rx);
    ag.addColorStop(0, "rgba(255, 255, 255, 0.32)");
    ag.addColorStop(0.45, hexToRgba(color, 0.42));
    ag.addColorStop(1, hexToRgba(color, 0));
    ctx.save();
    ctx.translate(cx, midY); ctx.scale(1, ry / rx); ctx.translate(-cx, -midY);
    ctx.fillStyle = ag;
    ctx.beginPath(); ctx.arc(cx, midY, rx, 0, TAU); ctx.fill();
    ctx.restore();

    // Aufsteigende Aura-Flammen
    const N = 16;
    for (let i = 0; i < N; i++) {
      const phase = ((t / 720 + i * 0.618) % 1 + 1) % 1;
      const side = Math.sin(i * 12.9898);
      const fx = cx + side * dw * 0.46 + Math.sin(t / 140 + i * 1.7) * 3 * (1 - phase);
      const fy = feetY - phase * dh * 1.12;
      const size = (1 - phase) * dw * 0.2 + 2.5;
      const alpha = Math.sin(phase * Math.PI) * 0.6;
      const flame = ctx.createRadialGradient(fx, fy, 0, fx, fy, size);
      flame.addColorStop(0, `rgba(255, 255, 255, ${alpha * 0.8})`);
      flame.addColorStop(0.4, hexToRgba(color, alpha));
      flame.addColorStop(1, hexToRgba(color, 0));
      ctx.save();
      ctx.translate(fx, fy); ctx.scale(0.6, 1.5); ctx.translate(-fx, -fy);
      ctx.fillStyle = flame;
      ctx.beginPath(); ctx.arc(fx, fy, size, 0, TAU); ctx.fill();
      ctx.restore();
    }
    ctx.restore();

    if (!ready) return;

    // Atem-Animation (Squash & Stretch), Anker an den Füßen
    const breath = Math.sin(t / 320);
    const sx = 1 - breath * 0.018;
    const sy = 1 + breath * 0.028;

    ctx.save();
    ctx.translate(cx, feetY);
    ctx.scale(flip ? -sx : sx, sy);

    // Leuchtrand
    const rim = getRimSprite(img, color, dw, dh);
    ctx.globalCompositeOperation = "lighter";
    ctx.globalAlpha = 0.5 + 0.25 * Math.sin(t / 150);
    for (let k = 0; k < 8; k++) {
      const ox = Math.cos((k / 8) * TAU) * 2.2;
      const oy = Math.sin((k / 8) * TAU) * 2.2;
      ctx.drawImage(rim, -dw / 2 + ox, -dh + oy, dw, dh);
    }
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = "source-over";
    ctx.drawImage(img, -dw / 2, -dh, dw, dh);
    ctx.restore();
  }

  // Energiestrahl von x1 nach x2 (Strahlkopf bei x2)
  function drawBeam(ctx, x1, x2, y, dicke, farbe, t) {
    const len = x2 - x1;
    if (Math.abs(len) < 1 || dicke <= 0) return;
    const steps = Math.max(6, Math.ceil(Math.abs(len) / 9));
    const th = dicke * (1 + Math.sin(t / 45) * 0.08);

    const tracePath = (amp) => {
      ctx.beginPath();
      for (let i = 0; i <= steps; i++) {
        const f = i / steps;
        const wob = (Math.sin(f * 9 - t / 40) * 0.7 + Math.sin(f * 23 + t / 27) * 0.3) * amp * f;
        if (i === 0) ctx.moveTo(x1, y);
        else ctx.lineTo(x1 + len * f, y + wob);
      }
    };

    ctx.save();
    ctx.lineCap = "round";
    ctx.lineJoin = "round";
    ctx.globalCompositeOperation = "lighter";

    const LAYERS = Array.of(
      { w: 2.4, col: hexToRgba(farbe, 0.16), amp: 0.16 },
      { w: 1.6, col: hexToRgba(farbe, 0.32), amp: 0.13 },
      { w: 1.0, col: hexToRgba(farbe, 0.8), amp: 0.1 },
      { w: 0.55, col: "rgba(255, 255, 255, 0.75)", amp: 0.07 },
      { w: 0.28, col: "#ffffff", amp: 0.05 }
    );
    LAYERS.forEach(L => {
      tracePath(th * L.amp);
      ctx.strokeStyle = L.col;
      ctx.lineWidth = th * L.w;
      ctx.stroke();
    });

    // Mündungsfeuer am Start
    const mr = th * 0.9;
    const mg = ctx.createRadialGradient(x1, y, 0, x1, y, mr);
    mg.addColorStop(0, "rgba(255, 255, 255, 0.9)");
    mg.addColorStop(1, hexToRgba(farbe, 0));
    ctx.fillStyle = mg;
    ctx.beginPath(); ctx.arc(x1, y, mr, 0, TAU); ctx.fill();

    // Leuchtender Strahlkopf
    const hr = th * (1.15 + Math.sin(t / 35) * 0.12);
    const hg = ctx.createRadialGradient(x2, y, 0, x2, y, hr * 1.8);
    hg.addColorStop(0, "rgba(255, 255, 255, 1)");
    hg.addColorStop(0.3, hexToRgba(farbe, 0.85));
    hg.addColorStop(1, hexToRgba(farbe, 0));
    ctx.fillStyle = hg;
    ctx.beginPath(); ctx.arc(x2, y, hr * 1.8, 0, TAU); ctx.fill();

    ctx.strokeStyle = "rgba(255, 255, 255, 0.55)";
    ctx.lineWidth = 1.4;
    ctx.beginPath();
    for (let k = 0; k < 8; k++) {
      const ang = (k / 8) * TAU + t / 300;
      const r2 = hr * (1.35 + 0.45 * Math.sin(t / 60 + k * 2.1));
      ctx.moveTo(x2 + Math.cos(ang) * hr * 0.5, y + Math.sin(ang) * hr * 0.5);
      ctx.lineTo(x2 + Math.cos(ang) * r2, y + Math.sin(ang) * r2);
    }
    ctx.stroke();
    ctx.restore();
  }
  // ===== KAMPF-SOUNDS (Web Audio API, synthetisch – keine Dateien nötig) =====
  // Eigener Schlüssel, damit "zwarriors_neon_v10" unverändert bleibt
  const SFX_MUTE_KEY = "zkrieger_kampf_stumm";
  let fightMuted = localStorage.getItem(SFX_MUTE_KEY) === "1";
  let noiseBuffer = null;

  function getNoiseBuffer(ac) {
    if (noiseBuffer && noiseBuffer.sampleRate === ac.sampleRate) return noiseBuffer;
    const len = Math.floor(ac.sampleRate * 1.3);
    noiseBuffer = ac.createBuffer(1, len, ac.sampleRate);
    noiseBuffer.copyToChannel(Float32Array.from({ length: len }, () => Math.random() * 2 - 1), 0);
    return noiseBuffer;
  }

  function sfxNoise(ac, out, { start, dur, type = "lowpass", f0, f1, q = 1, vol }) {
    const src = ac.createBufferSource();
    src.buffer = getNoiseBuffer(ac);
    const flt = ac.createBiquadFilter();
    flt.type = type;
    flt.Q.value = q;
    flt.frequency.setValueAtTime(f0, start);
    flt.frequency.exponentialRampToValueAtTime(f1, start + dur);
    const g = ac.createGain();
    g.gain.setValueAtTime(vol, start);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    src.connect(flt); flt.connect(g); g.connect(out);
    src.start(start); src.stop(start + dur + 0.03);
  }

  function sfxTone(ac, out, { start, dur, type = "sine", f0, f1, vol, attack = 0.005, vibrato = 0 }) {
    const osc = ac.createOscillator();
    osc.type = type;
    osc.frequency.setValueAtTime(f0, start);
    if (f1) osc.frequency.exponentialRampToValueAtTime(f1, start + dur);
    if (vibrato) {
      const lfo = ac.createOscillator();
      const depth = ac.createGain();
      lfo.frequency.value = 18;
      depth.gain.value = vibrato;
      lfo.connect(depth); depth.connect(osc.frequency);
      lfo.start(start); lfo.stop(start + dur + 0.03);
    }
    const g = ac.createGain();
    g.gain.setValueAtTime(0.0001, start);
    g.gain.exponentialRampToValueAtTime(vol, start + attack);
    g.gain.exponentialRampToValueAtTime(0.001, start + dur);
    osc.connect(g); g.connect(out);
    osc.start(start); osc.stop(start + dur + 0.03);
  }

  // Treffer, Strahl, Aufladen, K.O. (+ kleiner "zap"); andere Namen fallen auf playSound zurück
  function playFightSfx(name) {
    if (fightMuted) return;
    const FIGHT_SFX = { hit: 1, beam: 1, charge: 1, ko: 1, zap: 1 };
    if (!Reflect.get(FIGHT_SFX, name)) { playSound(name); return; }
    try {
      const ac = getAudioCtx();
      if (!ac) return;
      const now = ac.currentTime;
      const out = ac.createGain();
      out.gain.value = 0.85;
      const comp = ac.createDynamicsCompressor();
      out.connect(comp); comp.connect(ac.destination);

      if (name === "hit") {
        sfxTone(ac, out, { start: now, dur: 0.2, f0: 170, f1: 42, vol: 0.6 });
        sfxNoise(ac, out, { start: now, dur: 0.13, type: "bandpass", f0: 2600, f1: 450, q: 0.8, vol: 0.55 });
        sfxTone(ac, out, { start: now, dur: 0.06, type: "square", f0: 950, f1: 280, vol: 0.12 });
        if (navigator.vibrate) navigator.vibrate(25);
      } else if (name === "zap") {
        sfxTone(ac, out, { start: now, dur: 0.17, type: "sawtooth", f0: 1500, f1: 240, vol: 0.13 });
        sfxNoise(ac, out, { start: now, dur: 0.1, type: "highpass", f0: 3000, f1: 1200, vol: 0.18 });
      } else if (name === "beam") {
        sfxTone(ac, out, { start: now, dur: 0.22, type: "sawtooth", f0: 220, f1: 880, vol: 0.1, attack: 0.03 });
        sfxNoise(ac, out, { start: now + 0.08, dur: 0.95, f0: 3200, f1: 380, q: 0.7, vol: 0.5 });
        sfxTone(ac, out, { start: now + 0.08, dur: 0.95, type: "sawtooth", f0: 115, f1: 75, vol: 0.2, attack: 0.04, vibrato: 9 });
        sfxTone(ac, out, { start: now + 0.08, dur: 0.8, type: "square", f0: 232, f1: 150, vol: 0.05, attack: 0.04, vibrato: 14 });
        if (navigator.vibrate) navigator.vibrate(Array.of(40, 30, 60));
      } else if (name === "charge") {
        sfxTone(ac, out, { start: now, dur: 0.5, type: "square", f0: 180, f1: 820, vol: 0.06, attack: 0.04, vibrato: 25 });
        sfxTone(ac, out, { start: now, dur: 0.5, f0: 320, f1: 1300, vol: 0.12, attack: 0.04 });
        sfxNoise(ac, out, { start: now, dur: 0.45, type: "bandpass", f0: 600, f1: 4000, q: 3, vol: 0.15 });
      } else if (name === "ko") {
        sfxTone(ac, out, { start: now, dur: 1.0, f0: 130, f1: 28, vol: 0.75 });
        sfxNoise(ac, out, { start: now, dur: 1.2, f0: 2000, f1: 70, q: 0.6, vol: 0.6 });
        Array.of(660, 494, 392, 262).forEach((f, i) => {
          sfxTone(ac, out, { start: now + 0.35 + i * 0.13, dur: 0.24, type: "triangle", f0: f, vol: 0.16 });
        });
        if (navigator.vibrate) navigator.vibrate(Array.of(80, 40, 160));
      }
    } catch (e) {}
  }

  function updateMuteButton() {
    const btn = document.getElementById("lg-mute-btn");
    if (!btn) return;
    btn.textContent = fightMuted ? "🔇" : "🔊";
    btn.classList.toggle("muted", fightMuted);
    btn.setAttribute("aria-pressed", fightMuted ? "true" : "false");
    btn.setAttribute("aria-label", fightMuted ? "Kampf-Sound einschalten" : "Kampf-Sound stummschalten");
  }

  document.getElementById("lg-mute-btn").addEventListener("click", () => {
    fightMuted = !fightMuted;
    localStorage.setItem(SFX_MUTE_KEY, fightMuted ? "1" : "0");
    updateMuteButton();
    if (!fightMuted) playFightSfx("zap");
  });
  updateMuteButton();

    let animFrameId = null;

  function startDbzMission() {
    ensureCampaignState();
    if (state.battleTickets <= 0) {
      document.getElementById("ticket-modal-title").textContent =
        state.dailyTicketsEarned >= MAX_TICKETS_PER_DAY ? "TAGESLIMIT (4/4)" : "ARENA GESPERRT";
      document.getElementById("ticket-modal-desc").textContent =
        state.dailyTicketsEarned >= MAX_TICKETS_PER_DAY
          ? "Alle 4 Kämpfe für heute geschafft! Morgen warten neue Gegner auf dich."
          : `Mach noch ${EXERCISES_PER_TICKET - (state.dailyExerciseCount % EXERCISES_PER_TICKET)} Übung(en), um Welt-Level ${state.campaignStage} zu starten!`;
      document.getElementById("ticket-play-now").classList.add("hidden");
      ticketModal.classList.remove("hidden");
      return;
    }

    document.getElementById("ticket-play-now").classList.remove("hidden");
    state.battleTickets -= 1;
    updateUI();
    cancelAnimationFrame(animFrameId);

    const lvl = state.campaignStage;
    const mode = (lvl - 1) % 3;
    const stars = Math.min(5, Math.ceil(lvl / 2));
    document.getElementById("gta-stars-label").textContent = "★".repeat(stars) + "☆".repeat(5 - stars);

    const heroObj = CHARACTERS.find(c => c.id === state.selectedChar) || CHARACTERS.at(0);
    const enemyId = ((state.selectedChar + lvl + 1) % CHARACTERS.length) + 1;
    const enemyObj = CHARACTERS.find(c => c.id === enemyId) || CHARACTERS.at(1);

    document.getElementById("lg-hero-name").textContent = heroObj.name;
    document.getElementById("lg-enemy-name").textContent = enemyObj.name;
    document.getElementById("battle-stage-tag").textContent = `LVL ${lvl}`;

    const heroSprite = new Image();
    const enemySprite = new Image();
    loadSmartImage(heroSprite, `c${heroObj.id}_s${state.selectedStage}`, () => loadSmartImage(heroSprite, `c${heroObj.id}_s1`));
    loadSmartImage(enemySprite, `c${enemyObj.id}_s${Math.min(5, Math.ceil(lvl / 2))}`, () => loadSmartImage(enemySprite, `c${enemyObj.id}_s1`));

    const canvas = document.getElementById("legends-canvas");
    const ctx = canvas.getContext("2d");
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    canvas.width = 356 * dpr;
    canvas.height = 245 * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const ctrlArea = document.getElementById("lg-controls-area");
    const chargeBtn = document.getElementById("lg-charge-btn");

    const sim = {
      heroHp: 100, enemyHp: 100 + (lvl - 1) * 22, maxEnemyHp: 100 + (lvl - 1) * 22,
      ki: 55, heroX: 68, heroY: 145, enemyX: 288, enemyY: 145,
      vanishReady: true, warnTimer: 0, attackCd: 95, hitStop: 0, shake: 0,
      scroll: 0, projectiles: Array.of(), sparks: Array.of(), floats: Array.of(),
      beamTimer: 0, over: false, koBanner: "", lane: 1, ringAngle: 0, beamPos: 50
    };

    const spawnSparks = (x, y, col) => {
      for (let i = 0; i < 16; i++) {
        const ang = Math.random() * Math.PI * 2;
        const spd = 2 + Math.random() * 5.5;
        sim.sparks.push({ x, y, vx: Math.cos(ang) * spd, vy: Math.sin(ang) * spd, col, life: 24 });
      }
    };
    const spawnFloat = (x, y, txt, col) => sim.floats.push({ x, y, txt, col, life: 42 });

    const finishMission = (won) => {
      if (sim.over) return;
      sim.over = true;
      sim.koBanner = won ? "SIEG · K.O.!" : "NIEDERLAGE";
      playFightSfx("ko");
      setTimeout(() => {
        cancelAnimationFrame(animFrameId);
        battleModal.classList.add("hidden");
        if (won) {
          triggerKiImpact(true);
          state.campaignStage += 1;
          state.powerLevel += 1500;
          document.getElementById("levelup-badge").textContent = "🏆 SIEG +1.500 KI";
          document.getElementById("levelup-title").textContent = `WELT-LEVEL ${state.campaignStage}`;
          document.getElementById("levelup-desc").textContent = `Du hast ${enemyObj.name} besiegt!`;
        } else {
          document.getElementById("levelup-badge").textContent = "💥 KNAPP VERLOREN";
          document.getElementById("levelup-title").textContent = "WEITER TRAINIEREN";
          document.getElementById("levelup-desc").textContent = "Absolviere 2 Übungen für den nächsten Kampf!";
        }
        document.getElementById("levelup-overlay").classList.remove("hidden");
        updateUI();
      }, 1150);
    };

    if (mode === 0) {
      document.getElementById("gta-mode-label").textContent = "TURNIER · 1V1 DUELL";
      chargeBtn.style.display = "block";
      ctrlArea.innerHTML = `
        <button id="btn-m1" class="l-card">⚔️ STRIKE<span>20 KI</span></button>
        <button id="btn-m2" class="l-card">🔥 BLAST<span>25 KI</span></button>
        <button id="btn-m3" class="l-card special">💥 ULTIMATE<span>60 KI</span></button>
        <button id="btn-m4" class="l-card vanish">⚡ VANISH<span>TELEPORT</span></button>
      `;
      document.getElementById("btn-m1").onclick = () => {
        if (sim.ki < 20 || sim.over) return;
        sim.ki -= 20; sim.heroX = 225; sim.hitStop = 4; sim.shake = 8;
        playFightSfx("hit");
        const dmg = 20 + state.selectedStage * 3;
        sim.enemyHp -= dmg;
        spawnSparks(275, 115, heroObj.color);
        spawnFloat(265, 90, `-${dmg} KOMBO!`, "#ffe66d");
        setTimeout(() => { sim.heroX = 68; }, 210);
        if (sim.enemyHp <= 0) finishMission(true);
      };
      document.getElementById("btn-m2").onclick = () => {
        if (sim.ki < 25 || sim.over) return;
        sim.ki -= 25; playFightSfx("zap");
        Array.of(0, 1, 2).forEach(i => sim.projectiles.push({ x: 105 - i * 18, y: 118 + (i - 1) * 16, vx: 9, fromHero: true, col: heroObj.color }));
      };
      document.getElementById("btn-m3").onclick = () => {
        if (sim.ki < 60 || sim.over) return;
        sim.ki -= 60; sim.beamTimer = 28; sim.hitStop = 5; sim.shake = 12;
        playFightSfx("beam");
        const dmg = 46 + state.selectedStage * 6;
        sim.enemyHp -= dmg;
        spawnSparks(275, 115, "#ff0055");
        spawnFloat(245, 78, `${heroObj.attack}! -${dmg}`, "#ff0055");
        if (sim.enemyHp <= 0) finishMission(true);
      };
      document.getElementById("btn-m4").onclick = () => {
        if (!sim.vanishReady || sim.over) return;
        sim.vanishReady = false; sim.warnTimer = 0; sim.heroY = 72;
        playFightSfx("select"); spawnFloat(70, 82, "VANISH STEP!", "#00f5d4");
        setTimeout(() => { sim.heroY = 145; }, 380);
        setTimeout(() => { sim.vanishReady = true; }, 3400);
      };
      chargeBtn.onclick = () => {
        if (sim.over) return;
        sim.ki = Math.min(100, sim.ki + 30); playFightSfx("charge");
        spawnSparks(68, 125, "#52e588"); spawnFloat(68, 95, "+30 KI", "#52e588");
      };
    } else if (mode === 1) {
      document.getElementById("gta-mode-label").textContent = "CANYON · KI-RUSH";
      chargeBtn.style.display = "none";
      ctrlArea.innerHTML = `
        <button id="btn-up" class="l-card vanish" style="grid-column: span 2;">⬆️ OBEN AUSWEICHEN<span>FLUG-SPUR</span></button>
        <button id="btn-down" class="l-card" style="grid-column: span 2;">⬇️ UNTEN AUSWEICHEN<span>BODEN-SPUR</span></button>
      `;
      document.getElementById("btn-up").onclick = () => { sim.lane = 0; playFightSfx("click"); };
      document.getElementById("btn-down").onclick = () => { sim.lane = 1; playFightSfx("click"); };
    } else {
      document.getElementById("gta-mode-label").textContent = "NAMEK · KAMEHA-CLASH";
      chargeBtn.style.display = "none";
      ctrlArea.innerHTML = `
        <button id="btn-lock" class="l-card special" style="grid-column: span 4; padding: 12px;">
          🎯 BEI GRÜNEM RING FEUERN!<span>PRÄZISIONS-TREFFER DRÜCKT DEN STRAHL</span>
        </button>
      `;
      document.getElementById("btn-lock").onclick = () => {
        if (sim.over) return;
        const hitZone = Math.abs(Math.sin(sim.ringAngle)) < 0.38;
        if (hitZone) {
          sim.beamPos += 16; sim.shake = 9; sim.hitStop = 3;
          playFightSfx("hit"); spawnSparks(180, 125, "#00f5d4");
          spawnFloat(175, 85, "PERFEKT! +16%", "#00f5d4");
          if (sim.beamPos >= 100) { sim.enemyHp = 0; finishMission(true); }
        } else {
          sim.beamPos -= 9; playFightSfx("click");
          spawnFloat(150, 95, "DANEBEN!", "#ff0055");
        }
      };
          }
        battleModal.classList.remove("hidden");
    if (mode === 2) playFightSfx("beam");

    // Delta-Time: alle Werte sind auf "pro 60-Hz-Frame" ausgelegt, dt = 1 entspricht 16,67 ms.
    // Auf 120-Hz-Geräten ist dt ≈ 0,5, bei Rucklern max. 3 (verhindert Sprünge nach Tab-Wechsel).
    const FRAME_MS = 1000 / 60;
    let lastFrameT = null;

    function loop(t) {
      const dt = lastFrameT === null ? 1 : Math.min(3, Math.max(0, (t - lastFrameT) / FRAME_MS));
      lastFrameT = t;

      if (sim.hitStop > 0) { sim.hitStop -= dt; animFrameId = requestAnimationFrame(loop); return; }

      ctx.save();
      if (sim.shake > 0) {
        ctx.translate((Math.random() - 0.5) * sim.shake, (Math.random() - 0.5) * sim.shake);
        sim.shake *= Math.pow(0.82, dt);
        if (sim.shake < 0.2) sim.shake = 0;
      }

      sim.scroll += (mode === 1 ? 5.5 : 1.2) * dt;
      drawStageBackground(ctx, 356, 245, sim.scroll, lvl - 1, t);

      const hover = Math.sin(t / 170) * 4;

      if (mode === 0) {
        if (!sim.over) {
          sim.ki = Math.min(100, sim.ki + 0.09 * dt);
          sim.attackCd -= dt;
          if (sim.attackCd <= 0 && sim.warnTimer <= 0) sim.warnTimer = 40;
          if (sim.warnTimer > 0) {
            sim.warnTimer -= dt;
            if (sim.warnTimer <= 0) {
              sim.warnTimer = 0;
              sim.projectiles.push({ x: 245, y: 125, vx: -(6.5 + lvl * 0.4), fromHero: false, col: "#ff0055" });
              sim.attackCd = Math.max(60, 120 - lvl * 7);
            }
          }
        }
        if (sim.warnTimer > 0) {
          ctx.fillStyle = "#ff0055"; ctx.font = "bold 36px Anton, sans-serif";
          ctx.fillText("!", sim.enemyX - 8, 52);
        }
        if (sim.beamTimer > 0) {
          sim.beamTimer = Math.max(0, sim.beamTimer - dt);
          drawBeam(ctx, 95, 290, 120, 28 * Math.min(1, sim.beamTimer / 8), heroObj.color, t);
        }
      } else if (mode === 1) {
        sim.heroY = sim.lane === 0 ? 105 : 178;
        if (!sim.over) {
          sim.attackCd -= dt;
          if (sim.attackCd <= 0) {
            const isOrb = Math.random() < 0.35;
            const spawnLane = Math.random() < 0.5 ? 105 : 178;
            sim.projectiles.push({ x: 350, y: spawnLane - 20, vx: -(5.8 + lvl * 0.45), fromHero: false, isOrb, col: isOrb ? "#00f5d4" : "#ff0055" });
            sim.attackCd = Math.max(36, 68 - lvl * 3);
          }
        }
      } else {
        sim.ringAngle += (0.075 + lvl * 0.006) * dt;
        if (!sim.over) {
          sim.beamPos -= (0.16 + lvl * 0.02) * dt;
          if (sim.beamPos <= 0) { sim.heroHp = 0; finishMission(false); }
        }
        const clashX = 75 + (sim.beamPos / 100) * 205;
        drawBeam(ctx, 280, clashX, 128, 20, "#ff0055", t + 500);
        drawBeam(ctx, 75, clashX, 128, 20, heroObj.color, t);
        const pulseR = 24 + Math.abs(Math.sin(sim.ringAngle)) * 28;
        ctx.strokeStyle = "#52e588"; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(178, 65, 25, 0, Math.PI * 2); ctx.stroke();
        ctx.strokeStyle = "#ffe66d"; ctx.lineWidth = 2.5;
        ctx.beginPath(); ctx.arc(178, 65, pulseR, 0, Math.PI * 2); ctx.stroke();
      }

      // Kämpfer mit Aura, Flammen, Atem-Animation und Leuchtrand (Füße bei y + 40)
      drawFighterUnstretched(ctx, heroSprite, sim.heroX, sim.heroY + 40 + hover, { color: heroObj.color, t });
      drawFighterUnstretched(ctx, enemySprite, sim.enemyX, sim.enemyY + 40 - hover, { color: "#ff0055", flip: true, t: t + 900 });

      sim.projectiles = sim.projectiles.filter(p => {
        p.x += p.vx * dt;
        ctx.beginPath(); ctx.arc(p.x, p.y, p.isOrb ? 13 : 11, 0, Math.PI * 2);
        ctx.fillStyle = p.col; ctx.fill();
        if (p.fromHero && p.x >= sim.enemyX - 25) {
          const dmg = 9 + state.selectedStage;
          sim.enemyHp -= dmg; spawnSparks(sim.enemyX - 15, p.y, p.col); playFightSfx("hit");
          spawnFloat(sim.enemyX - 20, 90, `-${dmg}`, p.col);
          if (sim.enemyHp <= 0) finishMission(true);
          return false;
        }
        if (!p.fromHero && Math.abs(p.x - sim.heroX) < 26) {
          if (mode === 0 && sim.heroY < 100) {
            spawnFloat(sim.heroX, 85, "VANISH!", "#00f5d4"); return false;
          }
          if (mode === 1 && Math.abs(p.y - (sim.heroY - 20)) > 28) return true;
          if (p.isOrb) {
            const dmg = 22; sim.enemyHp -= dmg; playFightSfx("hit");
            spawnSparks(sim.heroX, p.y, "#00f5d4"); spawnFloat(sim.heroX, 85, `KONTER -${dmg}!`, "#00f5d4");
            if (sim.enemyHp <= 0) finishMission(true);
          } else {
            const dmg = 18 + lvl * 2; sim.heroHp -= dmg; sim.shake = 10; playFightSfx("hit");
            spawnSparks(sim.heroX, p.y, "#ff0055"); spawnFloat(sim.heroX - 10, 85, `-${dmg}`, "#ff0055");
            if (sim.heroHp <= 0) finishMission(false);
          }
          return false;
        }
        return p.x > -20 && p.x < 375;
      });

      sim.sparks = sim.sparks.filter(s => {
        s.x += s.vx * dt; s.y += s.vy * dt; s.life -= dt;
        ctx.fillStyle = s.col; ctx.fillRect(s.x, s.y, 4, 4);
        return s.life > 0;
      });

      sim.floats = sim.floats.filter(ft => {
        ft.y -= 0.8 * dt; ft.life -= dt;
        ctx.fillStyle = "#000"; ctx.font = "bold 17px Anton, sans-serif";
        ctx.fillText(ft.txt, ft.x + 2, ft.y + 2);
        ctx.fillStyle = ft.col; ctx.fillText(ft.txt, ft.x, ft.y);
        return ft.life > 0;
      });

      if (sim.koBanner) {
        ctx.fillStyle = "rgba(0, 0, 0, 0.68)";
        ctx.fillRect(0, 92, 356, 58);
        ctx.fillStyle = sim.koBanner === "NIEDERLAGE" ? "#ff0055" : "#ffe66d";
        ctx.font = "bold 36px Anton, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText(sim.koBanner, 178, 133);
        ctx.textAlign = "left";
      }

      ctx.restore();
      document.getElementById("lg-hero-hp").style.width = `${Math.max(0, sim.heroHp)}%`;
      document.getElementById("lg-enemy-hp").style.width = `${Math.max(0, (sim.enemyHp / sim.maxEnemyHp) * 100)}%`;
      document.getElementById("lg-ki-fill").style.width = `${Math.min(100, sim.ki)}%`;
      document.getElementById("lg-ki-num").textContent = Math.floor(sim.ki);
      if (mode === 0) {
        document.getElementById("btn-m1").disabled = sim.ki < 20 || sim.over;
        document.getElementById("btn-m2").disabled = sim.ki < 25 || sim.over;
        document.getElementById("btn-m3").disabled = sim.ki < 60 || sim.over;
        document.getElementById("btn-m4").disabled = !sim.vanishReady || sim.over;
      }
      animFrameId = requestAnimationFrame(loop);
    }

    animFrameId = requestAnimationFrame(loop);
  }

  document.getElementById("campaign-btn")?.addEventListener("click", startDbzMission);
  document.getElementById("ticket-play-now").addEventListener("click", () => {
    ticketModal.classList.add("hidden");
    startDbzMission();
  });
  document.getElementById("ticket-later-btn").addEventListener("click", () => ticketModal.classList.add("hidden"));
  document.getElementById("battle-close-btn").addEventListener("click", () => {
    cancelAnimationFrame(animFrameId);
    battleModal.classList.add("hidden");
  });

  updateUI();
})();

updateStaggeredCarousel();
updateUI();
renderWorkouts();
