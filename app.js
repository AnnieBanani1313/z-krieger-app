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
      { title: "10x Knie-Liegestütze", sub: "Einfach · Basis", xp: 25, power: 400 },
      { title: "20 Sek. Schattenboxen", sub: "Einfach · Ki-Fäuste", xp: 20, power: 350 }
    ],
    advanced: [
      { title: "12x Echte Liegestütze", sub: "Profi · Kamehameha", xp: 45, power: 900 },
      { title: "10x Dips am Stuhl", sub: "Profi · Trizeps", xp: 45, power: 950 }
    ],
    master: [
      { title: "22x Tiefe Liegestütze", sub: "Meister · 100x G", xp: 80, power: 2000 },
      { title: "10x Diamant-Liegestütze", sub: "Meister · Final-Ki", xp: 90, power: 2400 }
    ]
  },
  core: {
    label: "TRAINING: BAUCH & KI-KERN",
    easy: [
      { title: "20 Sek. Plank", sub: "Einfach · Ki-Schild", xp: 25, power: 450 },
      { title: "10x Crunches", sub: "Einfach · Körpermitte", xp: 25, power: 400 }
    ],
    advanced: [
      { title: "40 Sek. Plank", sub: "Profi · Goldene Aura", xp: 45, power: 950 },
      { title: "18x Sit-Ups", sub: "Profi · Saiyajin-Rumpf", xp: 45, power: 900 }
    ],
    master: [
      { title: "70 Sek. Plank", sub: "Meister · Abwehr", xp: 85, power: 2200 },
      { title: "25x Beinheben", sub: "Meister · Göttlicher Kern", xp: 80, power: 2100 }
    ]
  },
  legs: {
    label: "TRAINING: BEINE & SPRUNGKRAFT",
    easy: [
      { title: "15x Kniebeugen", sub: "Einfach · Fester Stand", xp: 25, power: 450 },
      { title: "25 Sek. Hampelmänner", sub: "Einfach · Speed", xp: 20, power: 350 }
    ],
    advanced: [
      { title: "25x Kniebeugen", sub: "Profi · 10x Schwerkraft", xp: 45, power: 950 },
      { title: "14x Ausfallschritte", sub: "Profi · Ausweichen", xp: 45, power: 900 }
    ],
    master: [
      { title: "15x Sprung-Kniebeugen", sub: "Meister · Raketen-Start", xp: 85, power: 2300 },
      { title: "45 Sek. Wandsitzen", sub: "Meister · 100x G", xp: 80, power: 2100 }
    ]
  }
};

let state = JSON.parse(localStorage.getItem("zwarriors_neon_v7")) || {
  level: 1, xp: 0, powerLevel: 1000, carouselIndex: 0, selectedChar: 1,
  selectedStage: 1, selectedPart: "arms", difficulty: "easy", partXP: { arms: 0, core: 0, legs: 0 }
};

function showScreen(id) {
  ["intro-screen", "select-screen", "detail-screen", "arena-screen"].forEach(s => {
    document.getElementById(s).classList.toggle("hidden", s !== id);
  });
}

function playSound(isLevelUp = false) {
  try {
    const AudioCtx = window.AudioContext || window.webkitAudioContext;
    const ctx = new AudioCtx();
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
  imgEl.style.display = "block";
  imgEl.onerror = () => {
    imgEl.onerror = () => {
      imgEl.style.display = "none";
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
    fb.style.display = "grid";
    loadSmartImage(im, `c${charObj.id}_s1`, () => {});
    im.onload = () => { fb.style.display = "none"; };
  });

  const progress = (idxCurr / (total - 1)) * 34;
  document.getElementById("scroll-thumb").style.transform = `translateY(${progress}px)`;
}

function stepCarousel(dir) {
  state.carouselIndex = (state.carouselIndex + dir + CHARACTERS.length) % CHARACTERS.length;
  playSound(false);
  updateStaggeredCarousel();
}

let touchStartY = 0;
let isSwiping = false;
const carouselEl = document.getElementById("staggered-carousel");

carouselEl.addEventListener("touchstart", e => {
  if (e.touches && e.touches.length > 0) {
    touchStartY = e.touches[0].clientY;
    isSwiping = true;
  }
}, { passive: true });

carouselEl.addEventListener("touchmove", e => {
  if (isSwiping) e.preventDefault();
}, { passive: false });

carouselEl.addEventListener("touchend", e => {
  if (!isSwiping || !e.changedTouches || e.changedTouches.length === 0) return;
  isSwiping = false;
  const diff = touchStartY - e.changedTouches[0].clientY;
  if (Math.abs(diff) > 25) {
    stepCarousel(diff > 0 ? 1 : -1);
  }
});

document.getElementById("card-prev").addEventListener("click", () => stepCarousel(-1));
document.getElementById("card-next").addEventListener("click", () => stepCarousel(1));
document.getElementById("card-curr").addEventListener("click", () => {
  playSound(false);
  openCharacterDetails(CHARACTERS[state.carouselIndex].id);
});

function openCharacterDetails(charId) {
  const c = CHARACTERS.find(item => item.id === charId) || CHARACTERS[0];
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

  loadSmartImage(imgEl, `c${c.id}_s1`, () => {
    phEl.classList.remove("hidden");
  });

  showScreen("detail-screen");
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
      document.getElementById("levelup-badge").textContent = "NEUE STUFE";
      document.getElementById("levelup-title").textContent = `STUFE ${newMax}`;
      document.getElementById("levelup-desc").textContent = `Stufe ${newMax} ist jetzt freigeschaltet!`;
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

  const charObj = CHARACTERS.find(c => c.id === state.selectedChar) || CHARACTERS[0];
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
  const placeholderEl = document.getElementById("placeholder-box");
  document.getElementById("placeholder-code").textContent = `${baseFile}.png`;
  placeholderEl.classList.add("hidden");

  loadSmartImage(imgEl, baseFile, () => {
    placeholderEl.classList.remove("hidden");
  });

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
        playSound(false);
        updateUI();
      });
    }
    pillsContainer.appendChild(btn);
  });

  localStorage.setItem("zwarriors_neon_v7", JSON.stringify(state));
}

document.getElementById("enter-app-btn").addEventListener("click", () => {
  playSound(false);
  updateStaggeredCarousel();
  showScreen("select-screen");
});

document.getElementById("back-to-intro").addEventListener("click", () => showScreen("intro-screen"));
document.getElementById("back-to-carousel").addEventListener("click", () => {
  updateStaggeredCarousel();
  showScreen("select-screen");
});

document.getElementById("confirm-fighter-btn").addEventListener("click", () => {
  playSound(true);
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
    state = { level: 1, xp: 0, powerLevel: 1000, carouselIndex: 0, selectedChar: 1, selectedStage: 1, selectedPart: "arms", difficulty: "easy", partXP: { arms: 0, core: 0, legs: 0 } };
    updateUI();
    renderWorkouts();
    showScreen("intro-screen");
  }
});

loadSmartImage(document.getElementById("intro-hero-img"), "c1_s1", () => {});
updateStaggeredCarousel();
updateUI();
renderWorkouts();
