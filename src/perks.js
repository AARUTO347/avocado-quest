// Perk tree: 3 branches x 8 tiers. Every perk changes real gameplay via mods.
export const BRANCHES = [
  { id: 'combat', name: 'COMBAT', icon: '⚔️' },
  { id: 'survival', name: 'SURVIVAL', icon: '🛡️' },
  { id: 'fortune', name: 'FORTUNE', icon: '🍀' }
];

export const PERKS = [
  // COMBAT
  { id: 'c1', branch: 'combat', tier: 1, name: 'SHARP BLADE', lvl: 1, desc: '+1 attack damage', eff: { dmg: 1 } },
  { id: 'c2', branch: 'combat', tier: 2, name: 'LONG REACH', lvl: 1, desc: '+18 px attack reach', eff: { reach: 18 } },
  { id: 'c3', branch: 'combat', tier: 3, name: 'QUICK SWING', lvl: 2, req: 'c1', desc: '-80 ms attack cooldown', eff: { atkCd: 80 } },
  { id: 'c4', branch: 'combat', tier: 4, name: 'CRITICAL', lvl: 3, req: 'c2', desc: '10% chance for double damage', eff: { crit: 0.1 } },
  { id: 'c5', branch: 'combat', tier: 5, name: 'BRUTAL', lvl: 4, req: 'c1', desc: '+1 more attack damage', eff: { dmg: 1 } },
  { id: 'c6', branch: 'combat', tier: 6, name: 'HUNTER', lvl: 5, req: 'c4', desc: '+1 scrap per beast', eff: { killScrap: 1 } },
  { id: 'c7', branch: 'combat', tier: 7, name: 'EXECUTIONER', lvl: 6, req: 'c4', desc: '+15% critical chance', eff: { crit: 0.15 } },
  { id: 'c8', branch: 'combat', tier: 8, name: 'MASTER', lvl: 8, req: 'c5', desc: '+2 attack damage', eff: { dmg: 2 } },
  // SURVIVAL
  { id: 's1', branch: 'survival', tier: 1, name: 'TOUGH', lvl: 1, desc: '+20 max HP', eff: { maxHp: 20 } },
  { id: 's2', branch: 'survival', tier: 2, name: 'ENDURANCE', lvl: 1, desc: '+25 max stamina', eff: { stamina: 25 } },
  { id: 's3', branch: 'survival', tier: 3, name: 'FAST REGEN', lvl: 2, req: 's1', desc: '60% faster HP regen', eff: { regen: 0.6 } },
  { id: 's4', branch: 'survival', tier: 4, name: 'ARMOR', lvl: 3, req: 's1', desc: 'Takes 15% less damage', eff: { armor: 0.15 } },
  { id: 's5', branch: 'survival', tier: 5, name: 'LONG SHIELD', lvl: 4, req: 's2', desc: '+0.8 s shield duration', eff: { shieldMs: 800 } },
  { id: 's6', branch: 'survival', tier: 6, name: 'BIG HEAL', lvl: 5, req: 's2', desc: 'Heal restores +20 HP', eff: { heal: 20 } },
  { id: 's7', branch: 'survival', tier: 7, name: 'FORTRESS', lvl: 6, req: 's4', desc: 'Another 15% less damage', eff: { armor: 0.15 } },
  { id: 's8', branch: 'survival', tier: 8, name: 'JUGGERNAUT', lvl: 8, req: 's4', desc: '+40 max HP', eff: { maxHp: 40 } },
  // FORTUNE
  { id: 'f1', branch: 'fortune', tier: 1, name: 'GREED', lvl: 1, desc: 'Coins are worth +1 scrap', eff: { coinValue: 1 } },
  { id: 'f2', branch: 'fortune', tier: 2, name: 'GEM HUNTER', lvl: 1, desc: 'Gems respawn 4 s faster', eff: { gemTime: 4 } },
  { id: 'f3', branch: 'fortune', tier: 3, name: 'SCAVENGER', lvl: 2, req: 'f1', desc: '+1 scrap per beast', eff: { killScrap: 1 } },
  { id: 'f4', branch: 'fortune', tier: 4, name: 'BARGAIN', lvl: 3, req: 'f1', desc: 'Decor is 10% cheaper', eff: { decorDiscount: 0.1 } },
  { id: 'f5', branch: 'fortune', tier: 5, name: 'MAGNET', lvl: 4, req: 'f1', desc: 'Coins worth +1 more scrap', eff: { coinValue: 1 } },
  { id: 'f6', branch: 'fortune', tier: 6, name: 'LUCKY', lvl: 5, req: 'f3', desc: '+2 more scrap per beast', eff: { killScrap: 2 } },
  { id: 'f7', branch: 'fortune', tier: 7, name: 'TREASURE', lvl: 6, req: 'f2', desc: 'Gems respawn 6 s faster', eff: { gemTime: 6 } },
  { id: 'f8', branch: 'fortune', tier: 8, name: 'TYCOON', lvl: 8, req: 'f4', desc: 'Decor is another 20% cheaper', eff: { decorDiscount: 0.2 } }
];

export const PERK_BY_ID = Object.fromEntries(PERKS.map(p => [p.id, p]));

export function totalPoints(state) {
  const lv = Math.max(1, state.stats.level || 1);
  const bopped = state.world.bopped || 0;
  return Math.max(0, lv - 1) + Math.floor(bopped / 10);
}

export function perkState(state) {
  const owned = new Set(state.world.perks || []);
  const total = totalPoints(state);
  const spent = owned.size;
  return { owned, total, spent, available: total - spent };
}

export function canBuy(perk, state) {
  const { owned, available } = perkState(state);
  if (owned.has(perk.id)) return { ok: false, reason: 'owned' };
  if (state.stats.level < perk.lvl) return { ok: false, reason: 'level' };
  if (perk.req && !owned.has(perk.req)) return { ok: false, reason: 'req' };
  if (available < 1) return { ok: false, reason: 'points' };
  return { ok: true };
}

export const BASE_MODS = {
  dmg: 0, reach: 0, atkCd: 0, crit: 0,
  maxHp: 0, stamina: 0, regen: 0, armor: 0, shieldMs: 0, heal: 0,
  coinValue: 0, gemTime: 0, killScrap: 0, decorDiscount: 0
};

export function computeMods(perkIds) {
  const m = { ...BASE_MODS };
  for (const id of perkIds || []) {
    const p = PERK_BY_ID[id];
    if (!p) continue;
    for (const [k, v] of Object.entries(p.eff)) m[k] += v;
  }
  return m;
}
