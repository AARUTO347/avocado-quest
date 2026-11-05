let AC = null;
let enabled = true;
let volume = 0.8;

export function setSoundEnabled(on) { enabled = on; }
export function setVolume(v) {
  volume = Math.max(0, Math.min(1, v));
  if (lofi.bus) lofi.bus.gain.value = 0.9 * volume;
}

function audio() {
  if (!AC) AC = new (window.AudioContext || window.webkitAudioContext)();
  if (AC.state === 'suspended') AC.resume();
  return AC;
}

export function unlockAudio() { audio(); }

function tone(freq, dur, type = 'square', vol = 0.05, when = 0, glide) {
  if (!enabled) return;
  const ac = audio();
  const t0 = ac.currentTime + when;
  const o = ac.createOscillator();
  const g = ac.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t0);
  if (glide) o.frequency.linearRampToValueAtTime(glide, t0 + dur);
  g.gain.setValueAtTime(vol * volume, t0);
  g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
  o.connect(g); g.connect(ac.destination);
  o.start(t0); o.stop(t0 + dur + 0.02);
}

function noise(dur, vol, when = 0) {
  if (!enabled) return;
  const ac = audio();
  const t0 = ac.currentTime + when;
  const buf = ac.createBuffer(1, Math.max(1, ac.sampleRate * dur), ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = ac.createBufferSource(); src.buffer = buf;
  const g = ac.createGain(); g.gain.value = vol * volume;
  src.connect(g); g.connect(ac.destination);
  src.start(t0);
}

let lastKey = 0;
export const SFX = {
  click: () => tone(600, 0.04, 'square', 0.04),
  key: () => {
    const n = performance.now();
    if (n - lastKey < 30) return;
    lastKey = n;
    tone(900 + Math.random() * 300, 0.02, 'square', 0.02);
    noise(0.015, 0.015);
  },
  add: () => { tone(523, 0.06, 'square', 0.05); tone(784, 0.09, 'square', 0.05, 0.06); },
  done: () => [523, 659, 784, 1046].forEach((f, i) => tone(f, 0.1, 'square', 0.05, i * 0.07)),
  delete: () => tone(300, 0.15, 'square', 0.05, 0, 100),
  error: () => { tone(150, 0.12, 'sawtooth', 0.06); tone(120, 0.18, 'sawtooth', 0.06, 0.12); },
  coin: () => { tone(988, 0.05, 'square', 0.05); tone(1319, 0.25, 'square', 0.05, 0.05); },
  xp: () => { tone(880, 0.06, 'triangle', 0.05); tone(1175, 0.1, 'triangle', 0.05, 0.06); },
  levelup: () => [523, 659, 784, 1046, 784, 1046, 1318].forEach((f, i) => tone(f, 0.12, 'square', 0.06, i * 0.09)),
  evolve: () => [261, 392, 523, 659, 784, 1046, 1318, 1568].forEach((f, i) => tone(f, 0.15, 'triangle', 0.09, i * 0.1)),
  hop: () => tone(400, 0.08, 'square', 0.03, 0, 800),
  land: () => noise(0.05, 0.03),
  alarm: () => { for (let i = 0; i < 6; i++) tone(880, 0.12, 'square', 0.06, i * 0.2); },
  alarmClock: (secs = 4) => {
    const n = Math.max(4, Math.floor(secs / 0.22));
    for (let i = 0; i < n; i++) tone(i % 2 ? 1318 : 988, 0.1, 'square', 0.1, i * 0.22);
  },
  tick: () => tone(1200, 0.02, 'square', 0.015),
  swing: () => { noise(0.08, 0.05); tone(520, 0.07, 'triangle', 0.03, 0, 260); },
  hurt: () => { tone(220, 0.1, 'sawtooth', 0.06, 0, 140); tone(110, 0.16, 'square', 0.05, 0.08); },
  boot: () => { tone(200, 0.25, 'sawtooth', 0.04, 0, 900); tone(900, 0.1, 'square', 0.04, 0.28); },
  win: () => [784, 988, 1175, 1568, 1175, 1568].forEach((f, i) => tone(f, 0.14, 'square', 0.06, i * 0.1))
};

/* ---------- lo-fi turntable engine ---------- */
const mtof = m => 440 * Math.pow(2, (m - 69) / 12);
const CHORDS = [
  [41, 45, 48, 52], // Fmaj7
  [50, 53, 57, 60], // Dm7
  [46, 50, 53, 57], // Bbmaj7
  [48, 52, 55, 58]  // C7
];
const BAR = 4.0;

let lofi = { running: false, timer: null, nextBar: 0, barIdx: 0, bus: null };

function padNote(freq, t0, dur, vol, type = 'triangle') {
  const ac = audio();
  const o = ac.createOscillator();
  const g = ac.createGain();
  const f = ac.createBiquadFilter();
  f.type = 'lowpass'; f.frequency.value = 900;
  o.type = type; o.frequency.value = freq;
  g.gain.setValueAtTime(0.0001, t0);
  g.gain.linearRampToValueAtTime(vol, t0 + 0.5);
  g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
  o.connect(f); f.connect(g); g.connect(lofi.bus);
  o.start(t0); o.stop(t0 + dur + 0.1);
}

function crackleTick(t0) {
  const ac = audio();
  const dur = 0.02;
  const buf = ac.createBuffer(1, ac.sampleRate * dur, ac.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
  const src = ac.createBufferSource(); src.buffer = buf;
  const g = ac.createGain();
  g.gain.value = Math.random() < 0.06 ? 0.02 : 0.006;
  const f = ac.createBiquadFilter(); f.type = 'highpass'; f.frequency.value = 2000;
  src.connect(f); f.connect(g); g.connect(lofi.bus);
  src.start(t0);
}

function scheduleBar(idx, t0) {
  const chord = CHORDS[idx % CHORDS.length];
  chord.forEach(m => padNote(mtof(m), t0, BAR * 0.95, 0.03));
  padNote(mtof(chord[0] - 12), t0, BAR * 0.9, 0.055, 'sine');
  for (let beat = 0; beat < 8; beat++) {
    const t = t0 + beat * (BAR / 8);
    if (Math.random() < 0.4) {
      const m = chord[Math.floor(Math.random() * chord.length)] + 12;
      padNote(mtof(m), t, 0.5, 0.022);
    }
  }
  for (let i = 0; i < BAR / 0.09; i++) {
    if (Math.random() < 0.55) crackleTick(t0 + i * 0.09 + Math.random() * 0.04);
  }
}

export const Lofi = {
  start() {
    if (lofi.running || !enabled) return;
    const ac = audio();
    lofi.bus = ac.createGain();
    lofi.bus.gain.value = 0.9 * volume;
    lofi.bus.connect(ac.destination);
    lofi.running = true;
    lofi.nextBar = ac.currentTime + 0.1;
    lofi.barIdx = 0;
    lofi.timer = setInterval(() => {
      if (!lofi.running) return;
      const ac2 = audio();
      while (lofi.nextBar < ac2.currentTime + 0.8) {
        scheduleBar(lofi.barIdx++, lofi.nextBar);
        lofi.nextBar += BAR;
      }
    }, 250);
  },
  stop() {
    lofi.running = false;
    clearInterval(lofi.timer);
    if (lofi.bus) {
      const ac = audio();
      lofi.bus.gain.linearRampToValueAtTime(0.0001, ac.currentTime + 0.6);
      const bus = lofi.bus;
      setTimeout(() => bus.disconnect(), 800);
      lofi.bus = null;
    }
  },
  get running() { return lofi.running; }
};
