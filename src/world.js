import { keyImage } from './key.js';
import mapUrl from './assets/world/village-map.jpg';
import mapFarmUrl from './assets/world/map-farm.png';
import mapForestUrl from './assets/world/map-forest.png';
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
import soldierIdleUrl from './assets/world/soldier_idle.png';
import soldierWalkUrl from './assets/world/soldier_walk.png';
import soldierAttackUrl from './assets/world/soldier_attack.png';
import soldierHurtUrl from './assets/world/soldier_hurt.png';
import orcIdleUrl from './assets/world/orc_idle.png';
import orcWalkUrl from './assets/world/orc_walk.png';
import orcAttackUrl from './assets/world/orc_attack.png';
import chickenUrl from './assets/world/chicken.png';
import cowAnimUrl from './assets/world/cow_anim.png';
import tsCastleUrl from './assets/world/ts_castle.png';
import tsHouseUrl from './assets/world/ts_house.png';
import tsTowerUrl from './assets/world/ts_tower.png';
import tsMonasteryUrl from './assets/world/ts_monastery.png';
import soldierDeathUrl from './assets/world/soldier_death.png';
import tsPawnIdleUrl from './assets/world/ts_pawn_idle.png';
import tsPawnRunUrl from './assets/world/ts_pawn_run.png';
import tsArcherIdleUrl from './assets/world/ts_archer_idle.png';
import tsArcherRunUrl from './assets/world/ts_archer_run.png';
import tsMonkIdleUrl from './assets/world/ts_monk_idle.png';
import tsMonkRunUrl from './assets/world/ts_monk_run.png';
import lancerIdleUrl from './assets/world/lancer_idle.png';
import lancerRunUrl from './assets/world/lancer_run.png';
import lancerAttackUrl from './assets/world/lancer_attack.png';
import sproutCoopUrl from './assets/world/sprout_coop.png';
import sproutBridgeUrl from './assets/world/sprout_bridge.png';
import sproutChestUrl from './assets/world/sprout_chest.png';
import sproutPlantsUrl from './assets/world/sprout_plants.png';
import { STAGES, PAL } from './sprites.js';

export const VIEW_W = 960;
export const VIEW_H = 380;
export const WORLD_W = 1200;
export const WORLD_H = 2080;

const MAP_SCALE = 2.5;

export const WORLD_MAPS = [
  { id: 'farm', name: 'FARM VALLEY' },
  { id: 'village', name: 'OLD VILLAGE' },
  { id: 'forest', name: 'ENCHANTED FOREST' }
];

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
  { id: 'succulent', name: 'SUCCULENT', cost: 4, sheet: 'pots', rect: potsRect(0, 2), w: 34, h: 52 },
  { id: 'castle', name: 'STONE KEEP', cost: 34, sheet: 'ts_castle', rect: [0, 0, 320, 256], w: 118, h: 94 },
  { id: 'manor', name: 'MANOR', cost: 20, sheet: 'ts_house', rect: [0, 0, 128, 192], w: 66, h: 98 },
  { id: 'tower', name: 'WATCHTOWER', cost: 26, sheet: 'ts_tower', rect: [0, 0, 128, 256], w: 56, h: 112 },
  { id: 'monastery', name: 'MONASTERY', cost: 30, sheet: 'ts_monastery', rect: [0, 0, 192, 320], w: 74, h: 122 },
  { id: 'coop', name: 'CHICKEN COOP', cost: 12, sheet: 'sprout_coop', rect: [0, 0, 48, 48], w: 44, h: 40 },
  { id: 'bridge', name: 'WOOD BRIDGE', cost: 10, sheet: 'sprout_bridge', rect: [0, 0, 80, 48], w: 66, h: 38 },
  { id: 'lockbox', name: 'LOCKBOX', cost: 8, sheet: 'sprout_chest', rect: [0, 0, 80, 96], w: 42, h: 34 },
  { id: 'bush', name: 'BUSH', cost: 4, sheet: 'sprout_plants', rect: [0, 0, 32, 32], w: 30, h: 24 }
];

