import crypto from 'node:crypto';

// Storage adapter interface: { async get(key) -> obj|null, async put(key, obj) }
// Keys: 'user:<name>', 'sess:<token>', 'state:<username>'

export const USERNAME_RE = /^[a-z0-9_]{3,20}$/;
export const SESSION_TTL_MS = 30 * 24 * 3600 * 1000;
export const FOCUS_GRACE_SECONDS = 10;
export const MAX_LEDGER = 800;
export const MAX_ACTIVITY = 1200;
export const MAX_FOCUS_SESSIONS = 200;

/* ---------- progress ---------- */
export function defaultProgression() {
  return { baseXpPerLevel: 50, focusXp: 30, scrapPerFocus: 10, scrapPerQuest: 5 };
}

export function xpForLevel(level, prog) {
  return (prog?.baseXpPerLevel ?? 50) * level;
}

export function applyXp(progress, amount, prog) {
  const p = { ...progress, totalXp: progress.totalXp + amount, currentLevelXp: progress.currentLevelXp + amount };
  const levels = [];
  while (p.currentLevelXp >= xpForLevel(p.level, prog)) {
    p.currentLevelXp -= xpForLevel(p.level, prog);
    p.level += 1;
    levels.push(p.level);
  }
  return { progress: p, levels };
}

/* ---------- state ---------- */
export function defaultState(username) {
  return {
    username,
    tasks: [],
    stats: { completed: 0, streak: 0, lastDoneDate: null, focusSessions: 0, scrap: 0 },
    progress: { level: 1, currentLevelXp: 0, totalXp: 0 },
    settings: {
      soundOn: true,
      volume: 80,
      durations: { work: 25, break: 5, long: 15 },
      longBreakInterval: 4,
      clockAlarm: { time: '18:00', enabled: false },
      theme: 'meadow',
      progression: defaultProgression()
    },
    world: { unlocked: ['garden'], placed: {} },
    inventory: {},
    achievements: {},
    focusSessions: [],
    ledger: [],
    activity: [],
    updatedAt: Date.now()
  };
}

export function sanitizeClientState(input) {
  const s = input || {};
  const out = {};
  if (Array.isArray(s.tasks)) {
    out.tasks = s.tasks.map(t => ({
      id: String(t.id).slice(0, 64),
      text: String(t.text || '').slice(0, 140),
      description: String(t.description || '').slice(0, 500),
      category: String(t.category || 'general').slice(0, 24),
      priority: ['low', 'normal', 'high'].includes(t.priority) ? t.priority : 'normal',
      dueAt: t.dueAt ? String(t.dueAt).slice(0, 32) : null,
      estimatedMinutes: Math.max(0, Math.min(600, Number(t.estimatedMinutes) || 0)),
      recurrence: ['none', 'daily', 'weekly', 'custom'].includes(t.recurrence) ? t.recurrence : 'none',
      recurrenceDays: Array.isArray(t.recurrenceDays) ? t.recurrenceDays.filter(d => Number.isInteger(d) && d >= 0 && d <= 6).slice(0, 7) : [],
      xp: Math.max(1, Math.min(200, Number(t.xp) || 20)),
      done: !!t.done,
      createdAt: Number(t.createdAt) || Date.now(),
      completedAt: t.completedAt ? Number(t.completedAt) : null
    })).slice(0, 500);
  }
  if (s.settings && typeof s.settings === 'object') {
    out.settings = { ...s.settings };
    delete out.settings.progression; // server-owned
  }
  if (s.world && typeof s.world === 'object') out.world = s.world;
  if (s.inventory && typeof s.inventory === 'object') out.inventory = s.inventory;
  if (s.cosmetics && typeof s.cosmetics === 'object') out.cosmetics = s.cosmetics;
  return out;
}

export function mergeState(base, clientPatch) {
  const next = { ...base, ...clientPatch, updatedAt: Date.now() };
  return next;
}

/* ---------- activity + ledger ---------- */
export function pushActivity(state, type, data = {}) {
  state.activity = state.activity || [];
  state.activity.push({ id: crypto.randomUUID(), type, at: Date.now(), ...data });
  if (state.activity.length > MAX_ACTIVITY) state.activity = state.activity.slice(-MAX_ACTIVITY);
}

function ledgerHas(state, eventId) {
  return (state.ledger || []).some(e => e.eventId === eventId);
}

