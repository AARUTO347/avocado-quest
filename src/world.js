import { keyImage } from './key.js';
import mapUrl from './assets/world/village-map.jpg';
import propsUrl from './assets/world/village-props.jpg';
import potsUrl from './assets/world/potted-plants-sheet.jpg';
import pots2Url from './assets/world/pots-sheet.jpg';
import mcUrl from './assets/world/mc-sheet.jpg';
import animalsUrl from './assets/world/companion-base-sprites.jpg';
import monstersUrl from './assets/world/monsters-sheet.jpg';
import orcUrl from './assets/world/orc-pack.jpg';
import rocksUrl from './assets/world/rocks-sheet.jpg';
import weaponsUrl from './assets/world/weapons-sheet.jpg';
import promoUrl from './assets/world/promo-icons.jpg';
import hudUrl from './assets/world/hud-reference.jpg';
import isoUrl from './assets/world/isometric-tiles.jpg';
import natureUrl from './assets/world/nature-sheet.jpg';
import seasonalUrl from './assets/world/seasonal-tileset.jpg';
import starlitUrl from './assets/world/starlit-farm-icons.jpg';
import bedsUrl from './assets/world/wood-garden-beds.jpg';
import { STAGES, PAL } from './sprites.js';

export const VIEW_W = 960;
export const VIEW_H = 380;
export const WORLD_W = 1200;
export const WORLD_H = 2080;

const MAP_SCALE = 2.5;

const propsRect = (col, row) => [col * (533 / 4), row * (800 / 6), 533 / 4, 800 / 6];
const potsRect = (col, row) => [col * (736 / 4), row * (1104 / 4), 736 / 4, 1104 / 4];
const iconRect = n => [((n - 1) % 6) * (735 / 6), Math.floor((n - 1) / 6) * (736 / 6), 735 / 6, 736 / 6];

export const DECOR = [
  { id: 'cottage', name: 'COTTAGE', cost: 24, sheet: 'props', rect: propsRect(0, 0), w: 86, h: 72 },
  { id: 'windmill', name: 'WINDMILL', cost: 18, sheet: 'icons', rect: iconRect(3), w: 66, h: 66 },
  { id: 'barn', name: 'BARN', cost: 20, sheet: 'icons', rect: iconRect(2), w: 70, h: 58 },
  { id: 'tree', name: 'TREE', cost: 6, sheet: 'props', rect: propsRect(3, 0), w: 66, h: 66 },
  { id: 'pine', name: 'PINE TREE', cost: 8, sheet: 'props', rect: propsRect(0, 1), w: 52, h: 64 },
  { id: 'oak', name: 'OAK', cost: 8, sheet: 'nature', rect: [0, 10, 147, 170], w: 62, h: 74 },
  { id: 'autumn', name: 'AUTUMN TREE', cost: 8, sheet: 'nature', rect: [280, 10, 130, 170], w: 58, h: 72 },
  { id: 'palmtree', name: 'PALM TREE', cost: 10, sheet: 'nature', rect: [0, 180, 147, 180], w: 54, h: 74 },
  { id: 'cherry', name: 'CHERRY TREE', cost: 10, sheet: 'nature', rect: [280, 175, 130, 185], w: 56, h: 74 },
  { id: 'grove', name: 'GROVE', cost: 12, sheet: 'seasonal', rect: [0, 20, 80, 70], w: 70, h: 44 },
  { id: 'flowers', name: 'FLOWER BED', cost: 6, sheet: 'props', rect: propsRect(3, 4), w: 60, h: 40 },
  { id: 'planter', name: 'PLANTER', cost: 8, sheet: 'beds', rect: [380, 95, 115, 90], w: 58, h: 44 },
  { id: 'fence', name: 'FENCE', cost: 4, sheet: 'props', rect: propsRect(0, 2), w: 60, h: 30 },
  { id: 'well', name: 'WELL', cost: 10, sheet: 'props', rect: propsRect(3, 1), w: 58, h: 58 },
  { id: 'barrel', name: 'BARREL', cost: 4, sheet: 'props', rect: propsRect(0, 3), w: 40, h: 44 },
  { id: 'lantern', name: 'LANTERN', cost: 8, sheet: 'props', rect: propsRect(3, 3), w: 34, h: 60 },
  { id: 'crate', name: 'CRATE', cost: 4, sheet: 'props', rect: propsRect(2, 2), w: 40, h: 34 },
  { id: 'bench', name: 'BENCH', cost: 6, sheet: 'props', rect: propsRect(2, 3), w: 60, h: 32 },
  { id: 'cart', name: 'CART', cost: 10, sheet: 'props', rect: propsRect(1, 3), w: 68, h: 44 },
  { id: 'stall', name: 'STALL', cost: 16, sheet: 'props', rect: propsRect(0, 5), w: 76, h: 62 },
  { id: 'chest', name: 'CHEST', cost: 10, sheet: 'icons', rect: iconRect(5), w: 40, h: 34 },
  { id: 'mailbox', name: 'MAILBOX', cost: 6, sheet: 'icons', rect: iconRect(6), w: 30, h: 40 },
  { id: 'can', name: 'WATERING CAN', cost: 4, sheet: 'icons', rect: iconRect(7), w: 30, h: 26 },
  { id: 'rock', name: 'ROCK CLUSTER', cost: 8, sheet: 'rocks', rect: [0, 0, 260, 200], w: 74, h: 56 },
  { id: 'pebbles', name: 'PEBBLES', cost: 4, sheet: 'rocks', rect: [450, 60, 200, 160], w: 46, h: 36 },
  { id: 'piano', name: 'PIANO', cost: 18, sheet: 'weapons', rect: [0, 1150, 180, 158], w: 84, h: 66 },
  { id: 'guitar', name: 'GUITAR', cost: 8, sheet: 'weapons', rect: [240, 610, 90, 160], w: 30, h: 54 },
  { id: 'hay', name: 'HAY BALE', cost: 6, sheet: 'iso', rect: [140, 30, 160, 170], w: 56, h: 44 },
  { id: 'palm', name: 'POTTED PALM', cost: 5, sheet: 'pots', rect: potsRect(1, 0), w: 40, h: 60 },
  { id: 'cactus', name: 'CACTUS POT', cost: 5, sheet: 'pots', rect: potsRect(0, 1), w: 38, h: 56 },
  { id: 'rose', name: 'ROSE POT', cost: 6, sheet: 'pots', rect: potsRect(2, 1), w: 34, h: 58 },
  { id: 'hangplant', name: 'HANGING PLANT', cost: 8, sheet: 'pots', rect: potsRect(3, 0), w: 44, h: 58 },
  { id: 'terrapot', name: 'TERRACOTTA POT', cost: 4, sheet: 'pots2', rect: [0, 0, 72, 110], w: 26, h: 40 }
];

