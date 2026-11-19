const STAGES = [
  { stage: 1, minLevel: 1, name: "BASIS-KRIEGER", img: "img_stufe1.jpg", aura: "aura-stage-1", desc: "Dein Training hat begonnen!" },
  { stage: 2, minLevel: 2, name: "SUPER-KRIEGER 1", img: "img_stufe2.png", aura: "aura-stage-2", desc: "Goldene Energie erwacht in dir!" },
  { stage: 3, minLevel: 4, name: "SUPER-KRIEGER 2", img: "img_stufe3.png", aura: "aura-stage-3", desc: "Blaue Blitze umzucken deine Aura!" },
  { stage: 4, minLevel: 6, name: "BLAUER KI-GOTT", img: "img_stufe4.png", aura: "aura-stage-4", desc: "Göttliches eisblaues Ki entfesselt!" },
  { stage: 5, minLevel: 9, name: "ULTRA-INSTINKT", img: "img_stufe5.png", aura: "aura-stage-5", desc: "Du hast die höchste Meister-Stufe erreicht!" }
];

let state = JSON.parse(localStorage.getItem("zkrieger_save_v3")) || {
  level: 1,
  xp: 0,
  powerLevel: 1000,
  selectedStage: 1
};

function playPowerSound(isTransform = false) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = isTransform ? "sawtooth" : "triangle";
    osc.frequency.setValueAtTime(isTransform ? 200 : 180, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(isTransform ? 950 : 520, ctx.currentTime + (isTransform ? 0.5 : 0.2));
    gain.gain.setValueAtTime(0.15, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + (isTransform ? 0.55 : 0.22));
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + (isTransform ? 0.55 : 0.22));
  } catch (e) {}
}

function getMaxUnlockedStage(lvl) {
  let maxStage = 1;
  STAGES.forEach(s => {
    if (lvl >= s.minLevel) maxStage = s.stage;
  });
  return maxStage;
}

function updateUI() {
  const xpNeeded = state.level * 100;
  const maxUnlocked = getMaxUnlockedStage(state.level);
  if (state.selectedStage > maxUnlocked) state.selectedStage = maxUnlocked;

  const activeData = STAGES.find(s => s.stage === state.selectedStage) || STAGES[0];

  document.getElementById("power-level").textContent = state.powerLevel.toLocaleString("de-DE");
  document.getElementById("rank-name").textContent = activeData.name;
  document.getElementById("stage-badge").textContent = `STUFE ${activeData.stage} / 5`;
  document.getElementById("level-label").textContent = `LEVEL ${state.level}`;
  document.getElementById("xp-text").textContent = `${state.xp} / ${xpNeeded} XP`;
  document.getElementById("ki-bar-fill").style.width = `${Math.min(100, (state.xp / xpNeeded) * 100)}%`;

  const imgEl = document.getElementById("fighter-img");
  imgEl.src = activeData.img;
  imgEl.onerror = () => { imgEl.src = "img_stufe4.png"; };
  document.getElementById("aura-wrapper").className = `aura-wrapper ${activeData.aura}`;

  document.querySelectorAll(".stage-btn").forEach(btn => {
    const sNum = parseInt(btn.dataset.stage, 10);
    const unlocked = sNum <= maxUnlocked;
    btn.classList.toggle("locked", !unlocked);
    btn.classList.toggle("active", sNum === state.selectedStage);
    btn.textContent = unlocked ? `STUFE ${sNum}` : `🔒 ${sNum}`;
  });

  localStorage.setItem("zkrieger_save_v3", JSON.stringify(state));
}

document.querySelectorAll(".mission-panel").forEach(btn => {
  btn.addEventListener("click", () => {
    const gainedXP = parseInt(btn.dataset.xp, 10);
    const gainedPower = parseInt(btn.dataset.power, 10);
    const oldMaxStage = getMaxUnlockedStage(state.level);

    state.xp += gainedXP;
    state.powerLevel += gainedPower;

    document.body.classList.remove("shake");
    void document.body.offsetWidth;
    document.body.classList.add("shake");

    const xpNeeded = state.level * 100;
    if (state.xp >= xpNeeded) {
      state.xp -= xpNeeded;
      state.level += 1;
      const newMaxStage = getMaxUnlockedStage(state.level);

      if (newMaxStage > oldMaxStage) {
        state.selectedStage = newMaxStage;
        const stageInfo = STAGES.find(s => s.stage === newMaxStage);
        playPowerSound(true);
        document.getElementById("levelup-badge").textContent = "NEUE VERWANDLUNG!";
        document.getElementById("levelup-title").textContent = stageInfo.name;
        document.getElementById("levelup-desc").textContent = stageInfo.desc;
      } else {
        playPowerSound(false);
        document.getElementById("levelup-badge").textContent = "LEVEL UP!";
        document.getElementById("levelup-title").textContent = `LEVEL ${state.level} ERREICHT!`;
        document.getElementById("levelup-desc").textContent = `Deine Kampfkraft steigt auf ${state.powerLevel.toLocaleString("de-DE")}!`;
      }
      document.getElementById("levelup-overlay").classList.remove("hidden");
    } else {
      playPowerSound(false);
    }

    updateUI();
  });
});

document.querySelectorAll(".stage-btn").forEach(btn => {
  btn.addEventListener("click", () => {
    const targetStage = parseInt(btn.dataset.stage, 10);
    if (targetStage <= getMaxUnlockedStage(state.level)) {
      state.selectedStage = targetStage;
      playPowerSound(false);
      updateUI();
    }
  });
});

document.getElementById("close-levelup").addEventListener("click", () => {
  document.getElementById("levelup-overlay").classList.add("hidden");
});

document.getElementById("reset-btn").addEventListener("click", () => {
  if (confirm("Wirklich wieder bei Level 1 starten?")) {
    state = { level: 1, xp: 0, powerLevel: 1000, selectedStage: 1 };
    updateUI();
  }
});

updateUI();
