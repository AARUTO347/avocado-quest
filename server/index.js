import express from 'express';
import fsEnv from 'node:fs';
import pathEnv from 'node:path';

// Minimal .env loader: keeps server secrets out of source and git.
try {
  const envPath = pathEnv.join(process.cwd(), '.env');
  if (fsEnv.existsSync(envPath)) {
    for (const line of fsEnv.readFileSync(envPath, 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^['"]|['"]$/g, '');
    }
  }
} catch {}
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as core from './core.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const DATA = path.join(__dirname, 'data.json');   // legacy guest state (untouched semantics)
const DB = path.join(__dirname, 'db.json');       // accounts + sessions + per-user state

/* ---------- legacy guest state (preserved as-is) ---------- */
const DEFAULT_STATE = {
  tasks: [],
  stats: {
    xp: 0, level: 1, scrap: 0, completed: 0,
    streak: 0, lastDoneDate: null, focusSessions: 0
  },
  soundOn: true,
  durations: { work: 25, break: 5, long: 15 },
  volume: 80,
  clockAlarm: { time: '18:00', enabled: false },
  theme: 'meadow',
  world: { decor: [], bopped: 0, perks: [], weapon: null, map: { d: 'southgate', c: 'day' } }
};

function readState() {
  try {
    const raw = JSON.parse(fs.readFileSync(DATA, 'utf8'));
    return {
      ...DEFAULT_STATE, ...raw,
      stats: { ...DEFAULT_STATE.stats, ...(raw.stats || {}) },
      durations: { ...DEFAULT_STATE.durations, ...(raw.durations || {}) },
      clockAlarm: { ...DEFAULT_STATE.clockAlarm, ...(raw.clockAlarm || {}) }
    };
  } catch {
    return structuredClone(DEFAULT_STATE);
  }
}
function writeState(state) {
  fs.writeFileSync(DATA, JSON.stringify(state, null, 2));
}

/* ---------- file store for accounts (db.json) ---------- */
function fileStore() {
  const readAll = () => {
    try { return JSON.parse(fs.readFileSync(DB, 'utf8')); } catch { return {}; }
  };
  return {
    async get(key) { return readAll()[key] ?? null; },
    async put(key, value) {
      const all = readAll();
      if (value === null) delete all[key]; else all[key] = value;
      fs.writeFileSync(DB, JSON.stringify(all));
    },
    async listPrefix(prefix) {
      return Object.keys(readAll()).filter(k => k.startsWith(prefix));
    }
  };
}

const store = fileStore();

function parseCookies(req) {
  const out = {};
  for (const part of (req.headers.cookie || '').split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

const SESSION_COOKIE = 'aq_session';
function setSession(res, token) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${core.SESSION_TTL_MS / 1000}`);
}
function clearSession(res) {
  res.setHeader('Set-Cookie', `${SESSION_COOKIE}=; HttpOnly; Path=/; SameSite=Lax; Max-Age=0`);
}

async function requireUser(req, res) {
  const user = await core.authUser(store, parseCookies(req)[SESSION_COOKIE]);
  if (!user) { res.status(401).json({ error: 'unauthenticated' }); return null; }
  return user;
}

async function loadUserState(user) {
  let state = await store.get(`state:${user.username}`);
  if (!state) { state = core.defaultState(user.username); await store.put(`state:${user.username}`, state); }
  return state;
}

const app = express();
app.use(express.json({ limit: '1mb' }));

/* ---------- legacy guest endpoints (unchanged) ---------- */
app.get('/api/state', (_req, res) => res.json(readState()));
app.put('/api/state', (req, res) => {
  const body = req.body || {};
  const next = {
    tasks: Array.isArray(body.tasks) ? body.tasks : [],
    stats: { ...DEFAULT_STATE.stats, ...(body.stats || {}) },
    soundOn: body.soundOn !== false,
    durations: { ...DEFAULT_STATE.durations, ...(body.durations || {}) },
    volume: typeof body.volume === 'number' ? body.volume : DEFAULT_STATE.volume,
    clockAlarm: { ...DEFAULT_STATE.clockAlarm, ...(body.clockAlarm || {}) },
    theme: typeof body.theme === 'string' ? body.theme.slice(0, 20) : DEFAULT_STATE.theme,
    world: body.world && typeof body.world === 'object'
      ? {
        decor: Array.isArray(body.world.decor) ? body.world.decor.slice(0, 80) : [],
        bopped: Math.max(0, Math.min(99999, Number(body.world.bopped) || 0)),
        perks: Array.isArray(body.world.perks) ? body.world.perks.filter(x => typeof x === 'string').slice(0, 40) : [],
        weapon: typeof body.world.weapon === 'string' ? body.world.weapon.slice(0, 40) : null,
        map: {
          d: typeof (body.world.map && body.world.map.d) === 'string' ? body.world.map.d.slice(0, 24) : 'southgate',
          c: typeof (body.world.map && body.world.map.c) === 'string' ? body.world.map.c.slice(0, 24) : 'day',
          w: typeof (body.world.map && body.world.map.w) === 'string' ? body.world.map.w.slice(0, 16) : 'farm'
        }
      }
      : DEFAULT_STATE.world
  };
  writeState(next);
  res.json({ ok: true });
});

/* ---------- v2: AI ---------- */
app.post('/api/v2/ai/quests', async (req, res) => {
  try { res.json(await core.generateQuests(req.body || {})); }
  catch { res.status(500).json({ error: 'ai_failed' }); }
});


/* ---------- v2: auth ---------- */
app.post('/api/v2/auth/signup', async (req, res) => {
  const r = await core.signup(store, req.body || {});
  if (r.error) return res.status(400).json({ error: r.error });
  const l = await core.login(store, req.body || {});
  setSession(res, l.token);
  res.json({ user: r.user });
});

app.post('/api/v2/auth/login', async (req, res) => {
  const r = await core.login(store, req.body || {});
  if (r.error) return res.status(401).json({ error: r.error });
  setSession(res, r.token);
  res.json({ user: r.user });
});

app.post('/api/v2/auth/logout', async (req, res) => {
  await core.logout(store, parseCookies(req)[SESSION_COOKIE]);
  clearSession(res);
  res.json({ ok: true });
});

app.get('/api/v2/auth/me', async (req, res) => {
  const user = await core.authUser(store, parseCookies(req)[SESSION_COOKIE]);
  if (!user) return res.status(401).json({ error: 'unauthenticated' });
  res.json({ user: core.publicUser(user) });
});

app.patch('/api/v2/profile', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  const updated = await core.updateProfile(store, user, req.body || {});
  res.json({ user: updated });
});

/* ---------- v2: state ---------- */
app.get('/api/v2/state', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  res.json(await loadUserState(user));
});

app.put('/api/v2/state', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  const state = await loadUserState(user);
  const patch = core.sanitizeClientState(req.body || {});
  await store.put(`state:${user.username}`, core.mergeState(state, patch));
  res.json({ ok: true });
});

/* ---------- v2: trusted rewards ---------- */
app.post('/api/v2/reward/quest', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  const { questId, eventId } = req.body || {};
  if (!questId || !eventId) return res.status(400).json({ error: 'missing_fields' });
  const state = await loadUserState(user);
  const r = core.completeQuest(state, { eventId, questId });
  if (!r.ok) return res.status(409).json({ error: r.error });
  await store.put(`state:${user.username}`, state);
  res.json({ duplicate: !!r.duplicate, progress: state.progress, stats: state.stats, task: r.task, levels: r.levels || [] });
});

app.post('/api/v2/quest/reopen', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  const { questId } = req.body || {};
  const state = await loadUserState(user);
  if (!core.reopenQuest(state, questId)) return res.status(409).json({ error: 'not_done' });
  await store.put(`state:${user.username}`, state);
  res.json({ ok: true });
});

/* ---------- v2: focus ---------- */
app.post('/api/v2/focus/start', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  const state = await loadUserState(user);
  const session = core.startFocus(state, req.body || {});
  await store.put(`state:${user.username}`, state);
  res.json({ session });
});

app.post('/api/v2/focus/complete', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  const { sessionId, eventId } = req.body || {};
  if (!sessionId || !eventId) return res.status(400).json({ error: 'missing_fields' });
  const state = await loadUserState(user);
  const r = core.completeFocus(state, { sessionId, eventId });
  if (!r.ok && !r.duplicate) return res.status(409).json({ error: r.error, elapsed: r.elapsed });
  if (r.ok && !r.duplicate) await store.put(`state:${user.username}`, state);
  res.json({ duplicate: !!r.duplicate, progress: state.progress, stats: state.stats, session: r.session, levels: r.levels || [] });
});

/* ---------- v2: analytics + leaderboard ---------- */
app.get('/api/v2/analytics', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  const state = await loadUserState(user);
  const from = req.query.from ? Number(req.query.from) : undefined;
  const to = req.query.to ? Number(req.query.to) : undefined;
  res.json(core.analytics(state, { from, to }));
});

app.get('/api/v2/leaderboard', async (req, res) => {
  const entries = await core.leaderboard(store, { period: req.query.period === 'all' ? 'all' : 'week' });
  res.json({ entries });
});

app.get('/api/v2/achievements', async (req, res) => {
  const user = await requireUser(req, res);
  if (!user) return;
  const state = await loadUserState(user);
  res.json({ achievements: state.achievements || {} });
});

/* ---------- static ---------- */
app.use(express.static(DIST));
app.get('*', (_req, res) => res.sendFile(path.join(DIST, 'index.html')));

const PORT = process.env.PORT || 4173;
app.listen(PORT, () => console.log(`avocado-quest server on http://localhost:${PORT}`));
