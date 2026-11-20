const CHARACTERS = [
  { id: 1, name: "SON-BLITZ", role: "BLITZ-KRIEGER", attack: "Sonnen-Kameha", focus: "Ganzkörper & Speed", bio: "Ein furchtloser Kämpfer mit unbändigem Trainingswillen. Je härter das Workout, desto heller leuchtet seine Aura.", color: "linear-gradient(135deg, #ff9d00, #c85a00)" },
  { id: 2, name: "PRINZ-KI", role: "ELITE-KÄMPFER", attack: "Finaler Blitzstrahl", focus: "Arme & Brustkraft", bio: "Stolz, zielstrebig und immer auf der Suche nach der nächsten Transformation. Meister der schweren Schwerkraft.", color: "linear-gradient(135deg, #38b6ff, #004e98)" },
  { id: 3, name: "STURM-GREEN", role: "KRAFT-KOLOS", attack: "Omega-Sturmwelle", focus: "Beine & Sprungkraft", bio: "Entfesselt gewaltige smaragdgrüne Natur-Energie und hält selbst den härtesten Ausdauer-Prüfungen stand.", color: "linear-gradient(135deg, #2ecc71, #116634)" },
  { id: 4, name: "CYBER-RED", role: "ZUKUNFTS-KRIEGER", attack: "Brennender Hieb", focus: "Reaktion & Ki-Kern", bio: "Ausgestattet mit einer High-Tech-Kampfrüstung und blitzschnellen Reflexen.", color: "linear-gradient(135deg, #ff4757, #8a111f)" },
  { id: 5, name: "SHADOW-X", role: "SCHATTEN-MEISTER", attack: "Phantom-Salve", focus: "Bauch & Balance", bio: "Bewegt sich lautlos wie der Wind und überrascht seine Gegner mit plötzlichen Energie-Schüben.", color: "linear-gradient(135deg, #9b59b6, #45165c)" },
  { id: 6, name: "NOVA-GOLD", role: "STERNEN-KRIEGER", attack: "Supernova-Kugel", focus: "Ganzkörper-Power", bio: "Seine goldene Energie erhellt die gesamte Arena und verleiht ihm enorme Ausdauer.", color: "linear-gradient(135deg, #f1c40f, #ad7200)" },
  { id: 7, name: "TITAN-FORCE", role: "SCHILD-WÄCHTER", attack: "Titanen-Wall", focus: "Arme & Core", bio: "Ein unerschütterlicher Verteidiger, dessen Ki-Schild keinen Angriff durchlässt.", color: "linear-gradient(135deg, #00d2d3, #016268)" },
  { id: 8, name: "BLITZ-KID", role: "TEMPO-TALENT", attack: "Donner-Sprint", focus: "Beine & Schnelligkeit", bio: "Jung, extrem wendig und immer bereit für das nächste Schnellkraft-Training.", color: "linear-gradient(135deg, #ff7f50, #a83500)" },
  { id: 9, name: "FROST-ZEN", role: "EIS-STRATEGE", attack: "Gletscher-Strahl", focus: "Ki-Kern & Fokus", bio: "Bleibt selbst unter höchstem Druck eiskalt und kontrolliert jeden Atemzug.", color: "linear-gradient(135deg, #70a1ff, #1b328a)" },
  { id: 10, name: "FLAME-REX", role: "FEUER-KÄMPFER", attack: "Magma-Faust", focus: "Brust & Schultern", bio: "Seine glühende Kampf-Aura steigt mit jeder absolvierten Liegestütze weiter an.", color: "linear-gradient(135deg, #ff6348, #8f1900)" },
  { id: 11, name: "ULTRA-VEX", role: "GALAXIE-HÜTER", attack: "Kometen-Regen", focus: "Ganzkörper", bio: "Nutzt kosmische Energie aus fernen Galaxien für maximale Sprungkraft.", color: "linear-gradient(135deg, #a29bfe, #352d8c)" },
  { id: 12, name: "SOLAR-KAI", role: "SONNEN-MEISTER", attack: "Helios-Welle", focus: "Ausdauer & Kern", bio: "Zieht seine Kraft direkt aus dem Licht der Sonne und gibt niemals auf.", color: "linear-gradient(135deg, #ffa502, #945500)" },
  { id: 13, name: "DARK-ORION", role: "NACHT-KRIEGER", attack: "Eclipse-Schlag", focus: "Arme & Rücken", bio: "Ein geheimnisvoller Einzelgänger mit gewaltiger Schlagkraft.", color: "linear-gradient(135deg, #57606f, #272c38)" },
  { id: 14, name: "AERO-DASH", role: "WIND-LÄUFER", attack: "Wirbelsturm-Kick", focus: "Beine & Agilität", bio: "Beherrscht den Himmel und bewegt sich schneller als das Auge folgen kann.", color: "linear-gradient(135deg, #1dd1a1, #09634b)" },
  { id: 15, name: "OMEGA-GOD", role: "LEGENDE", attack: "Omega-Urknall", focus: "Alle Körperteile", bio: "Der ultimative Meister-Krieger, der alle Kampftechniken in sich vereint.", color: "linear-gradient(135deg, #ff6b81, #801526)" }
];

