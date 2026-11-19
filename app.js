const STAGES = [
  { stage: 1, num: "001", minLevel: 1, name: "BASIS-KRIEGER", img: "img_stufe1.jpg", desc: "Dein Grundtraining hat begonnen!" },
  { stage: 2, num: "002", minLevel: 2, name: "SUPER-KRIEGER 1", img: "img_stufe2.png", desc: "Goldene Saiyajin-Energie entfesselt!" },
  { stage: 3, num: "003", minLevel: 4, name: "SUPER-KRIEGER 2", img: "img_stufe3.png", desc: "Blaue Blitze umzucken deinen Körper!" },
  { stage: 4, num: "004", minLevel: 6, name: "BLAUER KI-GOTT", img: "img_stufe4.png", desc: "Göttliches eisblaues Ki erreicht!" }
];

const BODY_WORKOUTS = {
  arms: {
    label: "TRAINING: ARME & BRUST",
    easy: [
      { title: "10x Wand- oder Knie-Liegestütze", sub: "Einfacher Modus · Schlagkraft-Basis", xp: 25, power: 400 },
      { title: "20 Sek. schnelles Schattenboxen", sub: "Einfacher Modus · Ki-Fäuste", xp: 20, power: 350 },
      { title: "15 Sek. Arme seitlich halten", sub: "Einfacher Modus · Schulter-Energie", xp: 20, power: 300 }
    ],
    advanced: [
      { title: "12x Echte Liegestütze", sub: "Fortgeschritten · Kamehameha-Druck", xp: 45, power: 900 },
      { title: "30 Sek. Power-Schattenboxen", sub: "Fortgeschritten · Blitz-Kombination", xp: 40, power: 800 },
      { title: "10x Dips an der Bettkante/Stuhl", sub: "Fortgeschritten · Trizeps-Aufladung", xp: 45, power: 950 }
    ],
    master: [
      { title: "22x Liegestütze (langsam & tief)", sub: "Meister · 100x Schwerkraft", xp: 80, power: 2000 },
      { title: "10x Diamant- oder Klatsch-Liegestütze", sub: "Meister · Finaler Energie-Stoß", xp: 90, power: 2400 },
      { title: "45 Sek. Plank-Schulter-Tippen", sub: "Meister · Ultra-Kontrolle", xp: 75, power: 1900 }
    ]
  },
  core: {
    label: "TRAINING: BAUCH & KI-KERN",
    easy: [
      { title: "20 Sek. Unterarmstütz (Plank)", sub: "Einfacher Modus · Ki-Schild aktivieren", xp: 25, power: 450 },
      { title: "10x Crunches (Bauchpressen)", sub: "Einfacher Modus · Körpermitte stärken", xp: 25, power: 400 },
      { title: "20 Sek. Superman-Halten am Boden", sub: "Einfacher Modus · Flug-Balance", xp: 20, power: 350 }
    ],
    advanced: [
      { title: "40 Sek. Unterarmstütz (Plank)", sub: "Fortgeschritten · Goldene Aura halten", xp: 45, power: 950 },
      { title: "18x Sit-Ups", sub: "Fortgeschritten · Saiyajin-Rumpf", xp: 45, power: 900 },
      { title: "20x Käfer-Crunches (Bicycle)", sub: "Fortgeschritten · Wirbel-Ki", xp: 50, power: 1050 }
    ],
    master: [
      { title: "70 Sek. Unterarmstütz (Plank)", sub: "Meister · Unzerstörbare Verteidigung", xp: 85, power: 2200 },
      { title: "25x Beinheben im Liegen", sub: "Meister · Göttlicher Kern", xp: 80, power: 2100 },
      { title: "30 Sek. Hohlkörper-Halten (Hollow Hold)", sub: "Meister · Maximale Ki-Konzentration", xp: 90, power: 2500 }
    ]
  },
  legs: {
    label: "TRAINING: BEINE & SPRUNGKRAFT",
    easy: [
      { title: "15x Kniebeugen (Squats)", sub: "Einfacher Modus · Fester Stand", xp: 25, power: 450 },
      { title: "25 Sek. Hampelmänner", sub: "Einfacher Modus · Schnelle Schritte", xp: 20, power: 350 },
      { title: "15x Wadenheben auf Zehenspitzen", sub: "Einfacher Modus · Absprung-Kraft", xp: 20, power: 300 }
    ],
    advanced: [
      { title: "25x Kniebeugen", sub: "Fortgeschritten · 10-fache Schwerkraft", xp: 45, power: 950 },
      { title: "14x Ausfallschritte (Lunges)", sub: "Fortgeschritten · Kampf-Ausweichen", xp: 45, power: 900 },
      { title: "25 Sek. Wandsitzen", sub: "Fortgeschritten · Stahl-Oberschenkel", xp: 50, power: 1000 }
    ],
    master: [
      { title: "15x Sprung-Kniebeugen (Jump Squats)", sub: "Meister · Raketen-Abflug", xp: 85, power: 2300 },
      { title: "45 Sek. Wandsitzen", sub: "Meister · 100-fache Schwerkraftkammer", xp: 80, power: 2100 },
      { title: "30 Sek. High-Knees (Kniehebelauf)", sub: "Meister · Lichtgeschwindigkeit", xp: 85, power: 2200 }
    ]
  }
};
let state = JSON.parse(localStorage.getItem("zwarriors_body_v1")) || {
  level: 1, xp: 0, powerLevel: 1000, selectedStage: 1,
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
  STAGES.forEach(s => { if (lvl >= s.minLevel) max = s.stage; });
  return max;
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

  document.querySelector(".app-shell").classList.remove("shake");
  void document.querySelector(".app-shell").offsetWidth;
  document.querySelector(".app-shell").classList.add("shake");

  const xpNeeded = state.level * 100;
  if (state.xp >= xpNeeded) {
    state.xp -= xpNeeded;
    state.level += 1;
    const newMax = getMaxUnlockedStage(state.level);
    if (newMax > oldMax) {
      state.selectedStage = newMax;
      const info = STAGES.find(s => s.stage === newMax);
      playSound(true);
      document.getElementById("levelup-badge").textContent = "NEUE FORM FREIGESCHALTET";
      document.getElementById("levelup-title").textContent = info.name;
      document.getElementById("levelup-desc").textContent = info.desc;
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

  const active = STAGES.find(s => s.stage === state.selectedStage) || STAGES[0];
  document.getElementById("power-level").textContent = state.powerLevel.toLocaleString("de-DE");
  document.getElementById("stage-num").textContent = active.num;
  document.getElementById("rank-name").textContent = active.name;
  document.getElementById("bg-watermark").textContent = active.num;
  document.getElementById("level-label").textContent = `LVL ${state.level}`;
  document.getElementById("xp-text").textContent = `${state.xp} / ${xpNeeded} XP`;
  document.getElementById("ki-bar-fill").style.width = `${Math.min(100, (state.xp / xpNeeded) * 100)}%`;

  document.getElementById("stat-arms").textContent = `LVL ${1 + Math.floor((state.partXP.arms || 0) / 60)}`;
  document.getElementById("stat-core").textContent = `LVL ${1 + Math.floor((state.partXP.core || 0) / 60)}`;
  document.getElementById("stat-legs").textContent = `LVL ${1 + Math.floor((state.partXP.legs || 0) / 60)}`;

  document.getElementById("fighter-img").src = active.img;
  document.getElementById("aura-wrapper").className = `fighter-scanner stage-${active.stage}`;

  document.querySelectorAll(".roster-card").forEach(card => {
    const sNum = parseInt(card.dataset.stage, 10);
    const unlocked = sNum <= maxUnlocked;
    card.classList.toggle("locked", !unlocked);
    card.classList.toggle("active", sNum === state.selectedStage);
    card.querySelector("span").textContent = unlocked ? `00${sNum} FORM` : `🔒 00${sNum}`;
  });
  localStorage.setItem("zwarriors_body_v1", JSON.stringify(state));
}

document.querySelectorAll(".body-hotspot").forEach(spot => {
  spot.addEventListener("click", () => {
    state.selectedPart = spot.dataset.part;
    playSound(false);
    renderWorkouts();
    localStorage.setItem("zwarriors_body_v1", JSON.stringify(state));
  });
});

document.querySelectorAll(".diff-tab").forEach(tab => {
  tab.addEventListener("click", () => {
    state.difficulty = tab.dataset.diff;
    renderWorkouts();
    localStorage.setItem("zwarriors_body_v1", JSON.stringify(state));
  });
});

document.querySelectorAll(".roster-card").forEach(card => {
  card.addEventListener("click", () => {
    const sNum = parseInt(card.dataset.stage, 10);
    if (sNum <= getMaxUnlockedStage(state.level)) {
      state.selectedStage = sNum;
      playSound(false);
      updateUI();
    }
  });
});

document.getElementById("close-levelup").addEventListener("click", () => {
  document.getElementById("levelup-overlay").classList.add("hidden");
});

document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Wirklich bei Level 1 neu starten?")) {
    state = { level: 1, xp: 0, powerLevel: 1000, selectedStage: 1, selectedPart: "arms", difficulty: "easy", partXP: { arms: 0, core: 0, legs: 0 } };
    renderWorkouts();
    updateUI();
  }
});

renderWorkouts();
updateUI();
