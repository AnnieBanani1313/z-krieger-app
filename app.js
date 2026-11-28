(function loadAppFonts() {
  const host = Array.of("fonts", "googleapis", "com").join(".");
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://${host}/css2?family=Anton&family=Rajdhani:wght@600;700&display=swap`;
  document.head.appendChild(link);
})();

// Linien-Icon aus dem Icon-Set in index.html (#i-name)
function icon(name, cls = "ico") {
  return `<svg class="${cls}" aria-hidden="true" focusable="false"><use href="#i-${name}"/></svg>`;
}

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
    /* .hud-strip / .hud-chip: Styles stehen jetzt in style.css */
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

  // HUD (Streak, Senzu, Boss, Trophäen) steht jetzt direkt in index.html.
  const stage = document.querySelector(".arena-poster-stage");
  if (stage && !document.getElementById("senzu-btn")) {
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
  { id: 1, name: "SON GOKU", attack: "SONNEN-KAMEHA", focus: "GANZKÖRPER", bio: "Furchtloser Saiyajin-Krieger.", color: "#ffb703" },
  { id: 2, name: "VEGETA", attack: "FINALER BLITZ", focus: "ARME & BRUST", bio: "Meister der Schwerkraft.", color: "#5ce1e6" },
  { id: 3, name: "KUROGANE", attack: "FLAMMEN-HIEB", focus: "REAKTION & BAUCH", bio: "High-Tech-Rüstung & Reflexe.", color: "#ff5c77" },
  { id: 4, name: "BEERUS", attack: "PHANTOM-SALVE", focus: "BAUCH & BALANCE", bio: "Lautlos wie der Wind.", color: "#c77dff" },
  { id: 5, name: "MUTEN ROSHI", attack: "SUPERNOVA", focus: "GANZKÖRPER", bio: "Seine goldene Energie strahlt.", color: "#ffe66d" },
  { id: 6, name: "PICCOLO", attack: "TITANEN-WALL", focus: "ARME & BAUCH", bio: "Verteidiger mit Ki-Schild.", color: "#48cae4" },
  { id: 7, name: "KRILLIN", attack: "DONNER-SPRINT", focus: "BEINE & SPEED", bio: "Extrem wendig & schnell.", color: "#ff9e5e" },
  { id: 8, name: "BOJACK", attack: "GLETSCHER-STRAHL", focus: "BAUCH-KRAFT", bio: "Bleibt unter Druck eiskalt.", color: "#72efdd" },
  { id: 9, name: "JIREN", attack: "MAGMA-FAUST", focus: "BRUST & SCHULTERN", bio: "Glühende Kampf-Aura.", color: "#ff6b6b" },
  { id: 10, name: "SON GOHAN", attack: "KOMETEN-REGEN", focus: "GANZKÖRPER", bio: "Kosmische Sprungkraft.", color: "#b8c0ff" },
  { id: 11, name: "GOLDEN FREEZER", attack: "HELIOS-WELLE", focus: "AUSDAUER", bio: "Zieht Kraft aus der Sonne.", color: "#ffd166" },
  { id: 12, name: "BROLY", attack: "ECLIPSE-SCHLAG", focus: "ARME & RÜCKEN", bio: "Einzelgänger mit Wucht.", color: "#80ffdb" },
  { id: 13, name: "TRUNKS", attack: "WIRBELSTURM", focus: "BEINE & AGILITÄT", bio: "Beherrscht den Himmel.", color: "#64dfdf" },
  { id: 14, name: "GOGETA", attack: "OMEGA-URKNALL", focus: "ALLE BEREICHE", bio: "Meister aller Techniken.", color: "#ff758f" },
  { id: 15, name: "TENSHINHAN", attack: "OMEGA-STURM", focus: "BEINE & KRAFT", bio: "Smaragdgrüne Natur-Energie.", color: "#52e588" }
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
  { id: "t1", icon: "bolt", name: "ERWACHEN", desc: "Stufe 2 erreicht" },
  { id: "t2", icon: "flame", name: "10.000 KI", desc: "10.000 Ki gesammelt" },
  { id: "t3", icon: "boss", name: "BOSS-JÄGER", desc: "Ersten Boss besiegt" },
  { id: "t4", icon: "calendar", name: "DISZIPLIN", desc: "3 Tage Streak" },
  { id: "t5", icon: "core", name: "BAUCH-STAHL", desc: "Bauch Level 3" },
  { id: "t6", icon: "crown", name: "TEAM-LEADER", desc: "5 Krieger trainiert" }
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
// Aussehen der Krieger für die Übungs-Animationen (nach den Figuren-Bildern c*_s1)
// hair: spiky | flame | wild | smooth | bald | ears | turban | bandana | dome
// face: Extras am Kopf (dots, thirdEye, beard, shades) · body: Extras am Körper (cape, shell, pads)
const FIGHTER_LOOKS = {
  1:  { hair: "spiky",  hairCol: "#1a1a1f", top: "#ff8c1a", top2: "#e8650a", belt: "#1d3fa0", pants: "#ff8c1a", shoe: "#2a54c8", band: "#2a54c8" },
  2:  { hair: "flame",  hairCol: "#15151c", top: "#24357a", top2: "#16204d", belt: "#d9b450", pants: "#24357a", shoe: "#f2f2f2", shoeLen: 24, arm: "#24357a", glove: "#f4f4f4" },
  3:  { hair: "spiky",  hairCol: "#cfc6ee", top: "#b01e35", top2: "#6b1020", belt: "#2a2a33", pants: "#b01e35", shoe: "#eeeeee", shoeLen: 20, arm: "#2a2a33", glove: "#2a2a33", band: "#eeeeee" },
  4:  { hair: "ears",   skin: "#9b7fd1", top: "#9b7fd1", top2: "#7e64b8", belt: "#2a3f8f", pants: "#3d8fd1", shoe: "#6b4a2b", arm: "#9b7fd1", band: "#d4a72c" },
  5:  { hair: "bald",   face: ["beard", "shades"], body: ["shell"], skin: "#f1c7a0", top: "#ff9a2e", top2: "#e5771a", belt: null, pants: "#e8e8e8", shin: ["#f1c7a0", 42, 46], shoe: "#3aa84a", shoeLen: 10 },
  6:  { hair: "turban", body: ["cape"], skin: "#6fbf4a", top: "#4b2f86", top2: "#3a2370", belt: "#3d8fd1", pants: "#4b2f86", shoe: "#8a5a2b", arm: "#6fbf4a", band: "#c0392b" },
  8:  { hair: "bandana", hairCol: "#f07a2a", skin: "#3fb8a8", top: "#5a3a2a", top2: "#3d4a63", belt: "#1e1e22", pants: "#2f9e93", shoe: "#1f3a36", shoeLen: 22, arm: "#3fb8a8", band: "#e0782a" },
  9:  { hair: "bald",   skin: "#d4cfe0", top: "#1c1c22", top2: "#d42a2a", belt: "#1c1c22", pants: "#1c1c22", shoe: "#d42a2a", shoeLen: 24, arm: "#d42a2a", band: "#eeeeee", glove: "#eeeeee" },
  7:  { hair: "bald",   face: ["dots"], top: "#ff8c1a", top2: "#e8650a", belt: "#2a54c8", pants: "#ff8c1a", shoe: "#1a1a22", band: "#2a54c8" },
  10: { hair: "spiky",  hairCol: "#111114", top: "#4b3a9a", top2: "#3a2c80", belt: "#a82a2a", pants: "#4b3a9a", shoe: "#8a5a2b", band: "#7b3fb0" },
  12: { hair: "wild",   hairCol: "#15151a", body: ["pads"], top: "#5a2a7a", top2: "#43205c", belt: "#7bbf3a", beltW: 8, pants: "#5a2a7a", shoe: "#8a9a8a", shoeLen: 22, band: "#c0c0c8" },
  11: { hair: "dome",   skin: "#e2b445", top: "#f0cc5a", top2: "#b8862a", belt: null, pants: "#d9a93a", shin: ["#7b4fc0", 46, 8], shoe: "#c99a30", arm: "#e2b445", glove: "#9b6fd0" },
  14: { hair: "wild",   hairCol: "#d9381e", body: ["pads"], padsCol: "#f4a52a", top: "#e9b48a", top2: "#3a2a2a", belt: "#2a54c8", pants: "#e8e8e8", shin: ["#2a54c8", 70, 16], shoe: "#1a1a22", arm: "#7a2a26", band: "#1a1a22" },
  13: { hair: "smooth", hairCol: "#c4a8e8", top: "#3f7ac8", top2: "#2c5ea8", belt: "#d9a441", pants: "#3c434d", shoe: "#e0a830", shoeLen: 22, arm: "#3f7ac8" },
  15: { hair: "bald",   face: ["thirdEye"], top: "#2f8a3e", top2: "#23702f", belt: "#b5382c", pants: "#2f8a3e", shin: ["#eeeeee", 74, 12], shoe: "#1f2f6a", band: "#5a3a8a" }
};

function getFighterLook(charObj) {
  const base = {
    hair: "spiky", hairCol: "#1a1a1f", skin: "#f4c095",
    top: charObj.color || "#ff9900", top2: "#e85d04", belt: "#1d3557",
    pants: "#1d3557", shoe: "#141418", shoeLen: 15, beltW: 0,
    face: Array.of(), body: Array.of()
  };
  const look = Object.assign(base, Reflect.get(FIGHTER_LOOKS, charObj.id) || {});
  if (!look.arm) look.arm = look.skin;
  return look;
}

// Animierte Übungs-Figuren (SVG/SMIL) im Stil der bisherigen Comic-Bildchen.
// Jede Pose pendelt weich zwischen Startpose (a) und Endpose (b).
// Aussehen (Haare, Haut, Kleidung) richtet sich nach dem gewählten Krieger.
function getComicSVG(pose) {
  const cObj = CHARACTERS.find(c => c.id === state.selectedChar) || CHARACTERS.at(0);
  const auraCol = cObj.color || "#ff9900";
  const look = getFighterLook(cObj);
  const OUT = "#141418";
  const EASE = `calcMode="spline" keyTimes="0;0.5;1" keySplines="0.45 0 0.55 1;0.45 0 0.55 1"`;

  const anim = (attr, a, b, dur) => a === b ? "" :
    `<animate attributeName="${attr}" values="${a};${b};${a}" dur="${dur}" repeatCount="indefinite" ${EASE}/>`;
  const moveAnim = (a, b, dur) => (a[0] === b[0] && a[1] === b[1]) ? "" :
    `<animateTransform attributeName="transform" type="translate" values="${a[0]},${a[1]};${b[0]},${b[1]};${a[0]},${a[1]}" dur="${dur}" repeatCount="indefinite" ${EASE}/>`;

  // Linienzug, a/b müssen gleich viele Punkte haben.
  // Optional nur ein Abschnitt (in % der Länge) – für Schuhe, Gürtel, Handschuhe usw.
  const seg = (a, b, col, w, dur, from = null, len = null, cap = null) => {
    const part = from === null ? "" : ` pathLength="100" stroke-dasharray="${len} 200" stroke-dashoffset="${-from}"`;
    const lc = cap || (from === null ? "round" : "butt");
    return `<polyline points="${a}" stroke="${col}" stroke-width="${w}" stroke-linecap="${lc}" stroke-linejoin="round" fill="none"${part}>${anim("points", a, b, dur)}</polyline>`;
  };
  // Bein: Hose + Schuh (+ optional Unterschenkel-Farbe). footFirst = Linie beginnt am Fuß.
  const leg = (a, b, w, dur, footFirst = false) => {
    const sl = look.shoeLen;
    let out = seg(a, b, look.pants, w, dur);
    if (look.shin) {
      const [col, from, len] = look.shin;
      out += seg(a, b, col, w - 2, dur, footFirst ? 100 - from - len : from, len);
    }
    // Schuh mit runder Spitze: am Fußende runden Abschluss nachzeichnen
    return out + seg(a, b, look.shoe, w + 1, dur, footFirst ? 0 : 100 - sl, sl)
      + seg(a, b, look.shoe, w + 1, dur, footFirst ? 0 : 99.5, 0.5, "round");
  };
  // Oberkörper: Oberteil + Gürtel (+ Umhang/Panzer/Schulterpolster). hipFirst = Linie beginnt an der Hüfte.
  const torso = (a, b, w, dur, hipFirst = false) => {
    let out = "";
    if (look.body.includes("cape")) out += seg(a, b, "#e8eef5", w + 7, dur);
    if (look.body.includes("shell")) out += seg(a, b, "#7b4bb0", w + 9, dur);
    out += seg(a, b, "url(#giGrad)", w, dur);
    if (look.belt) {
      const bl = 10 + (look.beltW || 0);
      out += seg(a, b, look.belt, w + 1, dur, hipFirst ? 0 : 100 - bl, bl);
    }
    if (look.body.includes("pads")) out += seg(a, b, look.padsCol || "#9ad64a", w + 5, dur, hipFirst ? 86 : 0, 14);
    return out;
  };
  // Arm: Ärmel/Haut + Armband + Handschuh/Hand (Hand liegt immer am Linienende)
  const arm = (a, b, w, dur, dim = false) => {
    let out = seg(a, b, look.arm, w, dur);
    if (look.band) out += seg(a, b, look.band, w + 1, dur, 68, 10);
    out += seg(a, b, look.glove || look.skin, w, dur, 82, 18)
      + seg(a, b, look.glove || look.skin, w, dur, 99.5, 0.5, "round");
    return dim ? `<g opacity="0.78">${out}</g>` : out;
  };

  const faceFx = () => {
    let fx = "";
    if (look.face.includes("dots")) fx += Array.of(-1.5, 2, 5.5).map(x => `<circle cx="${x}" cy="-4" r="0.9" fill="#b5652e"/>`).join("");
    if (look.face.includes("thirdEye")) fx += `<ellipse cx="2" cy="-3.5" rx="2.2" ry="1.4" fill="#ffffff" stroke="${OUT}" stroke-width="0.6"/><circle cx="2" cy="-3.5" r="0.8" fill="${OUT}"/>`;
    if (look.face.includes("beard")) fx += `<path d="M-5,5 Q2,22 9,5 Z" fill="#e6e6e6" stroke="#9a9a9a" stroke-width="0.6"/><path d="M-5,-3 L-1,-4 M5,-4 L9,-3" stroke="#e6e6e6" stroke-width="1.6" stroke-linecap="round"/>`;
    if (look.face.includes("shades")) fx += `<rect x="-5" y="-0.5" width="14" height="4" rx="1" fill="#2a4fb0" stroke="#d62828" stroke-width="1.2"/>`;
    return fx;
  };
  const headShape = () => {
    const face = `<circle cx="2" cy="2" r="9" fill="${look.skin}" stroke="${OUT}" stroke-width="1.5"/>`;
    const hairPoly = (pts) => `<polygon points="${pts}" fill="${look.hairCol}" stroke="${auraCol}" stroke-width="1.2" stroke-linejoin="round"/>`;
    switch (look.hair) {
      case "flame":
        return hairPoly("-9,-2 -13,-18 -6,-13 -7,-31 0,-19 4,-36 8,-20 13,-28 13,-4") + face;
      case "wild":
        return hairPoly("-11,8 -21,-2 -13,-7 -23,-19 -9,-15 -11,-30 0,-18 6,-32 10,-17 23,-24 15,-7 23,3 13,6") + face;
      case "smooth":
        return face + `<path d="M-8,7 C-12,-7 -6,-11 2,-11 C11,-11 16,-6 12,7 L9,1 L3,-5 L-2,1 Z" fill="${look.hairCol}" stroke="${OUT}" stroke-width="1"/>`;
      case "ears":
        return `<polygon points="-7,-2 -12,-25 0,-6" fill="${look.skin}" stroke="${OUT}" stroke-width="1.2" stroke-linejoin="round"/>
          <polygon points="4,-6 15,-25 11,-1" fill="${look.skin}" stroke="${OUT}" stroke-width="1.2" stroke-linejoin="round"/>
          ${face}<circle cx="13.5" cy="-14" r="1.4" fill="#d4a72c"/>`;
      case "turban":
        return `<polygon points="-6,1 -15,-5 -6,-3" fill="${look.skin}" stroke="${OUT}" stroke-width="1"/>
          <polygon points="10,1 19,-5 10,-3" fill="${look.skin}" stroke="${OUT}" stroke-width="1"/>
          ${face}<path d="M-8,-1 C-8,-12 12,-12 12,-1 Z" fill="#f2f2f2" stroke="${OUT}" stroke-width="1"/>
          <circle cx="2" cy="-8.5" r="2.4" fill="#6a3fa0"/>`;
      case "bandana":
        return `<path d="M-7,-3 C-15,3 -13,12 -18,17 C-9,15 -7,9 -5,4 Z" fill="${look.hairCol}" stroke="${OUT}" stroke-width="0.8"/>
          <path d="M11,-3 C19,3 17,12 22,17 C13,15 11,9 9,4 Z" fill="${look.hairCol}" stroke="${OUT}" stroke-width="0.8"/>
          <polygon points="-6,1 -15,-5 -6,-3" fill="${look.skin}" stroke="${OUT}" stroke-width="1"/>
          <polygon points="10,1 19,-5 10,-3" fill="${look.skin}" stroke="${OUT}" stroke-width="1"/>
          ${face}<path d="M-8,-1 C-8,-12 12,-12 12,-1 Z" fill="#eeeeee" stroke="${OUT}" stroke-width="1"/>
          <path d="M11,-5 L20,-9 L18,-2 Z" fill="#eeeeee" stroke="${OUT}" stroke-width="0.8"/>`;
      case "dome": // goldener Kopf mit lila Kuppel und lila Mundpartie
        return `${face}<path d="M-7,-1 C-7,-11 11,-11 11,-1 C7,-4 -3,-4 -7,-1 Z" fill="#6a3fb0" stroke="${OUT}" stroke-width="0.8"/>
          <path d="M-3,6 Q2,11.5 7,6 Q2,8 -3,6 Z" fill="#9b6fd0"/>`;
      case "bald":
        return face;
      default: // spiky
        return hairPoly("-10,-6 -22,-18 -6,-13 -12,-28 0,-16 6,-30 10,-15 22,-22 12,-8 20,-2 8,2") + face;
    }
  };
  // Kopf: a/b = [x, y, drehung]
  const head = (a, b, dur) => {
    const ra = a[2] || 0, rb = b[2] || 0;
    const rot = ra === rb ? "" :
      `<animateTransform attributeName="transform" type="rotate" values="${ra};${rb};${ra}" dur="${dur}" repeatCount="indefinite" ${EASE}/>`;
    return `<g transform="translate(${a[0]},${a[1]})">${moveAnim(a, b, dur)}<g transform="rotate(${ra})">${rot}${headShape()}${faceFx()}</g></g>`;
  };
  // Gegenstand bewegen (Hantel usw.), Inhalt ist um (0,0) gezeichnet
  const mover = (a, b, content, dur) =>
    `<g transform="translate(${a[0]},${a[1]})">${moveAnim(a, b, dur)}${content}</g>`;
  // Zittern für Halte-Übungen
  const tremble = (content) =>
    `<g><animateTransform attributeName="transform" type="translate" values="0,0;0.8,-0.4;-0.7,0.3;0,0" dur="0.35s" repeatCount="indefinite"/>${content}</g>`;
  // Aufsteigende Ki-Funken für Halte-Übungen
  const sparks = Array.of([70, 0], [130, 0.6], [200, 1.2]).map(([x, delay]) =>
    `<circle cx="${x}" cy="100" r="2.2" fill="${auraCol}" opacity="0">
      <animate attributeName="cy" values="100;30" dur="1.8s" begin="${delay}s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0;0.9;0" dur="1.8s" begin="${delay}s" repeatCount="indefinite"/>
    </circle>`).join("");

  const dumbbell = `<line x1="-11" y1="0" x2="11" y2="0" stroke="#adb5bd" stroke-width="5"/>
    <rect x="-15" y="-8" width="7" height="16" rx="2" fill="${auraCol}"/><rect x="8" y="-8" width="7" height="16" rx="2" fill="${auraCol}"/>`;
  const barbell = `<line x1="-28" y1="0" x2="28" y2="0" stroke="#adb5bd" stroke-width="5" stroke-linecap="round"/>
    <rect x="-32" y="-12" width="10" height="24" rx="2" fill="${auraCol}"/><rect x="22" y="-12" width="10" height="24" rx="2" fill="${auraCol}"/>`;

  const bg = `<defs>
    <radialGradient id="kiAura" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${auraCol}" stop-opacity="0.5"/>
      <stop offset="100%" stop-color="${auraCol}" stop-opacity="0"/>
    </radialGradient>
    <linearGradient id="giGrad" gradientUnits="userSpaceOnUse" x1="60" y1="20" x2="200" y2="110">
      <stop offset="0%" stop-color="${look.top}"/>
      <stop offset="100%" stop-color="${look.top2}"/>
    </linearGradient>
  </defs>
  <ellipse cx="130" cy="70" rx="95" ry="48" fill="url(#kiAura)">
    <animate attributeName="opacity" values="0.65;1;0.65" dur="2.2s" repeatCount="indefinite"/>
    <animate attributeName="rx" values="92;102;92" dur="2.2s" repeatCount="indefinite"/>
  </ellipse>
  <line x1="20" y1="112" x2="240" y2="112" stroke="#3a3a48" stroke-width="3" stroke-linecap="round"/>`;

  // viewBox oben erweitert, damit die Haarspitzen nicht abgeschnitten werden
  const wrap = (inner) => `<svg viewBox="0 -16 260 141" width="235" height="128" role="img" aria-label="Übungs-Animation">${bg}${inner}</svg>`;

  const builders = {
    benchpress: () => { const d = "2s"; return wrap(`
      <rect x="65" y="84" width="115" height="10" rx="4" fill="#4a4e69"/>
      <line x1="80" y1="94" x2="80" y2="112" stroke="#8d99ae" stroke-width="6"/>
      <line x1="165" y1="94" x2="165" y2="112" stroke="#8d99ae" stroke-width="6"/>
      ${leg("155,80 185,84 195,110", "155,80 185,84 195,110", 12, d)}
      ${torso("95,78 155,78", "95,78 155,78", 15, d)}
      ${arm("116,74 121,54 126,36", "116,74 106,62 126,52", 9, d)}
      ${mover([126, 34], [126, 50], barbell, d)}
      ${head([78, 72, -80], [78, 72, -80], d)}`); },

    dumbbellcurl: () => { const d = "1.6s"; return wrap(`
      ${leg("120,76 112,108", "120,76 112,108", 13, d)}
      ${leg("132,76 140,108", "132,76 140,108", 13, d)}
      ${torso("126,40 126,76", "126,40 126,76", 18, d)}
      ${arm("130,46 134,70 138,92", "130,46 134,70 152,52", 9, d)}
      ${mover([139, 95], [154, 49], dumbbell, d)}
      ${head([126, 23, 0], [126, 22, 0], d)}`); },

    pushup: () => { const d = "1.8s"; return wrap(`
      ${leg("48,106 108,84", "48,106 108,98", 13, d, true)}
      ${torso("108,84 166,62", "108,98 168,92", 16, d, true)}
      ${arm("164,64 164,86 164,108", "166,92 150,98 164,108", 9, d)}
      ${head([184, 54, 18], [188, 86, 8], d)}`); },

    kneepushup: () => { const d = "1.8s"; return wrap(`
      ${leg("42,92 84,106 122,80", "42,92 84,106 124,94", 13, d, true)}
      ${torso("122,80 172,60", "124,94 176,90", 16, d, true)}
      ${arm("170,62 168,86 170,108", "174,90 156,98 170,108", 9, d)}
      ${head([188, 52, 18], [192, 84, 8], d)}`); },

    dips: () => { const d = "1.8s"; return wrap(`
      <polyline points="55,110 55,64 95,64 95,110" stroke="#555" stroke-width="5" fill="none"/>
      ${leg("124,84 162,86 184,108", "124,100 160,94 184,108", 13, d)}
      ${torso("116,46 124,84", "116,62 124,100", 16, d)}
      ${arm("116,48 104,56 92,64", "116,64 98,56 92,64", 8, d)}
      ${head([116, 30, 0], [116, 46, 0], d)}`); },

    plank: () => { const d = "2.6s"; return wrap(sparks + tremble(`
      ${leg("45,104 112,88", "45,104 112,86", 13, d, true)}
      ${torso("112,88 176,73", "112,86 176,72", 16, d, true)}
      ${arm("172,76 168,104 190,104", "172,75 168,104 190,104", 9, d)}
      ${head([194, 68, 12], [194, 67, 12], d)}`)); },

    situp: () => { const d = "1.8s"; return wrap(`
      ${leg("126,104 156,78 182,106", "126,104 156,78 182,106", 13, d)}
      ${torso("126,104 88,104", "126,104 106,62", 17, d, true)}
      ${head([74, 102, -85], [100, 46, -20], d)}`); },

    legraise: () => { const d = "2s"; return wrap(`
      ${arm("70,109 110,110", "70,109 110,110", 8, d)}
      ${torso("68,104 124,104", "68,104 124,104", 16, d)}
      ${leg("124,104 184,102", "124,104 166,46", 13, d)}
      ${head([52, 98, -75], [52, 98, -75], d)}`); },

    squat: () => { const d = "1.8s"; return wrap(`
      ${leg("130,70 132,90 130,110", "116,84 146,88 132,110", 13, d)}
      ${torso("130,36 130,70", "124,50 116,84", 17, d)}
      ${arm("130,44 156,48", "124,56 160,56", 9, d)}
      ${head([130, 20, 0], [127, 34, 8], d)}`); },

    lunge: () => { const d = "1.8s"; return wrap(`
      ${leg("124,70 108,90 98,110", "122,84 100,104 76,108", 12, d)}
      ${leg("124,70 142,90 150,110", "122,84 150,84 150,110", 13, d)}
      ${torso("124,38 124,70", "122,52 122,84", 17, d)}
      ${arm("124,44 118,62", "122,58 116,76", 8, d)}
      ${head([124, 22, 0], [122, 36, 0], d)}`); },

    wallsit: () => { const d = "2.6s"; return wrap(`
      <line x1="94" y1="-6" x2="94" y2="112" stroke="${auraCol}" stroke-width="5" stroke-linecap="round"/>
      ${sparks}${tremble(`
      ${leg("104,76 146,76 146,108", "104,77 146,77 146,108", 13, d)}
      ${torso("104,38 104,76", "104,39 104,77", 17, d)}
      ${arm("106,46 138,48", "106,47 138,49", 9, d)}
      ${head([106, 22, 0], [106, 23, 0], d)}`)}`); },

    punch: () => { const d = "0.9s"; return wrap(`
      ${leg("104,76 86,108", "104,76 86,108", 13, d)}
      ${leg("108,76 130,108", "108,76 130,108", 13, d)}
      ${arm("106,44 140,42 172,40", "106,44 122,54 130,40", 8, d, true)}
      ${torso("106,40 106,76", "106,40 106,76", 18, d)}
      ${arm("108,48 124,58 132,44", "108,48 141,47 174,46", 9, d)}
      <polygon points="188,44 218,34 208,44 218,54" fill="${auraCol}">
        <animate attributeName="opacity" values="1;0;1;0;1" keyTimes="0;0.25;0.5;0.75;1" dur="${d}" repeatCount="indefinite"/>
      </polygon>
      ${head([106, 24, 0], [108, 24, 3], d)}`); },

    jump: () => { const d = "0.9s"; return wrap(`
      ${leg("130,70 126,90 124,110", "130,64 114,86 104,108", 12, d)}
      ${leg("130,70 134,90 136,110", "130,64 146,86 156,108", 12, d)}
      ${torso("130,36 130,70", "130,30 130,64", 17, d)}
      ${arm("130,42 120,58 118,72", "130,36 114,22 104,8", 8, d)}
      ${arm("130,42 140,58 142,72", "130,36 146,22 156,8", 8, d)}
      ${head([130, 20, 0], [130, 14, 0], d)}`); }
  };
  return (Reflect.get(builders, pose) || builders.punch)();
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
// Antippen wählt den Krieger und geht direkt ins Training (ohne Detail-Zwischenschritt)
document.getElementById("card-curr").addEventListener("click", () => {
  state.selectedChar = CHARACTERS.at(state.carouselIndex).id;
  playSound("levelup");
  updateUI();
  renderWorkouts();
  showScreen("arena-screen");
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
  document.getElementById("ex-modal-tag").textContent = ex.isBoss ? "BOSS-HERAUSFORDERUNG" : "TECHNIK-GUIDE";
  document.getElementById("ex-modal-title").textContent = ex.title;
  document.getElementById("ex-modal-tip").textContent = ex.tip || "Volle Körperspannung!";
  document.getElementById("ex-complete-btn").textContent = `GESCHAFFT (+${ex.xp * mult} XP)`;

  const imgEl = document.getElementById("ex-comic-img");
  const svgEl = document.getElementById("ex-comic-svg");
  svgEl.innerHTML = getComicSVG(ex.pose || "punch");
  // Bei "Bewegung reduzieren" die Animation in der Startpose anhalten
  if (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    svgEl.querySelector("svg")?.pauseAnimations();
  }
  svgEl.style.display = "grid";
  loadSmartImage(imgEl, `ex_${ex.pose || "punch"}`, () => { svgEl.style.display = "grid"; }, () => { svgEl.style.display = "none"; });

  const timerArea = document.getElementById("ex-timer-area");
  const timerDisp = document.getElementById("ex-timer-display");
  const timerBtn = document.getElementById("ex-timer-start");

  if (ex.sec) {
    let remaining = ex.sec;
    timerArea.classList.remove("hidden");
    const fmt = (s) => {
      const t = Math.max(0, s);
      return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`;
    };
    timerDisp.textContent = fmt(remaining);
    timerBtn.textContent = "TIMER STARTEN";
    timerBtn.onclick = () => {
      clearInterval(timerInterval);
      remaining = ex.sec; // Neustart beginnt immer von vorn
      timerDisp.textContent = fmt(remaining);
      timerBtn.textContent = "NEU STARTEN";
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

// Nur Anzeige: Icon pro Übungsart (pose), siehe Icon-Set in index.html
const WORKOUT_ICONS = {
  dumbbellcurl: "dumbbell", benchpress: "barbell", pushup: "pushup", kneepushup: "pushup",
  dips: "chair", punch: "glove", plank: "timer", situp: "rotate", legraise: "legraise",
  squat: "squat", lunge: "steps", jump: "jump", wallsit: "wall"
};

function renderWorkouts() {
  const activePart = state.selectedPart === "core" ? BODY_WORKOUTS.core : (state.selectedPart === "legs" ? BODY_WORKOUTS.legs : BODY_WORKOUTS.arms);
  document.getElementById("selected-part-title").textContent = activePart.label;
  const list = document.getElementById("workout-list");
  list.innerHTML = "";
  const exercises = state.difficulty === "master" ? activePart.master : (state.difficulty === "advanced" ? activePart.advanced : activePart.easy);
  exercises.forEach(ex => {
    const btn = document.createElement("button");
    btn.className = "workout-card";
    const exIcon = icon(WORKOUT_ICONS[ex.pose] || "dumbbell");
    btn.innerHTML = `<span class="workout-ico">${exIcon}</span><div class="workout-text"><div class="workout-title">${ex.title}</div><div class="workout-sub">${ex.sub}</div></div><span class="xp-tag">+${ex.xp} XP</span>`;
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
    div.innerHTML = `<div class="trophy-name">${icon(ok ? t.icon : "lock")}<span>${t.name}</span></div><div class="trophy-desc">${t.desc}</div>`;
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
  // Nur Anzeige: Farbe des Kriegers für den Hintergrund-Verlauf im Trainingsscreen
  document.getElementById("arena-screen").style.setProperty("--char", charObj.color || "#ff9900");
  document.getElementById("level-label").textContent = `LVL ${state.level}`;
  document.getElementById("xp-text").textContent = `${state.xp} / ${xpNeeded} XP`;

  const pct = Math.min(100, (state.xp / xpNeeded) * 100);
  document.getElementById("ki-bar-fill").style.width = `${pct}%`;

  const calcPartLvl = (xp) => `LVL ${1 + Math.floor((xp || 0) / 60)}`;
  document.getElementById("stat-arms").textContent = calcPartLvl(state.partXP.arms);
  document.getElementById("stat-core").textContent = calcPartLvl(state.partXP.core);
  document.getElementById("stat-legs").textContent = calcPartLvl(state.partXP.legs);

  const streakEl = document.getElementById("streak-chip");
  if (streakEl) streakEl.innerHTML = `${icon("flame")}<span>${state.streak || 0} ${(state.streak || 0) === 1 ? "TAG" : "TAGE"}</span>`;

  const senzuBtn = document.getElementById("senzu-btn");
  if (senzuBtn) {
    const usedToday = state.senzuDate === getTodayKey();
    senzuBtn.className = "hud-chip";
    const senzuHtml = (lbl) => `<span class="hud-ico">${icon("bean")}</span><span class="hud-lbl">${lbl}</span>`;
    if (state.senzuActive) {
      senzuBtn.classList.add("senzu-on");
      senzuBtn.innerHTML = senzuHtml("2x AKTIV");
    } else if (usedToday) {
      senzuBtn.style.opacity = "0.45";
      senzuBtn.innerHTML = senzuHtml("LEER");
    } else {
      senzuBtn.style.opacity = "1";
      senzuBtn.classList.add("senzu-ready");
      senzuBtn.innerHTML = senzuHtml("SENZU 2x");
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
    btn.innerHTML = unlocked ? `STUFE ${s.stage}` : `${icon("lock")}${s.stage}`;
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
    <div class="levelup-card" style="max-width: 350px;">
      <span class="orange-tag">TURNIER-PORTAL GEÖFFNET</span>
      <h2 id="ticket-modal-title" class="tall-orange-title small">WELT-LEVEL 1</h2>
      <p id="ticket-modal-desc" class="poster-copy center" style="color:#fff;">
        Training erledigt! Starte jetzt deinen HD-Kampf!
      </p>
      <button id="ticket-play-now" class="tall-orange-btn">${icon("swords")}JETZT KÄMPFEN</button>
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
          <div id="lg-hero-name" class="legends-name">SON GOKU</div>
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

  const campDock = document.getElementById("campaign-dock") || document.querySelector(".hud-strip");
  if (campDock) {
    const campBtn = document.createElement("button");
    campBtn.id = "campaign-btn";
    campBtn.className = "hud-chip";
    campDock.appendChild(campBtn);
  }
  // Nur Anzeige: Fortschrittspunkte statt "(x/y)"
  const campDots = (filled, total) =>
    `<span class="camp-dots">${Array.from({ length: total }, (_, i) => `<i class="${i < filled ? "on" : ""}"></i>`).join("")}</span>`;

  const origOpenExerciseModal = openExerciseModal;
  openExerciseModal = function (ex) {
    origOpenExerciseModal(ex);
    const completeBtn = document.getElementById("ex-complete-btn");
    const mult = state.senzuActive ? 2 : 1;
    const finalLabel = `GESCHAFFT (+${ex.xp * mult} XP)`;
    clearInterval(window._paceGuardInterval);
    completeBtn.disabled = true;

    if (ex.sec) {
      completeBtn.textContent = "ERST TIMER BEENDEN";
      const timerBtn = document.getElementById("ex-timer-start");
      const origClick = timerBtn.onclick;
      timerBtn.onclick = function () {
        if (origClick) origClick();
        clearInterval(window._paceGuardInterval); // bei Neustart keinen zweiten Wächter starten
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
      // Timer startet automatisch beim Öffnen der Übung (Button bleibt zum Neustarten)
      timerBtn.onclick();
    } else {
      let waitSec = MIN_EXERCISE_SEC;
      completeBtn.textContent = `TRAINING LÄUFT · ${waitSec}s`;
      window._paceGuardInterval = setInterval(() => {
        waitSec -= 1;
        if (waitSec > 0) completeBtn.textContent = `TRAINING LÄUFT · ${waitSec}s`;
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
      campBtn.className = "hud-chip senzu-on camp-ready";
      campBtn.style.opacity = "1";
      campBtn.innerHTML = `<span class="camp-label">${icon("swords")}KAMPF STARTEN</span><span class="camp-count">${state.battleTickets}×</span>`;
    } else if (state.dailyTicketsEarned >= MAX_TICKETS_PER_DAY) {
      campBtn.className = "hud-chip camp-limit";
      campBtn.style.opacity = "0.5";
      campBtn.innerHTML = `<span class="camp-label">${icon("swords")}TAGESLIMIT</span>${campDots(MAX_TICKETS_PER_DAY, MAX_TICKETS_PER_DAY)}`;
    } else {
      campBtn.className = "hud-chip camp-progress";
      campBtn.style.opacity = "1";
      campBtn.innerHTML = `<span class="camp-label">${icon("swords")}KAMPF</span>${campDots(progress, EXERCISES_PER_TICKET)}`;
    }
    campBtn.setAttribute("aria-label", state.battleTickets > 0
      ? `Kampf starten, ${state.battleTickets} Ticket bereit`
      : `Kampf: ${progress} von ${EXERCISES_PER_TICKET} Übungen bis zum nächsten Ticket`);
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

  // =====================================================================
  // MINISPIELE AB WELT-LEVEL 2 – jede Runde ein anderes Spiel, jedes Mal neu erzeugt
  // =====================================================================
  const MINI_GAMES = [
    { id: "puzzle", name: "KI-STEIN-STAPEL", run: (env) => miniPuzzle(env) },
    { id: "runner", name: "SCHLUCHT-LAUF", run: (env) => miniRunner(env) },
    { id: "shooter", name: "HIMMELS-JAGD", run: (env) => miniShooter(env) },
    { id: "maze", name: "KI-LABYRINTH", run: (env) => miniMaze(env) },
    { id: "snake", name: "DRACHEN-SCHLANGE", run: (env) => miniSnake(env) },
    { id: "breaker", name: "KI-MAUERBRECHER", run: (env) => miniBreaker(env) }
  ];
  const MG_DIRS = { l: [-1, 0], r: [1, 0], u: [0, -1], d: [0, 1] };
  const MG_OPP = { l: "r", r: "l", u: "d", d: "u" };

  // Wischen auf dem Spielfeld -> Richtung (l/r/u/d); onTap z.B. zum Überspringen des Intros
  function mgSwipe(canvas, onDir, onTap) {
    let sx = 0, sy = 0, down = false;
    canvas.onpointerdown = (e) => { down = true; const p = mgCanvasPos(canvas, e); sx = p.x; sy = p.y; if (onTap) onTap(); };
    canvas.onpointermove = (e) => {
      if (!down) return;
      const p = mgCanvasPos(canvas, e);
      const dx = p.x - sx, dy = p.y - sy;
      if (Math.hypot(dx, dy) > 16) {
        onDir(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "r" : "l") : (dy > 0 ? "d" : "u"));
        sx = p.x; sy = p.y;
      }
    };
    canvas.onpointerup = () => { down = false; };
  }

  // Schatten-Wicht (Gegner in mehreren Minispielen)
  function mgShade(ctx, x, y, r, scared, t) {
    ctx.fillStyle = scared ? "#3a5ba0" : "#2b1d40";
    ctx.beginPath(); ctx.ellipse(x, y, r, r * 1.1, 0, 0, TAU); ctx.fill();
    ctx.fillStyle = scared ? "#e6f0ff" : "#ff2a55";
    const blink = Math.sin(t / 260 + x) > 0.96 ? 0.4 : 1;
    ctx.fillRect(x - r * 0.55, y - r * 0.3, r * 0.38, r * 0.28 * blink);
    ctx.fillRect(x + r * 0.17, y - r * 0.3, r * 0.38, r * 0.28 * blink);
  }
  const MG_W = 356, MG_H = 245;

  // Zufall mit Startwert (jede Runde anders)
  function mgRng(seed) {
    let s = (seed >>> 0) || 1;
    return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; return ((s >>> 0) % 1000003) / 1000003; };
  }

  // Partikel & schwebende Texte
  function mgFx() {
    let parts = [], floats = [];
    return {
      burst(x, y, col, n = 12) {
        for (let i = 0; i < n; i++) {
          const a = Math.random() * TAU, sp = 1.5 + Math.random() * 4;
          parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp, col, life: 22 });
        }
      },
      text(x, y, txt, col) { floats.push({ x, y, txt, col, life: 46 }); },
      draw(ctx, dt) {
        parts = parts.filter(p => {
          p.x += p.vx * dt; p.y += p.vy * dt; p.life -= dt;
          ctx.fillStyle = p.col; ctx.fillRect(p.x, p.y, 3.5, 3.5);
          return p.life > 0;
        });
        ctx.font = "bold 15px Anton, sans-serif";
        ctx.textAlign = "center";
        floats = floats.filter(f => {
          f.y -= 0.7 * dt; f.life -= dt;
          ctx.fillStyle = "#000"; ctx.fillText(f.txt, f.x + 1.5, f.y + 1.5);
          ctx.fillStyle = f.col; ctx.fillText(f.txt, f.x, f.y);
          return f.life > 0;
        });
        ctx.textAlign = "left";
      }
    };
  }

  // Spielschleife mit Delta-Time (dt = 1 entspricht 60 fps)
  function mgLoop(step) {
    const FRAME_MS = 1000 / 60;
    let last = null;
    function frame(t) {
      const dt = last === null ? 1 : Math.min(3, Math.max(0, (t - last) / FRAME_MS));
      last = t;
      step(dt, t);
      animFrameId = requestAnimationFrame(frame);
    }
    animFrameId = requestAnimationFrame(frame);
  }

  function mgButtons(ctrlArea, defs) {
    ctrlArea.innerHTML = defs.map(d =>
      `<button id="${d.id}" type="button" class="l-card mg-btn ${d.cls || ""}" style="grid-column: span ${d.span || 1};">${icon(d.icon)}${d.label}${d.sub ? `<span>${d.sub}</span>` : ""}</button>`
    ).join("");
    const el = {};
    defs.forEach(d => { el[d.id] = document.getElementById(d.id); });
    return el;
  }
  function mgTap(btn, fn) {
    btn.addEventListener("pointerdown", (e) => { e.preventDefault(); fn(); });
  }
  function mgHold(btn, onDown, onUp) {
    btn.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      try { btn.setPointerCapture(e.pointerId); } catch (_) {}
      onDown();
    });
    ["pointerup", "pointercancel", "lostpointercapture"].forEach(ev => btn.addEventListener(ev, onUp));
  }
  // Canvas-Koordinaten aus einem Pointer-Event
  function mgCanvasPos(canvas, e) {
    const r = canvas.getBoundingClientRect();
    return { x: (e.clientX - r.left) / r.width * MG_W, y: (e.clientY - r.top) / r.height * MG_H };
  }

  function mgIntro(ctx, timer, title, lines) {
    if (timer <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.min(1, timer / 18);
    ctx.fillStyle = "rgba(5, 5, 9, 0.84)";
    ctx.fillRect(0, 0, MG_W, MG_H);
    ctx.textAlign = "center";
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 26px Anton, sans-serif";
    ctx.fillText(title, MG_W / 2, 78);
    ctx.font = "700 13px Rajdhani, sans-serif";
    ctx.fillStyle = "#c9c9d4";
    lines.forEach((l, i) => ctx.fillText(l, MG_W / 2, 108 + i * 19));
    ctx.fillStyle = timer < 45 ? "#ff9f1c" : "#6f6f7c";
    ctx.font = timer < 45 ? "bold 30px Anton, sans-serif" : "700 11px Rajdhani, sans-serif";
    ctx.fillText(timer < 45 ? "LOS!" : "ANTIPPEN ZUM STARTEN", MG_W / 2, 205);
    ctx.restore();
  }

  function mgKO(ctx, sim) {
    if (!sim.koBanner) return;
    ctx.fillStyle = "rgba(0, 0, 0, 0.68)";
    ctx.fillRect(0, 92, MG_W, 58);
    ctx.fillStyle = sim.koBanner === "NIEDERLAGE" ? "#ff0055" : "#ffe66d";
    ctx.font = "bold 36px Anton, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(sim.koBanner, MG_W / 2, 133);
    ctx.textAlign = "left";
  }

  function mgPanel(ctx, x, y, w, h, alpha = 0.72) {
    ctx.fillStyle = `rgba(8, 8, 12, ${alpha})`;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, 6); else ctx.rect(x, y, w, h);
    ctx.fill();
  }

  // Kleine Ki-Kugel mit Stern (Sammelobjekt/Bonusfeld)
  function mgOrb(ctx, x, y, r, t) {
    const g = ctx.createRadialGradient(x - r * 0.3, y - r * 0.3, 1, x, y, r * 1.8);
    g.addColorStop(0, "#fff3c4"); g.addColorStop(0.35, "#ffb020"); g.addColorStop(0.6, "rgba(255, 140, 0, 0.5)"); g.addColorStop(1, "rgba(255, 140, 0, 0)");
    ctx.fillStyle = g;
    ctx.beginPath(); ctx.arc(x, y, r * 1.8, 0, TAU); ctx.fill();
    ctx.fillStyle = "#e5383b";
    ctx.beginPath();
    for (let i = 0; i < 10; i++) {
      const a = -Math.PI / 2 + i * Math.PI / 5 + Math.sin(t / 400) * 0.2;
      const rr = i % 2 === 0 ? r * 0.5 : r * 0.22;
      ctx.lineTo(x + Math.cos(a) * rr, y + Math.sin(a) * rr);
    }
    ctx.closePath(); ctx.fill();
  }

  // ---------------------------------------------------------------------
  // SPIEL 1: KI-STEIN-STAPEL – Steine stapeln, volle Reihen feuern Ki-Strahlen
  // ---------------------------------------------------------------------
  function miniPuzzle(env) {
    const { ctx, canvas, ctrlArea, lvl, sim, heroObj, enemySprite, heroSprite } = env;
    const rnd = mgRng(Date.now() ^ (lvl * 7919));
    const fx = mgFx();
    const COLS = 7 + Math.floor(rnd() * 3); // 7–9 breit, jede Runde anders
    const ROWS = 16, CS = 13;
    const BX = 12, BY = Math.round((MG_H - ROWS * CS) / 2);
    const PAL = ["#ff9f1c", "#4cc9f0", "#ff4d6d", "#80ed99", "#c77dff", "#ffd166", "#f15bb5", "#00f5d4", "#a0c4ff"];
    // Eigene Steinformen mit 1–4 Feldern
    const SHAPES = [
      [[0, 0]], [[0, 0], [1, 0]], [[0, 0], [1, 0], [2, 0]], [[0, 0], [0, 1], [1, 1]],
      [[0, 0], [1, 0], [0, 1], [1, 1]], [[0, 0], [1, 0], [2, 0], [1, 1]], [[0, 0], [1, 0], [1, 1], [2, 1]],
      [[0, 0], [0, 1], [0, 2], [1, 2]], [[0, 0], [1, 0], [2, 0], [3, 0]]
    ];
    const weights = SHAPES.map(() => 0.4 + rnd());
    const orbChance = 0.1 + rnd() * 0.12;
    const fallBase = Math.max(9, 40 - (lvl - 2) * 2.4) * (0.85 + rnd() * 0.3);
    const enemyMax = 120 + (lvl - 2) * 20;
    sim.enemyHp = enemyMax; sim.maxEnemyHp = enemyMax; sim.heroHp = 100; sim.ki = 0;

    const grid = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
    const pickShape = () => {
      let r = rnd() * weights.reduce((a, b) => a + b, 0);
      for (let i = 0; i < SHAPES.length; i++) { r -= weights[i]; if (r <= 0) return i; }
      return 0;
    };
    const makePiece = () => {
      const i = pickShape();
      const cells = SHAPES[i].map(c => c.slice());
      const w = Math.max(...cells.map(c => c[0])) + 1;
      return { cells, x: Math.floor((COLS - w) / 2), y: 0, col: PAL[i % PAL.length], orb: rnd() < orbChance ? Math.floor(rnd() * cells.length) : -1 };
    };
    const fits = (cells, x, y) => cells.every(([cx, cy]) => {
      const gx = x + cx, gy = y + cy;
      return gx >= 0 && gx < COLS && gy < ROWS && (gy < 0 || !grid[gy][gx]);
    });
    const rotate = (cells) => {
      const r = cells.map(([x, y]) => [-y, x]);
      const mx = Math.min(...r.map(c => c[0])), my = Math.min(...r.map(c => c[1]));
      return r.map(([x, y]) => [x - mx, y - my]);
    };

    const G = { piece: null, next: makePiece(), fallT: 0, intro: 170, beamT: 0, shake: 0,
      garbT: 480 + rnd() * 240, warnT: 0, warnMax: 150 };
    const spawn = () => {
      G.piece = G.next; G.next = makePiece();
      if (!fits(G.piece.cells, G.piece.x, G.piece.y)) env.end(false);
    };
    spawn();

    const active = () => G.piece && G.intro <= 0 && !sim.over;
    const move = (dx) => { if (active() && fits(G.piece.cells, G.piece.x + dx, G.piece.y)) G.piece.x += dx; };
    const turn = () => {
      if (!active()) return;
      const r = rotate(G.piece.cells);
      for (const k of [0, -1, 1, -2, 2]) {
        if (fits(r, G.piece.x + k, G.piece.y)) { G.piece.cells = r; G.piece.x += k; return; }
      }
    };
    const hardDrop = () => {
      if (!active()) return;
      while (fits(G.piece.cells, G.piece.x, G.piece.y + 1)) G.piece.y++;
      lock();
    };

    function lock() {
      const p = G.piece;
      for (let i = 0; i < p.cells.length; i++) {
        const gy = p.y + p.cells[i][1], gx = p.x + p.cells[i][0];
        if (gy < 0) { env.end(false); return; }
        grid[gy][gx] = { col: p.col, orb: i === p.orb };
      }
      let rows = 0, orbs = 0;
      for (let r = ROWS - 1; r >= 0; r--) {
        if (grid[r].every(c => c)) {
          orbs += grid[r].filter(c => c.orb).length;
          grid.splice(r, 1); grid.unshift(Array(COLS).fill(null));
          rows++; r++;
        }
      }
      if (rows > 0) {
        let dmg = 14 * rows + 10 * (rows - 1) * (rows - 1) + orbs * 12 + env.heroStage * 2;
        if (sim.ki >= 100) { dmg *= 2; sim.ki = 0; fx.text(260, 46, "KI-BOOST ×2!", "#00f5d4"); }
        else sim.ki = Math.min(100, sim.ki + rows * 14 + orbs * 10);
        sim.enemyHp -= dmg;
        G.beamT = 26; G.shake = 6 + rows * 2;
        fx.text(266, 66, rows > 1 ? `${rows} REIHEN! -${dmg}` : `-${dmg}`, "#ffe66d");
        fx.burst(312, 150, heroObj.color, 14 + rows * 4);
        playFightSfx(rows > 1 ? "beam" : "hit");
        if (G.warnT > 0) { G.warnT = 0; G.garbT = 460 + rnd() * 260; fx.text(BX + COLS * CS / 2, 40, "ABGEWEHRT!", "#00f5d4"); }
        if (sim.enemyHp <= 0) { sim.enemyHp = 0; env.end(true); return; }
      } else {
        playFightSfx("click");
      }
      spawn();
    }

    function addGarbage(n) {
      for (let k = 0; k < n; k++) {
        if (grid[0].some(c => c)) { env.end(false); return; }
        grid.shift();
        const gap = Math.floor(rnd() * COLS);
        grid.push(Array.from({ length: COLS }, (_, i) => (i === gap ? null : { col: "#5c5c6a", orb: false })));
      }
      const p = G.piece;
      while (p && !fits(p.cells, p.x, p.y) && p.y > -4) p.y--;
      G.shake = 9; playFightSfx("hit");
      fx.text(BX + COLS * CS / 2, BY + ROWS * CS - 10, "MÜLL-REIHE!", "#ff4d6d");
    }

    const b = mgButtons(ctrlArea, [
      { id: "pz-l", icon: "left", label: "LINKS" },
      { id: "pz-r", icon: "right", label: "RECHTS" },
      { id: "pz-t", icon: "rotate", label: "DREHEN", cls: "vanish" },
      { id: "pz-d", icon: "drop", label: "FALLEN", cls: "special" }
    ]);
    mgTap(b["pz-l"], () => move(-1));
    mgTap(b["pz-r"], () => move(1));
    mgTap(b["pz-t"], turn);
    mgTap(b["pz-d"], hardDrop);
    canvas.onpointerdown = () => { if (G.intro > 45) G.intro = 45; };
    const cell = (x, y, col, orb, alpha, t) => {
      ctx.globalAlpha = alpha;
      ctx.fillStyle = col; ctx.fillRect(x + 0.5, y + 0.5, CS - 1, CS - 1);
      ctx.fillStyle = "rgba(255,255,255,0.28)"; ctx.fillRect(x + 1.5, y + 1.5, CS - 3, 2.5);
      ctx.fillStyle = "rgba(0,0,0,0.25)"; ctx.fillRect(x + 1.5, y + CS - 3.5, CS - 3, 2);
      ctx.globalAlpha = 1;
      if (orb) mgOrb(ctx, x + CS / 2, y + CS / 2, 4.2, t);
    };

    mgLoop((dt, t) => {
      if (!sim.over) {
        if (G.intro > 0) G.intro -= dt;
        else {
          G.fallT += dt;
          if (G.fallT >= fallBase) {
            G.fallT = 0;
            if (fits(G.piece.cells, G.piece.x, G.piece.y + 1)) G.piece.y++; else lock();
          }
          if (!sim.over) {
            if (G.warnT > 0) {
              G.warnT -= dt;
              if (G.warnT <= 0) { addGarbage(lvl >= 6 ? 2 : 1); G.garbT = Math.max(260, 520 - lvl * 18) + rnd() * 240; }
            } else {
              G.garbT -= dt;
              if (G.garbT <= 0) { G.warnT = G.warnMax; playFightSfx("charge"); }
            }
          }
        }
      }
      let top = ROWS;
      for (let r = 0; r < ROWS; r++) if (grid[r].some(c => c)) { top = r; break; }
      sim.heroHp = Math.round((top / ROWS) * 100);

      ctx.save();
      if (G.shake > 0) { ctx.translate((Math.random() - 0.5) * G.shake, (Math.random() - 0.5) * G.shake); G.shake *= Math.pow(0.82, dt); if (G.shake < 0.3) G.shake = 0; }
      drawStageBackground(ctx, MG_W, MG_H, t * 0.03, lvl - 1, t);

      // Spielfeld
      mgPanel(ctx, BX - 4, BY - 4, COLS * CS + 8, ROWS * CS + 8, 0.8);
      ctx.strokeStyle = "rgba(255,255,255,0.05)"; ctx.lineWidth = 1;
      for (let c = 1; c < COLS; c++) { ctx.beginPath(); ctx.moveTo(BX + c * CS, BY); ctx.lineTo(BX + c * CS, BY + ROWS * CS); ctx.stroke(); }
      if (G.warnT > 0) {
        ctx.fillStyle = `rgba(255, 60, 90, ${0.18 + 0.18 * Math.abs(Math.sin(t / 90))})`;
        ctx.fillRect(BX, BY + ROWS * CS - CS * 2, COLS * CS, CS * 2);
      }
      for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
        const v = grid[r][c]; if (v) cell(BX + c * CS, BY + r * CS, v.col, v.orb, 1, t);
      }
      if (G.piece && !sim.over) {
        const p = G.piece;
        let gy = p.y; while (fits(p.cells, p.x, gy + 1)) gy++;
        p.cells.forEach(([cx, cy]) => {
          ctx.strokeStyle = "rgba(255,255,255,0.35)";
          ctx.strokeRect(BX + (p.x + cx) * CS + 1.5, BY + (gy + cy) * CS + 1.5, CS - 3, CS - 3);
        });
        p.cells.forEach(([cx, cy], i) => { if (p.y + cy >= 0) cell(BX + (p.x + cx) * CS, BY + (p.y + cy) * CS, p.col, i === p.orb, 1, t); });
      }

      // Vorschau
      const PX = BX + COLS * CS + 14;
      mgPanel(ctx, PX, 10, 60, 58);
      ctx.fillStyle = "#9a9aa8"; ctx.font = "700 10px Rajdhani, sans-serif"; ctx.fillText("NÄCHSTER", PX + 8, 23);
      G.next.cells.forEach(([cx, cy], i) => cell(PX + 10 + cx * 11, 30 + cy * 11, G.next.col, i === G.next.orb, 1, t));
      if (G.warnT > 0) {
        mgPanel(ctx, PX, 76, 74, 40);
        ctx.fillStyle = "#ff4d6d"; ctx.font = "bold 13px Anton, sans-serif";
        ctx.fillText("ANGRIFF!", PX + 8, 92);
        ctx.font = "700 10px Rajdhani, sans-serif"; ctx.fillStyle = "#e6e6ec";
        ctx.fillText(`Reihe lösen · ${(G.warnT / 60).toFixed(1)}s`, PX + 8, 106);
      }

      // Kämpfer + Ki-Strahl
      drawFighterUnstretched(ctx, heroSprite, PX + 40, 232, { color: heroObj.color, t, maxW: 54, maxH: 84 });
      drawFighterUnstretched(ctx, enemySprite, 316, 232, { color: "#ff0055", flip: true, t: t + 900, maxW: 58, maxH: 92 });
      if (G.beamT > 0) { G.beamT -= dt; drawBeam(ctx, PX + 58, 300, 182, 16 * Math.min(1, G.beamT / 8), heroObj.color, t); }

      fx.draw(ctx, dt);
      mgIntro(ctx, G.intro, "KI-STEIN-STAPEL", [
        "Stapel die Steine – jede volle Reihe feuert einen Ki-Strahl.",
        `Feld ${COLS} breit · mehr Reihen = mehr Schaden · Ki-Kugeln = Bonus`,
        "Bei ANGRIFF schnell eine Reihe lösen, sonst kommt Müll!"
      ]);
      mgKO(ctx, sim);
      ctx.restore();
      env.bars();
    });
  }

  // ---------------------------------------------------------------------
  // SPIEL 2: SCHLUCHT-LAUF – zufällig erzeugte Strecke mit Lücken & Gegnern
  // ---------------------------------------------------------------------
  function miniRunner(env) {
    const { ctx, canvas, ctrlArea, lvl, sim, heroObj, enemySprite, heroSprite } = env;
    const rnd = mgRng(Date.now() ^ (lvl * 104729));
    const fx = mgFx();
    const diff = Math.min(1, (lvl - 2) / 10);
    const plats = [], rocks = [], mobs = [], orbs = [];
    let x = 370, y = 192;
    plats.push({ x: -60, w: 430, y });
    const LEN = 2900 + (lvl - 2) * 220 + rnd() * 600;
    while (x < LEN) {
      if (rnd() < 0.3 + diff * 0.15) x += 36 + rnd() * 30 + diff * 22; // Lücke
      if (rnd() < 0.5) y = Math.max(150, Math.min(205, y + (rnd() < 0.55 ? 1 : -1) * (14 + rnd() * 14)));
      const w = 110 + rnd() * 170;
      plats.push({ x, w, y });
      if (w > 150 && rnd() < 0.45 + diff * 0.25) rocks.push({ x: x + 55 + rnd() * (w - 100), y, h: 14 + rnd() * 8 });
      else if (w > 150 && rnd() < 0.45 + diff * 0.25) mobs.push({ x: x + 60 + rnd() * (w - 100), y, alive: true, ph: rnd() * 6 });
      const oc = Math.floor(rnd() * 4);
      for (let i = 0; i < oc; i++) orbs.push({ x: x + 24 + i * 22, y: y - 30 - rnd() * 26, got: false });
      if (rnd() < 0.28) {
        const fy = y - 58 - rnd() * 14, fx0 = x + w * 0.25;
        plats.push({ x: fx0, w: 56 + rnd() * 40, y: fy, float: true });
        orbs.push({ x: fx0 + 26, y: fy - 22, got: false });
      }
      x += w;
    }
    const END = x + 60;
    plats.push({ x, w: 460, y });
    const endY = y;
    const totalOrbs = orbs.length;

    const SPEED = 2.5 + Math.min(1.5, (lvl - 2) * 0.12);
    const HERO_SX = 78;
    const H = { wx: 30, y: 192, vy: 0, ground: true, jumps: 0, inv: 0, hearts: 3, shootCd: 0 };
    const blasts = [], shots = [];
    let shotT = 260 + rnd() * 200, warn = null;
    let intro = 170, shake = 0, finale = 0, got = 0;
    sim.enemyHp = 100; sim.maxEnemyHp = 100; sim.heroHp = 100; sim.ki = 0;

    const landOn = (wx, prevFeet, feet) => {
      let best = null;
      for (const p of plats) {
        if (wx + 7 >= p.x && wx - 7 <= p.x + p.w && prevFeet <= p.y + 1 && feet >= p.y && (!best || p.y < best.y)) best = p;
      }
      return best;
    };
    const stepUp = (wx, feet) => plats.find(p => !p.float && wx + 7 >= p.x && wx - 7 <= p.x + p.w && p.y < feet && feet - p.y <= 30);
    const hurt = (why) => {
      if (H.inv > 0 || sim.over) return;
      H.hearts -= 1; H.inv = 90; shake = 9; playFightSfx("hit");
      fx.text(HERO_SX, H.y - 60, why, "#ff4d6d");
      if (H.hearts <= 0) env.end(false);
    };

    const jump = () => {
      if (intro > 0 || sim.over || finale > 0) return;
      if (H.ground) { H.vy = -7.6; H.ground = false; H.jumps = 1; playFightSfx("click"); }
      else if (H.jumps < 2) { H.vy = -6.6; H.jumps = 2; fx.burst(HERO_SX, H.y - 10, heroObj.color, 10); playFightSfx("zap"); }
    };
    const shoot = () => {
      if (intro > 0 || sim.over || H.shootCd > 0 || finale > 0) return;
      blasts.push({ wx: H.wx + 16, y: H.y - 26, life: 0 });
      H.shootCd = 22; playFightSfx("zap");
    };
    const b = mgButtons(ctrlArea, [
      { id: "rn-j", icon: "up", label: "SPRINGEN", sub: "2× = FLIEGEN", span: 2, cls: "vanish" },
      { id: "rn-s", icon: "bolt", label: "KI-SCHUSS", sub: "Gegner & Schüsse", span: 2, cls: "special" }
    ]);
    mgTap(b["rn-j"], jump);
    mgTap(b["rn-s"], shoot);
    canvas.onpointerdown = () => { if (intro > 45) intro = 45; else jump(); };
    const drawPlat = (p, sx) => {
      if (p.float) {
        ctx.fillStyle = "#3d3358"; ctx.fillRect(sx, p.y, p.w, 9);
        ctx.fillStyle = "#b9a7e0"; ctx.fillRect(sx, p.y, p.w, 2.5);
        return;
      }
      const g = ctx.createLinearGradient(0, p.y, 0, MG_H);
      g.addColorStop(0, "#6b4630"); g.addColorStop(1, "#1d120c");
      ctx.fillStyle = g; ctx.fillRect(sx, p.y, p.w, MG_H - p.y);
      ctx.fillStyle = "#d39a5e"; ctx.fillRect(sx, p.y, p.w, 3);
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      for (let k = 12; k < p.w - 6; k += 26) ctx.fillRect(sx + k, p.y + 10 + ((k * 7) % 13), 9, 3);
    };

    mgLoop((dt, t) => {
      if (!sim.over && intro > 0) intro -= dt;
      else if (!sim.over && finale > 0) {
        finale -= dt;
        if (finale <= 0) { sim.enemyHp = 0; env.end(true); }
      } else if (!sim.over) {
        H.wx += SPEED * dt;
        if (H.inv > 0) H.inv -= dt;
        if (H.shootCd > 0) H.shootCd -= dt;
        const prev = H.y;
        H.vy += 0.45 * dt; H.y += H.vy * dt;
        if (H.vy >= 0) {
          const g = landOn(H.wx, prev, H.y);
          if (g) { H.y = g.y; H.vy = 0; H.ground = true; H.jumps = 0; } else H.ground = false;
        }
        if (H.ground) { const s = stepUp(H.wx, H.y); if (s) H.y = s.y; }
        if (H.y > MG_H + 30) {
          hurt("ABGESTÜRZT!");
          const next = plats.find(p => !p.float && p.x + p.w > H.wx + 40);
          if (next) { H.wx = Math.max(next.x + 12, H.wx); H.y = next.y - 40; H.vy = 0; }
        }
        rocks.forEach(r => {
          if (Math.abs(H.wx - r.x) < 11 && H.y > r.y - r.h + 3 && H.y <= r.y + 2) hurt("AUTSCH!");
        });
        mobs.forEach(m => {
          if (!m.alive) return;
          m.x -= 0.55 * dt; m.ph += 0.1 * dt;
          if (Math.abs(H.wx - m.x) < 13 && H.y > m.y - 20 && H.y <= m.y + 4) { m.alive = false; fx.burst(HERO_SX + (m.x - H.wx), m.y - 10, "#7b2cbf", 14); hurt("TREFFER!"); }
        });
        orbs.forEach(o => {
          if (!o.got && Math.abs(H.wx - o.x) < 14 && Math.abs((H.y - 24) - o.y) < 22) {
            o.got = true; got++; sim.ki = Math.min(100, (got / Math.max(1, totalOrbs)) * 100);
            fx.burst(HERO_SX + (o.x - H.wx), o.y, "#ffb020", 8); playFightSfx("select");
          }
        });
        // Gegner schießt vom Ziel aus
        if (warn) {
          warn.t -= dt;
          if (warn.t <= 0) { shots.push({ wx: H.wx + 300, y: warn.y }); warn = null; }
        } else {
          shotT -= dt;
          if (shotT <= 0) {
            const high = rnd() < 0.4;
            warn = { t: Math.max(36, 62 - lvl * 2), y: high ? H.y - 62 : H.y - 12, high };
            shotT = Math.max(120, 300 - lvl * 14) + rnd() * 160;
          }
        }
        shots.forEach(s => { s.wx -= 4.2 * dt; });
        for (let i = shots.length - 1; i >= 0; i--) {
          const s = shots[i];
          const bodyTop = H.y - 46;
          if (Math.abs(s.wx - H.wx) < 11 && s.y > bodyTop && s.y < H.y) { shots.splice(i, 1); hurt("GETROFFEN!"); }
          else if (s.wx < H.wx - 200) shots.splice(i, 1);
        }
        for (let i = blasts.length - 1; i >= 0; i--) {
          const bl = blasts[i];
          bl.wx += 8 * dt; bl.life += dt;
          let hit = false;
          mobs.forEach(m => { if (m.alive && Math.abs(bl.wx - m.x) < 12 && Math.abs(bl.y - (m.y - 10)) < 18) { m.alive = false; hit = true; fx.burst(HERO_SX + (m.x - H.wx), m.y - 10, "#c77dff", 14); playFightSfx("hit"); } });
          for (let k = shots.length - 1; k >= 0; k--) {
            if (Math.abs(bl.wx - shots[k].wx) < 14 && Math.abs(bl.y - shots[k].y) < 16) { shots.splice(k, 1); hit = true; fx.text(HERO_SX + (bl.wx - H.wx), bl.y - 10, "GEKONTERT!", "#00f5d4"); }
          }
          if (hit || bl.life > 50) blasts.splice(i, 1);
        }
        if (H.wx >= END) { finale = 60; playFightSfx("beam"); }
      }

      sim.heroHp = (H.hearts / 3) * 100;
      sim.enemyHp = finale > 0 || sim.over ? Math.min(sim.enemyHp, 100 * (1 - Math.min(1, H.wx / END))) : 100 * (1 - Math.min(1, H.wx / END));
      const camX = H.wx - HERO_SX;

      ctx.save();
      if (shake > 0) { ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake); shake *= Math.pow(0.82, dt); if (shake < 0.3) shake = 0; }
      drawStageBackground(ctx, MG_W, MG_H, camX * 0.6, 1 + lvl, t);
      plats.forEach(p => { const sx = p.x - camX; if (sx < MG_W + 10 && sx + p.w > -10) drawPlat(p, sx); });
      rocks.forEach(r => {
        const sx = r.x - camX; if (sx < -20 || sx > MG_W + 20) return;
        ctx.fillStyle = "#4a4550";
        ctx.beginPath(); ctx.moveTo(sx - 9, r.y); ctx.lineTo(sx - 6, r.y - r.h * 0.7); ctx.lineTo(sx, r.y - r.h); ctx.lineTo(sx + 7, r.y - r.h * 0.6); ctx.lineTo(sx + 9, r.y); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.18)"; ctx.fillRect(sx - 3, r.y - r.h + 3, 4, 3);
      });
      mobs.forEach(m => {
        if (!m.alive) return;
        const sx = m.x - camX; if (sx < -20 || sx > MG_W + 20) return;
        const by = m.y - 10 - Math.abs(Math.sin(m.ph)) * 4;
        ctx.fillStyle = "#2b1d40"; ctx.beginPath(); ctx.ellipse(sx, by, 10, 11, 0, 0, TAU); ctx.fill();
        ctx.fillStyle = "#ff2a55"; ctx.fillRect(sx - 6, by - 4, 3.5, 2.5); ctx.fillRect(sx - 1, by - 4, 3.5, 2.5);
      });
      orbs.forEach(o => { if (!o.got) { const sx = o.x - camX; if (sx > -15 && sx < MG_W + 15) mgOrb(ctx, sx, o.y + Math.sin(t / 300 + o.x) * 2, 5, t); } });
      const ex = END + 70 - camX;
      if (ex < MG_W + 60) drawFighterUnstretched(ctx, enemySprite, ex, endY, { color: "#ff0055", flip: true, t: t + 900, maxW: 46, maxH: 66 });
      shots.forEach(s => {
        const sx = s.wx - camX;
        const g = ctx.createRadialGradient(sx, s.y, 1, sx, s.y, 12);
        g.addColorStop(0, "#fff"); g.addColorStop(0.4, "#ff2a55"); g.addColorStop(1, "rgba(255,42,85,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(sx, s.y, 12, 0, TAU); ctx.fill();
      });
      blasts.forEach(bl => {
        const sx = bl.wx - camX;
        ctx.strokeStyle = heroObj.color; ctx.lineWidth = 5; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(sx - 14, bl.y); ctx.lineTo(sx, bl.y); ctx.stroke();
        ctx.strokeStyle = "#fff"; ctx.lineWidth = 2; ctx.beginPath(); ctx.moveTo(sx - 10, bl.y); ctx.lineTo(sx, bl.y); ctx.stroke();
      });
      if (warn) {
        ctx.fillStyle = `rgba(255, 42, 85, ${0.5 + 0.5 * Math.abs(Math.sin(t / 70))})`;
        ctx.font = "bold 22px Anton, sans-serif"; ctx.fillText("!", MG_W - 16, warn.y + 8);
        ctx.font = "700 10px Rajdhani, sans-serif"; ctx.fillText(warn.high ? "OBEN" : "UNTEN", MG_W - 44, warn.y + 4);
      }
      if (!(H.inv > 0 && Math.floor(t / 70) % 2 === 0)) {
        drawFighterUnstretched(ctx, heroSprite, HERO_SX, H.y, { color: heroObj.color, t, maxW: 36, maxH: 50 });
      }
      if (finale > 0) drawBeam(ctx, HERO_SX + 16, ex - 10, H.y - 26, 18, heroObj.color, t);

      // Anzeige: Herzen, Fortschritt, Kugeln
      for (let i = 0; i < 3; i++) {
        ctx.fillStyle = i < H.hearts ? "#ff4d6d" : "rgba(255,255,255,0.18)";
        ctx.beginPath(); ctx.arc(14 + i * 15, 14, 5, 0, TAU); ctx.fill();
      }
      mgPanel(ctx, 70, 8, 216, 12, 0.6);
      ctx.fillStyle = heroObj.color; ctx.fillRect(72, 11, 212 * Math.min(1, H.wx / END), 6);
      ctx.fillStyle = "#e6e6ec"; ctx.font = "700 10px Rajdhani, sans-serif";
      ctx.fillText(`KUGELN ${got}/${totalOrbs}`, 292, 18);

      fx.draw(ctx, dt);
      mgIntro(ctx, intro, "SCHLUCHT-LAUF", [
        "Lauf durch die Schlucht bis zum Gegner am Ende.",
        "SPRINGEN über Lücken & Felsen – zweimal tippen = kurz fliegen.",
        "KI-SCHUSS gegen Schatten-Wichte und Schüsse. 3 Leben!"
      ]);
      mgKO(ctx, sim);
      ctx.restore();
      env.bars();
    });
  }

  // ---------------------------------------------------------------------
  // SPIEL 3: HIMMELS-JAGD – Gegnerwellen abschießen, dann Boss mit wechselnden Mustern
  // ---------------------------------------------------------------------
  function miniShooter(env) {
    const { ctx, canvas, ctrlArea, lvl, sim, heroObj, enemySprite, heroSprite } = env;
    const rnd = mgRng(Date.now() ^ (lvl * 15485863));
    const pick = (arr) => arr[Math.floor(rnd() * arr.length)];
    const fx = mgFx();
    const scale = 1 + (lvl - 2) * 0.07;
    const H = { x: 46, y: 122, ty: 122, inv: 0, fireT: 0, spread: 0, up: false, down: false };
    const enemies = [], bullets = [], shots = [], items = [];
    sim.heroHp = 100; sim.ki = 0;

    // Wellen jedes Mal neu zusammenstellen
    const TYPES = {
      drone: { hp: 1, r: 8, col: "#ff4d6d", vx: 2.4 },
      zig: { hp: 2, r: 9, col: "#c77dff", vx: 1.9 },
      turret: { hp: 4, r: 11, col: "#ff9f1c", vx: 1.6 },
      rock: { hp: 6, r: 15, col: "#7d7a86", vx: 1.1 }
    };
    const spawns = [];
    let tt = 40;
    const waves = 4 + Math.min(4, Math.floor((lvl - 2) / 2));
    for (let w = 0; w < waves; w++) {
      const type = pick(["drone", "drone", "zig", "zig", "turret", "rock"]);
      const count = type === "turret" ? 2 : type === "rock" ? 3 : 5 + Math.floor(rnd() * 3);
      const form = pick(["line", "column", "random"]);
      const baseY = 40 + rnd() * 165;
      for (let i = 0; i < count; i++) {
        spawns.push({ t: tt + i * (form === "column" ? 7 : 20), type, y: form === "line" ? baseY : form === "column" ? 30 + (i / Math.max(1, count - 1)) * 185 : 30 + rnd() * 185 });
      }
      tt += count * 20 + 80;
    }
    const PATTERNS = ["fan", "aimed", "wave", "beam"];
    const bossPats = PATTERNS.slice().sort(() => rnd() - 0.5).slice(0, 2 + (lvl >= 5 ? 1 : 0));
    const bossMax = Math.round(80 + (lvl - 2) * 14);
    const boss = { on: false, x: 420, y: 122, hp: bossMax, pi: 0, cd: 80, beam: null, burst: 0, ph: 0, phase: 1 };
    sim.enemyHp = bossMax; sim.maxEnemyHp = bossMax;
    let clock = 0, intro = 170, shake = 0, flash = 0, scroll = 0;

    const hurt = (d) => {
      if (H.inv > 0 || sim.over) return;
      sim.heroHp -= Math.round(d * scale); H.inv = 45; shake = 8; playFightSfx("hit");
      if (sim.heroHp <= 0) { sim.heroHp = 0; env.end(false); }
    };
    const aimShot = (x, y, sp) => {
      const a = Math.atan2(H.y - y, H.x - x);
      shots.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp });
    };
    const bomb = () => {
      if (intro > 0 || sim.over || sim.ki < 100) return;
      sim.ki = 0; flash = 22; shake = 12; playFightSfx("beam");
      shots.length = 0;
      enemies.forEach(e => { e.hp -= 3; if (e.hp <= 0) { e.dead = true; fx.burst(e.x, e.y, e.col, 10); } });
      if (boss.on) {
        boss.hp -= 12; fx.text(boss.x, boss.y - 50, "-12", "#ffe66d");
        if (boss.hp <= 0) { boss.hp = 0; env.end(true); }
      }
      fx.text(178, 70, "KI-EXPLOSION!", "#00f5d4");
    };

    const b = mgButtons(ctrlArea, [
      { id: "sh-u", icon: "up", label: "HOCH" },
      { id: "sh-d", icon: "down", label: "RUNTER" },
      { id: "sh-b", icon: "bolt", label: "KI-EXPLOSION", sub: "bei 100 Ki", span: 2, cls: "special" }
    ]);
    mgHold(b["sh-u"], () => { H.up = true; }, () => { H.up = false; });
    mgHold(b["sh-d"], () => { H.down = true; }, () => { H.down = false; });
    mgTap(b["sh-b"], bomb);
    // Auf dem Spielfeld ziehen = Figur folgt dem Finger
    canvas.onpointerdown = (e) => { if (intro > 45) { intro = 45; return; } H.ty = mgCanvasPos(canvas, e).y; };
    canvas.onpointermove = (e) => { if (e.buttons || e.pointerType === "touch") H.ty = mgCanvasPos(canvas, e).y; };

    mgLoop((dt, t) => {
      scroll += 3 * dt;
      if (!sim.over && intro > 0) intro -= dt;
      else if (!sim.over) {
        clock += dt;
        if (H.up) H.ty -= 3.4 * dt;
        if (H.down) H.ty += 3.4 * dt;
        H.ty = Math.max(22, Math.min(225, H.ty));
        H.y += (H.ty - H.y) * Math.min(1, 0.22 * dt);
        if (H.inv > 0) H.inv -= dt;
        if (H.spread > 0) H.spread -= dt;
        H.fireT -= dt;
        if (H.fireT <= 0) {
          H.fireT = 11;
          bullets.push({ x: H.x + 18, y: H.y, vy: 0 });
          if (H.spread > 0) { bullets.push({ x: H.x + 18, y: H.y, vy: -1.3 }); bullets.push({ x: H.x + 18, y: H.y, vy: 1.3 }); }
        }
        while (spawns.length && spawns[0].t <= clock) {
          const s = spawns.shift(), T = TYPES[s.type];
          enemies.push({ type: s.type, x: MG_W + 20, y: s.y, y0: s.y, hp: T.hp, r: T.r, col: T.col, vx: T.vx * (1 + (lvl - 2) * 0.04), ph: rnd() * 6, fire: 50 + rnd() * 40, life: 0 });
        }
        if (!spawns.length && !enemies.length && !boss.on) { boss.on = true; fx.text(178, 60, "BOSS!", "#ff4d6d"); playFightSfx("charge"); }

        enemies.forEach(e => {
          e.life += dt; e.ph += 0.06 * dt;
          if (e.type === "turret") { if (e.x > 292) e.x -= e.vx * dt; else if (e.life > 420) e.x -= 2 * dt; e.fire -= dt; if (e.fire <= 0 && e.x < 330) { aimShot(e.x, e.y, 3.1); e.fire = 75; } }
          else e.x -= e.vx * dt;
          if (e.type === "zig") e.y = e.y0 + Math.sin(e.ph) * 30;
          if (Math.hypot(e.x - H.x, e.y - H.y) < e.r + 9) { e.hp = 0; e.dead = true; hurt(16); }
        });

        if (boss.on) {
          if (boss.x > 300) boss.x -= 1.6 * dt;
          boss.ph += 0.018 * dt * (boss.phase === 2 ? 1.4 : 1);
          boss.y = 122 + Math.sin(boss.ph) * 70;
          if (boss.phase === 1 && boss.hp <= bossMax / 2) {
            boss.phase = 2; bossPats.push(PATTERNS.find(p => !bossPats.includes(p)) || "fan");
            fx.text(boss.x, boss.y - 60, "WÜTEND!", "#ff4d6d"); shake = 10;
          }
          if (boss.beam) {
            boss.beam.t -= dt;
            if (boss.beam.t <= 0 && !boss.beam.fire) { boss.beam.fire = true; boss.beam.t = 40; playFightSfx("beam"); }
            else if (boss.beam.t <= 0) boss.beam = null;
            if (boss.beam && boss.beam.fire && Math.abs(H.y - boss.beam.y) < 15) hurt(20);
          } else if (boss.burst > 0) {
            boss.burstT -= dt;
            if (boss.burstT <= 0) { aimShot(boss.x - 30, boss.y, 3.6); boss.burst--; boss.burstT = 9; }
          } else if (boss.x <= 302) {
            boss.cd -= dt;
            if (boss.cd <= 0) {
              const pat = bossPats[boss.pi % bossPats.length]; boss.pi++;
              if (pat === "fan") { for (let k = -2; k <= 2; k++) { const a = Math.PI + k * 0.22; shots.push({ x: boss.x - 30, y: boss.y, vx: Math.cos(a) * 3, vy: Math.sin(a) * 3 }); } }
              if (pat === "aimed") { boss.burst = 3 + (boss.phase === 2 ? 2 : 0); boss.burstT = 0; }
              if (pat === "wave") { for (let k = 0; k < 7; k++) shots.push({ x: boss.x - 30, y: boss.y, vx: -2.6, vy: 0, wave: k * 0.9, y0: boss.y }); }
              if (pat === "beam") { boss.beam = { y: H.y, t: 52, fire: false }; }
              boss.cd = Math.max(45, 95 - lvl * 4) / (boss.phase === 2 ? 1.25 : 1);
            }
          }
        }

        for (let i = bullets.length - 1; i >= 0; i--) {
          const bl = bullets[i];
          bl.x += 7.5 * dt; bl.y += bl.vy * dt;
          let hit = false;
          for (const e of enemies) {
            if (!e.dead && Math.hypot(bl.x - e.x, bl.y - e.y) < e.r + 4) {
              e.hp -= 1; hit = true;
              if (e.hp <= 0) {
                e.dead = true; fx.burst(e.x, e.y, e.col, 12); playFightSfx("hit");
                sim.ki = Math.min(100, sim.ki + 7);
                if (rnd() < 0.14) items.push({ x: e.x, y: e.y, kind: rnd() < 0.5 ? "senzu" : "power" });
              }
              break;
            }
          }
          if (!hit && boss.on && Math.abs(bl.x - boss.x) < 26 && Math.abs(bl.y - boss.y) < 40) {
            boss.hp -= 1; hit = true; fx.burst(bl.x, bl.y, "#ffe66d", 3);
            if (boss.hp <= 0) { boss.hp = 0; fx.burst(boss.x, boss.y, "#ff0055", 30); env.end(true); }
          }
          if (hit || bl.x > MG_W + 10) bullets.splice(i, 1);
        }
        for (let i = enemies.length - 1; i >= 0; i--) if (enemies[i].dead || enemies[i].x < -30) enemies.splice(i, 1);
        for (let i = shots.length - 1; i >= 0; i--) {
          const s = shots[i];
          s.x += s.vx * dt;
          if (s.wave !== undefined) { s.wave += 0.12 * dt; s.y = s.y0 + Math.sin(s.wave) * 34; } else s.y += s.vy * dt;
          if (Math.hypot(s.x - H.x, s.y - H.y) < 9) { shots.splice(i, 1); hurt(11); }
          else if (s.x < -10 || s.y < -10 || s.y > MG_H + 10) shots.splice(i, 1);
        }
        for (let i = items.length - 1; i >= 0; i--) {
          const it = items[i];
          it.x -= 1.4 * dt;
          if (Math.hypot(it.x - H.x, it.y - H.y) < 16) {
            if (it.kind === "senzu") { sim.heroHp = Math.min(100, sim.heroHp + 25); fx.text(H.x + 20, H.y - 20, "SENZU +25", "#80ed99"); }
            else { H.spread = 480; fx.text(H.x + 20, H.y - 20, "STREUSCHUSS!", "#ffd166"); }
            playFightSfx("select"); items.splice(i, 1);
          } else if (it.x < -10) items.splice(i, 1);
        }
      }
      sim.enemyHp = boss.hp;

      ctx.save();
      if (shake > 0) { ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake); shake *= Math.pow(0.82, dt); if (shake < 0.3) shake = 0; }
      drawStageBackground(ctx, MG_W, MG_H, scroll, 2 + lvl, t);
      ctx.fillStyle = "rgba(10, 8, 20, 0.25)"; ctx.fillRect(0, 0, MG_W, MG_H);
      // Fahrtwind-Linien
      ctx.strokeStyle = "rgba(255,255,255,0.12)"; ctx.lineWidth = 1;
      for (let k = 0; k < 10; k++) { const ly = (k * 53) % MG_H, lx = MG_W - ((scroll * 2.4 + k * 97) % (MG_W + 60)); ctx.beginPath(); ctx.moveTo(lx, ly); ctx.lineTo(lx + 28, ly); ctx.stroke(); }

      items.forEach(it => {
        if (it.kind === "senzu") {
          ctx.fillStyle = "#80ed99"; ctx.beginPath(); ctx.ellipse(it.x, it.y, 6, 4, 0.5, 0, TAU); ctx.fill();
          ctx.strokeStyle = "#2d6a4f"; ctx.lineWidth = 1; ctx.stroke();
        } else mgOrb(ctx, it.x, it.y, 6, t);
      });
      enemies.forEach(e => {
        const g = ctx.createRadialGradient(e.x, e.y, 1, e.x, e.y, e.r * 1.6);
        g.addColorStop(0, "#ffffff"); g.addColorStop(0.35, e.col); g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 1.6, 0, TAU); ctx.fill();
        ctx.fillStyle = "#14141c"; ctx.beginPath(); ctx.arc(e.x, e.y, e.r * 0.55, 0, TAU); ctx.fill();
        ctx.fillStyle = e.col; ctx.fillRect(e.x - e.r * 0.35, e.y - 1.5, e.r * 0.7, 3);
      });
      if (boss.on) {
        if (boss.beam && !boss.beam.fire) {
          ctx.strokeStyle = `rgba(255, 42, 85, ${0.35 + 0.35 * Math.abs(Math.sin(t / 60))})`; ctx.setLineDash([6, 6]); ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(0, boss.beam.y); ctx.lineTo(boss.x - 30, boss.beam.y); ctx.stroke(); ctx.setLineDash([]);
        }
        if (boss.beam && boss.beam.fire) drawBeam(ctx, boss.x - 30, -10, boss.beam.y, 20, "#ff0055", t);
        drawFighterUnstretched(ctx, enemySprite, boss.x, boss.y + 46, { color: "#ff0055", flip: true, t: t + 900, maxW: 60, maxH: 92 });
      }
      bullets.forEach(bl => {
        ctx.strokeStyle = heroObj.color; ctx.lineWidth = 4; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(bl.x - 10, bl.y - bl.vy * 1.5); ctx.lineTo(bl.x, bl.y); ctx.stroke();
      });
      shots.forEach(s => {
        ctx.fillStyle = "#ff2a55"; ctx.beginPath(); ctx.arc(s.x, s.y, 4.5, 0, TAU); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.beginPath(); ctx.arc(s.x, s.y, 1.8, 0, TAU); ctx.fill();
      });
      if (!(H.inv > 0 && Math.floor(t / 70) % 2 === 0)) {
        drawFighterUnstretched(ctx, heroSprite, H.x, H.y + 24, { color: heroObj.color, t, maxW: 34, maxH: 48 });
      }
      if (flash > 0) { ctx.fillStyle = `rgba(255,255,255,${flash / 30})`; ctx.fillRect(0, 0, MG_W, MG_H); flash -= dt; }
      if (!boss.on) {
        ctx.fillStyle = "#e6e6ec"; ctx.font = "700 10px Rajdhani, sans-serif";
        ctx.fillText(`WELLEN: ${Math.max(0, Math.ceil(spawns.length))} GEGNER KOMMEN NOCH`, 10, 16);
      }
      if (H.spread > 0) { ctx.fillStyle = "#ffd166"; ctx.font = "700 10px Rajdhani, sans-serif"; ctx.fillText(`STREUSCHUSS ${Math.ceil(H.spread / 60)}s`, 10, 30); }

      fx.draw(ctx, dt);
      mgIntro(ctx, intro, "HIMMELS-JAGD", [
        "HOCH/RUNTER oder aufs Bild tippen & ziehen – du schießt automatisch.",
        "Erst die Gegnerwellen, dann kommt der Boss mit neuen Angriffen.",
        "Ki sammeln für die KI-EXPLOSION · grüne Bohne heilt"
      ]);
      mgKO(ctx, sim);
      ctx.restore();
      env.bars();
    });
  }

  // ---------------------------------------------------------------------
  // SPIEL 4: KI-LABYRINTH – 7 Sternkugeln sammeln, Schatten-Wichten entkommen
  // ---------------------------------------------------------------------
  function miniMaze(env) {
    const { ctx, canvas, ctrlArea, lvl, sim, heroObj, enemySprite, heroSprite } = env;
    const rnd = mgRng(Date.now() ^ (lvl * 2654435761));
    const fx = mgFx();
    const COLS = 17, ROWS = 11, CS = 20, OX = 8, OY = 20;

    // Labyrinth erzeugen (Tiefensuche) + zusätzliche Durchgänge für Fluchtwege
    const wall = Array.from({ length: ROWS }, () => Array(COLS).fill(true));
    const stack = [[1, 1]]; wall[1][1] = false;
    while (stack.length) {
      const [cx, cy] = stack[stack.length - 1];
      const nb = [[2, 0], [-2, 0], [0, 2], [0, -2]]
        .map(([dx, dy]) => [cx + dx, cy + dy, dx, dy])
        .filter(([x, y]) => x > 0 && y > 0 && x < COLS - 1 && y < ROWS - 1 && wall[y][x]);
      if (!nb.length) { stack.pop(); continue; }
      const [nx, ny, dx, dy] = nb[Math.floor(rnd() * nb.length)];
      wall[cy + dy / 2][cx + dx / 2] = false; wall[ny][nx] = false;
      stack.push([nx, ny]);
    }
    const extra = 14 + Math.floor(rnd() * 8);
    for (let i = 0, tries = 0; i < extra && tries < 800; tries++) {
      const x = 1 + Math.floor(rnd() * (COLS - 2)), y = 1 + Math.floor(rnd() * (ROWS - 2));
      if (!wall[y][x]) continue;
      const horiz = !wall[y][x - 1] && !wall[y][x + 1] && wall[y - 1][x] && wall[y + 1][x];
      const vert = !wall[y - 1][x] && !wall[y + 1][x] && wall[y][x - 1] && wall[y][x + 1];
      if (horiz || vert) { wall[y][x] = false; i++; }
    }
    const open = (x, y) => x >= 0 && y >= 0 && x < COLS && y < ROWS && !wall[y][x];
    const bfs = (sx, sy) => {
      const d = Array.from({ length: ROWS }, () => Array(COLS).fill(Infinity));
      const q = [[sx, sy]]; d[sy][sx] = 0;
      while (q.length) {
        const [x, y] = q.shift();
        for (const k in MG_DIRS) {
          const nx = x + MG_DIRS[k][0], ny = y + MG_DIRS[k][1];
          if (open(nx, ny) && d[ny][nx] === Infinity) { d[ny][nx] = d[y][x] + 1; q.push([nx, ny]); }
        }
      }
      return d;
    };
    const fromStart = bfs(1, 1);
    const cells = [];
    for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) if (open(x, y)) cells.push([x, y]);
    let portal = cells[0];
    cells.forEach(c => { if (fromStart[c[1]][c[0]] > fromStart[portal[1]][portal[0]]) portal = c; });
    const free = cells.filter(([x, y]) => fromStart[y][x] >= 4 && !(x === portal[0] && y === portal[1])).sort(() => rnd() - 0.5);
    const orbs = free.slice(0, 7).map(([x, y]) => ({ x, y, got: false }));
    const senzus = free.slice(7, 9).map(([x, y]) => ({ x, y, got: false }));
    const fromPortal = bfs(portal[0], portal[1]);
    const shadeStarts = cells.filter(([x, y]) => fromPortal[y][x] <= 4 && fromStart[y][x] > 8);

    const mover = (x, y, speed) => ({ x, y, tx: x, ty: y, t: 1, dir: null, speed });
    const pos = (m) => [m.x + (m.tx - m.x) * m.t, m.y + (m.ty - m.y) * m.t];
    const advance = (m, dt, choose) => {
      m.t += m.speed * dt;
      if (m.t >= 1) {
        m.x = m.tx; m.y = m.ty; m.t = 1;
        const d = choose(m);
        if (d && open(m.x + MG_DIRS[d][0], m.y + MG_DIRS[d][1])) { m.tx = m.x + MG_DIRS[d][0]; m.ty = m.y + MG_DIRS[d][1]; m.t = 0; m.dir = d; }
        return true;
      }
      return false;
    };

    const hero = mover(1, 1, 0.085);
    let queued = null, lives = 3, inv = 0, power = 0, got = 0, intro = 170, finale = 0, shake = 0;
    const nShades = Math.min(5, 2 + Math.floor((lvl - 2) / 3));
    const chaseP = Math.min(0.85, 0.5 + (lvl - 2) * 0.04);
    const shadeSpeed = Math.min(0.08, 0.052 + (lvl - 2) * 0.003);
    const shades = Array.from({ length: nShades }, (_, i) => {
      const s = shadeStarts[i % Math.max(1, shadeStarts.length)] || portal;
      return Object.assign(mover(s[0], s[1], shadeSpeed), { home: s, gone: 0 });
    });
    let heroDist = bfs(1, 1);
    sim.maxEnemyHp = 7; sim.enemyHp = 7; sim.heroHp = 100; sim.ki = 0;

    const setDir = (d) => { if (intro > 45) { intro = 45; return; } queued = d; if (hero.t >= 1 || (hero.dir && d === MG_OPP[hero.dir])) { if (hero.dir && d === MG_OPP[hero.dir] && hero.t < 1) { const tx = hero.tx, ty = hero.ty; hero.tx = hero.x; hero.ty = hero.y; hero.x = tx; hero.y = ty; hero.t = 1 - hero.t; hero.dir = d; } } };
    const b = mgButtons(ctrlArea, [
      { id: "mz-l", icon: "left", label: "LINKS" },
      { id: "mz-u", icon: "up", label: "HOCH" },
      { id: "mz-d", icon: "down", label: "RUNTER" },
      { id: "mz-r", icon: "right", label: "RECHTS" }
    ]);
    mgTap(b["mz-l"], () => setDir("l"));
    mgTap(b["mz-u"], () => setDir("u"));
    mgTap(b["mz-d"], () => setDir("d"));
    mgTap(b["mz-r"], () => setDir("r"));
    mgSwipe(canvas, setDir, () => { if (intro > 45) intro = 45; });

    const px = (x) => OX + x * CS + CS / 2, py = (y) => OY + y * CS + CS / 2;

    mgLoop((dt, t) => {
      if (!sim.over && intro > 0) intro -= dt;
      else if (!sim.over && finale > 0) { finale -= dt; if (finale <= 0) { sim.enemyHp = 0; env.end(true); } }
      else if (!sim.over) {
        if (inv > 0) inv -= dt;
        if (power > 0) power -= dt;
        const arrived = advance(hero, dt, (m) => {
          if (queued && open(m.x + MG_DIRS[queued][0], m.y + MG_DIRS[queued][1])) return queued;
          if (m.dir && open(m.x + MG_DIRS[m.dir][0], m.y + MG_DIRS[m.dir][1])) return m.dir;
          return null;
        });
        if (arrived) {
          heroDist = bfs(hero.x, hero.y);
          orbs.forEach(o => {
            if (!o.got && o.x === hero.x && o.y === hero.y) {
              o.got = true; got++; sim.enemyHp = 7 - got; playFightSfx("hit");
              fx.burst(px(o.x), py(o.y), "#ffb020", 14);
              fx.text(px(o.x), py(o.y) - 10, got === 7 ? "PORTAL OFFEN!" : `${got}/7`, "#ffd166");
            }
          });
          senzus.forEach(s => {
            if (!s.got && s.x === hero.x && s.y === hero.y) {
              s.got = true; power = 380; playFightSfx("charge");
              fx.text(px(s.x), py(s.y) - 10, "KAIOKEN!", "#ff4d6d");
            }
          });
          if (got >= 7 && hero.x === portal[0] && hero.y === portal[1]) { finale = 60; playFightSfx("beam"); }
        }
        sim.ki = power > 0 ? (power / 380) * 100 : 0;
        shades.forEach(s => {
          if (s.gone > 0) { s.gone -= dt; if (s.gone <= 0) { s.x = s.tx = s.home[0]; s.y = s.ty = s.home[1]; s.t = 1; } return; }
          s.speed = shadeSpeed * (power > 0 ? 0.7 : 1);
          advance(s, dt, (m) => {
            let opts = Object.keys(MG_DIRS).filter(k => open(m.x + MG_DIRS[k][0], m.y + MG_DIRS[k][1]));
            if (opts.length > 1 && m.dir) opts = opts.filter(k => k !== MG_OPP[m.dir]);
            if (rnd() < chaseP) {
              const score = (k) => heroDist[m.y + MG_DIRS[k][1]][m.x + MG_DIRS[k][0]];
              opts.sort((a, c) => (power > 0 ? score(c) - score(a) : score(a) - score(c)));
              return opts[0];
            }
            return opts[Math.floor(rnd() * opts.length)];
          });
          const [hx, hy] = pos(hero), [sx, sy] = pos(s);
          if (Math.hypot(hx - sx, hy - sy) < 0.6) {
            if (power > 0) {
              s.gone = 240; fx.burst(px(sx), py(sy), "#7bdff2", 16); fx.text(px(sx), py(sy) - 8, "WEG!", "#7bdff2"); playFightSfx("hit");
            } else if (inv <= 0) {
              lives--; inv = 110; shake = 10; playFightSfx("hit");
              fx.text(px(hx), py(hy) - 10, "ERWISCHT!", "#ff4d6d");
              hero.x = hero.tx = 1; hero.y = hero.ty = 1; hero.t = 1; hero.dir = null; queued = null;
              heroDist = bfs(1, 1);
              // faire neue Chance: alle Wichte zurück an ihren Startpunkt
              shades.forEach(o => { o.x = o.tx = o.home[0]; o.y = o.ty = o.home[1]; o.t = 1; o.dir = null; });
              if (lives <= 0) env.end(false);
            }
          }
        });
      }
      sim.heroHp = (lives / 3) * 100;

      ctx.save();
      if (shake > 0) { ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake); shake *= Math.pow(0.82, dt); if (shake < 0.3) shake = 0; }
      drawStageBackground(ctx, MG_W, MG_H, t * 0.02, lvl, t);
      ctx.fillStyle = "rgba(6, 5, 12, 0.62)"; ctx.fillRect(OX, OY, COLS * CS, ROWS * CS);
      for (let y = 0; y < ROWS; y++) for (let x = 0; x < COLS; x++) {
        if (!wall[y][x]) continue;
        const X = OX + x * CS, Y = OY + y * CS;
        ctx.fillStyle = "#231b3a"; ctx.fillRect(X, Y, CS, CS);
        ctx.fillStyle = "#3a2e62"; ctx.fillRect(X + 2, Y + 2, CS - 4, CS - 4);
        ctx.fillStyle = "rgba(180, 160, 255, 0.35)"; ctx.fillRect(X + 2, Y + 2, CS - 4, 2);
      }
      // Portal
      const [ptx, pty] = [px(portal[0]), py(portal[1])];
      ctx.strokeStyle = got >= 7 ? `hsl(${(t / 6) % 360}, 90%, 65%)` : "rgba(255,255,255,0.18)";
      ctx.lineWidth = 2.5;
      for (let k = 0; k < 3; k++) { ctx.beginPath(); ctx.arc(ptx, pty, 4 + k * 3 + Math.sin(t / 200 + k) * 1.2, 0, TAU); ctx.stroke(); }
      if (got >= 7) drawFighterUnstretched(ctx, enemySprite, ptx, pty + 9, { color: "#ff0055", flip: true, t: t + 900, maxW: 18, maxH: 26 });
      orbs.forEach(o => { if (!o.got) mgOrb(ctx, px(o.x), py(o.y) + Math.sin(t / 300 + o.x) * 1.5, 4.5, t); });
      senzus.forEach(s => {
        if (s.got) return;
        ctx.fillStyle = "#80ed99"; ctx.beginPath(); ctx.ellipse(px(s.x), py(s.y), 5, 3.4, 0.5, 0, TAU); ctx.fill();
        ctx.strokeStyle = "#2d6a4f"; ctx.lineWidth = 1; ctx.stroke();
      });
      shades.forEach(s => {
        if (s.gone > 0) return;
        const [sx, sy] = pos(s);
        mgShade(ctx, px(sx), py(sy), 7, power > 0, t);
      });
      const [hx, hy] = pos(hero);
      if (!(inv > 0 && Math.floor(t / 80) % 2 === 0)) {
        drawFighterUnstretched(ctx, heroSprite, px(hx), py(hy) + 10, { color: power > 0 ? "#ff2a2a" : heroObj.color, t, maxW: 18, maxH: 25 });
      }
      if (finale > 0) drawBeam(ctx, px(hx), ptx, py(hy), 10, heroObj.color, t);

      // Anzeige
      for (let i = 0; i < 3; i++) { ctx.fillStyle = i < lives ? "#ff4d6d" : "rgba(255,255,255,0.18)"; ctx.beginPath(); ctx.arc(14 + i * 14, 10, 4.5, 0, TAU); ctx.fill(); }
      ctx.fillStyle = "#e6e6ec"; ctx.font = "700 11px Rajdhani, sans-serif";
      ctx.fillText(`STERNKUGELN ${got}/7`, 64, 14);
      if (power > 0) { ctx.fillStyle = "#ff4d6d"; ctx.fillText(`KAIOKEN ${Math.ceil(power / 60)}s – jag die Wichte!`, 170, 14); }
      else if (got >= 7) { ctx.fillStyle = "#ffd166"; ctx.fillText("ZUM PORTAL!", 170, 14); }

      fx.draw(ctx, dt);
      mgIntro(ctx, intro, "KI-LABYRINTH", [
        "Sammle alle 7 Sternkugeln – dann öffnet sich das Portal zum Gegner.",
        "Steuern mit den Pfeilen oder Wischen. Weich den Schatten-Wichten aus!",
        "Grüne Senzu-Bohne = KAIOKEN: dann jagst du die Wichte."
      ]);
      mgKO(ctx, sim);
      ctx.restore();
      env.bars();
    });
  }

  // ---------------------------------------------------------------------
  // SPIEL 5: DRACHEN-SCHLANGE – Drache steuern, Ki-Kugeln fressen, Blitzen ausweichen
  // ---------------------------------------------------------------------
  function miniSnake(env) {
    const { ctx, canvas, ctrlArea, lvl, sim, heroObj, heroSprite } = env;
    const rnd = mgRng(Date.now() ^ (lvl * 40503));
    const fx = mgFx();
    const COLS = 22, ROWS = 14, CS = 15, OX = 13, OY = 24;
    const wrap = rnd() < 0.4; // Regel dieser Runde: durch die Wände gleiten?
    const GOAL = 8 + Math.min(8, lvl - 2);
    const START = [{ x: 5, y: 7 }, { x: 4, y: 7 }, { x: 3, y: 7 }];
    const rocks = new Set();
    const nRocks = Math.min(18, 3 + lvl);
    for (let i = 0, tries = 0; i < nRocks && tries < 400; tries++) {
      const x = Math.floor(rnd() * COLS), y = Math.floor(rnd() * ROWS);
      if (y === 7 && x < 12) continue;
      const k = `${x},${y}`;
      if (!rocks.has(k)) { rocks.add(k); i++; }
    }
    let snake = START.map(s => ({ ...s })), dir = "r", nextDir = "r";
    let stepT = 0, grow = 0, lives = 3, got = 0, inv = 0, intro = 170, shake = 0, crashFlash = 0;
    const baseStep = Math.max(4.5, 9 - (lvl - 2) * 0.35) * (0.9 + rnd() * 0.2);
    let food = null, golden = null, goldenT = 0, orbCount = 0;
    let bolt = null, boltT = 360 + rnd() * 200;
    sim.maxEnemyHp = GOAL; sim.enemyHp = GOAL; sim.heroHp = 100; sim.ki = 0;

    const occupied = (x, y) => rocks.has(`${x},${y}`) || snake.some(s => s.x === x && s.y === y);
    const freeCell = () => {
      for (let i = 0; i < 300; i++) {
        const x = Math.floor(rnd() * COLS), y = Math.floor(rnd() * ROWS);
        if (!occupied(x, y) && !(food && food.x === x && food.y === y)) return { x, y };
      }
      return { x: 10, y: 3 };
    };
    food = freeCell();

    const setDir = (d) => { if (intro > 45) { intro = 45; return; } if (d !== MG_OPP[dir]) nextDir = d; };
    const b = mgButtons(ctrlArea, [
      { id: "sn-l", icon: "left", label: "LINKS" },
      { id: "sn-u", icon: "up", label: "HOCH" },
      { id: "sn-d", icon: "down", label: "RUNTER" },
      { id: "sn-r", icon: "right", label: "RECHTS" }
    ]);
    mgTap(b["sn-l"], () => setDir("l"));
    mgTap(b["sn-u"], () => setDir("u"));
    mgTap(b["sn-d"], () => setDir("d"));
    mgTap(b["sn-r"], () => setDir("r"));
    mgSwipe(canvas, setDir, () => { if (intro > 45) intro = 45; });

    const crash = (why) => {
      if (inv > 0) return;
      lives--; shake = 10; crashFlash = 20; playFightSfx("hit");
      fx.text(OX + snake[0].x * CS, OY + snake[0].y * CS - 6, why, "#ff4d6d");
      if (lives <= 0) { env.end(false); return; }
      snake = START.map(s => ({ ...s })); dir = nextDir = "r"; grow = 0; inv = 90;
      START.forEach(s => rocks.delete(`${s.x},${s.y}`));
    };

    const step = () => {
      dir = nextDir;
      let nx = snake[0].x + MG_DIRS[dir][0], ny = snake[0].y + MG_DIRS[dir][1];
      if (wrap) { nx = (nx + COLS) % COLS; ny = (ny + ROWS) % ROWS; }
      else if (nx < 0 || ny < 0 || nx >= COLS || ny >= ROWS) { crash("WAND!"); return; }
      if (rocks.has(`${nx},${ny}`)) { crash("FELS!"); return; }
      if (snake.slice(0, -1).some(s => s.x === nx && s.y === ny) && inv <= 0) { crash("KNOTEN!"); return; }
      snake.unshift({ x: nx, y: ny });
      if (grow > 0) grow--; else snake.pop();
      const eat = (o, worth) => {
        got = Math.min(GOAL, got + worth); grow += 1 + worth; orbCount++;
        sim.enemyHp = GOAL - got; playFightSfx(worth > 1 ? "beam" : "hit");
        fx.burst(OX + o.x * CS + CS / 2, OY + o.y * CS + CS / 2, "#ffb020", 14);
        fx.text(OX + o.x * CS + CS / 2, OY + o.y * CS - 4, worth > 1 ? "GOLD ×2!" : `${got}/${GOAL}`, "#ffd166");
        if (got >= GOAL) { sim.enemyHp = 0; env.end(true); }
      };
      if (food && nx === food.x && ny === food.y) {
        eat(food, 1); food = freeCell();
        if (orbCount % 4 === 3 && !golden) { golden = freeCell(); goldenT = 330; }
      }
      if (golden && nx === golden.x && ny === golden.y) { eat(golden, 2); golden = null; }
    };

    mgLoop((dt, t) => {
      if (!sim.over && intro > 0) intro -= dt;
      else if (!sim.over) {
        if (inv > 0) inv -= dt;
        stepT += dt;
        const stepLen = Math.max(3.6, baseStep - got * 0.15);
        while (stepT >= stepLen && !sim.over) { stepT -= stepLen; step(); }
        if (golden) { goldenT -= dt; if (goldenT <= 0) golden = null; }
        // Gegner-Blitz über eine ganze Reihe oder Spalte
        if (bolt) {
          bolt.t -= dt;
          if (bolt.t <= 0 && !bolt.fire) { bolt.fire = true; bolt.t = 22; playFightSfx("zap"); }
          else if (bolt.t <= 0) bolt = null;
          if (bolt && bolt.fire && snake.some(s => (bolt.row ? s.y === bolt.i : s.x === bolt.i))) { crash("BLITZ!"); bolt = null; }
        } else {
          boltT -= dt;
          if (boltT <= 0) {
            const row = rnd() < 0.5;
            bolt = { row, i: Math.floor(rnd() * (row ? ROWS : COLS)), t: Math.max(55, 95 - lvl * 4), fire: false };
            boltT = Math.max(220, 480 - lvl * 22) + rnd() * 200;
          }
        }
      }
      sim.heroHp = (lives / 3) * 100;
      sim.ki = (got / GOAL) * 100;

      ctx.save();
      if (shake > 0) { ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake); shake *= Math.pow(0.82, dt); if (shake < 0.3) shake = 0; }
      drawStageBackground(ctx, MG_W, MG_H, t * 0.02, lvl + 1, t);
      mgPanel(ctx, OX - 3, OY - 3, COLS * CS + 6, ROWS * CS + 6, 0.7);
      if (wrap) { ctx.strokeStyle = "rgba(0, 245, 212, 0.45)"; ctx.setLineDash([4, 4]); ctx.strokeRect(OX - 3, OY - 3, COLS * CS + 6, ROWS * CS + 6); ctx.setLineDash([]); }
      ctx.fillStyle = "rgba(255,255,255,0.035)";
      for (let y = 0; y < ROWS; y++) for (let x = (y % 2); x < COLS; x += 2) ctx.fillRect(OX + x * CS, OY + y * CS, CS, CS);
      if (bolt) {
        const a = bolt.fire ? 0.85 : 0.18 + 0.2 * Math.abs(Math.sin(t / 60));
        ctx.fillStyle = bolt.fire ? `rgba(255, 255, 255, ${a})` : `rgba(255, 42, 85, ${a})`;
        if (bolt.row) ctx.fillRect(OX, OY + bolt.i * CS, COLS * CS, CS); else ctx.fillRect(OX + bolt.i * CS, OY, CS, ROWS * CS);
      }
      rocks.forEach(k => {
        const [x, y] = k.split(",").map(Number);
        const X = OX + x * CS, Y = OY + y * CS;
        ctx.fillStyle = "#4a4550"; ctx.beginPath(); ctx.moveTo(X + 2, Y + CS - 1); ctx.lineTo(X + 4, Y + 4); ctx.lineTo(X + CS / 2, Y + 1); ctx.lineTo(X + CS - 3, Y + 5); ctx.lineTo(X + CS - 1, Y + CS - 1); ctx.closePath(); ctx.fill();
        ctx.fillStyle = "rgba(255,255,255,0.16)"; ctx.fillRect(X + 5, Y + 4, 4, 2);
      });
      if (food) mgOrb(ctx, OX + food.x * CS + CS / 2, OY + food.y * CS + CS / 2, 5, t);
      if (golden) {
        const gx = OX + golden.x * CS + CS / 2, gy = OY + golden.y * CS + CS / 2;
        ctx.fillStyle = `rgba(255, 230, 109, ${0.3 + 0.3 * Math.abs(Math.sin(t / 120))})`;
        ctx.beginPath(); ctx.arc(gx, gy, 10, 0, TAU); ctx.fill();
        mgOrb(ctx, gx, gy, 6, t);
      }
      // Drache: Körper von hinten nach vorn
      const blink = inv > 0 && Math.floor(t / 80) % 2 === 0;
      if (!blink) {
        for (let i = snake.length - 1; i >= 0; i--) {
          const s = snake[i], X = OX + s.x * CS + CS / 2, Y = OY + s.y * CS + CS / 2;
          const r = i === 0 ? CS * 0.56 : CS * (0.46 - Math.min(0.14, i * 0.008));
          ctx.fillStyle = i % 2 ? "#1f8a4c" : "#2fae62";
          ctx.beginPath(); ctx.arc(X, Y, r, 0, TAU); ctx.fill();
          if (i > 0) { ctx.fillStyle = "#e9d48a"; ctx.beginPath(); ctx.arc(X, Y + r * 0.35, r * 0.4, 0, TAU); ctx.fill(); }
        }
        const h = snake[0], HX = OX + h.x * CS + CS / 2, HY = OY + h.y * CS + CS / 2;
        const [ddx, ddy] = MG_DIRS[dir];
        ctx.strokeStyle = "#f4e3a1"; ctx.lineWidth = 2; ctx.lineCap = "round";
        ctx.beginPath(); ctx.moveTo(HX - ddy * 4 - ddx * 3, HY + ddx * 4 - ddy * 3); ctx.lineTo(HX - ddy * 8 - ddx * 8, HY + ddx * 8 - ddy * 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(HX + ddy * 4 - ddx * 3, HY - ddx * 4 - ddy * 3); ctx.lineTo(HX + ddy * 8 - ddx * 8, HY - ddx * 8 - ddy * 8); ctx.stroke();
        ctx.strokeStyle = "#ff6b6b"; ctx.lineWidth = 1.2;
        ctx.beginPath(); ctx.moveTo(HX + ddx * 6, HY + ddy * 6); ctx.quadraticCurveTo(HX + ddx * 12 - ddy * 6, HY + ddy * 12 + ddx * 6, HX + ddx * 9 - ddy * 10, HY + ddy * 9 + ddx * 10); ctx.stroke();
        ctx.fillStyle = "#ffeb3b"; ctx.beginPath(); ctx.arc(HX + ddx * 3 - ddy * 3, HY + ddy * 3 + ddx * 3, 1.8, 0, TAU); ctx.fill();
        drawFighterUnstretched(ctx, heroSprite, HX, HY - 4, { color: heroObj.color, t, maxW: 14, maxH: 18 });
      }
      if (crashFlash > 0) { ctx.fillStyle = `rgba(255, 42, 85, ${crashFlash / 60})`; ctx.fillRect(0, 0, MG_W, MG_H); crashFlash -= dt; }

      for (let i = 0; i < 3; i++) { ctx.fillStyle = i < lives ? "#ff4d6d" : "rgba(255,255,255,0.18)"; ctx.beginPath(); ctx.arc(14 + i * 14, 11, 4.5, 0, TAU); ctx.fill(); }
      ctx.fillStyle = "#e6e6ec"; ctx.font = "700 11px Rajdhani, sans-serif";
      ctx.fillText(`KI-KUGELN ${got}/${GOAL}`, 64, 15);
      ctx.fillStyle = wrap ? "#00f5d4" : "#9a9aa8";
      ctx.fillText(wrap ? "REGEL: DURCH DIE WÄNDE" : "REGEL: WÄNDE SIND HART", 210, 15);

      fx.draw(ctx, dt);
      mgIntro(ctx, intro, "DRACHEN-SCHLANGE", [
        `Steuer den Drachen und friss ${GOAL} Ki-Kugeln – Gold zählt doppelt.`,
        "Nicht gegen Felsen, Wände oder dich selbst! Wischen oder Pfeile.",
        wrap ? "Diese Runde: du gleitest durch die Wände!" : "Rot blinkende Reihe = gleich schlägt ein Blitz ein!"
      ]);
      mgKO(ctx, sim);
      ctx.restore();
      env.bars();
    });
  }

  // ---------------------------------------------------------------------
  // SPIEL 6: KI-MAUERBRECHER – Ki-Kugel gegen die Energie-Mauer des Gegners
  // ---------------------------------------------------------------------
  function miniBreaker(env) {
    const { ctx, canvas, ctrlArea, lvl, sim, heroObj, enemySprite, heroSprite } = env;
    const rnd = mgRng(Date.now() ^ (lvl * 69069));
    const fx = mgFx();
    const BC = 10, BW = 31, BH = 11, BOX = (MG_W - BC * (BW + 2)) / 2, BOY = 44;
    const rowsN = 5 + (lvl >= 6 ? 1 : 0);
    const layouts = ["full", "pyramid", "checker", "holes", "diamond", "stripes"];
    const layout = layouts[Math.floor(rnd() * layouts.length)];
    const ROW_COLS = ["#ff4d6d", "#ff9f1c", "#ffd166", "#80ed99", "#4cc9f0", "#c77dff"];
    const bricks = [];
    for (let r = 0; r < rowsN; r++) for (let c = 0; c < BC; c++) {
      let on = true;
      if (layout === "pyramid") on = c >= r && c < BC - r;
      if (layout === "checker") on = (r + c) % 2 === 0;
      if (layout === "holes") on = rnd() > 0.28;
      if (layout === "diamond") on = Math.abs(c - (BC - 1) / 2) + Math.abs(r - (rowsN - 1) / 2) <= 4.2;
      if (layout === "stripes") on = c % 3 !== 1;
      if (!on) continue;
      const hp = (lvl >= 4 && r < 2) || (lvl >= 8 && r < 4) ? 2 : 1;
      const roll = rnd();
      const special = roll < 0.05 ? "multi" : roll < 0.09 ? "pierce" : roll < 0.12 ? "senzu" : null;
      bricks.push({ x: BOX + c * (BW + 2), y: BOY + r * (BH + 2), hp, max: hp, col: ROW_COLS[r % ROW_COLS.length], special });
    }
    const totalHp = bricks.reduce((a, b) => a + b.hp, 0);
    const P = { x: MG_W / 2, w: 58 - Math.min(14, (lvl - 2) * 1.2), y: 226, stun: 0, left: false, right: false, tx: null };
    const speed = Math.min(5.2, 3.5 + (lvl - 2) * 0.12);
    let balls = [], lives = 3, pierce = 0, intro = 170, shake = 0, shotT = 200 + rnd() * 120;
    const eShots = [];
    const newBall = () => { balls = [{ x: P.x, y: P.y - 8, vx: 0, vy: 0, stuck: true }]; };
    newBall();
    sim.maxEnemyHp = totalHp; sim.enemyHp = totalHp; sim.heroHp = 100; sim.ki = 0;

    const launch = () => {
      if (intro > 45) { intro = 45; return; }
      balls.forEach(bl => { if (bl.stuck) { bl.stuck = false; const a = -Math.PI / 2 + (rnd() - 0.5) * 0.8; bl.vx = Math.cos(a) * speed; bl.vy = Math.sin(a) * speed; } });
    };
    const b = mgButtons(ctrlArea, [
      { id: "bk-l", icon: "left", label: "LINKS" },
      { id: "bk-f", icon: "bolt", label: "ABSCHUSS", span: 2, cls: "special" },
      { id: "bk-r", icon: "right", label: "RECHTS" }
    ]);
    mgHold(b["bk-l"], () => { P.left = true; P.tx = null; }, () => { P.left = false; });
    mgHold(b["bk-r"], () => { P.right = true; P.tx = null; }, () => { P.right = false; });
    mgTap(b["bk-f"], launch);
    canvas.onpointerdown = (e) => { launch(); P.tx = mgCanvasPos(canvas, e).x; };
    canvas.onpointermove = (e) => { if (e.buttons || e.pointerType === "touch") P.tx = mgCanvasPos(canvas, e).x; };

    const hitBrick = (br) => {
      br.hp -= 1; sim.enemyHp -= 1;
      fx.burst(br.x + BW / 2, br.y + BH / 2, br.col, br.hp <= 0 ? 10 : 4);
      if (br.hp <= 0) {
        playFightSfx("hit");
        if (br.special === "multi") {
          const src = balls[0];
          if (src) for (const a of [-0.5, 0.5]) { const sp = Math.hypot(src.vx, src.vy) || speed; const ang = Math.atan2(src.vy, src.vx) + a; balls.push({ x: src.x, y: src.y, vx: Math.cos(ang) * sp, vy: Math.sin(ang) * sp, stuck: false }); }
          fx.text(br.x + BW / 2, br.y, "DREIFACH!", "#4cc9f0");
        }
        if (br.special === "pierce") { pierce = 300; fx.text(br.x + BW / 2, br.y, "DURCHSCHLAG!", "#ff9f1c"); }
        if (br.special === "senzu") { lives = Math.min(3, lives + 1); fx.text(br.x + BW / 2, br.y, "SENZU +1", "#80ed99"); }
      } else playFightSfx("click");
      if (sim.enemyHp <= 0) { sim.enemyHp = 0; env.end(true); }
    };

    mgLoop((dt, t) => {
      if (!sim.over && intro > 0) intro -= dt;
      else if (!sim.over) {
        if (pierce > 0) pierce -= dt;
        if (P.stun > 0) P.stun -= dt;
        else {
          if (P.left) P.x -= 4.6 * dt;
          if (P.right) P.x += 4.6 * dt;
          if (P.tx !== null) P.x += (P.tx - P.x) * Math.min(1, 0.3 * dt);
        }
        P.x = Math.max(P.w / 2 + 4, Math.min(MG_W - P.w / 2 - 4, P.x));
        balls.forEach(bl => {
          if (bl.stuck) { bl.x = P.x; bl.y = P.y - 8; return; }
          const steps = 3;
          for (let s = 0; s < steps; s++) {
            const px0 = bl.x, py0 = bl.y;
            bl.x += bl.vx * dt / steps; bl.y += bl.vy * dt / steps;
            if (bl.x < 5) { bl.x = 5; bl.vx = Math.abs(bl.vx); }
            if (bl.x > MG_W - 5) { bl.x = MG_W - 5; bl.vx = -Math.abs(bl.vx); }
            if (bl.y < 26) { bl.y = 26; bl.vy = Math.abs(bl.vy); }
            if (bl.vy > 0 && bl.y >= P.y - 5 && bl.y <= P.y + 4 && Math.abs(bl.x - P.x) <= P.w / 2 + 4) {
              const off = (bl.x - P.x) / (P.w / 2);
              const sp = Math.hypot(bl.vx, bl.vy);
              const ang = -Math.PI / 2 + off * 1.05;
              bl.vx = Math.cos(ang) * sp; bl.vy = Math.sin(ang) * sp; bl.y = P.y - 6;
              playFightSfx("click");
            }
            for (const br of bricks) {
              if (br.hp <= 0) continue;
              if (bl.x + 4 > br.x && bl.x - 4 < br.x + BW && bl.y + 4 > br.y && bl.y - 4 < br.y + BH) {
                hitBrick(br);
                if (pierce <= 0) {
                  const fromSide = px0 + 4 <= br.x || px0 - 4 >= br.x + BW;
                  if (fromSide) bl.vx = -bl.vx; else bl.vy = -bl.vy;
                  bl.x = px0; bl.y = py0;
                }
                break;
              }
            }
          }
        });
        const before = balls.length;
        balls = balls.filter(bl => bl.y < MG_H + 10);
        if (before && !balls.length) {
          lives--; shake = 9; playFightSfx("hit"); fx.text(P.x, P.y - 20, "KUGEL VERLOREN!", "#ff4d6d");
          if (lives <= 0) env.end(false); else newBall();
        }
        // Gegner schießt durch die Lücken
        shotT -= dt;
        if (shotT <= 0) {
          eShots.push({ x: MG_W / 2 + (rnd() - 0.5) * 60, y: 40, vx: (P.x - MG_W / 2) / 90, vy: 2.4 + lvl * 0.08 });
          shotT = Math.max(90, 240 - lvl * 10) + rnd() * 120;
        }
        for (let i = eShots.length - 1; i >= 0; i--) {
          const s = eShots[i];
          s.x += s.vx * dt; s.y += s.vy * dt;
          if (s.y >= P.y - 4 && s.y <= P.y + 6 && Math.abs(s.x - P.x) <= P.w / 2) {
            eShots.splice(i, 1); P.stun = 45; shake = 7; playFightSfx("hit"); fx.text(P.x, P.y - 22, "GELÄHMT!", "#ff4d6d");
          } else if (s.y > MG_H) eShots.splice(i, 1);
        }
      }
      sim.heroHp = (lives / 3) * 100;
      sim.ki = pierce > 0 ? (pierce / 300) * 100 : 0;

      ctx.save();
      if (shake > 0) { ctx.translate((Math.random() - 0.5) * shake, (Math.random() - 0.5) * shake); shake *= Math.pow(0.82, dt); if (shake < 0.3) shake = 0; }
      drawStageBackground(ctx, MG_W, MG_H, t * 0.02, lvl + 2, t);
      ctx.fillStyle = "rgba(6, 5, 12, 0.35)"; ctx.fillRect(0, 0, MG_W, MG_H);
      drawFighterUnstretched(ctx, enemySprite, MG_W / 2, 42, { color: "#ff0055", flip: true, t: t + 900, maxW: 26, maxH: 34 });
      bricks.forEach(br => {
        if (br.hp <= 0) return;
        ctx.globalAlpha = br.hp < br.max ? 0.55 : 1;
        ctx.fillStyle = br.col; ctx.fillRect(br.x, br.y, BW, BH);
        ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fillRect(br.x + 1, br.y + 1, BW - 2, 2);
        if (br.max > 1) { ctx.strokeStyle = "rgba(255,255,255,0.7)"; ctx.lineWidth = 1; ctx.strokeRect(br.x + 0.5, br.y + 0.5, BW - 1, BH - 1); }
        ctx.globalAlpha = 1;
        if (br.special) {
          ctx.fillStyle = "#0b0b0d"; ctx.font = "bold 9px Anton, sans-serif"; ctx.textAlign = "center";
          ctx.fillText(br.special === "multi" ? "×3" : br.special === "pierce" ? "»" : "+", br.x + BW / 2, br.y + 9);
          ctx.textAlign = "left";
        }
      });
      eShots.forEach(s => { ctx.fillStyle = "#ff2a55"; ctx.beginPath(); ctx.arc(s.x, s.y, 4, 0, TAU); ctx.fill(); });
      // Schläger = Ki-Schild des Helden
      ctx.fillStyle = P.stun > 0 ? "#6f6f7c" : heroObj.color;
      ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(P.x - P.w / 2, P.y, P.w, 6, 3); else ctx.rect(P.x - P.w / 2, P.y, P.w, 6); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.6)"; ctx.fillRect(P.x - P.w / 2 + 4, P.y + 1, P.w - 8, 1.5);
      drawFighterUnstretched(ctx, heroSprite, P.x, P.y + 1, { color: heroObj.color, t, maxW: 20, maxH: 26 });
      balls.forEach(bl => {
        const g = ctx.createRadialGradient(bl.x, bl.y, 0, bl.x, bl.y, 9);
        g.addColorStop(0, "#ffffff"); g.addColorStop(0.35, pierce > 0 ? "#ff9f1c" : heroObj.color); g.addColorStop(1, "rgba(0,0,0,0)");
        ctx.fillStyle = g; ctx.beginPath(); ctx.arc(bl.x, bl.y, 9, 0, TAU); ctx.fill();
      });
      for (let i = 0; i < 3; i++) { ctx.fillStyle = i < lives ? "#ff4d6d" : "rgba(255,255,255,0.18)"; ctx.beginPath(); ctx.arc(14 + i * 14, 12, 4.5, 0, TAU); ctx.fill(); }
      if (balls.some(bl => bl.stuck) && intro <= 0 && !sim.over) {
        ctx.fillStyle = "#e6e6ec"; ctx.font = "700 11px Rajdhani, sans-serif"; ctx.textAlign = "center";
        ctx.fillText("ABSCHUSS oder aufs Bild tippen", MG_W / 2, 200); ctx.textAlign = "left";
      }

      fx.draw(ctx, dt);
      mgIntro(ctx, intro, "KI-MAUERBRECHER", [
        "Brich mit der Ki-Kugel durch die Energie-Mauer des Gegners.",
        "Schild mit LINKS/RECHTS oder Ziehen bewegen. Rote Schüsse lähmen!",
        "Sondersteine: ×3 = drei Kugeln · » = Durchschlag · + = Extra-Leben"
      ]);
      mgKO(ctx, sim);
      ctx.restore();
      env.bars();
    });
  }

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
    // Gegner: Versatz 1 … (Anzahl-1) zum Helden – kann nie derselbe Charakter sein
    const heroIdx = Math.max(0, CHARACTERS.indexOf(heroObj));
    const enemyOffset = 1 + ((lvl + 1) % (CHARACTERS.length - 1));
    const enemyObj = CHARACTERS.at((heroIdx + enemyOffset) % CHARACTERS.length);

    document.getElementById("lg-hero-name").textContent = heroObj.name;
    document.getElementById("lg-enemy-name").textContent = enemyObj.name;
    document.getElementById("battle-stage-tag").textContent = `LVL ${lvl}`;

    const heroSprite = new Image();
    const enemySprite = new Image();
    loadSmartImage(heroSprite, `c${heroObj.id}_s${state.selectedStage}`, () => loadSmartImage(heroSprite, `c${heroObj.id}_s1`));
    loadSmartImage(enemySprite, `c${enemyObj.id}_s${Math.min(5, Math.ceil(lvl / 2))}`, () => loadSmartImage(enemySprite, `c${enemyObj.id}_s1`));

    const canvas = document.getElementById("legends-canvas");
    // Touch-Steuerung früherer Minispiele zurücksetzen
    canvas.onpointerdown = null; canvas.onpointermove = null; canvas.onpointerup = null;
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

    // Ab Welt-Level 2: jede Runde ein anderes Minispiel (Runde 1 bleibt unten unverändert)
    if (lvl >= 2) {
      const game = MINI_GAMES[(lvl - 2) % MINI_GAMES.length];
      chargeBtn.style.display = "none";
      document.getElementById("gta-mode-label").textContent = game.name;
      battleModal.classList.remove("hidden");
      game.run({
        ctx, canvas, ctrlArea, lvl, sim, heroObj, enemyObj, heroSprite, enemySprite,
        heroStage: state.selectedStage,
        end: (won) => { if (!sim.over) finishMission(won); },
        bars: () => {
          document.getElementById("lg-hero-hp").style.width = `${Math.max(0, Math.min(100, sim.heroHp))}%`;
          document.getElementById("lg-enemy-hp").style.width = `${Math.max(0, (sim.enemyHp / sim.maxEnemyHp) * 100)}%`;
          document.getElementById("lg-ki-fill").style.width = `${Math.min(100, sim.ki)}%`;
          document.getElementById("lg-ki-num").textContent = Math.floor(sim.ki);
        }
      });
      return;
    }

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