export const ENEMY_TYPES = [
  { name: 'SWAMP OGRE', sheet: 'monsters', rects: [[0, 0, 169, 170], [169, 0, 169, 170]], h: 62, hp: 2, tier: 1, reward: 2, damage: 2 },
  { name: 'SKULL BEAST', sheet: 'monsters', rects: [[0, 640, 169, 170], [169, 640, 169, 170]], h: 60, hp: 2, tier: 2, reward: 3, damage: 2 },
  { name: 'ORC', sheet: 'orc', rects: [[152, 40, 104, 84]], h: 62, hp: 1, tier: 1, reward: 2, damage: 2 },
  { name: 'OGRE BRUTE', sheet: 'monsters', rects: [[338, 0, 169, 170], [169, 0, 169, 170]], h: 66, hp: 3, tier: 3, reward: 5, damage: 3 },
  { name: 'GHOST', sheet: 'animals', rects: [[420, 460, 90, 120]], h: 54, hp: 1, tier: 1, reward: 2, damage: 2 },
  { name: 'ZOMBIE', sheet: 'animals', rects: [[500, 470, 90, 120]], h: 56, hp: 2, tier: 2, reward: 3, damage: 2 },
  { name: 'WILD BOAR', sheet: 'animals', rects: [[580, 420, 160, 130]], h: 44, hp: 1, tier: 1, reward: 2, damage: 2 },
  { name: 'ORANGE BRUTE', sheet: 'animals', rects: [[615, 285, 125, 125]], h: 62, hp: 3, tier: 3, reward: 5, damage: 3 }
];

const NPC_TYPES = [
  { name: 'COW', sheet: 'animals', rect: [270, 555, 160, 140], h: 52 },
  { name: 'BULL', sheet: 'animals', rect: [440, 600, 160, 120], h: 50 },
  { name: 'RABBIT', sheet: 'animals', rect: [370, 490, 85, 100], h: 30 },
  { name: 'MUSHROOM', sheet: 'animals', rect: [280, 470, 90, 100], h: 34 }
];

export const WEAPON_BASES = [
  { id: 'sword', name: 'LONGSWORD', sheet: 'weapons', rect: [485, 650, 60, 150] },
  { id: 'axe', name: 'BATTLE AXE', sheet: 'weapons', rect: [425, 780, 80, 90] },
  { id: 'spear', name: 'SPEAR', sheet: 'weapons', rect: [495, 860, 35, 140] },
  { id: 'pistol', name: 'PISTOL', sheet: 'weapons', rect: [25, 205, 75, 50] },
  { id: 'rifle', name: 'RIFLE', sheet: 'weapons', rect: [15, 55, 140, 70] },
  { id: 'spoon', name: 'GIANT SPOON', sheet: 'weapons', rect: [265, 900, 70, 250] },
  { id: 'guitar', name: 'GUITAR', sheet: 'weapons', rect: [235, 605, 100, 170] },
  { id: 'piano', name: 'PIANO', sheet: 'weapons', rect: [0, 1145, 185, 163] },
  { id: 'hammer', name: 'SLEDGEHAMMER', sheet: 'weapons', rect: [365, 1040, 100, 90] },
  { id: 'dagger', name: 'DAGGER', sheet: 'weapons', rect: [330, 890, 40, 95] },
  { id: 'pitchfork', name: 'PITCHFORK', sheet: 'weapons', rect: [452, 890, 55, 155] },
  { id: 'extinguisher', name: 'EXTINGUISHER', sheet: 'weapons', rect: [410, 1115, 70, 130] }
];

export const WEAPON_TIERS = ['RUSTY', 'BRONZE', 'IRON', 'STEEL', 'SILVER', 'GOLD', 'CRYSTAL', 'OBSIDIAN', 'FROST', 'FLAME'];

export const WEAPONS = WEAPON_BASES.flatMap(b => WEAPON_TIERS.map((t, i) => ({
  id: b.id + '-' + i,
  baseId: b.id,
  name: t + ' ' + b.name,
  tier: i,
  power: i + 1,
  dmg: 1 + Math.floor(i / 3),
  cost: 4 + i * 5
})));

export const DISTRICTS = [
  { id: 'southgate', name: 'SOUTH GATE', x: 600, y: 1900, danger: 0 },
  { id: 'bridge', name: 'STONE BRIDGE', x: 600, y: 1500, danger: 0 },
  { id: 'market', name: 'MARKET SQUARE', x: 300, y: 1300, danger: 1 },
  { id: 'westwoods', name: 'WEST WOODS', x: 160, y: 950, danger: 1 },
  { id: 'eastfields', name: 'EAST FIELDS', x: 1020, y: 1100, danger: 1 },
  { id: 'riverbank', name: 'RIVERBANK', x: 780, y: 1650, danger: 0 },
  { id: 'mill', name: 'OLD MILL', x: 260, y: 620, danger: 2 },
  { id: 'northforest', name: 'NORTH FOREST', x: 600, y: 300, danger: 2 },
  { id: 'hilltop', name: 'HILLTOP', x: 920, y: 520, danger: 3 },
  { id: 'oldroad', name: 'OLD ROAD', x: 450, y: 1000, danger: 2 }
];

