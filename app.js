// Entwicklungsstufen (Transformationen)
const STAGES = [
  { minLevel: 1, name: "BASIS-KRIEGER", auraClass: "aura-stage-1", desc: "Dein Training hat begonnen!" },
  { minLevel: 3, name: "KI-MEISTER", auraClass: "aura-stage-2", desc: "Blaue Energie umhüllt deinen Körper!" },
  { minLevel: 6, name: "SUPER-KRIEGER", auraClass: "aura-stage-3", desc: "Deine goldene Aura sprengt alle Grenzen!" },
  { minLevel: 10, name: "ULTRA-LEGENDE", auraClass: "aura-stage-4", desc: "Maximale Kampfkraft erreicht!" }
];

// Kämpfer-Bilder (du kannst hier eigene weitere Bilder pro Stufe hinterlegen)
const FIGHTERS = {
  duo: {
    base: "img/krieger-duo.png",
    super: "img/krieger-duo-super.png" // Fallback greift automatisch, falls noch nicht vorhanden
  },
  leon: {
    base: "img/leon.png",
    super: "img/leon-super.png"
  },
  noah: {
    base: "img/noah.png",
    super: "img/noah-super.png"
  }
};

// Gespeicherten Spielstand laden
let state = JSON.parse(localStorage.getItem("zkrieger_save")) || {
  level: 1,
  xp: 0,
  powerLevel: 1000,
  fighter: "duo"
};

// Web Audio API: Anime-Soundeffekte ohne externe Dateien generieren
function playPowerSound(isLevelUp = false) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = isLevelUp ? "sawtooth" : "triangle";
    osc.frequency.setValueAtTime(isLevelUp ? 220 : 180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(isLevelUp ? 880 : 520, ctx.currentTime + (isLevelUp ? 0.45 : 0.2));
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (isLevelUp ? 0.5 : 0.22));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + (isLevelUp ? 0.5 : 0.22));
  } catch (e) {}
}

function getStageForLevel(lvl) {
  let current = STAGES[0];
  let index = 1;
  STAGES.forEach((s, i) => {
    if (lvl >= s.minLevel) {
      current = s;
      index = i + 1;
    }
  });
  return { ...current, index };
}

function updateUI() {
  const xpNeeded = state.level * 100;
  const stage = getStageForLevel(state.level);

  document.getElementById("power-level").textContent = state.powerLevel.toLocaleString("de-DE");
  document.getElementById("rank-name").textContent = `${stage.name} (LVL ${state.level})`;
  document.getElementById("stage-badge").textContent = `FORM ${stage.index} / 4`;
  document.getElementById("xp-text").textContent = `${state.xp} / ${xpNeeded} XP`;
  document.getElementById("ki-bar-fill").style.width = `${Math.min(100, (state.xp / xpNeeded) * 100)}%`;

  // Aura-Klasse setzen
  const auraWrapper = document.getElementById("aura-wrapper");
  auraWrapper.className = `aura-wrapper ${stage.auraClass}`;

  // Kämpfer-Bild setzen (ab Level 6 Super-Form versuchen, sonst Basis-Bild)
  const imgEl = document.getElementById("fighter-img");
  const selected = FIGHTERS[state.fighter] || FIGHTERS.duo;
  imgEl.src = state.level >= 6 ? selected.super : selected.base;
  imgEl.onerror = () => { imgEl.src = "img/krieger-duo.png"; };

  // Aktiven Chip markieren
  document.querySelectorAll(".select-chip").forEach(btn => {
    btn.classList.toggle("active", btn.dataset.fighter === state.fighter);
  });

  localStorage.setItem("zkrieger_save", JSON.stringify(state));
}

// Trainings-Buttons verknüpfen
document.querySelectorAll(".mission-panel").forEach(btn => {
  btn.addEventListener("click", () => {
    const gainedXP = parseInt(btn.dataset.xp, 10);
    const gainedPower = parseInt(btn.dataset.power, 10);
    const oldStage = getStageForLevel(state.level).name;

    state.xp += gainedXP;
    state.powerLevel += gainedPower;

    // Bildschirm-Wackeln auslösen
    document.body.classList.remove("shake");
    void document.body.offsetWidth;
    document.body.classList.add("shake");

    const xpNeeded = state.level * 100;
    if (state.xp >= xpNeeded) {
      state.xp -= xpNeeded;
      state.level += 1;
      const newStage = getStageForLevel(state.level);
      playPowerSound(true);

      // Level-Up Modal zeigen
      document.getElementById("levelup-title").textContent = `LEVEL ${state.level}: ${newStage.name}!`;
      document.getElementById("levelup-desc").textContent =
        oldStage !== newStage.name
          ? `VERWANDLUNG! ${newStage.desc}`
          : `Deine Kampfkraft steigt auf ${state.powerLevel.toLocaleString("de-DE")}!`;
      document.getElementById("levelup-overlay").classList.remove("hidden");
    } else {
      playPowerSound(false);
    }

    updateUI();
  });
});

// Kämpfer wechseln
document.querySelectorAll(".select-chip").forEach(chip => {
  chip.addEventListener("click", () => {
    state.fighter = chip.dataset.fighter;
    playPowerSound(false);
    updateUI();
  });
});

document.getElementById("close-levelup").addEventListener("click", () => {
  document.getElementById("levelup-overlay").classList.add("hidden");
});

document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Wirklich wieder bei Level 1 starten?")) {
    state = { level: 1, xp: 0, powerLevel: 1000, fighter: "duo" };
    updateUI();
  }
});

// Initialisieren
updateUI();
