import { keyImage } from './key.js';
import bgUrl from './assets/bg-landscape.png';
import recordUrl from './assets/record.png';
import avoUrl from './assets/avo.png';
import twUrl from './assets/typewriter.png';

const W = 480, H = 260;
const REC = { size: 84, x: 8, feet: 0.82, visCX: 0.50, visCY: 0.56 };
const TW = { size: 132, cx: 0.46, feet: 0.87, paperX: 0.308, paperY: 0.148, paperW: 0.378, paperH: 0.148 };
const AVO = { size: 108, feet: 0.85, cx: 0.78, seedX: 0.48, seedY: 0.585 };
const INK = '#4a3520';

const GLYPH = {
  '0': ['111', '101', '101', '101', '111'],
  '1': ['010', '110', '010', '010', '111'],
  '2': ['111', '001', '111', '100', '111'],
  '3': ['111', '001', '111', '001', '111'],
  '4': ['101', '101', '111', '001', '001'],
  '5': ['111', '100', '111', '001', '111'],
  '6': ['111', '100', '111', '101', '111'],
  '7': ['111', '001', '001', '010', '010'],
  '8': ['111', '101', '111', '101', '111'],
  '9': ['111', '101', '111', '001', '111'],
  'A': ['010', '101', '111', '101', '101'],
  'B': ['110', '101', '110', '101', '110'],
  'C': ['011', '100', '100', '100', '011'],
  'D': ['110', '101', '101', '101', '110'],
  'E': ['111', '100', '110', '100', '111'],
  'F': ['111', '100', '110', '100', '100'],
  'G': ['011', '100', '101', '101', '011'],
  'H': ['101', '101', '111', '101', '101'],
  'I': ['111', '010', '010', '010', '111'],
  'J': ['001', '001', '001', '101', '010'],
  'K': ['101', '101', '110', '101', '101'],
  'L': ['100', '100', '100', '100', '111'],
  'M': ['101', '111', '111', '101', '101'],
  'N': ['110', '101', '101', '101', '101'],
  'O': ['010', '101', '101', '101', '010'],
  'P': ['110', '101', '110', '100', '100'],
  'Q': ['010', '101', '101', '010', '001'],
  'R': ['110', '101', '110', '101', '101'],
  'S': ['011', '100', '010', '001', '110'],
  'T': ['111', '010', '010', '010', '010'],
  'U': ['101', '101', '101', '101', '111'],
  'V': ['101', '101', '101', '101', '010'],
  'W': ['101', '101', '111', '111', '101'],
  'X': ['101', '101', '010', '101', '101'],
  'Y': ['101', '101', '010', '010', '010'],
  'Z': ['111', '001', '010', '100', '111'],
  ':': ['000', '010', '000', '010', '000'],
  '.': ['000', '000', '000', '000', '010'],
  '!': ['010', '010', '010', '000', '010'],
  '?': ['111', '001', '011', '000', '010'],
  '-': ['000', '000', '111', '000', '000'],
  '+': ['000', '010', '111', '010', '000'],
  '/': ['001', '001', '010', '100', '100'],
  ' ': ['000', '000', '000', '000', '000']
};

function rng(seed) {
  let s = seed;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error('failed to load ' + url));
    im.src = url;
  });
}