export const ENEMY_TYPES = [
  { name: 'SWAMP OGRE', sheet: 'monsters', rects: [[0, 0, 169, 170], [169, 0, 169, 170]], h: 62, hp: 2, tier: 1, reward: 2, damage: 2, speed: 0.085, aggro: 170 },
  { name: 'SKULL BEAST', sheet: 'monsters', rects: [[0, 640, 169, 170], [169, 640, 169, 170]], h: 60, hp: 2, tier: 2, reward: 3, damage: 2, speed: 0.1, aggro: 200 },
  { name: 'ORC', anim: { idle: 'orc_idle', walk: 'orc_walk', attack: 'orc_attack', cell: 100, frames: 6, walkFrames: 8 }, h: 140, hp: 1, tier: 1, reward: 2, damage: 2, speed: 0.11, aggro: 210 },
  { name: 'OGRE BRUTE', sheet: 'monsters', rects: [[338, 0, 169, 170], [169, 0, 169, 170]], h: 66, hp: 3, tier: 3, reward: 5, damage: 3, speed: 0.08, aggro: 190 },
  { name: 'GHOST', sheet: 'animals', rects: [[420, 460, 90, 120]], h: 54, hp: 1, tier: 1, reward: 2, damage: 2, speed: 0.09, aggro: 230 },
  { name: 'ZOMBIE', sheet: 'animals', rects: [[500, 470, 90, 120]], h: 56, hp: 2, tier: 2, reward: 3, damage: 2, speed: 0.07, aggro: 180 },
  { name: 'WILD BOAR', sheet: 'animals', rects: [[580, 420, 160, 130]], h: 44, hp: 1, tier: 1, reward: 2, damage: 2, speed: 0.13, aggro: 240 },
  { name: 'ORANGE BRUTE', sheet: 'animals', rects: [[615, 285, 125, 125]], h: 62, hp: 3, tier: 3, reward: 5, damage: 3, speed: 0.09, aggro: 190 },
  { name: 'BANDIT', anim: { idle: 'lancer_idle', walk: 'lancer_run', attack: 'lancer_attack', cell: 320, frames: 12, walkFrames: 6 }, h: 96, hp: 2, tier: 2, reward: 3, damage: 3, speed: 0.12, aggro: 260 }
];

