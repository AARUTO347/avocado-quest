import { getStore } from '@netlify/blobs';
import * as core from '../../server/core.mjs';

const store = {
  async get(key) {
    try { return await getStore('avoquest').get(key, { type: 'json' }); } catch { return null; }
  },
  async put(key, value) {
    await getStore('avoquest').setJSON(key, value);
  },
  async listPrefix(prefix) {
    const store = getStore('avoquest');
    const out = [];
    let cursor = null;
    for (let page = 0; page < 50; page++) {
      const res = await store.list({ prefix, ...(cursor ? { cursor } : {}) });
      const blobs = (res && res.blobs) || [];
      for (const b of blobs) out.push(b.key);
      const p = res && res.pagination;
      const next = typeof p === 'string' ? p : (p && p.next) || null;
      if (!next || !blobs.length) break;
      cursor = next;
    }
    return out;
  }
};

function parseCookies(req) {
  const out = {};
  const raw = req.headers.get('cookie') || '';
  for (const part of raw.split(';')) {
    const i = part.indexOf('=');
    if (i > 0) out[part.slice(0, i).trim()] = decodeURIComponent(part.slice(i + 1).trim());
  }
  return out;
}

const SESSION_COOKIE = 'aq_session';

function sessionCookieHeader(token, maxAgeSeconds) {
  return `${SESSION_COOKIE}=${token}; HttpOnly; Path=/; SameSite=Lax; Max-Age=${maxAgeSeconds}`;
}

function json(body, status = 200, headers = {}) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers }
  });
}

async function requireUser(req) {
  return core.authUser(store, parseCookies(req)[SESSION_COOKIE]);
}

async function loadUserState(user) {
  let state = await store.get(`state:${user.username}`);
  if (!state) {
    state = core.defaultState(user.username);
    await store.put(`state:${user.username}`, state);
  }
  return state;
}

export default async (req) => {
  const url = new URL(req.url);
  const path = url.pathname.replace(/\/+$/, '') || '/';
  const body = req.method === 'POST' || req.method === 'PUT' || req.method === 'PATCH'
    ? await req.json().catch(() => ({}))
    : {};

  /* ----- auth ----- */
  if (path === '/api/v2/auth/signup' && req.method === 'POST') {
    const r = await core.signup(store, body);
    if (r.error) return json({ error: r.error }, 400);
    const l = await core.login(store, body);
    return json({ user: r.user }, 200, { 'Set-Cookie': sessionCookieHeader(l.token, core.SESSION_TTL_MS / 1000) });
  }
  if (path === '/api/v2/auth/login' && req.method === 'POST') {
    const r = await core.login(store, body);
    if (r.error) return json({ error: r.error }, 401);
    return json({ user: r.user }, 200, { 'Set-Cookie': sessionCookieHeader(r.token, core.SESSION_TTL_MS / 1000) });
  }
  if (path === '/api/v2/auth/logout' && req.method === 'POST') {
    await core.logout(store, parseCookies(req)[SESSION_COOKIE]);
    return json({ ok: true }, 200, { 'Set-Cookie': sessionCookieHeader('', 0) });
  }
  if (path === '/api/v2/auth/me' && req.method === 'GET') {
    const user = await requireUser(req);
    if (!user) return json({ error: 'unauthenticated' }, 401);
    return json({ user: core.publicUser(user) });
  }
  if (path === '/api/v2/profile' && req.method === 'PATCH') {
    const user = await requireUser(req);
    if (!user) return json({ error: 'unauthenticated' }, 401);
    return json({ user: await core.updateProfile(store, user, body) });
  }

  /* ----- AI ----- */
  if (path === '/api/v2/ai/quests' && req.method === 'POST') {
    return json(await core.generateQuests(body));
  }

  /* ----- state ----- */
  if (path === '/api/v2/state' && req.method === 'GET') {
    const user = await requireUser(req);
    if (!user) return json({ error: 'unauthenticated' }, 401);
    return json(await loadUserState(user));
  }
  if (path === '/api/v2/state' && req.method === 'PUT') {
    const user = await requireUser(req);
    if (!user) return json({ error: 'unauthenticated' }, 401);
    const state = await loadUserState(user);
    await store.put(`state:${user.username}`, core.mergeState(state, core.sanitizeClientState(body)));
    return json({ ok: true });
  }

  /* ----- trusted rewards ----- */
  if (path === '/api/v2/reward/quest' && req.method === 'POST') {
    const user = await requireUser(req);
    if (!user) return json({ error: 'unauthenticated' }, 401);
    if (!body.questId || !body.eventId) return json({ error: 'missing_fields' }, 400);
    const state = await loadUserState(user);
    const r = core.completeQuest(state, { eventId: body.eventId, questId: body.questId });
    if (!r.ok) return json({ error: r.error }, 409);
    await store.put(`state:${user.username}`, state);
    return json({ duplicate: !!r.duplicate, progress: state.progress, stats: state.stats, task: r.task, levels: r.levels || [] });
  }
  if (path === '/api/v2/quest/reopen' && req.method === 'POST') {
    const user = await requireUser(req);
    if (!user) return json({ error: 'unauthenticated' }, 401);
    const state = await loadUserState(user);
    if (!core.reopenQuest(state, body.questId)) return json({ error: 'not_done' }, 409);
    await store.put(`state:${user.username}`, state);
    return json({ ok: true });
  }

  /* ----- focus ----- */
  if (path === '/api/v2/focus/start' && req.method === 'POST') {
    const user = await requireUser(req);
    if (!user) return json({ error: 'unauthenticated' }, 401);
    const state = await loadUserState(user);
    const session = core.startFocus(state, body);
    await store.put(`state:${user.username}`, state);
    return json({ session });
  }
  if (path === '/api/v2/focus/complete' && req.method === 'POST') {
    const user = await requireUser(req);
    if (!user) return json({ error: 'unauthenticated' }, 401);
    if (!body.sessionId || !body.eventId) return json({ error: 'missing_fields' }, 400);
    const state = await loadUserState(user);
    const r = core.completeFocus(state, { sessionId: body.sessionId, eventId: body.eventId });
    if (!r.ok && !r.duplicate) return json({ error: r.error, elapsed: r.elapsed }, 409);
    if (r.ok && !r.duplicate) await store.put(`state:${user.username}`, state);
    return json({ duplicate: !!r.duplicate, progress: state.progress, stats: state.stats, session: r.session, levels: r.levels || [] });
  }

  /* ----- analytics / leaderboard / achievements ----- */
  if (path === '/api/v2/analytics' && req.method === 'GET') {
    const user = await requireUser(req);
    if (!user) return json({ error: 'unauthenticated' }, 401);
    const state = await loadUserState(user);
    return json(core.analytics(state, {
      from: url.searchParams.get('from') ? Number(url.searchParams.get('from')) : undefined,
      to: url.searchParams.get('to') ? Number(url.searchParams.get('to')) : undefined
    }));
  }
  if (path === '/api/v2/leaderboard' && req.method === 'GET') {
    const entries = await core.leaderboard(store, { period: url.searchParams.get('period') === 'all' ? 'all' : 'week' });
    return json({ entries });
  }
  if (path === '/api/v2/achievements' && req.method === 'GET') {
    const user = await requireUser(req);
    if (!user) return json({ error: 'unauthenticated' }, 401);
    const state = await loadUserState(user);
    return json({ achievements: state.achievements || {} });
  }

  return json({ error: 'not_found' }, 404);
};

export const config = { path: '/api/v2/*' };
