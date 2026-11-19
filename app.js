let state = JSON.parse(localStorage.getItem('zkrieger_save')) || {
  power: 150,
  balls: 0
};

const forms = [
  { min: 0, name: 'Basis-Form', rank: 'Anfänger-Kämpfer', hair: '#1a1a1a', eye: '#1a1a1a', aura: 'rgba(255,255,255,0.15)' },
  { min: 1000, name: 'Super-Krieger Stufe 1', rank: 'Goldener Krieger', hair: '#ffd700', eye: '#00d4ff', aura: 'rgba(255, 215, 0, 0.55)' },
  { min: 3000, name: 'Super-Krieger Stufe 2', rank: 'Blitz-Meister', hair: '#ffea00', eye: '#00ffaa', aura: 'rgba(255, 234, 0, 0.75)' },
  { min: 6000, name: 'Super-Gott Blau', rank: 'Göttlicher Kämpfer', hair: '#00d4ff', eye: '#00d4ff', aura: 'rgba(0, 212, 255, 0.7)' },
  { min: 10000, name: 'Ultra-Instinkt', rank: 'Legende des Universums', hair: '#e6edf3', eye: '#c9d1d9', aura: 'rgba(255, 255, 255, 0.85)' }
];

const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
function playBeep(freq = 600, duration = 0.12, type = 'sine') {
  if (audioCtx.state === 'suspended') audioCtx.resume();
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  gain.gain.setValueAtTime(0.15, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  osc.connect(gain);
  gain.connect(audioCtx.destination);
  osc.start();
  osc.stop(audioCtx.currentTime + duration);
}

function saveGame() {
  localStorage.setItem('zkrieger_save', JSON.stringify(state));
}

function updateUI() {
  document.getElementById('powerLevel').textContent = state.power.toLocaleString('de-DE');
  document.getElementById('ballsFound').textContent = state.balls;

  let currentForm = forms[0];
  let nextForm = null;
  for (let i = 0; i < forms.length; i++) {
    if (state.power >= forms[i].min) {
      currentForm = forms[i];
      nextForm = forms[i + 1] || null;
    }
  }

  document.getElementById('rankBadge').textContent = currentForm.rank;
  document.getElementById('formName').textContent = currentForm.name;
  document.getElementById('fighterHair').setAttribute('fill', currentForm.hair);
  document.getElementById('eyeLeft').setAttribute('fill', currentForm.eye);
  document.getElementById('eyeRight').setAttribute('fill', currentForm.eye);
  document.getElementById('fighterAura').style.background =
    `radial-gradient(circle, ${currentForm.aura} 0%, transparent 70%)`;

  if (nextForm) {
    document.getElementById('nextGoal').textContent = nextForm.min.toLocaleString('de-DE');
    const percent = Math.min(100, ((state.power - currentForm.min) / (nextForm.min - currentForm.min)) * 100);
    document.getElementById('progressFill').style.width = percent + '%';
  } else {
    document.getElementById('nextGoal').textContent = 'MAX';
    document.getElementById('progressFill').style.width = '100%';
  }

  if (state.balls >= 7) {
    document.getElementById('summonBtn').classList.remove('hidden');
    document.getElementById('radarBlip').classList.add('hidden');
  } else {
    document.getElementById('summonBtn').classList.add('hidden');
    document.getElementById('radarBlip').classList.remove('hidden');
  }
}

function train(points, exerciseName) {
  const oldForm = forms.filter(f => state.power >= f.min).pop();
  state.power += points;
  const newForm = forms.filter(f => state.power >= f.min).pop();

  playBeep(520, 0.1, 'triangle');
  setTimeout(() => playBeep(780, 0.15, 'triangle'), 90);

  const svg = document.getElementById('fighterSvg');
  svg.style.transform = 'scale(1.12)';
  setTimeout(() => svg.style.transform = 'scale(1)', 180);

  if (newForm.min > oldForm.min) {
    playBeep(900, 0.4, 'sawtooth');
    showModal('⚡', 'NEUE VERWANDLUNG!', `Du hast die Stufe "${newForm.name}" erreicht!`);
  }

  saveGame();
  updateUI();
}

let blipX = 70;
let blipY = 30;

function moveBlip() {
  blipX = Math.floor(Math.random() * 70) + 15;
  blipY = Math.floor(Math.random() * 70) + 15;
  const blip = document.getElementById('radarBlip');
  blip.style.left = blipX + '%';
  blip.style.top = blipY + '%';
}

function scanRadar(event) {
  if (state.balls >= 7) return;
  const rect = event.currentTarget.getBoundingClientRect();
  const clickX = ((event.clientX - rect.left) / rect.width) * 100;
  const clickY = ((event.clientY - rect.top) / rect.height) * 100;

  const dist = Math.hypot(clickX - blipX, clickY - blipY);

  if (dist < 14) {
    state.balls += 1;
    playBeep(1100, 0.25, 'sine');
    document.getElementById('radarHint').textContent = `Treffer! Kugel Nr. ${state.balls} eingesammelt!`;
    if (state.balls < 7) moveBlip();
    saveGame();
    updateUI();
  } else {
    playBeep(350, 0.08, 'sine');
    document.getElementById('radarHint').textContent = dist < 30 ? 'Ganz nah dran! Tippe direkt auf den Punkt!' : 'Signal schwach – tippe auf den gelben Punkt!';
  }
}

function summonDragon() {
  state.balls = 0;
  state.power += 1500;
  playBeep(300, 0.5, 'sawtooth');
  moveBlip();
  saveGame();
  updateUI();
  showModal('🐉', 'DER WUNSCH-DRACHE ERSCHEINT!', 'Deine 7 Kugeln haben den Drachen gerufen! Du erhältst +1.500 Kampfkraft!');
}

let beamPosition = 50;
let battleInterval = null;

function startBattle() {
  beamPosition = 50;
  updateBeamUI();
  document.getElementById('startBattleBtn').classList.add('hidden');
  document.getElementById('mashBtn').classList.remove('hidden');
  document.getElementById('battleStatus').textContent = 'JETZT TIPPEN!';

  battleInterval = setInterval(() => {
    beamPosition -= 2.2;
    updateBeamUI();
    if (beamPosition <= 0) {
      endBattle(false);
    }
  }, 100);
}

function pushBeam() {
  beamPosition += 6.5;
  playBeep(650 + beamPosition * 3, 0.06, 'square');
  updateBeamUI();
  if (beamPosition >= 100) {
    endBattle(true);
  }
}

function updateBeamUI() {
  const clamped = Math.max(0, Math.min(100, beamPosition));
  document.getElementById('beamPlayer').style.width = clamped + '%';
  document.getElementById('beamClash').style.left = clamped + '%';
}

function endBattle(won) {
  clearInterval(battleInterval);
  document.getElementById('mashBtn').classList.add('hidden');
  document.getElementById('startBattleBtn').classList.remove('hidden');

  if (won) {
    state.power += 400;
    saveGame();
    updateUI();
    document.getElementById('battleStatus').textContent = 'SIEG! +400 Kampfkraft gewonnen!';
    playBeep(950, 0.3, 'triangle');
  } else {
    document.getElementById('battleStatus').textContent = 'Knapp verloren – versuch es direkt nochmal!';
    playBeep(200, 0.3, 'sawtooth');
  }
}

function switchTab(tabName, btn) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(el => el.classList.remove('active'));
  document.getElementById('tab-' + tabName).classList.add('active');
  btn.classList.add('active');
}

function showModal(icon, title, text) {
  document.getElementById('modalIcon').textContent = icon;
  document.getElementById('modalTitle').textContent = title;
  document.getElementById('modalText').textContent = text;
  document.getElementById('rewardModal').classList.remove('hidden');
}

function closeModal() {
  document.getElementById('rewardModal').classList.add('hidden');
}

moveBlip();
updateUI();