export function grantReward(state, { eventId, eventType, xp, scrap = 0, meta = {} }) {
  if (!eventId || ledgerHas(state, eventId)) {
    return { granted: false, duplicate: true, progress: state.progress };
  }
  const prog = state.settings?.progression || defaultProgression();
  const { progress, levels } = applyXp(state.progress, Math.max(0, Math.floor(xp)), prog);
  state.progress = progress;
  if (scrap) state.stats.scrap = (state.stats.scrap || 0) + scrap;
  state.ledger = state.ledger || [];
  state.ledger.push({ eventId, eventType, xpAwarded: xp, scrap, at: Date.now(), ...meta });
  if (state.ledger.length > MAX_LEDGER) state.ledger = state.ledger.slice(-MAX_LEDGER);
  return { granted: true, duplicate: false, progress, levels };
}

/* ---------- quests ---------- */
export function completeQuest(state, { eventId, questId }) {
  const task = (state.tasks || []).find(t => t.id === questId);
  if (!task) return { ok: false, error: 'quest_not_found' };
  if (task.done) {
    if (ledgerHas(state, eventId)) return { ok: true, duplicate: true, progress: state.progress };
    const rewardedBefore = (state.ledger || []).some(e => e.questId === questId);
    if (rewardedBefore) return { ok: false, error: 'already_done' };
    // Already marked done client-side but never rewarded: grant once, guarded by the ledger.
    const progDone = state.settings?.progression || defaultProgression();
    const replay = grantReward(state, { eventId, eventType: 'quest', xp: task.xp || 20, scrap: progDone.scrapPerQuest, meta: { questId } });
    if (replay.granted) pushActivity(state, 'quest_completed', { questId, text: task.text, category: task.category, xp: task.xp });
    return { ok: true, duplicate: false, ...replay, task };
  }
  task.done = true;
  task.completedAt = Date.now();
  state.stats.completed = (state.stats.completed || 0) + 1;
  const today = new Date().toDateString();
  const yest = new Date(Date.now() - 864e5).toDateString();
  state.stats.streak = state.stats.lastDoneDate === today
    ? state.stats.streak
    : (state.stats.lastDoneDate === yest ? (state.stats.streak || 0) + 1 : 1);
  state.stats.lastDoneDate = today;
  const prog = state.settings?.progression || defaultProgression();
  const res = grantReward(state, { eventId, eventType: 'quest', xp: task.xp, scrap: prog.scrapPerQuest, meta: { questId } });
  if (res.granted) pushActivity(state, 'quest_completed', { questId, text: task.text, category: task.category, xp: task.xp });
  return { ok: true, duplicate: false, ...res, task };
}

export function reopenQuest(state, questId) {
  const task = (state.tasks || []).find(t => t.id === questId);
  if (!task || !task.done) return false;
  task.done = false;
  task.completedAt = null;
  return true;
}

/* ---------- focus ---------- */
export function startFocus(state, { plannedSeconds, questId = null }) {
  const planned = Math.max(60, Math.min(4 * 3600, Math.floor(plannedSeconds)));
  const session = {
    id: crypto.randomUUID(),
    questId,
    startedAt: Date.now(),
    plannedSeconds: planned,
    status: 'running'
  };
  state.focusSessions = state.focusSessions || [];
  state.focusSessions.push(session);
  if (state.focusSessions.length > MAX_FOCUS_SESSIONS) state.focusSessions = state.focusSessions.slice(-MAX_FOCUS_SESSIONS);
  return session;
}

export function completeFocus(state, { eventId, sessionId }) {
  const s = (state.focusSessions || []).find(x => x.id === sessionId);
  if (!s) return { ok: false, error: 'session_not_found' };
  if (s.status === 'completed') {
    return ledgerHas(state, eventId)
      ? { ok: true, duplicate: true, progress: state.progress }
      : { ok: false, error: 'already_completed' };
  }
  const elapsed = Math.floor((Date.now() - s.startedAt) / 1000);
  if (elapsed < s.plannedSeconds - FOCUS_GRACE_SECONDS) {
    s.status = 'abandoned';
    pushActivity(state, 'focus_abandoned', { sessionId, elapsedSeconds: elapsed });
    return { ok: false, error: 'not_elapsed', elapsed };
  }
  s.status = 'completed';
  s.endedAt = Date.now();
  s.verifiedDurationSeconds = elapsed;
  state.stats.focusSessions = (state.stats.focusSessions || 0) + 1;
  const prog = state.settings?.progression || defaultProgression();
  const res = grantReward(state, { eventId, eventType: 'focus', xp: prog.focusXp, scrap: prog.scrapPerFocus, meta: { sessionId } });
  if (res.granted) pushActivity(state, 'focus_completed', { sessionId, seconds: elapsed, questId: s.questId });
  return { ok: true, duplicate: false, ...res, session: s };
}

