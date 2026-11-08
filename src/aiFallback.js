const CATS = ['general', 'work', 'health', 'learning', 'chores', 'fun'];
const PRI = ['low', 'normal', 'high'];

export function localQuests(goal, count = 5) {
  const g = String(goal || 'get things done').trim().slice(0, 60) || 'get things done';
  const base = [
    { text: 'Plan the next step for ' + g, category: 'general', priority: 'high', minutes: 15 },
    { text: 'Spend 25 focused minutes on ' + g, category: 'work', priority: 'normal', minutes: 25 },
    { text: 'Clear one small blocker for ' + g, category: 'work', priority: 'normal', minutes: 20 },
    { text: 'Review progress on ' + g, category: 'general', priority: 'low', minutes: 10 },
    { text: 'Tidy your space before ' + g, category: 'chores', priority: 'low', minutes: 10 },
    { text: 'Write three notes about ' + g, category: 'learning', priority: 'normal', minutes: 15 },
    { text: 'Take a short walk to recharge', category: 'health', priority: 'low', minutes: 15 },
    { text: 'Celebrate one win from ' + g, category: 'fun', priority: 'low', minutes: 5 }
  ];
  return base.slice(0, Math.max(1, Math.min(8, count))).map(q => ({
    ...q,
    category: CATS.includes(q.category) ? q.category : 'general',
    priority: PRI.includes(q.priority) ? q.priority : 'normal'
  }));
}