export const CONDITIONS = [
  { id: 'day', name: 'DAY', tint: null, danger: 0 },
  { id: 'dawn', name: 'DAWN', tint: 'rgba(255,180,120,0.12)', danger: 0 },
  { id: 'dusk', name: 'DUSK', tint: 'rgba(255,120,80,0.14)', danger: 1 },
  { id: 'night', name: 'NIGHT', tint: 'rgba(20,20,70,0.32)', danger: 1 },
  { id: 'mist', name: 'MIST', tint: 'rgba(205,225,220,0.20)', danger: 2 }
];

const GEM_RECT = [40, 660, 28, 80];

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

function loadImage(url) {
  return new Promise((resolve, reject) => {
    const im = new Image();
    im.onload = () => resolve(im);
    im.onerror = () => reject(new Error('failed to load ' + url));
    im.src = url;
  });
}

function buildLandMask(map) {
  const w = 240;
  const h = Math.round(w * map.height / map.width);
  const c = document.createElement('canvas');
  c.width = w; c.height = h;
  const x = c.getContext('2d', { willReadFrequently: true });
  x.drawImage(map, 0, 0, w, h);
  const d = x.getImageData(0, 0, w, h).data;
  const mask = new Uint8Array(w * h);
  for (let i = 0; i < w * h; i++) {
    const r = d[i * 4], g = d[i * 4 + 1], b = d[i * 4 + 2];
    const water = b > 140 && b - r > 40 && g > 110;
    mask[i] = water ? 0 : 1;
  }
  return { w, h, mask };
}

function makeAvoSprite() {
  const rows = STAGES[1].rows;
  const cell = 6;
  const c = document.createElement('canvas');
  c.width = rows[0].length * cell;
  c.height = rows.length * cell;
  const x = c.getContext('2d');
  rows.forEach((row, r) => {
    for (let i = 0; i < row.length; i++) {
      const col = PAL[row[i]];
      if (!col) continue;
      x.fillStyle = col;
      x.fillRect(i * cell, r * cell, cell, cell);
    }
  });
  return c;
}

let assetsPromise = null;
function loadAssets() {
  if (!assetsPromise) {
    assetsPromise = Promise.all([
      loadImage(mapUrl), loadImage(propsUrl), loadImage(potsUrl), loadImage(pots2Url), loadImage(mcUrl),
      loadImage(animalsUrl), loadImage(monstersUrl), loadImage(orcUrl), loadImage(rocksUrl),
      loadImage(weaponsUrl), loadImage(promoUrl), loadImage(hudUrl), loadImage(isoUrl),
      loadImage(natureUrl), loadImage(seasonalUrl), loadImage(starlitUrl), loadImage(bedsUrl)
    ]).then(([map, props, pots, pots2, mc, animals, monsters, orc, rocks, weapons, promo, hud, iso, nature, seasonal, starlit, beds]) => ({
      map, hud, avo: makeAvoSprite(), land: buildLandMask(map), raw: { weapons },
      sheets: {
        props: keyImage(props, 36),
        pots: keyImage(pots, 30),
        pots2: keyImage(pots2, 26),
        rocks: keyImage(rocks, 26),
        weapons: keyImage(weapons, 60),
        iso: keyImage(iso, 26),
        mc: keyImage(mc, 38, [[255, 255, 255]], { diag: true }),
        animals: keyImage(animals, 22, [[255, 255, 255]], { diag: true }),
        monsters: keyImage(monsters, 14),
        orc: keyImage(orc, 12),
        promo: keyImage(promo, 26, [[30, 30, 52], [24, 25, 43], [63, 67, 102]], { global: true }),
        nature: keyImage(nature, 24, [[255, 255, 255]], { diag: true }),
        seasonal: keyImage(seasonal, 24),
        icons: keyImage(starlit, 26, [[255, 255, 255], [204, 204, 204]], { diag: true }),
        beds: keyImage(beds, 24)
      }
    }));
  }
  return assetsPromise;
}

export function weaponThumbnails() {
  return loadAssets().then(a => {
    const out = {};
    for (const b of WEAPON_BASES) {
      const src = b.sheet === 'weapons' ? a.raw.weapons : a.sheets[b.sheet];
      const [sx, sy, sw, sh] = b.rect;
      const crop = document.createElement('canvas');
      crop.width = Math.round(sw); crop.height = Math.round(sh);
      const cx = crop.getContext('2d', { willReadFrequently: true });
      cx.drawImage(src, sx, sy, sw, sh, 0, 0, crop.width, crop.height);
      const w = crop.width, h = crop.height;
      const img = cx.getImageData(0, 0, w, h);
      const px = img.data;
      const votes = new Map();
      const addVote = (i) => {
        const k = (px[i] >> 4) + ',' + (px[i + 1] >> 4) + ',' + (px[i + 2] >> 4);
        const v = votes.get(k) || { n: 0, r: 0, g: 0, b: 0 };
        v.n++; v.r += px[i]; v.g += px[i + 1]; v.b += px[i + 2];
        votes.set(k, v);
      };
      for (let i = 0; i < w; i++) { addVote(i * 4); addVote(((h - 1) * w + i) * 4); }
      for (let j = 0; j < h; j++) { addVote((j * w) * 4); addVote((j * w + w - 1) * 4); }
      let best = null;
      for (const v of votes.values()) if (!best || v.n > best.n) best = v;
      if (best) {
        const br = best.r / best.n, bg2 = best.g / best.n, bb = best.b / best.n;
        for (let i = 0; i < px.length; i += 4) {
          if (Math.abs(px[i] - br) <= 34 && Math.abs(px[i + 1] - bg2) <= 34 && Math.abs(px[i + 2] - bb) <= 34) px[i + 3] = 0;
        }
        cx.putImageData(img, 0, 0);
      }
      const keyed = crop;
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const x = c.getContext('2d');
      x.imageSmoothingEnabled = false;
      const sc = Math.min(56 / crop.width, 56 / crop.height);
      x.drawImage(keyed, (64 - crop.width * sc) / 2, (64 - crop.height * sc) / 2, crop.width * sc, crop.height * sc);
      out[b.id] = c.toDataURL('image/png');
    }
    return out;
  });
}