export function createScene(canvas, getState) {
  const ctx = canvas.getContext('2d');
  const rand = rng(2026);

  const flies = [];
  for (let i = 0; i < 5; i++) {
    flies.push({
      x: rand() * W, y: rand() * H, ph: rand() * 6.28,
      vx: (rand() - 0.5) * 0.5, vy: (rand() - 0.5) * 0.3,
      c: ['#f4f4f4', '#c9a0ff', '#ffe066'][i % 3]
    });
  }

  let particles = [], notes = [];
  let raf = 0, lastNote = 0;
  let bg = null, rec = null, avo = null, tw = null;
  const extraBgs = {};   // theme url -> HTMLImageElement (lazy)
  const bgLoading = {};  // theme url -> bool

  function ensureBg(url) {
    if (!url || extraBgs[url] || bgLoading[url]) return;
    bgLoading[url] = true;
    loadImage(url).then(im => { extraBgs[url] = im; }).catch(() => {});
  }

  Promise.all([loadImage(bgUrl), loadImage(recordUrl), loadImage(avoUrl), loadImage(twUrl)])
    .then(([b, r, a, w]) => {
      bg = b;
      rec = keyImage(r);
      avo = keyImage(a);
      tw = keyImage(w);
      window.__sceneReady = true;
      draw(performance.now());
    })
    .catch(() => { window.__sceneReady = true; draw(performance.now()); });

  function drawBackground(t, st) {
    if (st && st.bg) ensureBg(st.bg);
    const img = (st && st.bg && extraBgs[st.bg]) || bg;
    if (!img) { ctx.fillStyle = '#7dbb57'; ctx.fillRect(0, 0, W, H); return; }
    const scale = Math.max(W / img.width, H / img.height) * 1.07;
    const dw = img.width * scale, dh = img.height * scale;
    const swayX = Math.sin(t / 9000) * 5;
    const swayY = Math.cos(t / 12000) * 2;
    ctx.imageSmoothingEnabled = true;
    ctx.drawImage(img, (W - dw) / 2 + swayX, (H - dh) / 2 + swayY, dw, dh);
  }

  function shadow(cx, cy, rx, ry) {
    ctx.fillStyle = 'rgba(0,0,0,0.20)';
    ctx.beginPath(); ctx.ellipse(cx, cy, rx, ry, 0, 0, 6.29); ctx.fill();
  }

  function drawRecord(t, working) {
    const S = REC.size;
    const dy = H - 12 - REC.feet * S + Math.sin(t / 700) * 1.2;
    const ox = REC.x + REC.visCX * S, oy = dy + REC.visCY * S;
    const ang = working ? Math.sin(t / 260) * 0.05 : 0;
    const sc = working ? 1 + Math.sin(t / 300) * 0.02 : 1;
    shadow(REC.x + 0.5 * S, H - 10, 34, 4);
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(ox, oy);
    ctx.rotate(ang);
    ctx.scale(sc, sc);
    ctx.drawImage(rec, -REC.visCX * S, -REC.visCY * S, S, S);
    ctx.restore();
  }

  function drawPixelText(text, x, y, k, color) {
    ctx.fillStyle = color;
    let gx = Math.round(x);
    const gy = Math.round(y);
    for (const raw of String(text).toUpperCase()) {
      const g = GLYPH[raw] || GLYPH['?'];
      for (let r = 0; r < 5; r++) {
        for (let c = 0; c < 3; c++) {
          if (g[r][c] === '1') ctx.fillRect(gx + c * k, gy + r * k, k, k);
        }
      }
      gx += 4 * k;
    }
  }

  function wrapText(text, width, maxLines) {
    const words = String(text).toUpperCase().split(/\s+/).filter(Boolean);
    const lines = [];
    let cur = '';
    for (const w of words) {
      if ((cur + ' ' + w).trim().length <= width) {
        cur = (cur + ' ' + w).trim();
      } else {
        lines.push(cur);
        cur = w;
        if (lines.length >= maxLines) break;
      }
    }
    if (cur && lines.length < maxLines) lines.push(cur);
    return lines.slice(0, maxLines).map(l => l.slice(0, width));
  }

  function drawPaper(t, st, tx, ty) {
    const S = TW.size;
    const px = Math.round(tx + TW.paperX * S), py = Math.round(ty + TW.paperY * S);
    const pw = Math.round(TW.paperW * S), ph = Math.round(TW.paperH * S);
    ctx.fillStyle = '#f6ecd4';
    ctx.fillRect(px, py, pw, ph);

    const mode = Math.floor(t / 5000) % 3;
    if (mode === 1) {
      const txt = String(st.timerText || '').slice(0, 5);
      const k = 2;
      const wpx = txt.length * 4 * k - k;
      drawPixelText(txt, px + (pw - wpx) / 2, py + Math.round(ph / 2) - 5, k, INK);
      return;
    }

    let lines;
    if (mode === 0) {
      lines = (st.missions || []).slice(0, 3).map((m, i) => (i + 1) + '-' + m);
    } else {
      lines = wrapText(st.speech || '', 11, 3);
    }
    let budget = Math.floor((t % 5000) / 35);
    for (let li = 0; li < lines.length; li++) {
      if (budget <= 0) break;
      let txt = String(lines[li]).toUpperCase().slice(0, 11);
      if (txt.length > budget) txt = txt.slice(0, budget);
      budget -= txt.length;
      drawPixelText(txt, px + 3, py + 2 + li * 6, 1, INK);
    }
  }

  function drawTypewriter(t, st) {
    const S = TW.size;
    const tx = W * TW.cx - S / 2;
    const ty = H - 8 - TW.feet * S;
    shadow(W * TW.cx, H - 5, 52, 5);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(tw, tx, ty, S, S);
    drawPaper(t, st, tx, ty);
  }

  function drawTimerText(text, cx, cy) {
    const k = 2, gap = 1;
    const cols = text.length * (3 + gap) - gap;
    const ox = Math.round(cx - (cols * k) / 2), oy = Math.round(cy - (5 * k) / 2);
    for (let pass = 0; pass < 2; pass++) {
      ctx.fillStyle = pass === 0 ? '#3a1f14' : '#fff8e7';
      const dx = pass === 0 ? 1 : 0, dy = pass === 0 ? 1 : 0;
      let gx = ox + dx;
      for (const ch of text) {
        const g = GLYPH[ch] || GLYPH['0'];
        for (let r = 0; r < 5; r++) {
          for (let c = 0; c < 3; c++) {
            if (g[r][c] === '1') ctx.fillRect(gx + c * k, oy + dy + r * k, k, k);
          }
        }
        gx += (3 + gap) * k;
      }
    }
  }

  function drawAvo(t, st) {
    const S = AVO.size;
    const bob = Math.round(Math.sin(t / 420) * 2) + (st.hop ? -10 : 0);
    const ax = W * AVO.cx - S / 2;
    const ay = H - 14 - AVO.feet * S + bob;
    shadow(ax + S / 2, H - 11, 30, 5);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(avo, ax, ay, S, S);
    if (st.timerText) drawTimerText(st.timerText, ax + AVO.seedX * S, ay + AVO.seedY * S);
  }

  function drawFly(fl, t) {
    const flap = Math.floor(t / 140) % 2;
    const x = Math.round(fl.x), y = Math.round(fl.y) + Math.round(Math.sin(t / 300 + fl.ph) * 2);
    ctx.fillStyle = '#33301c';
    ctx.fillRect(x - 1, y - 1, 2, 2);
    ctx.fillStyle = fl.c;
    if (flap) {
      ctx.fillRect(x - 4, y - 2, 3, 3); ctx.fillRect(x + 1, y - 2, 3, 3);
    } else {
      ctx.fillRect(x - 3, y - 4, 2, 3); ctx.fillRect(x + 1, y - 4, 2, 3);
    }
  }

  function draw(t) {
    const st = getState();

    drawBackground(t, st);

    if (rec) drawRecord(t, st.working);
    if (tw) drawTypewriter(t, st);
    if (avo) drawAvo(t, st);

    // music notes drift off the turntable while the lo-fi engine spins
    if (st.working && rec && t - lastNote > 550) {
      lastNote = t;
      notes.push({
        x: REC.x + REC.size * 0.5 + (Math.random() - 0.5) * 20,
        y: H - 12 - REC.size * REC.feet - 8,
        vy: -(0.45 + Math.random() * 0.4), ph: Math.random() * 6.28, life: 100
      });
    }
    notes = notes.filter(n => n.life > 0);
    for (const n of notes) {
      n.y += n.vy; n.x += Math.sin(t / 300 + n.ph) * 0.4; n.life--;
      ctx.globalAlpha = Math.min(1, n.life / 30);
      ctx.fillStyle = n.life % 12 < 6 ? '#ffe066' : '#fff8e7';
      const nx = Math.round(n.x), ny = Math.round(n.y);
      ctx.fillRect(nx, ny, 4, 3);
      ctx.fillRect(nx + 3, ny - 5, 1, 6);
      ctx.fillRect(nx + 3, ny - 5, 3, 1);
      ctx.globalAlpha = 1;
    }

    for (const fl of flies) {
      fl.x += fl.vx + Math.sin(t / 900 + fl.ph) * 0.3;
      fl.y += fl.vy + Math.cos(t / 800 + fl.ph) * 0.2;
      if (fl.x < -6) fl.x = W + 6; if (fl.x > W + 6) fl.x = -6;
      if (fl.y < -6) fl.y = H + 6; if (fl.y > H + 6) fl.y = -6;
      drawFly(fl, t);
    }

    particles = particles.filter(p => p.life > 0);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy; p.vy += 0.12; p.life--;
      ctx.fillStyle = p.life % 6 < 3 ? p.c1 : '#fff8e7';
      ctx.fillRect(p.x, p.y, p.s, p.s);
    }

    const h = new Date().getHours();
    if (h >= 19 || h < 6) {
      ctx.fillStyle = 'rgba(24,24,70,0.32)';
      ctx.fillRect(0, 0, W, H);
    }

    raf = requestAnimationFrame(draw);
  }

  draw(performance.now());
  window.__redraw = t2 => { cancelAnimationFrame(raf); draw(t2); };
  window.__getState = () => getState();
  window.__sceneBgs = extraBgs;

  return {
    burst(colors, n = 26) {
      for (let i = 0; i < n; i++) {
        particles.push({
          x: W * AVO.cx, y: H - 60,
          vx: (Math.random() - 0.5) * 6, vy: -Math.random() * 5 - 1,
          life: 30 + Math.random() * 20, s: 3 + Math.floor(Math.random() * 3) * 2,
          c1: colors[i % colors.length]
        });
      }
    },
    destroy() { cancelAnimationFrame(raf); }
  };
}