const STAGE_RULES = [
  { stage: 1, minLevel: 1, label: "BASIS" },
  { stage: 2, minLevel: 2, label: "SUPER 1" },
  { stage: 3, minLevel: 4, label: "BLAU-KI" },
  { stage: 4, minLevel: 6, label: "SILBER" },
  { stage: 5, minLevel: 8, label: "ROT-GOTT" }
];

const BODY_WORKOUTS = {
  arms: {
    label: "TRAINING: ARME & BRUST",
    easy: [
      { title: "10x Knie- oder Wand-Liegestütze", sub: "Einfach · Schlagkraft-Basis", xp: 25, power: 400 },
      { title: "20 Sek. schnelles Schattenboxen", sub: "Einfach · Ki-Fäuste", xp: 20, power: 350 }
    ],
    advanced: [
      { title: "12x Echte Liegestütze", sub: "Profi · Kamehameha-Druck", xp: 45, power: 900 },
      { title: "10x Dips am Stuhl", sub: "Profi · Trizeps-Aufladung", xp: 45, power: 950 }
    ],
    master: [
      { title: "22x Tiefe Liegestütze", sub: "Meister · 100x Schwerkraft", xp: 80, power: 2000 },
      { title: "10x Diamant-Liegestütze", sub: "Meister · Finaler Energie-Stoß", xp: 90, power: 2400 }
    ]
  },
  core: {
    label: "TRAINING: BAUCH & KI-KERN",
    easy: [
      { title: "20 Sek. Unterarmstütz (Plank)", sub: "Einfach · Ki-Schild aktivieren", xp: 25, power: 450 },
      { title: "10x Crunches (Bauchpressen)", sub: "Einfach · Körpermitte stärken", xp: 25, power: 400 }
    ],
    advanced: [
      { title: "40 Sek. Unterarmstütz (Plank)", sub: "Profi · Goldene Aura halten", xp: 45, power: 950 },
      { title: "18x Sit-Ups", sub: "Profi · Saiyajin-Rumpf", xp: 45, power: 900 }
    ],
    master: [
      { title: "70 Sek. Unterarmstütz (Plank)", sub: "Meister · Unzerstörbare Abwehr", xp: 85, power: 2200 },
      { title: "25x Beinheben im Liegen", sub: "Meister · Göttlicher Kern", xp: 80, power: 2100 }
    ]
  },
  legs: {
    label: "TRAINING: BEINE & SPRUNGKRAFT",
    easy: [
      { title: "15x Kniebeugen (Squats)", sub: "Einfach · Fester Stand", xp: 25, power: 450 },
      { title: "25 Sek. Hampelmänner", sub: "Einfach · Schnelle Schritte", xp: 20, power: 350 }
    ],
    advanced: [
      { title: "25x Kniebeugen", sub: "Profi · 10-fache Schwerkraft", xp: 45, power: 950 },
      { title: "14x Ausfallschritte (Lunges)", sub: "Profi · Kampf-Ausweichen", xp: 45, power: 900 }
    ],
    master: [
      { title: "15x Sprung-Kniebeugen", sub: "Meister · Raketen-Abflug", xp: 85, power: 2300 },
      { title: "45 Sek. Wandsitzen", sub: "Meister · 100x Schwerkraftkammer", xp: 80, power: 2100 }
    ]
  }
};
let state = JSON.parse(localStorage.getItem("zwarriors_full_v1")) || {
  level: 1, xp: 0, powerLevel: 1000, selectedChar: 1, previewChar: 1,
  selectedStage: 1, selectedPart: "arms", difficulty: "easy", partXP: { arms: 0, core: 0, legs: 0 }
};