export function enemyThumbnails() {
  return loadAssets().then(a => {
    const out = {};
    for (const t of ENEMY_TYPES) {
      const sheet = a.sheets[t.sheet];
      const [sx, sy, sw, sh] = t.rects[0];
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const x = c.getContext('2d');
      x.imageSmoothingEnabled = false;
      const s = Math.min(56 / sw, 56 / sh);
      x.drawImage(sheet, sx, sy, sw, sh, (64 - sw * s) / 2, (64 - sh * s) / 2, sw * s, sh * s);
      out[t.name] = c.toDataURL('image/png');
    }
    return out;
  });
}

export function decorThumbnails() {
  return loadAssets().then(a => {
    const out = {};
    for (const d of DECOR) {
      const sheet = a.sheets[d.sheet];
      const [sx, sy, sw, sh] = d.rect;
      const c = document.createElement('canvas');
      c.width = 64; c.height = 64;
      const x = c.getContext('2d');
      x.imageSmoothingEnabled = false;
      const s = Math.min(60 / sw, 60 / sh);
      const dw = sw * s, dh = sh * s;
      x.drawImage(sheet, sx, sy, sw, sh, (64 - dw) / 2, (64 - dh) / 2, dw, dh);
      out[d.id] = c.toDataURL('image/png');
    }
    return out;
  });
}

