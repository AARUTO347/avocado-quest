const KEY = 'avocado-quest-v3';

export const DEFAULT_STATE = {
  tasks: [],
  stats: {
    xp: 0, level: 1, scrap: 0, completed: 0,
    streak: 0, lastDoneDate: null, focusSessions: 0, history: {}, unlocked: []
  },
  soundOn: true,
  durations: { work: 25, break: 5, long: 15 },
  volume: 80,
  clockAlarm: { time: '18:00', enabled: false },
  theme: 'meadow',
  world: { decor: [], bopped: 0, weapon: null, map: { d: 'southgate', c: 'day' } }
};

export async function loadState() {
  try {
    const r = await fetch('/api/state');
    if (r.ok) {
      const j = await r.json();
      return { ...structuredClone(DEFAULT_STATE), ...j, stats: { ...DEFAULT_STATE.stats, ...(j.stats || {}) }, remote: true };
    }
  } catch { /* static hosting: fall back */ }
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...structuredClone(DEFAULT_STATE), ...JSON.parse(raw), remote: false };
  } catch { /* ignore */ }
  return { ...structuredClone(DEFAULT_STATE), remote: false };
}

let saveTimer = null;
export function saveState(state) {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    const { remote, ...data } = state;
    if (remote) {
      fetch('/api/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      }).catch(() => localStorage.setItem(KEY, JSON.stringify(data)));
    } else {
      localStorage.setItem(KEY, JSON.stringify(data));
    }
  }, 300);
}
