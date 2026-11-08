export const ACHIEVEMENTS = [
  { id: 'first_sprout', name: 'FIRST SPROUT', icon: '🌱', desc: 'Complete your first mission', test: s => s.stats.completed >= 1 },
  { id: 'ten_quests', name: 'TEN TASKS', icon: '🌿', desc: 'Complete 10 missions', test: s => s.stats.completed >= 10 },
  { id: 'fifty_quests', name: 'FIFTY TASKS', icon: '🌳', desc: 'Complete 50 missions', test: s => s.stats.completed >= 50 },
  { id: 'hundred_quests', name: 'CENTURION', icon: '🏆', desc: 'Complete 100 missions', test: s => s.stats.completed >= 100 },
  { id: 'streak_3', name: 'WARMING UP', icon: '🔥', desc: 'Reach a 3-day streak', test: s => s.stats.streak >= 3 },
  { id: 'streak_7', name: 'WEEK WARRIOR', icon: '⚡', desc: 'Reach a 7-day streak', test: s => s.stats.streak >= 7 },
  { id: 'streak_30', name: 'MONTH MASTER', icon: '👑', desc: 'Reach a 30-day streak', test: s => s.stats.streak >= 30 },
  { id: 'level_5', name: 'GROWING UP', icon: '🌼', desc: 'Reach level 5', test: s => s.stats.level >= 5 },
  { id: 'level_10', name: 'GOLDEN KING', icon: '🥑', desc: 'Reach level 10', test: s => s.stats.level >= 10 },
  { id: 'level_20', name: 'AVO LEGEND', icon: '✨', desc: 'Reach level 20', test: s => s.stats.level >= 20 },
  { id: 'focus_1', name: 'FIRST SPIN', icon: '💿', desc: 'Finish your first focus session', test: s => s.stats.focusSessions >= 1 },
  { id: 'focus_10', name: 'IN THE GROOVE', icon: '🎵', desc: 'Finish 10 focus sessions', test: s => s.stats.focusSessions >= 10 },
  { id: 'focus_50', name: 'DEEP WORK', icon: '🎧', desc: 'Finish 50 focus sessions', test: s => s.stats.focusSessions >= 50 },
  { id: 'bop_1', name: 'FIRST BOP', icon: '👊', desc: 'Defeat your first beast', test: s => (s.world.bopped || 0) >= 1 },
  { id: 'bop_10', name: 'BEAST WRANGLER', icon: '🐗', desc: 'Defeat 10 beasts', test: s => (s.world.bopped || 0) >= 10 },
  { id: 'bop_50', name: 'SLAYER', icon: '🗡️', desc: 'Defeat 50 beasts', test: s => (s.world.bopped || 0) >= 50 },
  { id: 'decor_5', name: 'DECORATOR', icon: '🪴', desc: 'Place 5 decorations', test: s => (s.world.decor || []).length >= 5 },
  { id: 'decor_20', name: 'VILLAGE BUILDER', icon: '🏡', desc: 'Place 20 decorations', test: s => (s.world.decor || []).length >= 20 },
  { id: 'armed', name: 'ARMED', icon: '⚔️', desc: 'Equip a weapon', test: s => !!s.world.weapon },
  { id: 'traveler_5', name: 'EXPLORER', icon: '🗺️', desc: 'Visit 5 different maps', test: s => (s.world.visited || []).length >= 5 },
  { id: 'traveler_20', name: 'WANDERER', icon: '🧭', desc: 'Visit 20 different maps', test: s => (s.world.visited || []).length >= 20 }
];

export function checkAchievements(state) {
  const unlocked = new Set(state.stats.unlocked || []);
  const fresh = ACHIEVEMENTS.filter(a => !unlocked.has(a.id) && a.test(state));
  return fresh.map(a => a.id);
}

export function todayKey(d = new Date()) {
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
}

export function bumpHistory(history, patch) {
  const h = { ...(history || {}) };
  const key = todayKey();
  const day = { q: 0, xp: 0, f: 0, m: 0, ...(h[key] || {}) };
  h[key] = {
    q: day.q + (patch.q || 0),
    xp: day.xp + (patch.xp || 0),
    f: day.f + (patch.f || 0),
    m: day.m + (patch.m || 0)
  };
  const keys = Object.keys(h).sort();
  while (keys.length > 120) delete h[keys.shift()];
  return h;
}

export function lastDays(history, n = 14) {
  const out = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date(Date.now() - i * 864e5);
    const key = todayKey(d);
    out.push({ key, label: key.slice(5).replace('-', '/'), ...(history && history[key] || { q: 0, xp: 0, f: 0, m: 0 }) });
  }
  return out;
}