export function createWorld(canvas, opts) {
  const ctx = canvas.getContext('2d');
  const { getDecor, onCollect, onPlace, getPlacing, onDamage, onSwing, onBop, getBopped, onWater, getMap, getWeaponDamage } = opts;

  const player = { x: WORLD_W / 2, y: WORLD_H - 260, dir: 1, moving: false };
  const avo = { x: player.x - 46, y: player.y + 30, dir: 1, hopUntil: 0 };
  const keys = {};
  const coins = [];
  const gem = { x: 0, y: 0, ready: true, respawnAt: 0 };
  const enemies = [];
  const npcs = [];
  let camX = 0, camY = 0, raf = 0, ready = false, last = 0, t = 0, frames = 0;
  let hover = null, assets = null, active = false;
  let attackUntil = 0, attackCd = 0, invulnUntil = 0, hurtUntil = 0, lastWorldLv = 1;

  function isLand(wx, wy) {
    if (!assets || !assets.land) return true;
    const m = assets.land;
    const mx = clamp(Math.floor(wx / WORLD_W * m.w), 0, m.w - 1);
    const my = clamp(Math.floor(wy / WORLD_H * m.h), 0, m.h - 1);
    return m.mask[my * m.w + mx] === 1;
  }
  function isOpenGround(wx, wy, r = 12) {
    return isLand(wx, wy) && isLand(wx - r, wy) && isLand(wx + r, wy) && isLand(wx, wy - r) && isLand(wx, wy + r);
  }
  function landPoint(minDist, fromX, fromY) {
    for (let i = 0; i < 80; i++) {
      const x = 60 + Math.random() * (WORLD_W - 120);
      const y = 100 + Math.random() * (WORLD_H - 180);
      if (!isOpenGround(x, y)) continue;
      if (minDist && Math.hypot(x - fromX, y - fromY) < minDist) continue;
      return { x, y };
    }
    const sx = clamp(fromX || WORLD_W / 2, 60, WORLD_W - 60);
    const sy = clamp(fromY || WORLD_H / 2, 100, WORLD_H - 100);
    for (let r = 24; r < 700; r += 24) {
      for (let a = 0; a < 14; a++) {
        const ang = (a / 14) * 6.28;
        const x = clamp(sx + Math.cos(ang) * r, 40, WORLD_W - 40);
        const y = clamp(sy + Math.sin(ang) * r, 80, WORLD_H - 40);
        if (isOpenGround(x, y)) return { x, y };
      }
    }
    return { x: sx, y: sy };
  }

  function spawnCoin(c) {
    for (let i = 0; i < 40; i++) {
      const x = clamp(player.x + (Math.random() - 0.5) * 800, 60, WORLD_W - 60);
      const y = clamp(player.y + (Math.random() - 0.5) * 520, 80, WORLD_H - 80);
      if (isOpenGround(x, y, 10)) { c.x = x; c.y = y; c.ph = Math.random() * 6.28; return; }
    }
    const p = landPoint(0, player.x, player.y);
    c.x = p.x; c.y = p.y; c.ph = Math.random() * 6.28;
  }
  for (let i = 0; i < 5; i++) { const c = {}; spawnCoin(c); coins.push(c); }
  gem.x = WORLD_W / 2; gem.y = 300;

  const worldLv = () => {
    const m = (getMap ? getMap() : null) || {};
    const d = DISTRICTS.find(x => x.id === m.d) || DISTRICTS[0];
    const c = CONDITIONS.find(x => x.id === m.c) || CONDITIONS[0];
    return clamp(1 + Math.floor((getBopped ? getBopped() : 0) / 8) + d.danger + c.danger, 1, 12);
  };

  function initEnemy(en) {
    const lv = worldLv();
    const maxTier = Math.max(1, Math.ceil(lv / 2));
    const pool = ENEMY_TYPES.filter(t => t.tier <= maxTier);
    const strong = pool.filter(t => t.tier === maxTier);
    const type = (Math.random() < 0.45 && strong.length)
      ? strong[Math.floor(Math.random() * strong.length)]
      : (pool[Math.floor(Math.random() * pool.length)] || ENEMY_TYPES[0]);
    en.type = type;
    en.lv = clamp(lv + type.tier - 1, 1, 20);
    en.maxHp = type.hp + Math.floor((en.lv - 1) / 4);
    en.hp = en.maxHp;
    en.reward = type.reward + Math.floor((en.lv - 1) / 3);
    en.damage = type.damage + Math.floor((en.lv - 1) / 5);
    en.flashUntil = 0;
    en.alive = true;
    en.respawnAt = 0;
    const p = landPoint(320, player.x, player.y);
    en.x = p.x;
    en.y = p.y;
    en.vx = 0; en.vy = 0; en.timer = 0; en.frame = 0;
  }
  for (let i = 0; i < 5; i++) { const en = { frame: 0 }; initEnemy(en); enemies.push(en); }

  NPC_TYPES.forEach(type => {
    npcs.push({ type, x: WORLD_W / 2, y: WORLD_H / 2, vx: 0.02, vy: 0.01, timer: 2000 + Math.random() * 3000, phase: Math.random() * 6.28 });
  });

  function isTyping(e) {
    const tag = (e.target && e.target.tagName) || '';
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target && e.target.isContentEditable);
  }

  function attack() {
    if (t < attackCd) return;
    attackCd = t + 450;
    attackUntil = t + 260;
    onSwing && onSwing();
    let hit = false;
    for (const en of enemies) {
      if (!en.alive) continue;
      const d = Math.hypot(en.x - player.x, en.y - player.y);
      if (d < 95) {
        hit = true;
        en.hp -= (getWeaponDamage ? getWeaponDamage() : 1);
        en.flashUntil = t + 170;
        const push = d || 1;
        en.x += ((en.x - player.x) / push) * 28;
        en.y += ((en.y - player.y) / push) * 28;
        if (en.hp <= 0) {
          en.alive = false;
          en.respawnAt = t + 6500;
          avo.hopUntil = t + 400;
          onCollect && onCollect(en.reward);
          onBop && onBop();
        }
      }
    }
    if (hit) attackCd = t + 500;
  }

  function onKey(e, down) {
    if (isTyping(e)) return;
    const k = e.key.toLowerCase();
    if (['arrowup', 'arrowdown', 'arrowleft', 'arrowright', 'w', 'a', 's', 'd', ' '].includes(k)) {
      keys[k] = down;
      e.preventDefault();
      if (down && k === ' ' && !e.repeat) attack();
    }
  }
  const kd = e => onKey(e, true);
  const ku = e => onKey(e, false);
  window.addEventListener('keydown', kd);
  window.addEventListener('keyup', ku);

  function toWorld(ev) {
    const rect = canvas.getBoundingClientRect();
    const x = (ev.clientX - rect.left) / rect.width * VIEW_W + camX;
    const y = (ev.clientY - rect.top) / rect.height * VIEW_H + camY;
    return { x, y };
  }
  function onMove(ev) { hover = toWorld(ev); active = true; }
  function onClick(ev) {
    active = true;
    const id = getPlacing();
    if (id) {
      const p = toWorld(ev);
      const px = clamp(p.x, 30, WORLD_W - 30);
      const py = clamp(p.y, 60, WORLD_H - 20);
      if (!isOpenGround(px, py, 8)) { onWater && onWater(); return; }
      onPlace(id, px, py);
    } else {
      attack();
    }
  }
  const onEnter = () => { active = true; };
  const onLeave = () => { active = false; for (const k of Object.keys(keys)) keys[k] = false; };
  canvas.addEventListener('mousemove', onMove);
  canvas.addEventListener('mouseenter', onEnter);
  canvas.addEventListener('mouseleave', onLeave);
  canvas.addEventListener('click', onClick);

  loadAssets().then(a => {
    assets = a;
    if (!isOpenGround(player.x, player.y, 16)) {
      const p = landPoint(0, player.x, player.y);
      player.x = p.x; player.y = p.y; avo.x = p.x - 40; avo.y = p.y + 24;
    }
    const gp = landPoint(0, player.x, player.y);
    gem.x = gp.x; gem.y = gp.y;
    for (const n of npcs) { const p = landPoint(160, player.x, player.y); n.x = p.x; n.y = p.y; }
    for (const c of coins) spawnCoin(c);
    for (const en of enemies) initEnemy(en);
    ready = true;
    draw(performance.now());
  }).catch(() => { ready = true; });

  function drawSprite(sheet, rect, x, y, h, dir) {
    if (!Array.isArray(rect)) return;
    const [sx, sy, sw, sh] = rect;
    const sc = h / sh;
    const dw = sw * sc;
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    if (dir < 0) ctx.scale(-1, 1);
    ctx.drawImage(sheet, sx, sy, sw, sh, -dw / 2, -h, dw, h);
    ctx.restore();
  }

  function drawDecor(item, d) {
    if (!ready) return;
    const x = d.x - camX, y = d.y - camY;
    if (y < -120 || y > VIEW_H + 120 || x < -140 || x > VIEW_W + 140) return;
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(x, y - 2, item.w * 0.36, 5, 0, 0, 6.29); ctx.fill();
    ctx.imageSmoothingEnabled = false;
    drawSprite(assets.sheets[item.sheet], item.rect, x, y, item.h, 1);
  }

  function drawPlayer() {
    const bob = player.moving ? Math.round(Math.sin(t / 90) * 2) : Math.round(Math.sin(t / 420) * 1);
    const x = player.x - camX, y = player.y - camY;
    ctx.fillStyle = 'rgba(0,0,0,0.22)';
    ctx.beginPath(); ctx.ellipse(x, y - 2, 17, 5, 0, 0, 6.29); ctx.fill();
    if (!ready) {
      ctx.fillStyle = '#4a3520'; ctx.fillRect(x - 10, y - 46, 20, 44);
      return;
    }
    const mc = assets.sheets.mc;
    const cw = mc.width / 5, ch = mc.height / 4;
    ctx.imageSmoothingEnabled = false;
    const row = player.moving ? 1 : 0;
    const col = Math.floor(t / (player.moving ? 120 : 380)) % 5;
    drawSprite(mc, [col * cw, row * ch, cw, ch], x, y + bob, 76, player.dir);
  }

  function drawAvo() {
    if (!ready) return;
    const x = Math.round(avo.x - camX), y = Math.round(avo.y - camY);
    if (y < -80 || y > VIEW_H + 80) return;
    const bob = Math.round(Math.sin(t / 300) * 3) + (t < avo.hopUntil ? -9 : 0);
    ctx.fillStyle = 'rgba(0,0,0,0.18)';
    ctx.beginPath(); ctx.ellipse(x, y - 1, 12, 4, 0, 0, 6.29); ctx.fill();
    ctx.imageSmoothingEnabled = false;
    const S = 48;
    ctx.save();
    ctx.translate(x, y + bob);
    ctx.scale(avo.dir, 1);
    ctx.drawImage(assets.avo, -S / 2, -S + 4, S, S);
    ctx.restore();
  }

  function drawEnemy(en) {
    if (!en.alive) return;
    const x = en.x - camX, y = en.y - camY;
    if (y < -100 || y > VIEW_H + 100 || x < -120 || x > VIEW_W + 120) return;
    ctx.fillStyle = 'rgba(0,0,0,0.2)';
    ctx.beginPath(); ctx.ellipse(x, y - 2, 16, 5, 0, 0, 6.29); ctx.fill();
    const rects = en.type.rects;
    const rect = rects[(Math.floor(t / 260) + en.frame) % rects.length];
    const dir = en.vx < 0 ? -1 : 1;
    ctx.imageSmoothingEnabled = false;
    drawSprite(assets.sheets[en.type.sheet], rect, x, y, en.type.h, dir);
    if (t < en.flashUntil) {
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fillRect(x - en.type.h * 0.35, y - en.type.h, en.type.h * 0.7, en.type.h);
    }
    ctx.font = 'bold 9px monospace';
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(20,14,6,0.75)';
    ctx.fillRect(x - 16, y - en.type.h - 22, 32, 11);
    ctx.fillStyle = '#ffe066';
    ctx.fillText('Lv' + en.lv, x, y - en.type.h - 13);
    ctx.textAlign = 'left';
    if (en.hp < en.maxHp) {
      const bw = 26, bx = Math.round(x - bw / 2), by = Math.round(y - en.type.h - 10);
      ctx.fillStyle = '#3a1f14'; ctx.fillRect(bx - 1, by - 1, bw + 2, 5);
      ctx.fillStyle = '#c0392b'; ctx.fillRect(bx, by, bw, 3);
      ctx.fillStyle = '#7ec850'; ctx.fillRect(bx, by, bw * (en.hp / en.maxHp), 3);
    }
  }

  function drawNpc(npc) {
    const x = npc.x - camX, y = npc.y - camY;
    if (y < -90 || y > VIEW_H + 90 || x < -120 || x > VIEW_W + 120) return;
    const hop = npc.type.name === 'RABBIT' ? Math.abs(Math.sin(t / 260 + npc.phase)) * -5 : 0;
    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.beginPath(); ctx.ellipse(x, y - 1, 14, 4, 0, 0, 6.29); ctx.fill();
    ctx.imageSmoothingEnabled = false;
    drawSprite(assets.sheets[npc.type.sheet], npc.type.rect, x, y + hop, npc.type.h, npc.vx < 0 ? -1 : 1);
  }

  function drawCoin(c) {
    const bob = Math.sin(t / 220 + c.ph) * 3;
    const x = Math.round(c.x - camX), y = Math.round(c.y + bob - camY);
    if (y < -24 || y > VIEW_H + 24 || x < -24 || x > VIEW_W + 24) return;
    const glow = 0.35 + Math.sin(t / 180 + c.ph) * 0.25;
    const spin = 3 + Math.abs(Math.cos(t / 320 + c.ph)) * 5;
    ctx.fillStyle = 'rgba(255,224,102,' + glow.toFixed(2) + ')';
    ctx.beginPath(); ctx.arc(x, y, 13, 0, 6.29); ctx.fill();
    ctx.fillStyle = '#5c3d00';
    ctx.beginPath(); ctx.ellipse(x, y + 1, spin + 1.5, 9.5, 0, 0, 6.29); ctx.fill();
    ctx.fillStyle = '#ffd75e';
    ctx.beginPath(); ctx.ellipse(x, y, spin, 8, 0, 0, 6.29); ctx.fill();
    ctx.fillStyle = '#fff3b0';
    ctx.fillRect(x - Math.max(1, spin - 3), y - 4, Math.max(2, spin - 2), 3);
  }

  function drawGem() {
    if (!ready || !gem.ready) return;
    const x = gem.x - camX, y = gem.y + Math.sin(t / 260) * 4 - camY;
    if (y < -40 || y > VIEW_H + 40) return;
    ctx.fillStyle = 'rgba(120,220,255,0.35)';
    ctx.beginPath(); ctx.arc(x, y - 14, 16, 0, 6.29); ctx.fill();
    ctx.imageSmoothingEnabled = false;
    drawSprite(assets.sheets.promo, GEM_RECT, x, y, 30, 1);
  }

  function updateEnemies(dt) {
    for (const en of enemies) {
      if (!en.alive) {
        if (t >= en.respawnAt) initEnemy(en);
        continue;
      }
      const dist = Math.hypot(en.x - player.x, en.y - player.y);
      en.timer -= dt;
      if (dist < 190) {
        const k = 0.1 * dt / (dist || 1);
        en.vx = (player.x - en.x) * k;
        en.vy = (player.y - en.y) * k;
        en.frame = 1;
      } else if (en.timer <= 0) {
        en.timer = 1200 + Math.random() * 2200;
        const a = Math.random() * 6.28;
        en.vx = Math.cos(a) * 0.05 * dt;
        en.vy = Math.sin(a) * 0.05 * dt;
        en.frame = 0;
      }
      const ex = clamp(en.x + en.vx, 40, WORLD_W - 40);
      const ey = clamp(en.y + en.vy, 80, WORLD_H - 40);
      if (isLand(ex, en.y)) en.x = ex;
      if (isLand(en.x, ey)) en.y = ey;

      if (dist < 34 && t > invulnUntil) {
        invulnUntil = t + 1300;
        hurtUntil = t + 500;
        onDamage && onDamage(en.damage || 2);
        const push = dist || 1;
        const kx = clamp(player.x + ((player.x - en.x) / push) * 46, 24, WORLD_W - 24);
        const ky = clamp(player.y + ((player.y - en.y) / push) * 46, 60, WORLD_H - 30);
        if (isLand(kx, player.y)) player.x = kx;
        if (isLand(player.x, ky)) player.y = ky;
      }
    }
  }

  function updateNpcs(dt) {
    for (const npc of npcs) {
      npc.timer -= dt;
      if (npc.timer <= 0) {
        npc.timer = 2600 + Math.random() * 3600;
        const a = Math.random() * 6.28;
        npc.vx = Math.cos(a) * 0.022 * dt;
        npc.vy = Math.sin(a) * 0.012 * dt;
      }
      const px = clamp(npc.x + npc.vx, 40, WORLD_W - 40);
      const py = clamp(npc.y + npc.vy, 80, WORLD_H - 40);
      if (isLand(px, npc.y)) npc.x = px;
      if (isLand(npc.x, py)) npc.y = py;
    }
  }

  function setMap(did, cid) {
    const d = DISTRICTS.find(x => x.id === did) || DISTRICTS[0];
    let p = { x: clamp(d.x, 60, WORLD_W - 60), y: clamp(d.y, 120, WORLD_H - 60) };
    if (assets && assets.land && !isOpenGround(p.x, p.y, 14)) p = landPoint(0, p.x, p.y);
    player.x = p.x; player.y = p.y;
    avo.x = p.x - 40; avo.y = p.y + 24;
    camX = clamp(player.x - VIEW_W / 2, 0, WORLD_W - VIEW_W);
    camY = clamp(player.y - VIEW_H * 0.58, 0, WORLD_H - VIEW_H);
    for (const en of enemies) initEnemy(en);
    for (const c of coins) spawnCoin(c);
    lastWorldLv = worldLv();
  }

  function draw(now) {
    frames++;
    const dt = Math.min(40, now - last || 16);
    last = now; t += dt;

    const sp = 0.165 * dt;
    let dx = 0, dy = 0;
    if (keys.arrowleft || keys.a) dx -= 1;
    if (keys.arrowright || keys.d) dx += 1;
    if (keys.arrowup || keys.w) dy -= 1;
    if (keys.arrowdown || keys.s) dy += 1;
    if (dx && dy) { dx *= 0.707; dy *= 0.707; }
    player.moving = !!(dx || dy);
    if (dx) player.dir = dx > 0 ? 1 : -1;
    const nx = clamp(player.x + dx * sp, 24, WORLD_W - 24);
    const ny = clamp(player.y + dy * sp, 60, WORLD_H - 30);
    if (dx && isLand(nx, player.y)) player.x = nx;
    if (dy && isLand(player.x, ny)) player.y = ny;

    camX = clamp(player.x - VIEW_W / 2, 0, WORLD_W - VIEW_W);
    camY = clamp(player.y - VIEW_H * 0.58, 0, WORLD_H - VIEW_H);

    avo.x += (player.x - player.dir * 44 - avo.x) * 0.06 * dt / 16;
    avo.y += (player.y + 26 - avo.y) * 0.06 * dt / 16;
    avo.dir = player.dir;

    for (const c of coins) {
      if (Math.abs(c.x - player.x) < 30 && Math.abs(c.y - player.y) < 34) {
        avo.hopUntil = t + 350;
        onCollect && onCollect(1);
        spawnCoin(c);
      }
    }
    if (gem.ready && Math.abs(gem.x - player.x) < 34 && Math.abs(gem.y - player.y) < 40) {
      gem.ready = false;
      gem.respawnAt = t + 18000;
      avo.hopUntil = t + 450;
      onCollect && onCollect(5);
    }
    if (!gem.ready && t >= gem.respawnAt) {
      gem.ready = true;
      gem.x = clamp(player.x + (Math.random() - 0.5) * 600, 60, WORLD_W - 60);
      gem.y = clamp(player.y + (Math.random() - 0.5) * 500, 80, WORLD_H - 80);
    }

    if (ready) {
      const lv = worldLv();
      if (lv !== lastWorldLv) {
        lastWorldLv = lv;
        for (const en of enemies) {
          en.lv = clamp(lv + en.type.tier - 1, 1, 20);
          en.maxHp = en.type.hp + Math.floor((en.lv - 1) / 4);
          en.hp = en.maxHp;
          en.reward = en.type.reward + Math.floor((en.lv - 1) / 3);
          en.damage = en.type.damage + Math.floor((en.lv - 1) / 5);
        }
      }
      const target = Math.min(10, 4 + lv);
      while (enemies.length < target) { const en = { frame: 0 }; initEnemy(en); enemies.push(en); }
      updateEnemies(dt); updateNpcs(dt);
    }

    ctx.clearRect(0, 0, VIEW_W, VIEW_H);

    if (ready) {
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(assets.map, camX / MAP_SCALE, camY / MAP_SCALE, VIEW_W / MAP_SCALE, VIEW_H / MAP_SCALE, 0, 0, VIEW_W, VIEW_H);
    } else {
      if (assets && assets.hud) {
        const s = Math.max(VIEW_W / assets.hud.width, VIEW_H / assets.hud.height);
        const dw = assets.hud.width * s, dh = assets.hud.height * s;
        ctx.drawImage(assets.hud, (VIEW_W - dw) / 2, (VIEW_H - dh) / 2, dw, dh);
        ctx.fillStyle = 'rgba(20,16,8,0.45)'; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
        ctx.fillStyle = '#fff3b0';
        ctx.font = 'bold 14px monospace';
        ctx.textAlign = 'center';
        ctx.fillText('LOADING AVO VILLAGE...', VIEW_W / 2, VIEW_H / 2 + 6);
        ctx.textAlign = 'left';
      } else {
        ctx.fillStyle = '#22331c'; ctx.fillRect(0, 0, VIEW_W, VIEW_H);
      }
    }

    const drawables = [];
    for (const d of getDecor() || []) {
      const item = DECOR.find(x => x.id === d.id);
      if (item) drawables.push({ y: d.y, fn: () => drawDecor(item, d) });
    }
    if (ready) {
      for (const en of enemies) if (en.alive) drawables.push({ y: en.y, fn: () => drawEnemy(en) });
      for (const npc of npcs) drawables.push({ y: npc.y, fn: () => drawNpc(npc) });
    }
    drawables.push({ y: player.y - 2, fn: drawAvo });
    drawables.push({ y: player.y, fn: drawPlayer });
    drawables.sort((a, b) => a.y - b.y);
    for (const d of drawables) d.fn();

    for (const c of coins) drawCoin(c);
    drawGem();

    if (t < attackUntil) {
      const y = player.y - camY - 30;
      const r = Math.max(0, 50 + ((t - (attackUntil - 260)) / 260) * 45);
      ctx.strokeStyle = 'rgba(255,248,231,' + Math.max(0, 0.8 - (r - 50) / 60).toFixed(2) + ')';
      ctx.lineWidth = 4;
      ctx.beginPath(); ctx.arc(player.x - camX, y, r, -0.6, 1.2); ctx.stroke();
      ctx.strokeStyle = 'rgba(255,215,94,0.6)';
      ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(player.x - camX, y, Math.max(0, r - 8), -0.7, 1.3); ctx.stroke();
    }

    if (hover && getPlacing()) {
      const item = DECOR.find(x => x.id === getPlacing());
      if (item) {
        const x = Math.round(hover.x - camX), y = Math.round(hover.y + Math.sin(t / 200) * 2 - camY);
        ctx.strokeStyle = 'rgba(255,255,255,0.85)';
        ctx.lineWidth = 2;
        ctx.strokeRect(x - item.w / 2, y - item.h, item.w, item.h);
        ctx.fillStyle = 'rgba(255,224,102,0.25)';
        ctx.fillRect(x - item.w / 2, y - item.h, item.w, item.h);
      }
    }

    if (ready) {
      const mw = 64, mh = Math.round(mw * assets.map.height / assets.map.width);
      const mx = 8, my = 8;
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = 'rgba(20,16,8,0.75)';
      ctx.fillRect(mx - 2, my - 2, mw + 4, mh + 4);
      ctx.drawImage(assets.map, mx, my, mw, mh);
      ctx.strokeStyle = 'rgba(255,224,102,0.85)';
      ctx.lineWidth = 1;
      ctx.strokeRect(mx - 2.5, my - 2.5, mw + 5, mh + 5);
      const dot = (wx, wy, col, sz) => {
        ctx.fillStyle = col;
        ctx.fillRect(Math.round(mx + wx / WORLD_W * mw - sz / 2), Math.round(my + wy / WORLD_H * mh - sz / 2), sz, sz);
      };
      for (const en of enemies) if (en.alive) dot(en.x, en.y, '#e74c3c', 3);
      for (const n of npcs) dot(n.x, n.y, '#7ec850', 2);
      dot(player.x, player.y, '#ffe066', 4);
      dot(avo.x, avo.y, '#dbe37a', 2);
      ctx.globalAlpha = 1;
    }

    const msel = getMap ? getMap() : null;
    const cond = CONDITIONS.find(x => x.id === (msel && msel.c)) || CONDITIONS[0];
    if (cond.tint) {
      ctx.fillStyle = cond.tint;
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    }
    if (t < hurtUntil) {
      ctx.fillStyle = 'rgba(200,30,20,' + (0.32 * (hurtUntil - t) / 500).toFixed(2) + ')';
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    }
    ctx.fillStyle = 'rgba(74,53,32,0.55)';
    ctx.fillRect(0, 0, VIEW_W, 3);
    ctx.fillRect(0, VIEW_H - 3, VIEW_W, 3);

    raf = requestAnimationFrame(draw);
  }

  raf = requestAnimationFrame(draw);
  window.__world = {
    player, avo, coins, enemies, npcs, attack,
    getCam: () => camY,
    getCamX: () => camX,
    getFrames: () => frames,
    getGem: () => gem,
    isLand: (x, y) => isLand(x, y),
    landPoint: (min) => landPoint(min || 0, player.x, player.y),
    setMap,
    setDir(name, down) {
      const map = { up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright' };
      if (map[name]) keys[map[name]] = down;
    }
  };

  return {
    attack,
    setMap,
    setDir(name, down) {
      const map = { up: 'arrowup', down: 'arrowdown', left: 'arrowleft', right: 'arrowright' };
      if (map[name]) keys[map[name]] = down;
    },
    destroy() {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', kd);
      window.removeEventListener('keyup', ku);
      canvas.removeEventListener('mousemove', onMove);
      canvas.removeEventListener('mouseenter', onEnter);
      canvas.removeEventListener('mouseleave', onLeave);
      canvas.removeEventListener('click', onClick);
    }
  };
}