function showScreen(screenId) {
  ["intro-screen", "select-screen", "detail-screen", "arena-screen"].forEach(id => {
    document.getElementById(id).classList.toggle("hidden", id !== screenId);
  });
}

function playSound(isLevelUp = false) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = isLevelUp ? "sawtooth" : "triangle";
    osc.frequency.setValueAtTime(isLevelUp ? 220 : 190, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(isLevelUp ? 880 : 540, ctx.currentTime + (isLevelUp ? 0.45 : 0.18));
    gain.gain.setValueAtTime(0.14, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (isLevelUp ? 0.5 : 0.2));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + (isLevelUp ? 0.5 : 0.2));
  } catch (e) {}
}

function loadSmartImage(imgEl, baseName, onFail) {
  imgEl.onerror = () => {
    imgEl.onerror = onFail;
    imgEl.src = `${baseName}.jpg`;
  };
  imgEl.src = `${baseName}.png`;
}

function getMaxUnlockedStage(lvl) {
  let max = 1;
  STAGE_RULES.forEach(s => { if (lvl >= s.minLevel) max = s.stage; });
  return max;
}

// Karussell bauen & Klick auf Karte -> Steckbrief öffnen
function buildVerticalCarousel() {
  const carousel = document.getElementById("vertical-carousel");
  carousel.innerHTML = "";
  const maxStage = getMaxUnlockedStage(state.level);
  document.getElementById("select-power").textContent = state.powerLevel.toLocaleString("de-DE");

  CHARACTERS.forEach(c => {
    const card = document.createElement("div");
    card.className = `v-card ${c.id === state.selectedChar ? "is-center" : ""}`;
    card.style.background = c.color;
    card.dataset.id = c.id;

    card.innerHTML = `
      <div class="v-card-fallback">#${String(c.id).padStart(2, "0")}</div>
      <img class="v-card-img" alt="${c.name}" />
      <div class="v-card-info">
        <div class="v-card-name">${c.name}</div>
        <div class="v-card-badges">
          <span class="v-pill">${c.role}</span>
          <span class="v-pill">Stufe ${maxStage}/5</span>
        </div>
      </div>
    `;

    const imgEl = card.querySelector(".v-card-img");
    loadSmartImage(imgEl, `c${c.id}_s1`, () => { imgEl.style.display = "none"; });

    card.addEventListener("click", () => {
      playSound(false);
      openCharacterDetails(c.id);
    });

    carousel.appendChild(card);
  });
}