/* ---------- analytics ---------- */
export function analytics(state, { from, to }) {
  const fromMs = from ?? 0;
  const toMs = to ?? Date.now();
  const inRange = a => a.at >= fromMs && a.at <= toMs;
  const acts = (state.activity || []).filter(inRange);
  const quests = acts.filter(a => a.type === 'quest_completed');
  const focus = acts.filter(a => a.type === 'focus_completed');
  const byDay = {};
  const byCategory = {};
  const xpByDay = {};
  for (const a of acts) {
    const day = new Date(a.at).toISOString().slice(0, 10);
    byDay[day] = byDay[day] || { quests: 0, focus: 0 };
    if (a.type === 'quest_completed') {
      byDay[day].quests++;
      const cat = a.category || 'general';
      byCategory[cat] = (byCategory[cat] || 0) + 1;
    }
    if (a.type === 'focus_completed') byDay[day].focus++;
    if (a.type === 'quest_completed' || a.type === 'focus_completed') {
      xpByDay[day] = (xpByDay[day] || 0) + (a.xp || 0);
    }
  }
  const totalTasks = (state.tasks || []).length;
  const doneTasks = (state.tasks || []).filter(t => t.done).length;
  return {
    from: fromMs, to: toMs,
    questsCompleted: quests.length,
    focusSessions: focus.length,
    focusMinutes: Math.round(focus.reduce((s, a) => s + (a.seconds || 0) / 60, 0)),
    xpEarned: Object.values(xpByDay).reduce((s, n) => s + n, 0),
    completionRate: totalTasks ? Math.round((doneTasks / totalTasks) * 100) : 0,
    byDay, byCategory, xpByDay,
    activeDays: Object.keys(byDay).length
  };
}

/* ---------- auth ---------- */
export function hashPassword(password, salt) {
  return crypto.scryptSync(password, salt, 32).toString('hex');
}

export async function signup(store, { username, password, displayName }) {
  username = String(username || '').toLowerCase().trim();
  if (!USERNAME_RE.test(username)) return { error: 'invalid_username' };
  if (typeof password !== 'string' || password.length < 8) return { error: 'weak_password' };
  if (await store.get(`user:${username}`)) return { error: 'username_taken' };
  const salt = crypto.randomBytes(16).toString('hex');
  const user = {
    username,
    displayName: String(displayName || username).slice(0, 24),
    salt,
    passHash: hashPassword(password, salt),
    createdAt: Date.now(),
    timezone: null,
    privacy: { leaderboard: true }
  };
  await store.put(`user:${username}`, user);
  await store.put(`state:${username}`, defaultState(username));
  return { user: publicUser(user) };
}

export function publicUser(u) {
  return { username: u.username, displayName: u.displayName, createdAt: u.createdAt, privacy: u.privacy, timezone: u.timezone };
}

export async function login(store, { username, password }) {
  username = String(username || '').toLowerCase().trim();
  const user = await store.get(`user:${username}`);
  if (!user) return { error: 'bad_credentials' };
  const hash = hashPassword(String(password || ''), user.salt);
  const ok = hash.length === user.passHash.length &&
    crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(user.passHash));
  if (!ok) return { error: 'bad_credentials' };
  const token = crypto.randomBytes(32).toString('hex');
  await store.put(`sess:${token}`, { username, createdAt: Date.now(), expiresAt: Date.now() + SESSION_TTL_MS });
  return { token, user: publicUser(user) };
}

export async function authUser(store, token) {
  if (!token) return null;
  const sess = await store.get(`sess:${token}`);
  if (!sess || sess.expiresAt < Date.now()) return null;
  const user = await store.get(`user:${sess.username}`);
  return user || null;
}

export async function logout(store, token) {
  if (token) await store.put(`sess:${token}`, { expired: true, expiresAt: 0 });
}

