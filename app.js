(function loadAppFonts() {
  const host = ["fonts", "googleapis", "com"].join(".");
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = `https://${host}/css2?family=Anton&family=Rajdhani:wght@600;700&display=swap`;
  document.head.appendChild(link);
})();

(function injectEffectsAndModal() {
  const style = document.createElement("style");
  style.textContent = `
    @keyframes kiShake {
      0%, 100% { transform: translate(0, 0) rotate(0deg); }
      20% { transform: translate(-6px, 4px) rotate(-1deg); }
      40% { transform: translate(6px, -4px) rotate(1deg); }
      60% { transform: translate(-4px, -2px) rotate(-0.5deg); }
      80% { transform: translate(4px, 3px) rotate(0.5deg); }
    }
    @keyframes auraPulse {
      0%, 100% { filter: drop-shadow(0 0 10px var(--aura-color, #ff9900)); }
      50% { filter: drop-shadow(0 0 26px var(--aura-color, #ff9900)); }
    }
    .shake-active { animation: kiShake 0.45s ease-in-out; }
    .aura-active { animation: auraPulse 1.8s infinite ease-in-out; }
    .comic-stage {
      background: #101015; border: 2px solid #ff9900; border-radius: 12px;
      padding: 12px; position: relative; overflow: hidden;
      background-image: radial-gradient(#262632 1px, transparent 1px);
      background-size: 10px 10px;
    }
    .comic-badge {
      position: absolute; top: 8px; left: 8px; background: #ff9900;
      color: #0b0b0d; font-family: 'Anton', sans-serif; font-size: 0.78rem;
      padding: 2px 8px; border-radius: 5px; letter-spacing: 0.6px;
    }
    .timer-box {
      font-family: 'Anton', sans-serif; font-size: 2.2rem; color: #ffb703;
      letter-spacing: 2px; margin: 4px 0;
    }
    .timer-btn {
      background: #1c1c24; border: 1.5px solid #ff9900; color: #ff9900;
      font-family: 'Anton', sans-serif; font-size: 1rem; padding: 6px 14px;
      border-radius: 8px; cursor: pointer; letter-spacing: 0.8px;
    }
  `;
  document.head.appendChild(style);

  const modal = document.createElement("div");
  modal.id = "exercise-modal";
  modal.className = "levelup-overlay hidden";
  modal.innerHTML = `
    <div class="levelup-card" style="max-width: 360px;">
      <span id="ex-modal-tag" class="orange-tag">COMIC-ANLEITUNG</span>
      <h2 id="ex-modal-title" class="tall-orange-title small">ÜBUNG</h2>
      <div class="comic-stage">
        <span class="comic-badge">TECHNIK-GUIDE</span>
        <img id="ex-comic-img" style="width:100%;height:140px;object-fit:contain;display:none;" alt="" />
        <div id="ex-comic-svg" style="height:140px;display:grid;place-items:center;"></div>
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
})();
const CHARACTERS = [
  { id: 1, name: "SON-BLITZ", attack: "SONNEN-KAMEHA", focus: "GANZKÖRPER", bio: "Ein furchtloser Saiyajin-Krieger mit unbändigem Trainingswillen.", color: "#ffb703" },
  { id: 2, name: "PRINZ-KI", attack: "FINALER BLITZ", focus: "ARME & BRUST", bio: "Stolz, zielstrebig und Meister der schweren Schwerkraft.", color: "#5ce1e6" },
  { id: 3, name: "CYBER-RED", attack: "FLAMMEN-HIEB", focus: "REAKTION & KERN", bio: "High-Tech-Kampfrüstung und blitzschnelle Reflexe.", color: "#ff5c77" },
  { id: 4, name: "SHADOW-X", attack: "PHANTOM-SALVE", focus: "BAUCH & BALANCE", bio: "Bewegt sich lautlos wie der Wind.", color: "#c77dff" },
  { id: 5, name: "NOVA-GOLD", attack: "SUPERNOVA", focus: "GANZKÖRPER", bio: "Seine goldene Energie erhellt die gesamte Arena.", color: "#ffe66d" },
  { id: 6, name: "TITAN-FORCE", attack: "TITANEN-WALL", focus: "ARME & CORE", bio: "Ein unerschütterlicher Verteidiger mit starkem Ki-Schild.", color: "#48cae4" },
  { id: 7, name: "BLITZ-KID", attack: "DONNER-SPRINT", focus: "BEINE & SPEED", bio: "Jung, extrem wendig und voller Schnellkraft.", color: "#ff9e5e" },
  { id: 8, name: "FROST-ZEN", attack: "GLETSCHER-STRAHL", focus: "KI-KERN", bio: "Bleibt selbst unter höchstem Druck eiskalt.", color: "#72efdd" },
  { id: 9, name: "FLAME-REX", attack: "MAGMA-FAUST", focus: "BRUST & SCHULTERN", bio: "Seine glühende Kampf-Aura steigt mit jedem Training.", color: "#ff6b6b" },
  { id: 10, name: "ULTRA-VEX", attack: "KOMETEN-REGEN", focus: "GANZKÖRPER", bio: "Nutzt kosmische Energie für maximale Sprungkraft.", color: "#b8c0ff" },
  { id: 11, name: "SOLAR-KAI", attack: "HELIOS-WELLE", focus: "AUSDAUER", bio: "Zieht seine Kraft direkt aus dem Licht der Sonne.", color: "#ffd166" },
  { id: 12, name: "DARK-ORION", attack: "ECLIPSE-SCHLAG", focus: "ARME & RÜCKEN", bio: "Geheimnisvoller Einzelgänger mit gewaltiger Schlagkraft.", color: "#80ffdb" },
  { id: 13, name: "AERO-DASH", attack: "WIRBELSTURM", focus: "BEINE & AGILITÄT", bio: "Beherrscht den Himmel und bewegt sich blitzschnell.", color: "#64dfdf" },
  { id: 14, name: "OMEGA-GOD", attack: "OMEGA-URKNALL", focus: "ALLE BEREICHE", bio: "Der ultimative Meister-Krieger aller Techniken.", color: "#ff758f" },
  { id: 15, name: "STURM-GREEN", attack: "OMEGA-STURM", focus: "BEINE & KRAFT", bio: "Entfesselt gewaltige smaragdgrüne Natur-Energie.", color: "#52e588" }
];

const STAGE_RULES = [
  { stage: 1, minLevel: 1 },
  { stage: 2, minLevel: 2 },
  { stage: 3, minLevel: 4 },
  { stage: 4, minLevel: 6 },
  { stage: 5, minLevel: 8 }
];

const BODY_WORKOUTS = {
  arms: {
    label: "TRAINING: ARME & BRUST",
    easy: [
      { title: "10x Knie-Liegestütze", sub: "Einfach · Basis", xp: 25, power: 400, pose: "pushup", tip: "Knie auf den Boden, Rücken gerade halten und Brust tief absenken." },
      { title: "20 Sek. Schattenboxen", sub: "Einfach · Ki-Fäuste", xp: 20, power: 350, pose: "punch", sec: 20, tip: "Lockere Deckung, schnelle gerade Schläge nach vorn und Ki-Fokus halten!" }
    ],
    advanced: [
      { title: "12x Echte Liegestütze", sub: "Profi · Kamehameha", xp: 45, power: 900, pose: "pushup", tip: "Körper wie ein Brett spannen, Ellbogen eng führen und explosiv hochdrücken." },
      { title: "10x Dips am Stuhl", sub: "Profi · Trizeps", xp: 45, power: 950, pose: "pushup", tip: "Hände an die Stuhlkante, Po dicht am Stuhl absenken und kraftvoll strecken." }
    ],
    master: [
      { title: "22x Tiefe Liegestütze", sub: "Meister · 100x G", xp: 80, power: 2000, pose: "pushup", tip: "Bis kurz vor den Boden absenken, 1 Sekunde halten und mit voller Ki-Kraft hoch." },
      { title: "10x Diamant-Liegestütze", sub: "Meister · Final-Ki", xp: 90, power: 2400, pose: "pushup", tip: "Daumen und Zeigefinger bilden ein Dreieck unter der Brust – volle Trizeps-Power!" }
    ]
  },
  core: {
    label: "TRAINING: BAUCH & KI-KERN",
    easy: [
      { title: "20 Sek. Plank", sub: "Einfach · Ki-Schild", xp: 25, power: 450, pose: "plank", sec: 20, tip: "Unterarme aufstützen, Bauch und Po fest anspannen – nicht durchhängen!" },
      { title: "10x Crunches", sub: "Einfach · Körpermitte", xp: 25, power: 400, pose: "situp", tip: "Schultern kontrolliert vom Boden einrollen und beim Hochgehen ausatmen." }
    ],
    advanced: [
      { title: "40 Sek. Plank", sub: "Profi · Goldene Aura", xp: 45, power: 950, pose: "plank", sec: 40, tip: "Halte deine goldene Aura stabil – ruhig weiteratmen und Körperspannung halten." },
      { title: "18x Sit-Ups", sub: "Profi · Saiyajin-Rumpf", xp: 45, power: 900, pose: "situp", tip: "Mit sauberer Rumpfkraft ganz aufrichten, ohne am Nacken zu ziehen." }
    ],
    master: [
      { title: "70 Sek. Plank", sub: "Meister · Abwehr", xp: 85, power: 2200, pose: "plank", sec: 70, tip: "Unzerstörbarer Ki-Schild! Jede Sekunde stärkt deine Rumpf-Verteidigung." },
      { title: "25x Beinheben", sub: "Meister · Göttlicher Kern", xp: 80, power: 2100, pose: "situp", tip: "Beine gestreckt langsam heben und kontrolliert absenken, ohne Hohlkreuz." }
    ]
  },
  legs: {
    label: "TRAINING: BEINE & SPRUNGKRAFT",
    easy: [
      { title: "15x Kniebeugen", sub: "Einfach · Fester Stand", xp: 25, power: 450, pose: "squat", tip: "Füße schulterbreit, Po weit nach hinten schieben und Rücken stolz lassen." },
      { title: "25 Sek. Hampelmänner", sub: "Einfach · Speed", xp: 20, power: 350, pose: "jump", sec: 25, tip: "Leichtfüßig auf den Fußballen springen und Arme schwungvoll über den Kopf." }
    ],
    advanced: [
      { title: "25x Kniebeugen", sub: "Profi · 10x Schwerkraft", xp: 45, power: 950, pose: "squat", tip: "Tief in die Hocke gehen und über die Fersen explosiv nach oben drücken." },
      { title: "14x Ausfallschritte", sub: "Profi · Ausweichen", xp: 45, power: 900, pose: "squat", tip: "Großer Schritt nach vorn, hinteres Knie knapp über dem Boden abstoppen." }
    ],
    master: [
      { title: "15x Sprung-Kniebeugen", sub: "Meister · Raketen-Start", xp: 85, power: 2300, pose: "jump", tip: "Aus der tiefen Kniebeuge mit voller Kraft abspringen und weich landen!" },
      { title: "45 Sek. Wandsitzen", sub: "Meister · 100x G", xp: 80, power: 2100, pose: "squat", sec: 45, tip: "Rücken fest an die Wand, Knie im 90-Grad-Winkel – halte der Schwerkraft stand!" }
    ]
  }
};
const CHARACTER_WORKOUTS = {
  1: {
    arms: {
      easy: [{ title: "10x Knie-Liegestütze", sub: "Einfach · Kamehameha-Basis", xp: 25, power: 400, pose: "pushup", tip: "Knie auf den Boden, Rücken gerade halten und Brust tief absenken." }, { title: "20 Sek. Ki-Schattenboxen", sub: "Einfach · Schnelle Fäuste", xp: 20, power: 350, pose: "punch", sec: 20, tip: "Schnelle Kombos nach vorn schlagen und dein Ki in den Fäusten bündeln!" }],
      advanced: [{ title: "15x Echte Liegestütze", sub: "Profi · Kaioken x2", xp: 45, power: 900, pose: "pushup", tip: "Volle Körperspannung halten und explosiv nach oben drücken." }, { title: "12x Stuhl-Dips", sub: "Profi · Arm-Power", xp: 45, power: 950, pose: "pushup", tip: "Arme sauber beugen und den Trizeps voll durchstrecken." }],
      master: [{ title: "25x Tiefe Liegestütze", sub: "Meister · Kaioken x10", xp: 80, power: 2000, pose: "pushup", tip: "Maximale Tiefe für maximale Kaioken-Kraft!" }, { title: "12x Diamant-Liegestütze", sub: "Meister · Super-Kameha", xp: 90, power: 2400, pose: "pushup", tip: "Hände eng im Dreieck unter der Brust platzieren." }]
    },
    core: {
      easy: [{ title: "20 Sek. Ki-Plank", sub: "Einfach · Stabile Aura", xp: 25, power: 450, pose: "plank", sec: 20, tip: "Körper gerade wie ein Pfeil halten und Bauch anspannen." }, { title: "12x Crunches", sub: "Einfach · Körpermitte", xp: 25, power: 400, pose: "situp", tip: "Kontrolliert einrollen und oben kurz halten." }],
      advanced: [{ title: "45 Sek. Plank", sub: "Profi · Schwerkraft-Kern", xp: 45, power: 950, pose: "plank", sec: 45, tip: "Trotz Schwerkraft stabil bleiben und ruhig atmen." }, { title: "20x Sit-Ups", sub: "Profi · Saiyajin-Rumpf", xp: 45, power: 900, pose: "situp", tip: "Kraftvoll aufrichten und langsam abrollen." }],
      master: [{ title: "75 Sek. Plank", sub: "Meister · Ultra-Abwehr", xp: 85, power: 2200, pose: "plank", sec: 75, tip: "Volle Konzentration – nichts erschüttert deine Deckung!" }, { title: "25x Beinheben", sub: "Meister · Volle Kontrolle", xp: 80, power: 2100, pose: "situp", tip: "Beine gestreckt heben und kontrolliert absenken." }]
    },
    legs: {
      easy: [{ title: "15x Kniebeugen", sub: "Einfach · Fester Stand", xp: 25, power: 450, pose: "squat", tip: "Sauber in die Hocke gehen, Knie bleiben hinter den Zehenspitzen." }, { title: "25 Sek. Hampelmänner", sub: "Einfach · Aufwärmen", xp: 20, power: 350, pose: "jump", sec: 25, tip: "Schneller Rhythmus auf den Fußballen." }],
      advanced: [{ title: "25x Kniebeugen", sub: "Profi · 10x Schwerkraft", xp: 45, power: 950, pose: "squat", tip: "Tief runter und kraftvoll hochdrücken." }, { title: "16x Ausfallschritte", sub: "Profi · Blitz-Ausweichen", xp: 45, power: 900, pose: "squat", tip: "Weite Schritte im Wechsel für maximale Beinstabilität." }],
      master: [{ title: "18x Sprung-Kniebeugen", sub: "Meister · Wolken-Sprung", xp: 85, power: 2300, pose: "jump", tip: "Explosiv in den Himmel abspringen!" }, { title: "50 Sek. Wandsitzen", sub: "Meister · 100x G", xp: 80, power: 2100, pose: "squat", sec: 50, tip: "90-Grad-Winkel an der Wand halten, bis die Zeit abläuft." }]
    }
  },
  2: {
    arms: {
      easy: [{ title: "12x Wand-Liegestütze", sub: "Einfach · Prinzen-Stolz", xp: 25, power: 400, pose: "pushup", tip: "Saubere Spannung vom Kopf bis zu den Fersen." }, { title: "25 Sek. Armkreisen", sub: "Einfach · Schulter-Ki", xp: 20, power: 350, pose: "punch", sec: 25, tip: "Arme gestreckt halten und kraftvolle Kreise ziehen." }],
      advanced: [{ title: "15x Breite Liegestütze", sub: "Profi · Galick-Strahl", xp: 45, power: 950, pose: "pushup", tip: "Hände weiter als schulterbreit für maximale Brust-Power." }, { title: "12x Schulter-Drücken (Pike)", sub: "Profi · 300x G", xp: 50, power: 1000, pose: "pushup", tip: "Hüfte hoch wie ein umgekehrtes V und Kopf Richtung Boden senken." }],
      master: [{ title: "20x Explosiv-Liegestütze", sub: "Meister · Finaler Blitz", xp: 85, power: 2200, pose: "pushup", tip: "So schnell hochdrücken, dass die Hände kurz abheben!" }, { title: "15x Diamant-Liegestütze", sub: "Meister · Royal Blue", xp: 90, power: 2500, pose: "pushup", tip: "Hände eng zusammen für königliche Armkraft." }]
    },
    core: {
      easy: [{ title: "25 Sek. Unterarm-Plank", sub: "Einfach · Eiserner Wille", xp: 25, power: 450, pose: "plank", sec: 25, tip: "Kein Durchhängen – halte den Körper eisern gerade." }, { title: "12x Käfer-Crunches", sub: "Einfach · Balance", xp: 25, power: 400, pose: "situp", tip: "Ellbogen und gegenüberliegendes Knie sauber zusammenführen." }],
      advanced: [{ title: "45 Sek. Seitlicher Plank", sub: "Profi · Ki-Rüstung", xp: 45, power: 950, pose: "plank", sec: 45, tip: "Hüfte hochdrücken und seitliche Bauchmuskeln anspannen." }, { title: "20x Russian Twists", sub: "Profi · Dreh-Impuls", xp: 45, power: 900, pose: "situp", tip: "Oberkörper leicht zurücklehnen und kontrolliert von Seite zu Seite drehen." }],
      master: [{ title: "60 Sek. Kommando-Plank", sub: "Meister · 400x G Raum", xp: 85, power: 2300, pose: "plank", sec: 60, tip: "Im Wechsel vom Unterarm- in den hohen Stütz wandern." }, { title: "20x V-Ups (Klappmesser)", sub: "Meister · Stolz des Prinzen", xp: 90, power: 2400, pose: "situp", tip: "Arme und gestreckte Beine gleichzeitig oben zusammenführen." }]
    },
    legs: {
      easy: [{ title: "15x Sumo-Kniebeugen", sub: "Einfach · Tiefer Stand", xp: 25, power: 450, pose: "squat", tip: "Breiter Stand, Fußspitzen leicht nach außen und tief absenken." }, { title: "20x Wadenheben", sub: "Einfach · Sprungansatz", xp: 20, power: 350, pose: "jump", tip: "Weit auf die Zehenspitzen hochdrücken und kurz halten." }],
      advanced: [{ title: "20x Ausfallschritte rückwärts", sub: "Profi · Konter-Schritt", xp: 45, power: 950, pose: "squat", tip: "Kontrolliert nach hinten steigen und über das vordere Bein hochdrücken." }, { title: "35 Sek. Wandsitzen", sub: "Profi · Schwerkraft", xp: 45, power: 900, pose: "squat", sec: 35, tip: "Oberschenkel parallel zum Boden halten." }],
      master: [{ title: "12x Bulgarische Kniebeugen", sub: "Meister · Einzelbein-Kraft", xp: 85, power: 2300, pose: "squat", tip: "Hinteren Fuß auf einen Stuhl legen und tief beugen." }, { title: "20x Ausfallschritt-Sprünge", sub: "Meister · Überschall", xp: 90, power: 2400, pose: "jump", tip: "Beine explosiv in der Luft wechseln!" }]
    }
  },
  3: {
    arms: {
      easy: [{ title: "25 Sek. Speed-Punches", sub: "Einfach · Turbo-Fäuste", xp: 25, power: 400, pose: "punch", sec: 25, tip: "Maximale Schlagfrequenz nach vorn – Schultern locker lassen!" }, { title: "10x Schulter-Tippen im Plank", sub: "Einfach · Reflexe", xp: 25, power: 450, pose: "pushup", tip: "Im hohen Stütz abwechselnd die gegenüberliegende Schulter antippen." }],
      advanced: [{ title: "14x Enge Liegestütze", sub: "Profi · Plasma-Stoß", xp: 45, power: 950, pose: "pushup", tip: "Ellbogen eng am Körper führen für maximale Stoßkraft." }, { title: "30 Sek. Oberkörper-Boxen", sub: "Profi · Overdrive", xp: 45, power: 900, pose: "punch", sec: 30, tip: "Volles Tempo mit Haken und Geraden!" }],
      master: [{ title: "20x Wechsel-Liegestütze", sub: "Meister · Flammen-Hieb", xp: 85, power: 2200, pose: "pushup", tip: "Nach jedem Liegestütz eine Hand versetzen." }, { title: "40 Sek. Bergsteiger (Speed)", sub: "Meister · System-Maximum", xp: 90, power: 2400, pose: "plank", sec: 40, tip: "Knie im Sprint-Tempo unter die Brust ziehen." }]
    },
    core: {
      easy: [{ title: "15x Mountain Climbers", sub: "Einfach · Antrieb", xp: 25, power: 450, pose: "plank", tip: "Hände fest unter den Schultern, Knie zügig vorziehen." }, { title: "20 Sek. Hollow Hold", sub: "Einfach · Panzer-Kern", xp: 25, power: 400, pose: "situp", sec: 20, tip: "Unteren Rücken fest in den Boden drücken, Schultern und Beine leicht heben." }],
      advanced: [{ title: "30x Fahrrad-Crunches", sub: "Profi · Cyber-Rotation", xp: 45, power: 950, pose: "situp", tip: "Fließende Rotation von Ellbogen zu Knie." }, { title: "45 Sek. Plank mit Kniezug", sub: "Profi · Reaktor-Stabilität", xp: 50, power: 1000, pose: "plank", sec: 45, tip: "Im Plank abwechselnd das Knie seitlich zum Ellbogen ziehen." }],
      master: [{ title: "50x Fahrrad-Crunches", sub: "Meister · Hyper-Kern", xp: 85, power: 2300, pose: "situp", tip: "Sauber durchziehen ohne Schwung zu holen!" }, { title: "60 Sek. Hollow Body Hold", sub: "Meister · Titan-Schild", xp: 90, power: 2400, pose: "situp", sec: 60, tip: "Volle Rumpfspannung für 60 Sekunden halten." }]
    },
    legs: {
      easy: [{ title: "25 Sek. Kniehebelauf", sub: "Einfach · Sprint-Modul", xp: 25, power: 450, pose: "jump", sec: 25, tip: "Knie hoch auf Hüfthöhe ziehen und Arme aktiv mitnehmen." }, { title: "15x Skater-Sprünge", sub: "Einfach · Ausweich-Sensor", xp: 25, power: 400, pose: "jump", tip: "Seitlich von einem Bein aufs andere springen und stabil landen." }],
      advanced: [{ title: "40 Sek. High Knees", sub: "Profi · Nachbrenner", xp: 45, power: 950, pose: "jump", sec: 40, tip: "Höchstgeschwindigkeit halten!" }, { title: "18x Seitliche Ausfallschritte", sub: "Profi · Ausweich-Manöver", xp: 45, power: 900, pose: "squat", tip: "Weit zur Seite steigen, Standbein beugen und zurückdrücken." }],
      master: [{ title: "15x Burpees", sub: "Meister · Vollgas-Modus", xp: 90, power: 2500, pose: "jump", tip: "Liegestütz, Beine vorspringen und Strecksprung nach oben!" }, { title: "20x Skater-Sprünge weit", sub: "Meister · Lichtgeschwindigkeit", xp: 85, power: 2200, pose: "jump", tip: "Maximale Sprungweite von Seite zu Seite." }]
    }
  }
};
let state = JSON.parse(localStorage.getItem("zwarriors_neon_v8")) || {
  level: 1, xp: 0, powerLevel: 0, carouselIndex: 0, selectedChar: 1,
  selectedStage: 1, selectedPart: "arms", difficulty: "easy", partXP: { arms: 0, core: 0, legs: 0 }
};

let activeExercise = null;
let timerInterval = null;

function showScreen(id) {
  ["intro-screen", "select-screen", "detail-screen", "arena-screen"].forEach(s => {
    document.getElementById(s).classList.toggle("hidden", s !== id);
  });
}

function playSound(mode = "click") {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
    const now = ctx.currentTime;

    if (mode === "stageup") {
      if (navigator.vibrate) navigator.vibrate(Array.of(90, 40, 140, 40, 220));
      Array.of(220, 330, 440, 660, 880).forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = idx % 2 === 0 ? "sawtooth" : "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        osc.frequency.exponentialRampToValueAtTime(freq * 1.35, now + idx * 0.08 + 0.28);
        gain.gain.setValueAtTime(0.14, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.005, now + idx * 0.08 + 0.3);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.31);
      });
      return;
    }

    if (mode === "levelup") {
      if (navigator.vibrate) navigator.vibrate(Array.of(80, 40, 130));
      Array.of(330, 440, 660).forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.15, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.07 + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.26);
      });
      return;
    }

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(190, now);
    osc.frequency.exponentialRampToValueAtTime(540, now + 0.16);
    gain.gain.setValueAtTime(0.13, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.19);
  } catch (e) {}
}

function getComicSVG(pose) {
  const svgs = {
    pushup: `<svg viewBox="0 0 220 120" width="200" height="115">
      <line x1="15" y1="98" x2="205" y2="98" stroke="#444" stroke-width="3" stroke-linecap="round"/>
      <circle cx="155" cy="48" r="11" fill="#ff9900"/>
      <line x1="145" y1="54" x2="72" y2="86" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
      <line x1="72" y1="86" x2="35" y2="95" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
      <polyline points="140,56 142,78 148,96" fill="none" stroke="#ffb703" stroke-width="6" stroke-linecap="round"/>
      <path d="M175,45 L175,78 M169,70 L175,79 L181,70" stroke="#ff9900" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`,
    plank: `<svg viewBox="0 0 220 120" width="200" height="115">
      <line x1="15" y1="98" x2="205" y2="98" stroke="#444" stroke-width="3" stroke-linecap="round"/>
      <circle cx="165" cy="66" r="11" fill="#ff9900"/>
      <line x1="154" y1="70" x2="40" y2="94" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
      <polyline points="150,72 150,94 166,94" fill="none" stroke="#ffb703" stroke-width="6" stroke-linecap="round"/>
      <path d="M95,52 L115,52" stroke="#ff9900" stroke-width="3" stroke-dasharray="4 4"/>
    </svg>`,
    squat: `<svg viewBox="0 0 220 120" width="200" height="115">
      <line x1="40" y1="106" x2="180" y2="106" stroke="#444" stroke-width="3" stroke-linecap="round"/>
      <circle cx="112" cy="28" r="11" fill="#ff9900"/>
      <line x1="110" y1="40" x2="96" y2="70" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
      <polyline points="96,70 124,78 112,104" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
      <polyline points="108,46 138,52" fill="none" stroke="#ffb703" stroke-width="5" stroke-linecap="round"/>
      <path d="M72,54 L72,82 M66,75 L72,83 L78,75" stroke="#ff9900" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`,
    situp: `<svg viewBox="0 0 220 120" width="200" height="115">
      <line x1="15" y1="98" x2="205" y2="98" stroke="#444" stroke-width="3" stroke-linecap="round"/>
      <circle cx="92" cy="40" r="11" fill="#ff9900"/>
      <line x1="95" y1="52" x2="112" y2="94" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
      <polyline points="112,94 146,66 172,95" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
      <polyline points="96,56 122,52" fill="none" stroke="#ffb703" stroke-width="5" stroke-linecap="round"/>
      <path d="M64,74 Q66,48 80,42" stroke="#ff9900" stroke-width="3" fill="none" stroke-linecap="round"/>
    </svg>`,
    punch: `<svg viewBox="0 0 220 120" width="200" height="115">
      <circle cx="88" cy="30" r="11" fill="#ff9900"/>
      <line x1="88" y1="42" x2="88" y2="80" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
      <polyline points="88,80 72,108" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
      <polyline points="88,80 108,108" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
      <line x1="88" y1="50" x2="148" y2="48" stroke="#ffb703" stroke-width="6" stroke-linecap="round"/>
      <polygon points="154,48 168,42 164,54" fill="#ff9900"/>
    </svg>`,
    jump: `<svg viewBox="0 0 220 120" width="200" height="115">
      <line x1="50" y1="108" x2="170" y2="108" stroke="#444" stroke-width="3" stroke-linecap="round"/>
      <circle cx="110" cy="24" r="11" fill="#ff9900"/>
      <line x1="110" y1="36" x2="110" y2="70" stroke="#fff" stroke-width="7" stroke-linecap="round"/>
      <polyline points="110,42 82,20" fill="none" stroke="#ffb703" stroke-width="5" stroke-linecap="round"/>
      <polyline points="110,42 138,20" fill="none" stroke="#ffb703" stroke-width="5" stroke-linecap="round"/>
      <polyline points="110,70 90,94" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
      <polyline points="110,70 130,94" fill="none" stroke="#fff" stroke-width="6" stroke-linecap="round"/>
      <path d="M110,104 L110,86" stroke="#ff9900" stroke-width="3" stroke-dasharray="3 3"/>
    </svg>`
  };
  return svgs[pose] || svgs.punch;
}

function loadSmartImage(imgEl, baseName, onFail, onSuccess) {
  imgEl.style.display = "none";
  imgEl.onload = () => {
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

  const cPrev = CHARACTERS[idxPrev];
  const cCurr = CHARACTERS[idxCurr];
  const cNext = CHARACTERS[idxNext];

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
    im.classList.toggle("is-c3", charObj.id === 3);
    fb.style.display = "grid";
    loadSmartImage(
      im,
      `c${charObj.id}_s1`,
      () => { fb.style.display = "grid"; },
      () => { fb.style.display = "none"; }
    );
  });

  const progress = (idxCurr / (total - 1)) * 34;
  document.getElementById("scroll-thumb").style.transform = `translateY(${progress}px)`;
}

function stepCarousel(dir) {
  state.carouselIndex = (state.carouselIndex + dir + CHARACTERS.length) % CHARACTERS.length;
  playSound("click");
  updateStaggeredCarousel();
}

let touchStartY = 0;
let isSwiping = false;
const carouselEl = document.getElementById("staggered-carousel");

carouselEl.addEventListener("touchstart", e => {
  if (e.touches && e.touches.length > 0) {
    touchStartY = e.touches.item(0).clientY;
    isSwiping = true;
  }
}, { passive: true });

carouselEl.addEventListener("touchmove", e => {
  if (isSwiping) e.preventDefault();
}, { passive: false });

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
  openCharacterDetails(CHARACTERS[state.carouselIndex].id);
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
  imgEl.classList.toggle("is-c3", c.id === 3);
  const phEl = document.getElementById("detail-placeholder");
  document.getElementById("detail-placeholder-code").textContent = `c${c.id}_s1.png`;
  phEl.classList.add("hidden");

  loadSmartImage(imgEl, `c${c.id}_s1`, () => { phEl.classList.remove("hidden"); });
  showScreen("detail-screen");
}
function openExerciseModal(ex) {
  activeExercise = ex;
  clearInterval(timerInterval);
  playSound("click");

  document.getElementById("ex-modal-title").textContent = ex.title;
  document.getElementById("ex-modal-tip").textContent = ex.tip || "Saubere Ausführung mit voller Körperspannung!";
  document.getElementById("ex-complete-btn").textContent = `GESCHAFFT (+${ex.xp} XP)`;

  const imgEl = document.getElementById("ex-comic-img");
  const svgEl = document.getElementById("ex-comic-svg");
  svgEl.innerHTML = getComicSVG(ex.pose || "punch");
  svgEl.style.display = "grid";

  loadSmartImage(
    imgEl,
    `ex_${ex.pose || "punch"}`,
    () => { svgEl.style.display = "grid"; },
    () => { svgEl.style.display = "none"; }
  );

  const timerArea = document.getElementById("ex-timer-area");
  const timerDisp = document.getElementById("ex-timer-display");
  const timerBtn = document.getElementById("ex-timer-start");

  if (ex.sec) {
    let remaining = ex.sec;
    timerArea.classList.remove("hidden");
    timerDisp.textContent = `00:${String(remaining).padStart(2, "0")}`;
    timerBtn.textContent = "TIMER STARTEN";
    timerBtn.onclick = () => {
      clearInterval(timerInterval);
      timerBtn.textContent = "LÄUFT...";
      timerInterval = setInterval(() => {
        remaining -= 1;
        timerDisp.textContent = `00:${String(Math.max(0, remaining)).padStart(2, "0")}`;
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
  const customCharWorkouts = CHARACTER_WORKOUTS[state.selectedChar];
  const partData = (customCharWorkouts && customCharWorkouts[state.selectedPart])
    ? { label: BODY_WORKOUTS[state.selectedPart].label, ...customCharWorkouts[state.selectedPart] }
    : (BODY_WORKOUTS[state.selectedPart] || BODY_WORKOUTS.arms);

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

function completeExercise(gainedXP, gainedPower) {
  const oldMax = getMaxUnlockedStage(state.level);
  state.xp += gainedXP;
  state.powerLevel += gainedPower;
  state.partXP[state.selectedPart] = (state.partXP[state.selectedPart] || 0) + gainedXP;

  const stageEl = document.querySelector(".arena-poster-stage");
  if (stageEl) {
    stageEl.classList.remove("shake-active");
    void stageEl.offsetWidth;
    stageEl.classList.add("shake-active");
  }

  const xpNeeded = state.level * 100;
  if (state.xp >= xpNeeded) {
    state.xp -= xpNeeded;
    state.level += 1;
    const newMax = getMaxUnlockedStage(state.level);
    if (newMax > oldMax) {
      state.selectedStage = newMax;
      playSound("stageup");
      document.getElementById("levelup-badge").textContent = "TRANSFORMATION!";
      document.getElementById("levelup-title").textContent = `STUFE ${newMax}`;
      document.getElementById("levelup-desc").textContent = `Neue Aura & Stufe ${newMax} freigeschaltet!`;
    } else {
      playSound("levelup");
      document.getElementById("levelup-badge").textContent = "LEVEL UP!";
      document.getElementById("levelup-title").textContent = `LEVEL ${state.level}`;
      document.getElementById("levelup-desc").textContent = `Kampfkraft steigt auf ${state.powerLevel.toLocaleString("de-DE")}!`;
    }
    document.getElementById("levelup-overlay").classList.remove("hidden");
  } else {
    playSound("click");
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
  document.getElementById("ki-bar-fill").style.width = `${Math.min(100, (state.xp / xpNeeded) * 100)}%`;

  document.getElementById("stat-arms").textContent = `LVL ${1 + Math.floor((state.partXP.arms || 0) / 60)}`;
  document.getElementById("stat-core").textContent = `LVL ${1 + Math.floor((state.partXP.core || 0) / 60)}`;
  document.getElementById("stat-legs").textContent = `LVL ${1 + Math.floor((state.partXP.legs || 0) / 60)}`;

  loadSmartImage(document.getElementById("header-avatar-img"), `c${state.selectedChar}_s1`, () => {});

  const imgEl = document.getElementById("fighter-img");
  imgEl.classList.toggle("is-c3", state.selectedChar === 3);
  imgEl.style.setProperty("--aura-color", charObj.color);
  imgEl.classList.toggle("aura-active", state.selectedStage >= 2);

  const placeholderEl = document.getElementById("placeholder-box");
  document.getElementById("placeholder-code").textContent = `${baseFile}.png`;
  placeholderEl.classList.add("hidden");

  loadSmartImage(imgEl, baseFile, () => { placeholderEl.classList.remove("hidden"); });

  const pillsContainer = document.getElementById("stage-pills");
  pillsContainer.innerHTML = "";
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
    pillsContainer.appendChild(btn);
  });

  localStorage.setItem("zwarriors_neon_v8", JSON.stringify(state));
}

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
  if (confirm("Wirklich bei Level 1 neu starten?")) {
    state = { level: 1, xp: 0, powerLevel: 0, carouselIndex: 0, selectedChar: 1, selectedStage: 1, selectedPart: "arms", difficulty: "easy", partXP: { arms: 0, core: 0, legs: 0 } };
    updateUI();
    renderWorkouts();
    showScreen("intro-screen");
  }
});

loadSmartImage(document.getElementById("intro-hero-img"), "c1_s1", () => {});
updateStaggeredCarousel();
updateUI();
renderWorkouts();
