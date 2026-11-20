const CHARACTERS = [
  { id: 1, name: "SON-BLITZ" },
  { id: 2, name: "PRINZ-KI" },
  { id: 3, name: "STURM-GREEN" },
  { id: 4, name: "CYBER-RED" },
  { id: 5, name: "SHADOW-X" },
  { id: 6, name: "NOVA-GOLD" },
  { id: 7, name: "TITAN-FORCE" },
  { id: 8, name: "BLITZ-KID" },
  { id: 9, name: "FROST-ZEN" },
  { id: 10, name: "FLAME-REX" },
  { id: 11, name: "ULTRA-VEX" },
  { id: 12, name: "SOLAR-KAI" },
  { id: 13, name: "DARK-ORION" },
  { id: 14, name: "AERO-DASH" },
  { id: 15, name: "OMEGA-GOD" }
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
let state = JSON.parse(localStorage.getItem("zwarriors_15_v1")) || {
  level: 1, xp: 0, powerLevel: 1000, selectedChar: 1, selectedStage: 1,
  selectedPart: "arms", difficulty: "easy", partXP: { arms: 0, core: 0, legs: 0 }
};

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

function getMaxUnlockedStage(lvl) {
  let max = 1;
  STAGE_RULES.forEach(s => { if (lvl >= s.minLevel) max = s.stage; });
  return max;
}

function renderRoster() {
  const container = document.getElementById("character-roster");
  container.innerHTML = "";
  CHARACTERS.forEach(c => {
    const card = document.createElement("button");
    card.className = `char-card ${c.id === state.selectedChar ? "active" : ""}`;
    card.innerHTML = `
      <img src="c${c.id}_s1.png" alt="${c.name}" onerror="this.style.display='none'; this.nextElementSibling.style.display='grid';" />
      <div class="char-fallback-num" style="display:none;">#${String(c.id).padStart(2, "0")}</div>
      <span>${c.name}</span>
    `;
    card.addEventListener("click", () => {
      state.selectedChar = c.id;
      playSound(false);
      renderRoster();
      updateUI();
    });
    container.appendChild(card);
  });
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
      document.getElementById("levelup-desc").textContent = `Alle 15 Krieger können jetzt in Stufe ${newMax} verwandelt werden!`;
    } else {
      playSound(false);
      document.getElementById("levelup-badge").textContent = "LEVEL UP";
      document.getElementById("levelup-title").textContent = `LEVEL ${state.level}`;
      document.getElementById("levelup-desc").textContent = `Deine Kampfkraft steigt auf ${state.powerLevel.toLocaleString("de-DE")}!`;
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
  const fileName = `c${state.selectedChar}_s${state.selectedStage}.png`;

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

  // Bild laden oder sauberen Platzhalter zeigen
  const imgEl = document.getElementById("fighter-img");
  const placeholderEl = document.getElementById("placeholder-box");
  document.getElementById("placeholder-code").textContent = fileName;
  imgEl.classList.remove("hidden");
  placeholderEl.classList.add("hidden");
  imgEl.src = fileName;
  imgEl.onerror = () => {
    imgEl.classList.add("hidden");
    placeholderEl.classList.remove("hidden");
  };

  // Stufen-Buttons 1 bis 5 rendern
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

  localStorage.setItem("zwarriors_15_v1", JSON.stringify(state));
}

document.querySelectorAll(".body-hotspot").forEach(spot => {
  spot.addEventListener("click", () => {
    state.selectedPart = spot.dataset.part;
    playSound(false);
    renderWorkouts();
    localStorage.setItem("zwarriors_15_v1", JSON.stringify(state));
  });
});

document.querySelectorAll(".diff-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    state.difficulty = tab.dataset.diff;
    renderWorkouts();
    localStorage.setItem("zwarriors_15_v1", JSON.stringify(state));
  });
});

document.getElementById("close-levelup").addEventListener("click", () => {
  document.getElementById("levelup-overlay").classList.add("hidden");
});

document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Wirklich bei Level 1 neu starten?")) {
    state = { level: 1, xp: 0, powerLevel: 1000, selectedChar: 1, selectedStage: 1, selectedPart: "arms", difficulty: "easy", partXP: { arms: 0, core: 0, legs: 0 } };
    renderRoster();
    renderWorkouts();
    updateUI();
  }
});

renderRoster();
renderWorkouts();
updateUI();