export async function updateProfile(store, user, patch) {
  if (typeof patch.displayName === 'string' && patch.displayName.trim()) {
    user.displayName = patch.displayName.trim().slice(0, 24);
  }
  if (patch.privacy && typeof patch.privacy === 'object') {
    user.privacy = { ...user.privacy, leaderboard: patch.privacy.leaderboard !== false };
  }
  if (typeof patch.timezone === 'string') user.timezone = patch.timezone.slice(0, 48) || null;
  await store.put(`user:${user.username}`, user);
  return publicUser(user);
}

/* ---------- leaderboard ---------- */
export async function leaderboard(store, { period = 'week' }) {
  const since = period === 'all' ? 0 : Date.now() - 7 * 864e5;
  const names = await store.listPrefix('state:');
  const entries = [];
  for (const key of names) {
    const state = await store.get(key);
    if (!state) continue;
    const user = await store.get(`user:${state.username}`);
    if (!user || !user.privacy?.leaderboard) continue;
    const xp = (state.ledger || []).filter(e => e.at >= since).reduce((s, e) => s + (e.xpAwarded || 0), 0);
    entries.push({ username: user.username, displayName: user.displayName, xp, level: state.progress?.level || 1 });
  }
  entries.sort((a, b) => b.xp - a.xp || a.username.localeCompare(b.username));
  return entries.slice(0, 100);
}

/* ---------- AI quest generator (Groq, server-side only) ---------- */
const QUEST_CATEGORIES = ['general', 'work', 'health', 'learning', 'chores', 'fun'];
const QUEST_PRIORITIES = ['low', 'normal', 'high'];

function fallbackQuests(goal, count) {
  const g = String(goal || 'get things done').slice(0, 60).toLowerCase();
  const templates = [
    { text: 'Plan the next step for ' + g, category: 'general', priority: 'high', minutes: 15 },
    { text: 'Spend 25 focused minutes on ' + g, category: 'work', priority: 'normal', minutes: 25 },
    { text: 'Clear one small blocker for ' + g, category: 'work', priority: 'normal', minutes: 20 },
    { text: 'Review progress on ' + g, category: 'general', priority: 'low', minutes: 10 },
    { text: 'Tidy your workspace before ' + g, category: 'chores', priority: 'low', minutes: 10 },
    { text: 'Write three notes about ' + g, category: 'learning', priority: 'normal', minutes: 15 },
    { text: 'Take a short walk to recharge', category: 'health', priority: 'low', minutes: 15 },
    { text: 'Celebrate one win from ' + g, category: 'fun', priority: 'low', minutes: 5 }
  ];
  return templates.slice(0, Math.max(1, Math.min(8, count || 5)));
}

export async function generateQuests({ goal, count } = {}) {
  const n = Math.max(1, Math.min(8, Number(count) || 5));
  const key = process.env.GROQ_API_KEY;
  if (!key) return { source: 'fallback', quests: fallbackQuests(goal, n) };
  try {
    const r = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: { Authorization: 'Bearer ' + key, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: process.env.GROQ_MODEL || 'openai/gpt-oss-20b',
        temperature: 0.7,
        max_tokens: 500,
        response_format: { type: 'json_object' },
        messages: [
          { role: 'system', content: 'You create short cozy productivity quests. Reply ONLY as JSON: {"quests":[{"text":"...","category":"general|work|health|learning|chores|fun","priority":"low|normal|high","minutes":10-120}]}. Text max 70 characters, no emojis.' },
          { role: 'user', content: 'Goal: ' + String(goal || 'a productive day').slice(0, 120) + '. Give exactly ' + n + ' quests.' }
        ]
      })
    });
    if (!r.ok) { const t = await r.text(); throw new Error('groq_' + r.status + ':' + t.slice(0, 140)); }
    const j = await r.json();
    const parsed = JSON.parse(j.choices[0].message.content);
    const list = Array.isArray(parsed.quests) ? parsed.quests : [];
    const quests = list.slice(0, n).map(q => ({
      text: String(q.text || '').slice(0, 90).trim(),
      category: QUEST_CATEGORIES.includes(q.category) ? q.category : 'general',
      priority: QUEST_PRIORITIES.includes(q.priority) ? q.priority : 'normal',
      minutes: Math.max(5, Math.min(120, Number(q.minutes) || 25))
    })).filter(q => q.text);
    if (!quests.length) throw new Error('empty');
    return { source: 'groq', quests };
  } catch (err) {
    return { source: 'fallback', quests: fallbackQuests(goal, n), error: String(err && err.message || err) };
  }
}
