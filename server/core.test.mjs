import test from 'node:test';
import assert from 'node:assert/strict';
import * as core from './core.mjs';

test('applyXp levels up and carries leftover xp', () => {
  const prog = core.defaultProgression();
  const start = { level: 1, currentLevelXp: 40, totalXp: 40 };
  const { progress, levels } = core.applyXp(start, 30, prog);
  assert.equal(progress.level, 2);
  assert.equal(progress.currentLevelXp, 20);
  assert.equal(progress.totalXp, 70);
  assert.deepEqual(levels, [2]);
});

test('sanitizeClientState clamps task fields', () => {
  const out = core.sanitizeClientState({
    tasks: [{ id: 'q1', text: 'x'.repeat(500), xp: 999, priority: 'nope', category: 'work', recurrence: 'daily' }]
  });
  assert.equal(out.tasks.length, 1);
  assert.equal(out.tasks[0].text.length, 140);
  assert.equal(out.tasks[0].xp, 200);
  assert.equal(out.tasks[0].priority, 'normal');
  assert.equal(out.tasks[0].recurrence, 'daily');
  assert.equal(out.settings, undefined);
});

test('grantReward is idempotent per eventId', () => {
  const state = core.defaultState('qa');
  const first = core.grantReward(state, { eventId: 'ev1', eventType: 'quest', xp: 20, scrap: 5 });
  const second = core.grantReward(state, { eventId: 'ev1', eventType: 'quest', xp: 20, scrap: 5 });
  assert.equal(first.granted, true);
  assert.equal(second.duplicate, true);
  assert.equal(state.progress.totalXp, 20);
  assert.equal(state.stats.scrap, 5);
  assert.equal(state.ledger.length, 1);
});

test('completeQuest rejects missing and double-rewarded quests', () => {
  const state = core.defaultState('qa');
  assert.equal(core.completeQuest(state, { eventId: 'e1', questId: 'missing' }).error, 'quest_not_found');
  state.tasks.push({ id: 'q1', text: 'QA', done: false, xp: 20 });
  const ok = core.completeQuest(state, { eventId: 'e2', questId: 'q1' });
  assert.equal(ok.ok, true);
  const again = core.completeQuest(state, { eventId: 'e3', questId: 'q1' });
  assert.equal(again.error, 'already_done');
  assert.equal(state.ledger.length, 1);
});

test('done-but-unrewarded quests (client sync) grant exactly once', () => {
  const state = core.defaultState('qa');
  state.tasks.push({ id: 'q2', text: 'SYNCED', done: true, xp: 20 });
  const first = core.completeQuest(state, { eventId: 's1', questId: 'q2' });
  assert.equal(first.ok, true);
  assert.equal(first.duplicate, false);
  assert.equal(state.ledger.length, 1);
  const second = core.completeQuest(state, { eventId: 's2', questId: 'q2' });
  assert.equal(second.error, 'already_done');
  assert.equal(state.ledger.length, 1);
});

test('hashPassword is deterministic per salt', () => {
  const a = core.hashPassword('secret123', 'salt');
  const b = core.hashPassword('secret123', 'salt');
  const c = core.hashPassword('secret123', 'other');
  assert.equal(a, b);
  assert.notEqual(a, c);
});

test('generateQuests falls back without GROQ_API_KEY', async () => {
  const old = process.env.GROQ_API_KEY;
  delete process.env.GROQ_API_KEY;
  const r = await core.generateQuests({ goal: 'ship a website', count: 3 });
  assert.equal(r.source, 'fallback');
  assert.equal(r.quests.length, 3);
  assert.ok(r.quests.every(q => q.text && q.category && q.priority));
  if (old) process.env.GROQ_API_KEY = old;
});