const NPC_TYPES = [
  { name: 'COW', anim: { sheet: 'cow_anim', cellW: 32, cellH: 64, frames: 3 }, h: 44 },
  { name: 'BULL', sheet: 'animals', rect: [440, 600, 160, 120], h: 50 },
  { name: 'CHICKEN', anim: { sheet: 'chicken', cellW: 32, cellH: 32, frames: 2 }, h: 22 },
  { name: 'MUSHROOM', sheet: 'animals', rect: [280, 470, 90, 100], h: 34 },
  { name: 'GUARD', anim: { sheet: 'ts_pawn_idle', run: 'ts_pawn_run', cellW: 192, frames: 8, runFrames: 6 }, h: 74 },
  { name: 'ARCHER', anim: { sheet: 'ts_archer_idle', run: 'ts_archer_run', cellW: 192, frames: 6, runFrames: 4 }, h: 74 },
  { name: 'MONK', anim: { sheet: 'ts_monk_idle', run: 'ts_monk_run', cellW: 192, frames: 6, runFrames: 6 }, h: 74 }
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
  { id: 'southgate', name: 'SOUTH GATE', x: 600, y: 1900, danger: 0, mobs: ['GHOST', 'WILD BOAR'] },
  { id: 'bridge', name: 'STONE BRIDGE', x: 600, y: 1500, danger: 0, mobs: ['ORC', 'GHOST'] },
  { id: 'market', name: 'MARKET SQUARE', x: 300, y: 1300, danger: 1, mobs: ['ORC', 'ZOMBIE'] },
  { id: 'westwoods', name: 'WEST WOODS', x: 160, y: 950, danger: 1, mobs: ['WILD BOAR', 'SKULL BEAST'] },
  { id: 'eastfields', name: 'EAST FIELDS', x: 1020, y: 1100, danger: 1, mobs: ['ORC', 'GHOST'] },
  { id: 'riverbank', name: 'RIVERBANK', x: 780, y: 1650, danger: 0, mobs: ['GHOST', 'ZOMBIE'] },
  { id: 'mill', name: 'OLD MILL', x: 260, y: 620, danger: 2, mobs: ['SKULL BEAST', 'ZOMBIE'] },
  { id: 'northforest', name: 'NORTH FOREST', x: 600, y: 300, danger: 2, mobs: ['WILD BOAR', 'SKULL BEAST'] },
  { id: 'hilltop', name: 'HILLTOP', x: 920, y: 520, danger: 3, mobs: ['OGRE BRUTE', 'ORANGE BRUTE', 'BANDIT'] },
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
      loadImage(natureUrl), loadImage(seasonalUrl), loadImage(starlitUrl), loadImage(bedsUrl),
      loadImage(soldierIdleUrl), loadImage(soldierWalkUrl), loadImage(soldierAttackUrl), loadImage(soldierHurtUrl),
      loadImage(orcIdleUrl), loadImage(orcWalkUrl), loadImage(orcAttackUrl), loadImage(chickenUrl), loadImage(cowAnimUrl),
      loadImage(tsCastleUrl), loadImage(tsHouseUrl), loadImage(tsTowerUrl), loadImage(tsMonasteryUrl),
      loadImage(soldierDeathUrl), loadImage(tsPawnIdleUrl), loadImage(tsPawnRunUrl),
      loadImage(tsArcherIdleUrl), loadImage(tsArcherRunUrl), loadImage(tsMonkIdleUrl), loadImage(tsMonkRunUrl),
      loadImage(lancerIdleUrl), loadImage(lancerRunUrl), loadImage(lancerAttackUrl),
      loadImage(sproutCoopUrl), loadImage(sproutBridgeUrl), loadImage(sproutChestUrl), loadImage(sproutPlantsUrl),
      loadImage(mapFarmUrl), loadImage(mapForestUrl)
    ]).then(([map, props, pots, pots2, mc, animals, monsters, orc, rocks, weapons, promo, hud, iso, nature, seasonal, starlit, beds,
      soldierIdle, soldierWalk, soldierAttack, soldierHurt, orcIdle, orcWalk, orcAttack, chicken, cowAnim,
      tsCastle, tsHouse, tsTower, tsMonastery, soldierDeath, tsPawnIdle, tsPawnRun, tsArcherIdle, tsArcherRun, tsMonkIdle, tsMonkRun,
      lancerIdle, lancerRun, lancerAttack, sproutCoop, sproutBridge, sproutChest, sproutPlants, mapFarm, mapForest]) => ({
      anim: {
        soldierIdle, soldierWalk, soldierAttack, soldierHurt, soldierDeath,
        orc_idle: orcIdle, orc_walk: orcWalk, orc_attack: orcAttack,
        chicken, cow_anim: cowAnim,
        lancer_idle: lancerIdle, lancer_run: lancerRun, lancer_attack: lancerAttack,
        ts_pawn_idle: tsPawnIdle, ts_pawn_run: tsPawnRun,
        ts_archer_idle: tsArcherIdle, ts_archer_run: tsArcherRun,
        ts_monk_idle: tsMonkIdle, ts_monk_run: tsMonkRun
      },
      maps: { village: map, farm: mapFarm, forest: mapForest },
      masks: { village: buildLandMask(map), farm: buildLandMask(mapFarm), forest: buildLandMask(mapForest) },
      hud, avo: makeAvoSprite(), raw: { weapons },
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
        beds: keyImage(beds, 24),
        ts_castle: tsCastle,
        ts_house: tsHouse,
        ts_tower: tsTower,
        ts_monastery: tsMonastery,
        sprout_coop: sproutCoop,
        sprout_bridge: sproutBridge,
        sprout_chest: keyImage(sproutChest, 24),
        sprout_plants: keyImage(sproutPlants, 24)
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
      x.fillStyle = '#f6ecd4';
      x.fillRect(0, 0, 64, 64);
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
  const { getDecor, onCollect, onPlace, getPlacing, onDamage, onSwing, onBop, getBopped, onWater, getMap, getWeaponDamage, onDeath, onRespawn, onAbility, getLevel, getMods } = opts;

  const player = {
  x: WORLD_W / 2, y: WORLD_H - 260, dir: 1, moving: false,
  hp: 100, maxHp: 100, lastHurt: -99999, deathUntil: 0,
  stamina: 100, maxStamina: 100, lastStaminaUse: -99999,
  jumpUntil: 0, jumpStart: 0, dashUntil: 0, dashX: 0, dashY: 0,
  shieldUntil: 0, healReadyAt: 0
};
  const avo = { x: player.x - 46, y: player.y + 30, dir: 1, hopUntil: 0 };
  const keys = {};
  const coins = [];
  const gem = { x: 0, y: 0, ready: true, respawnAt: 0 };
  const enemies = [];
  const npcs = [];
  let camX = 0, camY = 0, raf = 0, ready = false, last = 0, t = 0, frames = 0;
  let activeMap = ((getMap ? getMap() : null) || {}).w || 'farm';
  let hover = null, assets = null, active = false;
  let attackUntil = 0, attackCd = 0, invulnUntil = 0, hurtUntil = 0, lastWorldLv = 1;

  function isLand(wx, wy) {
    if (!assets || !assets.masks) return true;
    const m = assets.masks[activeMap] || assets.masks.village;
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
    const msel = (getMap ? getMap() : null) || {};
    const dist = DISTRICTS.find(x => x.id === msel.d);
    const pref = (dist && dist.mobs) ? pool.filter(t => dist.mobs.includes(t.name)) : [];
    const type = (pref.length && Math.random() < 0.65)
      ? pref[Math.floor(Math.random() * pref.length)]
      : ((Math.random() < 0.45 && strong.length)
        ? strong[Math.floor(Math.random() * strong.length)]
        : (pool[Math.floor(Math.random() * pool.length)] || ENEMY_TYPES[0]));
    en.type = type;
    en.lv = clamp(lv + type.tier - 1, 1, 20);
    en.maxHp = type.hp + Math.floor((en.lv - 1) / 4);
    en.hp = en.maxHp;
    en.reward = type.reward + Math.floor((en.lv - 1) / 3);
    en.damage = type.damage + Math.floor((en.lv - 1) / 5);
    en.flashUntil = 0;
    en.alive = true;
    en.respawnAt = 0;
    const p = landPoint(440, player.x, player.y);
    en.x = p.x;
    en.y = p.y;
    en.vx = 0; en.vy = 0; en.timer = 0; en.frame = 0;
    en.home = { x: en.x, y: en.y };
    en.aggro = false;
    en.windupUntil = 0;
    en.nextAttack = 0;
    en.alertUntil = 0;
  }
  for (let i = 0; i < 5; i++) { const en = { frame: 0 }; initEnemy(en); enemies.push(en); }

  NPC_TYPES.forEach(type => {
    npcs.push({ type, x: WORLD_W / 2, y: WORLD_H / 2, vx: 0.02, vy: 0.01, timer: 2000 + Math.random() * 3000, phase: Math.random() * 6.28 });
  });

  function isTyping(e) {
    const tag = (e.target && e.target.tagName) || '';
    return tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || (e.target && e.target.isContentEditable);
  }

  function activate(name) {
    const lv = getLevel ? getLevel() : 99;
    if (name === 'jump' && lv >= 1 && t > player.jumpUntil && player.stamina >= 12) {
      player.jumpStart = t;
      player.jumpUntil = t + 460;
      player.stamina -= 12; player.lastStaminaUse = t;
      onAbility && onAbility('jump');
      return true;
    }
    if (name === 'dash' && lv >= 2 && t > player.dashUntil && player.stamina >= 18) {
      player.dashX = player.dir;
      player.dashY = keys.arrowup || keys.w ? -1 : (keys.arrowdown || keys.s ? 1 : 0);
      player.dashUntil = t + 220;
      player.stamina -= 18; player.lastStaminaUse = t;
      invulnUntil = Math.max(invulnUntil, t + 240);
      onAbility && onAbility('dash');
      return true;
    }
    if (name === 'shield' && lv >= 4 && t > player.shieldUntil && player.stamina >= 25) {
      player.shieldUntil = t + 1600 + (m.shieldMs || 0);
      player.stamina -= 25; player.lastStaminaUse = t;
      onAbility && onAbility('shield');
      return true;
    }
    if (name === 'heal' && lv >= 6 && t > player.healReadyAt && player.stamina >= 40 && player.hp < player.maxHp) {
      player.hp = Math.min(player.maxHp, player.hp + 35 + (m.heal || 0));
      player.healReadyAt = t + 9000;
      player.stamina -= 40; player.lastStaminaUse = t;
      onAbility && onAbility('heal');
      return true;
    }
    onAbility && onAbility('blocked');
    return false;
  }

  const M = () => (getMods ? getMods() : {}) || {};

  function attack() {
    if (t < attackCd) return;
    const m = M();
    attackCd = t + Math.max(180, 450 - (m.atkCd || 0));
    attackUntil = t + 260;
    onSwing && onSwing();
    let hit = false;
    for (const en of enemies) {
      if (!en.alive) continue;
      const d = Math.hypot(en.x - player.x, en.y - player.y);
      if (d < 95 + (m.reach || 0)) {
        hit = true;
        let dmg = (getWeaponDamage ? getWeaponDamage() : 1) + (m.dmg || 0);
        if (Math.random() < (m.crit || 0)) dmg *= 2;
        en.hp -= dmg;
        en.flashUntil = t + 170;
        const push = d || 1;
        en.x += ((en.x - player.x) / push) * 28;
        en.y += ((en.y - player.y) / push) * 28;
        if (en.hp <= 0) {
          en.alive = false;
          en.respawnAt = t + 6500;
          avo.hopUntil = t + 400;
          onCollect && onCollect(en.reward + (m.killScrap || 0));
          onBop && onBop();
        }
      }
    }
    if (hit) attackCd = t + 500;
  }

  function onKey(e, down) {
    if (isTyping(e)) return;
    const k = e.key.toLowerCase();
    if (['j', 'k', 'l', 'h'].includes(k)) {
      if (down && !e.repeat) activate({ j: 'jump', k: 'dash', l: 'shield', h: 'heal' }[k]);
      return;
    }
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

  function drawAnim(sheet, cellW, frames, fps, phase, x, y, h, dir) {
    const col = Math.floor(phase * fps) % frames;
    const sc = h / sheet.height;
    const dw = cellW * sc;
    ctx.save();
    ctx.translate(Math.round(x), Math.round(y));
    if (dir < 0) ctx.scale(-1, 1);
    ctx.drawImage(sheet, col * cellW, 0, cellW, sheet.height, -dw / 2, -h, dw, h);
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
    ctx.imageSmoothingEnabled = false;
    const A = assets.anim;
    if (t < player.deathUntil) {
      drawAnim(A.soldierDeath, 100, 6, 0.012, t, x, y + bob, 160, player.dir);
    } else if (t < attackUntil) {
      drawAnim(A.soldierAttack, 100, 6, 0.024, t, x, y + bob, 160, player.dir);
    } else if (t < hurtUntil) {
      drawAnim(A.soldierHurt, 100, 4, 0.018, t, x, y + bob, 160, player.dir);
    } else if (player.moving) {
      drawAnim(A.soldierWalk, 100, 8, 0.018, t, x, y + bob, 160, player.dir);
    } else {
      drawAnim(A.soldierIdle, 100, 6, 0.011, t, x, y + bob, 160, player.dir);
    }
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
    const dir = en.vx < 0 ? -1 : 1;
    ctx.imageSmoothingEnabled = false;
    if (en.type.anim) {
      const A = assets.anim, cfg = en.type.anim;
      if (t < en.attackUntil) drawAnim(A[cfg.attack], cfg.cell, cfg.frames, 0.02, t, x, y, en.type.h, dir);
      else if (en.frame === 1) drawAnim(A[cfg.walk], cfg.cell, cfg.walkFrames, 0.016, t, x, y, en.type.h, dir);
      else drawAnim(A[cfg.idle], cfg.cell, cfg.frames, 0.01, t, x, y, en.type.h, dir);
    } else {
      const rects = en.type.rects;
      const rect = rects[(Math.floor(t / 260) + en.frame) % rects.length];
      drawSprite(assets.sheets[en.type.sheet], rect, x, y, en.type.h, dir);
    }
    if (t < en.flashUntil) {
      ctx.fillStyle = 'rgba(255,255,255,0.45)';
      ctx.fillRect(x - en.type.h * 0.35, y - en.type.h, en.type.h * 0.7, en.type.h);
    }
    if (t < en.alertUntil) {
      ctx.fillStyle = '#ffe066';
      ctx.font = 'bold 14px monospace';
      ctx.textAlign = 'center';
      ctx.fillText('!', x, y - en.type.h - 26);
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
    const hop = npc.type.name === 'CHICKEN' ? Math.abs(Math.sin(t / 240 + npc.phase)) * -3 : 0;
    ctx.fillStyle = 'rgba(0,0,0,0.16)';
    ctx.beginPath(); ctx.ellipse(x, y - 1, 14, 4, 0, 0, 6.29); ctx.fill();
    ctx.imageSmoothingEnabled = false;
    const dir = npc.vx < 0 ? -1 : 1;
    if (npc.type.anim) {
      const cfg = npc.type.anim;
      const moving = Math.abs(npc.vx) + Math.abs(npc.vy) > 0.05;
      const sheet = moving && cfg.run ? assets.anim[cfg.run] : assets.anim[cfg.sheet];
      drawAnim(sheet, cfg.cellW, moving && cfg.run ? cfg.runFrames : cfg.frames, 0.014, t + npc.phase * 100, x, y + hop, npc.type.h, dir);
    } else {
      drawSprite(assets.sheets[npc.type.sheet], npc.type.rect, x, y + hop, npc.type.h, dir);
    }
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
      const homeDist = en.home ? Math.hypot(en.home.x - en.x, en.home.y - en.y) : 0;
      const aggroR = en.type.aggro || 190;
      const spd = (en.type.speed || 0.1) * dt;
      en.timer -= dt;

      if (dist < aggroR && homeDist < 520 && t > player.deathUntil) {
        if (!en.aggro) en.alertUntil = t + 700;
        en.aggro = true;
        if (dist > 44) {
          en.vx = (player.x - en.x) / (dist || 1) * spd;
          en.vy = (player.y - en.y) / (dist || 1) * spd;
          en.frame = 1;
        } else {
          en.vx = 0; en.vy = 0; en.frame = 0;
        }
        if (dist < 52 && t > en.nextAttack) {
          en.windupUntil = t + 320;
          en.attackUntil = t + 520;
          en.nextAttack = t + 1500;
        }
      } else if (homeDist > 40) {
        en.vx = (en.home.x - en.x) / (homeDist || 1) * spd * 0.7;
        en.vy = (en.home.y - en.y) / (homeDist || 1) * spd * 0.7;
        en.frame = 1;
        en.aggro = false;
      } else if (en.timer <= 0) {
        en.timer = 1600 + Math.random() * 2600;
        const a = Math.random() * 6.28;
        en.vx = Math.cos(a) * 0.04 * dt;
        en.vy = Math.sin(a) * 0.04 * dt;
        en.frame = 0;
        en.aggro = false;
      } else {
        en.frame = 0;
      }

      const ex = clamp(en.x + en.vx, 40, WORLD_W - 40);
      const ey = clamp(en.y + en.vy, 80, WORLD_H - 40);
      if (isLand(ex, en.y)) en.x = ex;
      if (isLand(en.x, ey)) en.y = ey;

      if (en.windupUntil && t >= en.windupUntil) {
        en.windupUntil = 0;
        const d2 = Math.hypot(en.x - player.x, en.y - player.y);
        if (d2 < 60 && t > invulnUntil && t > player.jumpUntil && t > player.shieldUntil) {
          invulnUntil = t + 1200;
          hurtUntil = t + 500;
          const raw = (en.damage || 2) * 8;
          player.hp = Math.max(0, player.hp - Math.round(raw * (1 - Math.min(0.6, m.armor || 0))));
          player.lastHurt = t;
          onDamage && onDamage(en.damage || 2);
          if (player.hp <= 0) {
            player.deathUntil = t + 1500;
            onDeath && onDeath();
          }
        }
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

  function setMap(did, cid, wid) {
    if (wid && assets && assets.maps && assets.maps[wid]) activeMap = wid;
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
    if (t > player.deathUntil) {
      if (t < player.dashUntil) {
        const bx = clamp(player.x + player.dashX * 0.55 * dt, 40, WORLD_W - 40);
        const by = clamp(player.y + player.dashY * 0.55 * dt, 74, WORLD_H - 44);
        if (isLand(bx, player.y)) player.x = bx;
        if (isLand(player.x, by)) player.y = by;
      } else {
        const nx = clamp(player.x + dx * sp, 40, WORLD_W - 40);
        const ny = clamp(player.y + dy * sp, 74, WORLD_H - 44);
        if (dx && isLand(nx, player.y)) player.x = nx;
        if (dy && isLand(player.x, ny)) player.y = ny;
      }
    }
    const mmFrame = M();
    player.maxHp = 100 + (mmFrame.maxHp || 0);
    player.maxStamina = 100 + (mmFrame.stamina || 0);
    if (player.hp > player.maxHp) player.hp = player.maxHp;
    if (t - player.lastStaminaUse > 1000 && player.stamina < player.maxStamina) {
      player.stamina = Math.min(player.maxStamina, player.stamina + 0.009 * dt * 2 * (1 + (mmFrame.regen || 0)));
    }
    if (player.deathUntil && t > player.deathUntil) {
      player.deathUntil = 0;
      player.hp = player.maxHp;
      player.lastHurt = t;
      const mm = (getMap ? getMap() : null) || {};
      setMap(mm.d || 'southgate', mm.c || 'day', activeMap);
      onRespawn && onRespawn();
    }
    if (t - player.lastHurt > 5000 && player.hp < player.maxHp && !player.deathUntil) {
      player.hp = Math.min(player.maxHp, player.hp + 0.012 * dt);
    }

    camX = clamp(player.x - VIEW_W / 2, 0, WORLD_W - VIEW_W);
    camY = clamp(player.y - VIEW_H * 0.58, 0, WORLD_H - VIEW_H);

    avo.x += (player.x - player.dir * 44 - avo.x) * 0.06 * dt / 16;
    avo.y += (player.y + 26 - avo.y) * 0.06 * dt / 16;
    avo.dir = player.dir;

    for (const c of coins) {
      if (Math.abs(c.x - player.x) < 30 && Math.abs(c.y - player.y) < 34) {
        avo.hopUntil = t + 350;
        onCollect && onCollect(1 + (M().coinValue || 0));
        spawnCoin(c);
      }
    }
    if (gem.ready && Math.abs(gem.x - player.x) < 34 && Math.abs(gem.y - player.y) < 40) {
      gem.ready = false;
      gem.respawnAt = t + Math.max(6000, 18000 - (M().gemTime || 0) * 1000);
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
      const img = assets.maps[activeMap] || assets.maps.village;
      const sm = WORLD_W / img.width;
      ctx.drawImage(img, camX / sm, camY / sm, VIEW_W / sm, VIEW_H / sm, 0, 0, VIEW_W, VIEW_H);
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

    if (t < player.shieldUntil) {
      ctx.strokeStyle = 'rgba(120,200,255,0.85)';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.arc(player.x - camX, player.y - camY - 34, 34, 0, 6.29);
      ctx.stroke();
    }
    if (player.hp < player.maxHp && t > player.deathUntil) {
      const bw = 38, bx = Math.round(player.x - camX - bw / 2), by = Math.round(player.y - camY - 140);
      ctx.fillStyle = '#3a1f14'; ctx.fillRect(bx - 1, by - 1, bw + 2, 6);
      ctx.fillStyle = '#c0392b'; ctx.fillRect(bx, by, bw, 4);
      ctx.fillStyle = '#7ec850'; ctx.fillRect(bx, by, bw * (player.hp / player.maxHp), 4);
    }

    if (ready) {
      const mini = assets.maps[activeMap] || assets.maps.village;
      const mw = 64, mh = Math.round(mw * mini.height / mini.width);
      const mx = 8, my = 8;
      ctx.globalAlpha = 0.92;
      ctx.fillStyle = 'rgba(20,16,8,0.75)';
      ctx.fillRect(mx - 2, my - 2, mw + 4, mh + 4);
      ctx.drawImage(mini, mx, my, mw, mh);
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
      const hbY = my + mh + 8;
      ctx.fillStyle = 'rgba(20,16,8,0.75)';
      ctx.fillRect(mx - 2, hbY - 2, mw + 4, 12);
      ctx.fillStyle = '#c0392b'; ctx.fillRect(mx, hbY, mw, 8);
      ctx.fillStyle = '#7ec850'; ctx.fillRect(mx, hbY, mw * (player.hp / player.maxHp), 8);
      ctx.fillStyle = '#fff6d8';
      ctx.font = 'bold 6px monospace';
      ctx.fillText(Math.ceil(player.hp) + '/' + player.maxHp, mx + 3, hbY + 6);
      const sbY = hbY + 12;
      ctx.fillStyle = 'rgba(20,16,8,0.75)';
      ctx.fillRect(mx - 2, sbY - 2, mw + 4, 9);
      ctx.fillStyle = '#8a6b2a'; ctx.fillRect(mx, sbY, mw, 5);
      ctx.fillStyle = '#ffe066'; ctx.fillRect(mx, sbY, mw * (player.stamina / player.maxStamina), 5);
      const lv = getLevel ? getLevel() : 1;
      const ab = [
        ['J', lv >= 1 && t > player.jumpUntil],
        ['K', lv >= 2 && t > player.dashUntil],
        ['L', lv >= 4 && t > player.shieldUntil],
        ['H', lv >= 6 && t > player.healReadyAt]
      ];
      ab.forEach(([k, ok], i) => {
        const bx2 = mx + i * 17, by2 = sbY + 10;
        ctx.fillStyle = ok ? 'rgba(126,200,80,0.9)' : 'rgba(90,70,40,0.9)';
        ctx.fillRect(bx2, by2, 14, 9);
        ctx.fillStyle = '#1a1208';
        ctx.font = 'bold 6px monospace';
        ctx.fillText(k, bx2 + 5, by2 + 7);
      });
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
    ctx.fillStyle = 'rgba(74,53,32,0.6)';
    ctx.fillRect(0, 0, VIEW_W, 4);
    ctx.fillRect(0, VIEW_H - 4, VIEW_W, 4);
    ctx.fillRect(0, 0, 4, VIEW_H);
    ctx.fillRect(VIEW_W - 4, 0, 4, VIEW_H);
    const edge = 46;
    const nearEdge = player.x < edge || player.x > WORLD_W - edge || player.y < edge + 40 || player.y > WORLD_H - edge;
    if (nearEdge) {
      ctx.fillStyle = 'rgba(255,224,102,0.10)';
      ctx.fillRect(0, 0, VIEW_W, VIEW_H);
    }

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
    getHp: () => ({ hp: player.hp, max: player.maxHp }),
    getWorldMap: () => activeMap,
    activate,
    getStamina: () => player.stamina,
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