// Screen 3: Kämpfer-Steckbrief füllen
function openCharacterDetails(charId) {
  state.previewChar = charId;
  const c = CHARACTERS.find(item => item.id === charId) || CHARACTERS;

  document.getElementById("detail-bg-glow").style.background = c.color;
  document.getElementById("detail-num").textContent = `#${String(c.id).padStart(3, "0")}`;
  document.getElementById("detail-watermark").textContent = c.name;
  document.getElementById("detail-class").textContent = c.role;
  document.getElementById("detail-name").textContent = c.name;
  document.getElementById("detail-bio").textContent = c.bio;
  document.getElementById("detail-attack").textContent = c.attack;
  document.getElementById("detail-focus").textContent = c.focus;

  const imgEl = document.getElementById("detail-img");
  const phEl = document.getElementById("detail-placeholder");
  document.getElementById("detail-placeholder-code").textContent = `c${c.id}_s1.png`;
  imgEl.classList.remove("hidden");
  phEl.classList.add("hidden");

  loadSmartImage(imgEl, `c${c.id}_s1`, () => {
    imgEl.classList.add("hidden");
    phEl.classList.remove("hidden");
  });

  showScreen("detail-screen");
}
function renderWorkouts() {
  const partData = BODY_WORKOUTS[state.selectedPart] || BODY_WORKOUTS.arms;
  document.getElementById("selected-part-title").textContent = partData.label;
  const list = document.getElementById("workout-list");
  list.innerHTML = "";

  (partData[state.difficulty] || partData.easy).forEach(ex => {
    const btn = document.createElement("button");
    btn.className = "workout-card";
    btn.innerHTML = `<div><div class="workout-title">${ex.title}</div><div class="workout-sub">${ex.sub}</div></div><span class="xp-tag">+${ex.xp} XP</span>`;
    btn.addEventListener("click", () => completeExercise(ex.xp, ex.power));
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

  const xpNeeded = state.level * 100;
  if (state.xp >= xpNeeded) {
    state.xp -= xpNeeded;
    state.level += 1;
    const newMax = getMaxUnlockedStage(state.level);
    if (newMax > oldMax) {
      state.selectedStage = newMax;
      playSound(true);
      document.getElementById("levelup-badge").textContent = "NEUE STUFE FREIGESCHALTET";
      document.getElementById("levelup-title").textContent = `STUFE ${newMax} ERREICHT!`;
      document.getElementById("levelup-desc").textContent = `Dein Krieger kann jetzt Stufe ${newMax} entfesseln!`;
    } else {
      playSound(false);
      document.getElementById("levelup-badge").textContent = "LEVEL UP";
      document.getElementById("levelup-title").textContent = `LEVEL ${state.level}`;
      document.getElementById("levelup-desc").textContent = `Kampfkraft steigt auf ${state.powerLevel.toLocaleString("de-DE")}!`;
    }
    document.getElementById("levelup-overlay").classList.remove("hidden");
  } else {
    playSound(false);
  }
  updateUI();
}

function updateUI() {
  const xpNeeded = state.level * 100;
  const maxUnlocked = getMaxUnlockedStage(state.level);
  if (state.selectedStage > maxUnlocked) state.selectedStage = maxUnlocked;

  const charObj = CHARACTERS.find(c => c.id === state.selectedChar) || CHARACTERS;
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

  const imgEl = document.getElementById("fighter-img");
  const placeholderEl = document.getElementById("placeholder-box");
  document.getElementById("placeholder-code").textContent = `${baseFile}.png`;
  imgEl.classList.remove("hidden");
  placeholderEl.classList.add("hidden");

  loadSmartImage(imgEl, baseFile, () => {
    imgEl.classList.add("hidden");
    placeholderEl.classList.remove("hidden");
  });

  const pillsContainer = document.getElementById("stage-pills");
  pillsContainer.innerHTML = "";
  STAGE_RULES.forEach(s => {
    const unlocked = s.stage <= maxUnlocked;
    const btn = document.createElement("button");
    btn.className = `stage-pill ${s.stage === state.selectedStage ? "active" : ""} ${!unlocked ? "locked" : ""}`;
    btn.textContent = unlocked ? `S${s.stage} ${s.label}` : `🔒 S${s.stage}`;
    if (unlocked) {
      btn.addEventListener("click", () => {
        state.selectedStage = s.stage;
        playSound(false);
        updateUI();
      });
    }
    pillsContainer.appendChild(btn);
  });

  localStorage.setItem("zwarriors_full_v1", JSON.stringify(state));
}

// Screen-Buttons verknüpfen
document.getElementById("enter-app-btn").addEventListener("click", () => {
  playSound(false);
  buildVerticalCarousel();
  showScreen("select-screen");
});

document.getElementById("back-to-intro").addEventListener("click", () => showScreen("intro-screen"));
document.getElementById("back-to-carousel").addEventListener("click", () => {
  buildVerticalCarousel();
  showScreen("select-screen");
});

document.getElementById("confirm-fighter-btn").addEventListener("click", () => {
  state.selectedChar = state.previewChar;
  playSound(true);
  updateUI();
  renderWorkouts();
  showScreen("arena-screen");
});

document.getElementById("arena-back-btn").addEventListener("click", () => {
  buildVerticalCarousel();
  showScreen("select-screen");
});

document.querySelectorAll(".body-hotspot").forEach(spot => {
  spot.addEventListener("click", () => {
    state.selectedPart = spot.dataset.part;
    playSound(false);
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
    state = { level: 1, xp: 0, powerLevel: 1000, selectedChar: 1, previewChar: 1, selectedStage: 1, selectedPart: "arms", difficulty: "easy", partXP: { arms: 0, core: 0, legs: 0 } };
    updateUI();
    renderWorkouts();
    showScreen("intro-screen");
  }
});

// Intro-Bild & Startzustand laden
loadSmartImage(document.getElementById("intro-hero-img"), "c1_s1", () => {});
updateUI();
renderWorkouts();
