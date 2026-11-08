import { useEffect, useRef, useState } from 'react';
import { createScene } from './scene.js';
import { stageFor, STAGES } from './sprites.js';
import { SFX, Lofi, setSoundEnabled, setVolume, unlockAudio } from './audio.js';
import { loadState, saveState } from './store.js';
import { ACHIEVEMENTS, checkAchievements, bumpHistory, lastDays } from './progression.js';
import { BRANCHES, PERKS, PERK_BY_ID, perkState, canBuy, computeMods } from './perks.js';
import { THEMES, themeById } from './themes.js';
import {
  createWorld, DECOR, ENEMY_TYPES, decorThumbnails, enemyThumbnails,
  WEAPON_BASES, WEAPON_TIERS, WEAPONS, DISTRICTS, CONDITIONS, WORLD_MAPS, weaponThumbnails
} from './world.js';
import typewriterUrl from './assets/typewriter.png';
import recordUrl from './assets/record.png';
import logoUrl from './assets/logo.png';

const VAR_KEYS = ['--grass', '--cream', '--wood', '--wood-dark', '--ink', '--leaf', '--blush', '--gold'];

const fmt = s => String(Math.floor(s / 60)).padStart(2, '0') + ':' + String(s % 60).padStart(2, '0');
const clampMin = (m, lo, hi) => Math.max(lo, Math.min(hi, m));

const CATEGORIES = ['general', 'work', 'health', 'learning', 'chores', 'fun'];
const PRIORITIES = ['low', 'normal', 'high'];
const PRI_W = { high: 0, normal: 1, low: 2 };
const RECURRENCES = ['none', 'daily', 'weekly'];
const BLANK_DRAFT = { text: '', category: 'general', priority: 'normal', dueAt: '', recurrence: 'none', description: '' };
const normWorld = w => ({
  decor: Array.isArray(w && w.decor) ? w.decor.slice(0, 80) : [],
  visited: Array.isArray(w && w.visited) ? w.visited.slice(-60) : [],
  bopped: Number(w && w.bopped) || 0,
  weapon: typeof (w && w.weapon) === 'string' ? w.weapon : null,
  perks: Array.isArray(w && w.perks) ? w.perks.slice(0, 40) : [],
  map: { d: (w && w.map && w.map.d) || 'southgate', c: (w && w.map && w.map.c) || 'day', w: (w && w.map && w.map.w) || 'farm' }
});
const normTask = t => ({
  description: '', category: 'general', priority: 'normal', dueAt: null,
  recurrence: 'none', estimatedMinutes: 0, createdAt: Date.now(), completedAt: null,
  ...t, id: t.id, text: String(t.text || ''), xp: t.xp || 20, done: !!t.done, rewarded: !!t.rewarded
});
const localDate = () => {
  const d = new Date();
  return d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0');
};

function PerkDiagram({ branch, stats, world, onBuy }) {
  const list = PERKS.filter(p => p.branch === branch.id);
  const rowH = 62, nodeW = 140, nodeH = 42, top = 14;
  const W = 236, H = top + list.length * rowH;
  const pos = {};
  list.forEach((p, i) => {
    pos[p.id] = { x: i % 2 ? 158 : 78, y: top + 22 + i * rowH };
  });
  const st = perkState({ stats, world });
  return (
    <div className={'perk-branch ' + branch.id}>
      <h3>{branch.icon} {branch.name}</h3>
      <svg viewBox={'0 0 ' + W + ' ' + H} className="perk-svg" role="group" aria-label={branch.name + ' perks'}>
        {list.map(p => p.req && pos[p.req] && (
          <line key={'e' + p.id} x1={pos[p.req].x} y1={pos[p.req].y} x2={pos[p.id].x} y2={pos[p.id].y}
            className={'perk-edge' + (st.owned.has(p.req) ? ' lit' : '')} />
        ))}
        {list.map(p => {
          const owned = st.owned.has(p.id);
          const chk = canBuy(p, { stats, world });
          const tag = owned ? 'OWNED' : chk.ok ? '1 PT' : chk.reason === 'level' ? 'LV ' + p.lvl : chk.reason === 'req' ? 'LOCKED' : 'NO PTS';
          const cls = 'perk-node' + (owned ? ' owned' : chk.ok ? ' ready' : ' locked');
          return (
            <g key={p.id} className={cls} onClick={() => onBuy(p)} tabIndex="0" role="button" aria-label={p.name + ' — ' + p.desc}>
              <rect x={pos[p.id].x - nodeW / 2} y={pos[p.id].y - nodeH / 2} width={nodeW} height={nodeH} rx="5" />
              <text x={pos[p.id].x} y={pos[p.id].y - 6} textAnchor="middle" className="perk-svg-name">{p.name}</text>
              <text x={pos[p.id].x} y={pos[p.id].y + 4} textAnchor="middle" className="perk-svg-desc">{p.desc}</text>
              <text x={pos[p.id].x} y={pos[p.id].y + 14} textAnchor="middle" className="perk-svg-tag">{tag}</text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

export default function App() {
  const [ready, setReady] = useState(false);
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ xp: 0, level: 1, scrap: 0, completed: 0, streak: 0, lastDoneDate: null, focusSessions: 0, history: {}, unlocked: [] });
  const [soundOn, setSoundOn] = useState(true);
  const [remote, setRemote] = useState(false);
  const [timer, setTimer] = useState({ mode: 'idle', left: 25 * 60, running: false, finished: false, endAt: null });
  const [stale, setStale] = useState(false);
  const [aiOpen, setAiOpen] = useState(false);
  const [aiGoal, setAiGoal] = useState('');
  const [aiQuests, setAiQuests] = useState([]);
  const [aiLoading, setAiLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState('login');
  const [authForm, setAuthForm] = useState({ username: '', password: '', displayName: '' });
  const [authError, setAuthError] = useState('');
  const [board, setBoard] = useState([]);
  const tabId = useRef(Math.random().toString(36).slice(2));
  const channelRef = useRef(null);
  const modsRef = useRef({});
  const [durations, setDurations] = useState({ work: 25, break: 5, long: 15 });
  const [volume, setVolumeState] = useState(80);
  const [clockAlarm, setClockAlarm] = useState({ time: '18:00', enabled: false });
  const [theme, setTheme] = useState('meadow');
  const [speech, setSpeech] = useState('');
  const [banner, setBanner] = useState(null);
  const [flash, setFlash] = useState(0);
  const [taskView, setTaskView] = useState('active');
  const [filterCat, setFilterCat] = useState('all');
  const [filterPri, setFilterPri] = useState('all');
  const [editingId, setEditingId] = useState(null);
  const [draft, setDraft] = useState(BLANK_DRAFT);
  const [world, setWorld] = useState(normWorld());
  const [placing, setPlacing] = useState(null);
  const [worldThumbs, setWorldThumbs] = useState({});
  const [enemyThumbs, setEnemyThumbs] = useState({});
  const [weaponThumbs, setWeaponThumbs] = useState({});
  const [armoryBase, setArmoryBase] = useState('sword');

  const canvasRef = useRef(null);
  const inputRef = useRef(null);
  const sceneRef = useRef(null);
  const worldCanvasRef = useRef(null);
  const worldRef = useRef(null);
  const worldDataRef = useRef({ decor: [] });
  const placingRef = useRef(null);
  const scrapRef = useRef(0);
  const moodRef = useRef({ happyUntil: 0, hopUntil: 0 });
  const typeTimer = useRef(null);
  const lastAlarmMin = useRef('');
  const statsRef = useRef({ focusSessions: 0 });
  const sceneState = useRef({ working: false, hop: false, timerText: fmt(25 * 60) });

  const mods = computeMods(world.perks);
  modsRef.current = mods;
  statsRef.current = stats;
  scrapRef.current = stats.scrap;
  worldDataRef.current = world;
  placingRef.current = placing;
  sceneState.current.working = timer.running && timer.mode === 'work';
  sceneState.current.hop = performance.now() < moodRef.current.hopUntil;
  sceneState.current.timerText = timer.mode === 'idle' ? fmt(durations.work * 60) : fmt(timer.left);
  const pendingSorted = tasks.filter(t => !t.done).sort((a, b) =>
    (PRI_W[a.priority] - PRI_W[b.priority]) ||
    String(a.dueAt || '9999').localeCompare(String(b.dueAt || '9999')) ||
    a.createdAt - b.createdAt);
  sceneState.current.missions = pendingSorted.slice(0, 3).map(t => t.text);
  sceneState.current.speech = speech;
  sceneState.current.bg = themeById(theme).bg;

  useEffect(() => {
    const t = themeById(theme);
    if (t.vars) for (const [k, v] of Object.entries(t.vars)) document.body.style.setProperty(k, v);
    else for (const k of VAR_KEYS) document.body.style.removeProperty(k);
  }, [theme]);

  function say(text) {
    clearInterval(typeTimer.current);
    let i = 0;
    setSpeech('');
    typeTimer.current = setInterval(() => {
      i++;
      setSpeech(text.slice(0, i));
      if (text[i - 1] && text[i - 1] !== ' ') SFX.key();
      if (i >= text.length) clearInterval(typeTimer.current);
    }, 28);
  }

  function bumpStats(s, xp) {
    const ns = { ...s, xp: s.xp + xp };
    const prevStage = stageFor(s.level);
    while (ns.xp >= ns.level * 50) { ns.xp -= ns.level * 50; ns.level += 1; }
    if (stageFor(ns.level) !== prevStage) {
      SFX.evolve();
      setBanner({ text: 'EVOLVED INTO ' + stageFor(ns.level).name + '!' });
      setFlash(f => f + 1);
      setTimeout(() => setBanner(null), 3500);
      sceneRef.current && sceneRef.current.burst(['#ffd75e', '#f7b6c8', '#7ec850', '#fff8e7'], 40);
    } else if (ns.level !== s.level) {
      SFX.levelup();
      setBanner({ text: 'LEVEL ' + ns.level + ' REACHED!' });
      setFlash(f => f + 1);
      setTimeout(() => setBanner(null), 2000);
    } else {
      SFX.xp();
    }
    return ns;
  }

  useEffect(() => {
    loadState().then(st => {
      setTasks(st.tasks.map(normTask)); setStats({ ...st.stats, history: st.stats.history || {}, unlocked: st.stats.unlocked || [] }); setSoundOn(st.soundOn); setRemote(!!st.remote);
      if (st.durations) setDurations(d => ({ ...d, ...st.durations }));
      if (typeof st.volume === 'number') { setVolumeState(st.volume); setVolume(st.volume / 100); }
      if (st.clockAlarm) setClockAlarm(c => ({ ...c, ...st.clockAlarm }));
      if (st.theme) setTheme(st.theme);
      if (st.world) setWorld(normWorld(st.world));
      setSoundEnabled(st.soundOn);
      setReady(true);
      sceneRef.current = createScene(canvasRef.current, () => sceneState.current);
      say('HELLO COMMANDER! I AM AVO! PLANT A MISSION AND LETS GROW!');
    });
    return () => sceneRef.current && sceneRef.current.destroy();
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveState({ tasks, stats, soundOn, remote, durations, volume, clockAlarm, theme, world });
  }, [tasks, stats, soundOn, ready, durations, volume, clockAlarm, theme, world]);

  useEffect(() => {
    fetch('/api/v2/auth/me').then(r => r.ok ? r.json() : null).then(j => { if (j && j.user) setUser(j.user); }).catch(() => {});
    fetch('/api/v2/leaderboard').then(r => r.ok ? r.json() : null).then(j => { if (j && j.entries) setBoard(j.entries); }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!user || !ready) return;
    const id = setTimeout(() => {
      fetch('/api/v2/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, world })
      }).catch(() => {});
    }, 800);
    return () => clearTimeout(id);
  }, [tasks, world, user, ready]);

  useEffect(() => {
    if (typeof BroadcastChannel === 'undefined') return;
    const ch = new BroadcastChannel('avoquest-sync');
    ch.onmessage = e => { if (e.data && e.data.tab !== tabId.current) setStale(true); };
    channelRef.current = ch;
    return () => ch.close();
  }, []);

  useEffect(() => {
    if (!ready || !channelRef.current) return;
    channelRef.current.postMessage({ tab: tabId.current, ts: Date.now() });
  }, [tasks, stats, world, theme, soundOn, durations, volume, clockAlarm, ready]);

  useEffect(() => {
    if (!ready) return;
    const fresh = checkAchievements({ stats, world });
    if (!fresh.length) return;
    setStats(s => ({ ...s, unlocked: Array.from(new Set([...(s.unlocked || []), ...fresh])) }));
    const first = ACHIEVEMENTS.find(x => x.id === fresh[0]);
    if (first) {
      setBanner({ text: 'ACHIEVEMENT: ' + first.name });
      setTimeout(() => setBanner(null), 2600);
      SFX.levelup();
      say('ACHIEVEMENT UNLOCKED! ' + first.name + '!');
      sceneRef.current && sceneRef.current.burst(['#ffe066', '#fff8e7', '#7ec850'], 24);
    }
  }, [stats, world, ready]);

  const pickTheme = id => {
    if (id === theme) return;
    SFX.click();
    setTheme(id);
    say(themeById(id).name + ' THEME EQUIPPED! LOOKING FRESH!');
  };

  const collectScrap = n => {
    setStats(s => ({ ...s, scrap: s.scrap + (n || 1) }));
    SFX.coin();
  };

  const hurtScrap = (dmg = 2) => {
    setStats(s => ({ ...s, scrap: Math.max(0, s.scrap - dmg) }));
    SFX.hurt();
    say('OUCH! A VILLAGE BEAST STOLE ' + dmg + ' SCRAP! BOP IT BACK!');
  };

  const placeDecor = (id, x, y) => {
    const item = DECOR.find(d => d.id === id);
    if (!item) return;
    const cost = Math.max(1, Math.round(item.cost * (1 - (modsRef.current.decorDiscount || 0))));
    if (statsRef.current.scrap < cost) {
      SFX.error();
      say('NOT ENOUGH SCRAP FOR ' + item.name + ' (' + cost + ')... COLLECT MORE COINS IN THE VILLAGE!');
      return;
    }
    setStats(s => ({ ...s, scrap: s.scrap - cost }));
    setWorld(w => ({ ...w, decor: [...w.decor, { id, x, y }].slice(-80) }));
    SFX.add();
    say(item.name + ' PLACED! THE VILLAGE IS GROWING!');
  };

  const buyWeapon = w => {
    if (world.weapon === w.id) return;
    if (statsRef.current.scrap < w.cost) { SFX.error(); say('NOT ENOUGH SCRAP FOR ' + w.name + ' (' + w.cost + ')'); return; }
    setStats(s => ({ ...s, scrap: s.scrap - w.cost }));
    setWorld(x => ({ ...x, weapon: w.id }));
    SFX.done();
    say(w.name + ' EQUIPPED! ATTACK POWER +' + w.dmg + '!');
  };

  const buyPerk = p => {
    const chk = canBuy(p, { stats, world });
    if (!chk.ok) {
      SFX.error();
      say(chk.reason === 'level' ? 'NEED LEVEL ' + p.lvl + ' FOR ' + p.name + '.'
        : chk.reason === 'req' ? 'UNLOCK ' + ((PERK_BY_ID[p.req] || {}).name || '') + ' FIRST.'
        : chk.reason === 'points' ? 'NO PERK POINTS YET. LEVEL UP OR BOP BEASTS!'
        : p.name + ' ALREADY OWNED.');
      return;
    }
    setWorld(w => ({ ...w, perks: [...(w.perks || []), p.id] }));
    SFX.levelup();
    say(p.name + ' UNLOCKED! ' + p.desc + '.');
  };

  const pickMap = (d, c, w) => {
    setWorld(x => ({ ...x, map: { d, c, w }, visited: Array.from(new Set([...(x.visited || []), d + '-' + c])).slice(-60) }));
    if (worldRef.current) worldRef.current.setMap(d, c, w);
    SFX.click();
    const dn = (DISTRICTS.find(x => x.id === d) || {}).name;
    const cn = (CONDITIONS.find(x => x.id === c) || {}).name;
    const wn = (WORLD_MAPS.find(x => x.id === w) || {}).name;
    say('TRAVELING TO ' + dn + ' IN ' + wn + ' AT ' + cn + '.');
  };

  const togglePlacing = id => {
    SFX.click();
    const next = placing === id ? null : id;
    setPlacing(next);
    if (next) say('CLICK THE VILLAGE MAP TO PLACE ' + (DECOR.find(d => d.id === id) || {}).name + '.');
    else say('PLACEMENT CANCELED.');
  };

  useEffect(() => {
    decorThumbnails().then(setWorldThumbs).catch(() => {});
    enemyThumbnails().then(setEnemyThumbs).catch(() => {});
    weaponThumbnails().then(setWeaponThumbs).catch(() => {});
    if (worldCanvasRef.current) {
      worldRef.current = createWorld(worldCanvasRef.current, {
        getDecor: () => worldDataRef.current.decor,
        getPlacing: () => placingRef.current,
        onCollect: collectScrap,
        onPlace: placeDecor,
        onDamage: hurtScrap,
        onSwing: () => SFX.swing(),
        getLevel: () => statsRef.current.level,
        getMods: () => modsRef.current,
        onAbility: name => {
          if (name === 'jump') SFX.hop();
          else if (name === 'dash') SFX.click();
          else if (name === 'shield') SFX.xp();
          else if (name === 'heal') SFX.done();
          else SFX.error();
        },
        onDeath: () => { setStats(s => ({ ...s, scrap: Math.max(0, s.scrap - 10) })); SFX.hurt(); say('AVO FAINTED! YOU LOST 10 SCRAP... WALK IT OFF AND TRY AGAIN.'); },
        onRespawn: () => { SFX.boot(); say('BACK ON YOUR FEET! FULL HEALTH AND READY.'); },
        onBop: () => setWorld(w => ({ ...w, bopped: (w.bopped || 0) + 1 })),
        getBopped: () => worldDataRef.current.bopped || 0,
        getMap: () => worldDataRef.current.map || { d: 'southgate', c: 'day' },
        getWeaponDamage: () => { const w = WEAPONS.find(x => x.id === worldDataRef.current.weapon); return w ? w.dmg : 1; },
        onWater: () => { SFX.error(); say('NO BUILDING ON WATER! PICK SOLID GROUND.'); }
      });
    }
    const m = worldDataRef.current.map;
    if (m) setTimeout(() => worldRef.current && worldRef.current.setMap(m.d, m.c, m.w), 60);
    return () => { worldRef.current && worldRef.current.destroy(); worldRef.current = null; };
  }, []);

  useEffect(() => {
    if (!timer.running && timer.mode === 'idle') {
      setTimer(t => (t.left !== durations.work * 60 ? { ...t, left: durations.work * 60 } : t));
    }
  }, [durations.work, timer.running, timer.mode]);

  useEffect(() => {
    const id = setInterval(() => {
      if (!clockAlarm.enabled) return;
      const n = new Date();
      const hm = String(n.getHours()).padStart(2, '0') + ':' + String(n.getMinutes()).padStart(2, '0');
      if (hm === clockAlarm.time && lastAlarmMin.current !== hm) {
        lastAlarmMin.current = hm;
        unlockAudio();
        SFX.alarmClock(5);
        setBanner({ text: 'ALARM! ' + hm });
        setFlash(f => f + 1);
        setTimeout(() => setBanner(null), 4000);
        moodRef.current.happyUntil = performance.now() + 3000;
        moodRef.current.hopUntil = performance.now() + 600;
        sceneRef.current && sceneRef.current.burst(['#ffe066', '#f7b6c8', '#7ec850']);
        say('ALARM! ALARM! IT IS ' + hm + '!');
      }
    }, 1000);
    return () => clearInterval(id);
  }, [clockAlarm.enabled, clockAlarm.time]);

  useEffect(() => {
    if (!timer.running) return;
    const id = setInterval(() => {
      setTimer(t => {
        if (!t.running || !t.endAt) return t;
        const left = Math.max(0, Math.round((t.endAt - Date.now()) / 1000));
        if (left === t.left) return t;
        if (left <= 6 && left > 0) SFX.tick();
        if (left <= 0) return { ...t, left: 0, running: false, finished: true, endAt: null };
        return { ...t, left };
      });
    }, 250);
    return () => clearInterval(id);
  }, [timer.running]);

  useEffect(() => {
    const onVis = () => {
      setTimer(t => {
        if (!t.running || !t.endAt) return t;
        const left = Math.max(0, Math.round((t.endAt - Date.now()) / 1000));
        if (left <= 0) return { ...t, left: 0, running: false, finished: true, endAt: null };
        return left === t.left ? t : { ...t, left };
      });
    };
    document.addEventListener('visibilitychange', onVis);
    return () => document.removeEventListener('visibilitychange', onVis);
  }, []);

  useEffect(() => {
    if (!timer.finished) return;
    if (timer.mode === 'work') {
      Lofi.stop(); SFX.alarmClock(4);
      moodRef.current.happyUntil = performance.now() + 3000;
      moodRef.current.hopUntil = performance.now() + 600;
      sceneRef.current && sceneRef.current.burst(['#f7b6c8', '#ffe066', '#7ec850']);
      const done = statsRef.current.focusSessions + 1;
      const isLong = done % 4 === 0;
      setStats(s => bumpStats({ ...s, focusSessions: s.focusSessions + 1, scrap: s.scrap + 10, history: bumpHistory(s.history, { f: 1, m: durations.work, xp: 30 }) }, 30));
      if (isLong) {
        say('FOCUS COMPLETE! +30XP! YOU EARNED A LONG ' + durations.long + ' MIN RECHARGE!');
        setTimer({ mode: 'break', left: durations.long * 60, running: true, finished: false, long: true, endAt: Date.now() + durations.long * 60000 });
      } else {
        say('FOCUS COMPLETE! +30XP +10 SCRAP! RECHARGING NOW...');
        setTimer({ mode: 'break', left: durations.break * 60, running: true, finished: false, endAt: Date.now() + durations.break * 60000 });
      }
    } else {
      SFX.win();
      say('BATTERY FULL! READY FOR THE NEXT SESSION!');
      setTimer({ mode: 'idle', left: durations.work * 60, running: false, finished: false, endAt: null });
    }
  }, [timer.finished]);

  const addQuest = q => {
    setTasks(ts => [...ts, normTask({
      id: Date.now() + Math.random(),
      text: q.text,
      done: false,
      xp: 20,
      category: q.category || 'general',
      priority: q.priority || 'normal'
    })]);
    SFX.add();
  };

  const genQuests = async () => {
    setAiLoading(true);
    try {
      const r = await fetch('/api/v2/ai/quests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ goal: aiGoal || 'a productive day', count: 5 })
      });
      const j = await r.json();
      setAiQuests(j.quests || []);
      SFX.done();
      say(j.source === 'groq' ? 'AI HARVESTED FRESH QUESTS! PLANT THEM!' : 'AI IS OFFLINE... HERE ARE STARTER QUESTS.');
    } catch {
      SFX.error();
      say('AI COULD NOT REACH THE GARDEN. TRY AGAIN LATER.');
    }
    setAiLoading(false);
  };

  const acceptQuest = q => {
    addQuest(q);
    setAiQuests(list => list.filter(x => x !== q));
    say('AI QUEST PLANTED!');
  };

  const acceptAll = () => {
    aiQuests.forEach(addQuest);
    setAiQuests([]);
    say('ALL AI QUESTS PLANTED!');
  };

  const refreshBoard = () => {
    fetch('/api/v2/leaderboard').then(r => r.ok ? r.json() : null).then(j => { if (j && j.entries) setBoard(j.entries); }).catch(() => {});
  };

  const submitAuth = async () => {
    setAuthError('');
    const path = authMode === 'login' ? '/api/v2/auth/login' : '/api/v2/auth/signup';
    try {
      const r = await fetch(path, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: authForm.username.trim().toLowerCase(),
          password: authForm.password,
          displayName: authForm.displayName.trim() || authForm.username.trim()
        })
      });
      const j = await r.json();
      if (!r.ok) { setAuthError(j.error || 'failed'); SFX.error(); return; }
      setUser(j.user);
      setAuthOpen(false);
      fetch('/api/v2/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks, world })
      }).catch(() => {});
      refreshBoard();
      SFX.done();
      say('SIGNED IN AS ' + j.user.username.toUpperCase() + '! QUESTS NOW SCORE ON THE LEADERBOARD.');
    } catch {
      setAuthError('network');
      SFX.error();
    }
  };

  const signOut = async () => {
    await fetch('/api/v2/auth/logout', { method: 'POST' }).catch(() => {});
    setUser(null);
    setAuthOpen(false);
    say('SIGNED OUT. PROGRESS STAYS LOCAL.');
  };

  const togglePrivacy = async () => {
    if (!user) return;
    const next = !(user.privacy && user.privacy.leaderboard !== false);
    try {
      const r = await fetch('/api/v2/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ privacy: { leaderboard: next } })
      });
      const j = await r.json();
      if (r.ok) { setUser(j.user); refreshBoard(); say(next ? 'YOU ARE VISIBLE ON THE LEADERBOARD.' : 'LEADERBOARD PRIVACY ON.'); }
    } catch { SFX.error(); }
  };

  const addTask = () => {
    const text = inputRef.current.value.trim();
    if (!text) { SFX.error(); say('BZZT! EMPTY MISSION REJECTED!'); return; }
    setTasks(ts => [...ts, normTask({ id: Date.now() + Math.random(), text, done: false, xp: 20 })]);
    inputRef.current.value = '';
    SFX.add();
    say('NEW MISSION PLANTED! +20XP WHEN IT SPROUTS! PRESS THE PENCIL TO SET CATEGORY, PRIORITY, DEADLINE OR REPEAT!');
  };

  const toggleTask = id => {
    const t = tasks.find(x => x.id === id);
    if (!t || t.done) return;
    const now = Date.now();
    setTasks(ts => {
      const doneList = ts.map(x => x.id === id ? { ...x, done: true, completedAt: now, rewarded: true } : x);
      if (t.recurrence === 'daily' || t.recurrence === 'weekly') {
        const step = t.recurrence === 'daily' ? 864e5 : 7 * 864e5;
        const nextDue = t.dueAt ? new Date(new Date(t.dueAt).getTime() + step).toISOString().slice(0, 10) : null;
        doneList.push(normTask({ ...t, id: now + Math.random(), done: false, completedAt: null, createdAt: now, dueAt: nextDue, rewarded: false }));
      }
      return doneList;
    });
    if (!t.rewarded) {
      const today = new Date().toDateString();
      const yest = new Date(Date.now() - 864e5).toDateString();
      setStats(s => bumpStats({
        ...s,
        completed: s.completed + 1,
        history: bumpHistory(s.history, { q: 1, xp: t.xp }),
        scrap: s.scrap + 5,
        streak: s.lastDoneDate === today ? s.streak : (s.lastDoneDate === yest ? s.streak + 1 : 1),
        lastDoneDate: today
      }, t.xp));
    }
    if (user) {
      const synced = tasks.map(x => x.id === id ? { ...x, done: true, completedAt: now } : x);
      fetch('/api/v2/state', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tasks: synced, world })
      })
        .then(() => fetch('/api/v2/reward/quest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ eventId: 'q-' + String(t.id) + '-' + now, questId: String(t.id), xp: t.xp, scrap: 5 })
        }))
        .then(() => refreshBoard())
        .catch(() => {});
    }
    SFX.done(); setTimeout(() => SFX.coin(), 300);
    moodRef.current.happyUntil = performance.now() + 2200;
    moodRef.current.hopUntil = performance.now() + 500;
    sceneRef.current && sceneRef.current.burst(['#7ec850', '#dbe37a', '#f7b6c8']);
    say(t.recurrence !== 'none'
      ? 'RECURRING MISSION COMPLETE! THE NEXT ONE ALREADY SPROUTED IN THE GARDEN!'
      : t.rewarded ? 'MISSION COMPLETE AGAIN! NO EXTRA XP THIS TIME, BUT STILL PROUD!'
        : ['MISSION COMPLETE! EXCELLENT!', 'TARGET SPROUTED! HOORAY!', 'TASK DONE! SO PROUD OF US!', 'HARVEST TIME! +5 SCRAP!'][Math.floor(Math.random() * 4)]);
  };

  const reopenTask = id => {
    setTasks(ts => ts.map(x => x.id === id ? { ...x, done: false, completedAt: null, rewarded: true } : x));
    SFX.click();
    say('MISSION REPLANTED! NO DOUBLE XP, BUT LETS DO THIS!');
  };

  const startEdit = t => {
    setEditingId(t.id);
    setDraft({ text: t.text, category: t.category, priority: t.priority, dueAt: t.dueAt || '', recurrence: t.recurrence, description: t.description || '' });
  };

  const saveEdit = id => {
    const text = draft.text.trim();
    if (!text) { SFX.error(); say('BZZT! A MISSION NEEDS A NAME!'); return; }
    setTasks(ts => ts.map(x => x.id === id ? { ...x, text, category: draft.category, priority: draft.priority, dueAt: draft.dueAt || null, recurrence: draft.recurrence, description: draft.description } : x));
    setEditingId(null);
    setDraft(BLANK_DRAFT);
    SFX.add();
    say('MISSION LOG UPDATED!');
  };

  const cancelEdit = () => { setEditingId(null); setDraft(BLANK_DRAFT); };

  const deleteTask = id => {
    setTasks(ts => ts.filter(t => t.id !== id));
    SFX.delete();
    say('MISSION COMPOSTED... DELETED FROM LOG.');
  };

  const startPause = () => {
    unlockAudio(); SFX.click();
    if (timer.running) {
      const left = timer.endAt ? Math.max(0, Math.round((timer.endAt - Date.now()) / 1000)) : timer.left;
      setTimer(t => ({ ...t, running: false, left, endAt: null }));
      if (timer.mode === 'work') { Lofi.stop(); say('RECORD PAUSED... I WILL WAIT RIGHT HERE.'); }
    } else {
      let mode = timer.mode, left = timer.left;
      if (mode === 'idle' || left <= 0) { mode = 'work'; left = durations.work * 60; }
      setTimer({ mode, left, running: true, finished: false, endAt: Date.now() + left * 1000 });
      if (mode === 'work') {
        Lofi.start();
        moodRef.current.happyUntil = performance.now() + 1500;
        say('TURNTABLE ONLINE! LO-FI AND FOCUS FOR ' + durations.work + ' MINUTES!');
      } else {
        say('BREAK TIME! STRETCH THOSE LEAVES!');
      }
    }
  };

  const resetTimer = () => {
    SFX.click(); Lofi.stop();
    setTimer({ mode: 'idle', left: durations.work * 60, running: false, finished: false, endAt: null });
    say('TURNTABLE STOPPED. STANDING BY.');
  };

  const setDur = (key, raw) => {
    const fallback = { work: 25, break: 5, long: 15 }[key];
    const max = key === 'work' ? 180 : 90;
    const m = clampMin(parseInt(raw, 10) || fallback, 1, max);
    setDurations(d => ({ ...d, [key]: m }));
  };

  const changeVolume = v => {
    setVolumeState(v);
    setVolume(v / 100);
  };

  const toggleClockAlarm = () => {
    unlockAudio(); SFX.click();
    setClockAlarm(c => {
      const nv = { ...c, enabled: !c.enabled };
      say(nv.enabled ? 'CLOCK ARMED FOR ' + nv.time + '! I WILL RING LOUD!' : 'CLOCK ALARM DISARMED.');
      return nv;
    });
  };

  const toggleSound = () => {
    const nv = !soundOn;
    setSoundOn(nv); setSoundEnabled(nv);
    if (!nv) Lofi.stop();
    else { unlockAudio(); SFX.boot(); if (timer.running && timer.mode === 'work') Lofi.start(); }
  };

  const stage = stageFor(stats.level);
  const pending = tasks.filter(t => !t.done).length;
  const doneSorted = tasks.filter(t => t.done).sort((a, b) => (b.completedAt || 0) - (a.completedAt || 0));
  const todayStr = localDate();
  const visibleTasks = (taskView === 'active' ? pendingSorted : doneSorted)
    .filter(t => filterCat === 'all' || t.category === filterCat)
    .filter(t => filterPri === 'all' || t.priority === filterPri);

  return (
    <div className="app">
      <header>
        <img className="logo" src={logoUrl} alt="Avocado Quest logo" />
        <h1>AVOCADO<span> QUEST</span></h1>
        <div className="theme-dots" role="group" aria-label="Color theme">
          {THEMES.map(t => (
            <button
              key={t.id}
              className={'theme-dot' + (theme === t.id ? ' active' : '')}
              style={{ background: 'linear-gradient(135deg, ' + t.swatch[0] + ' 0 34%, ' + t.swatch[1] + ' 34% 67%, ' + t.swatch[2] + ' 67% 100%)' }}
              onClick={() => pickTheme(t.id)}
              title={t.name}
              aria-label={t.name + ' theme'}
              aria-pressed={theme === t.id}
            />
          ))}
        </div>
        <button
          className="wood"
          onClick={() => {
            if (navigator.share) navigator.share({ title: 'Avocado Quest', text: 'A cozy pixel productivity RPG', url: location.href }).catch(() => {});
            else { navigator.clipboard && navigator.clipboard.writeText(location.href); say('LINK COPIED! SHARE THE VILLAGE.'); }
          }}
        >SHARE</button>
        <button className="wood" onClick={() => { setAuthError(''); setAuthOpen(true); }}>{user ? user.username.toUpperCase() : 'SIGN IN'}</button>
        <button className="wood" onClick={toggleSound}>SOUND: {soundOn ? 'ON' : 'OFF'}</button>
      </header>

      {stale && (
        <div className="stale-bar">
          <span>THIS SAVE WAS UPDATED IN ANOTHER TAB</span>
          <button className="wood" onClick={() => location.reload()}>RELOAD</button>
        </div>
      )}
      <div className="scene-wrap">
        <canvas ref={canvasRef} width={480} height={260} />
        <div className="hud">
          <div>
            <div className="bot-name">AVO-01</div>
            <div className="stage-name">STAGE {STAGES.indexOf(stage) + 1} // {stage.name}</div>
          </div>
          <div className="save-tag">{remote ? 'CLOUD SAVE' : 'LOCAL SAVE'}</div>
        </div>
        {flash > 0 && <div className="flash" key={flash} />}
        {banner && <div className="banner"><h3>{banner.text}</h3></div>}
      </div>

      <div className="speech">
        <img className="tw" src={typewriterUrl} alt="" />
        <div className="speech-text">&#9656; {speech}<span className="cursor">&#9608;</span></div>
      </div>

      <main>
        <section className="col">
          <div className="panel center">
            <h2><img className="h2-icon" src={recordUrl} alt="" /> FOCUS TURNTABLE</h2>
            <div className={'mode ' + timer.mode}>
              {timer.mode === 'work' ? '▶ SPINNING // WORK' : timer.mode === 'break' ? (timer.long ? '❚❚ LONG RECHARGE' : '❚❚ RECHARGE') : 'IDLE // ' + pending + ' MISSIONS'}
            </div>
            <div className="timer-display">{fmt(timer.left)}</div>
            <div className="btn-row">
              <button className="wood primary" onClick={startPause}>{timer.running ? 'PAUSE' : timer.mode === 'idle' ? 'START' : 'RESUME'}</button>
              <button className="wood" onClick={resetTimer}>RESET</button>
            </div>
            <div className="dur-grid">
              <label>WORK MIN<input type="number" min="1" max="180" value={durations.work} onChange={e => setDur('work', e.target.value)} /></label>
              <label>BREAK MIN<input type="number" min="1" max="90" value={durations.break} onChange={e => setDur('break', e.target.value)} /></label>
              <label>LONG MIN<input type="number" min="1" max="90" value={durations.long} onChange={e => setDur('long', e.target.value)} /></label>
            </div>
            <div className="dur-hint">TYPE MINUTES THEN HIT START // LONG BREAK AUTO-STARTS AFTER EVERY 4TH FOCUS SESSION</div>
          </div>

          <div className="panel">
            <h2>&#9200; ALARM &amp; SOUND</h2>
            <div className="alarm-row">
              <span>CLOCK ALARM</span>
              <input type="time" value={clockAlarm.time} onChange={e => { setClockAlarm(c => ({ ...c, time: e.target.value })); lastAlarmMin.current = ''; }} />
              <button className={'wood' + (clockAlarm.enabled ? ' primary' : '')} onClick={toggleClockAlarm}>{clockAlarm.enabled ? 'ARMED' : 'OFF'}</button>
            </div>
            <div className="vol-row">
              <span>VOLUME</span>
              <input type="range" min="0" max="100" value={volume} onChange={e => changeVolume(+e.target.value)} />
              <b>{volume}%</b>
            </div>
            <div className="vol-hint">TIMER END RINGS A CLASSIC ALARM // CLOCK ALARM RINGS EVEN WHILE THE TURNTABLE IS IDLE</div>
          </div>
        </section>

        <section className="col">
          <div className="panel">
            <h2>&#9632; GROWTH</h2>
            <div className="stat-row"><span>LEVEL</span><b>{stats.level}</b></div>
            <div className="bar"><div className="bar-fill" style={{ width: Math.min(100, stats.xp / (stats.level * 50) * 100) + '%' }} /></div>
            <div className="stat-row"><span>XP</span><b>{stats.xp} / {stats.level * 50}</b></div>
            <div className="mini-stats">
              <div>DONE<b>{stats.completed}</b></div>
              <div>STREAK<b>{stats.streak}</b></div>
              <div>SCRAP<b>{stats.scrap}</b></div>
              <div>FOCUS<b>{stats.focusSessions}</b></div>
            </div>
          </div>

          <div className="panel">
            <h2>&#9876; MISSION GARDEN</h2>
            <div className="view-tabs">
              <button className={'wood' + (taskView === 'active' ? ' primary' : '')} onClick={() => { setTaskView('active'); SFX.click(); }}>ACTIVE ({pending})</button>
              <button className={'wood' + (taskView === 'done' ? ' primary' : '')} onClick={() => { setTaskView('done'); SFX.click(); }}>DONE ({doneSorted.length})</button>
            </div>
            <div className="filter-row">
              <select value={filterCat} onChange={e => setFilterCat(e.target.value)} aria-label="filter by category">
                <option value="all">ALL CATEGORIES</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
              </select>
              <select value={filterPri} onChange={e => setFilterPri(e.target.value)} aria-label="filter by priority">
                <option value="all">ALL PRIORITIES</option>
                {PRIORITIES.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
              </select>
            </div>
            <div className="input-row">
              <input ref={inputRef} maxLength={80} placeholder="PLANT A NEW MISSION..."
                onKeyDown={e => e.key === 'Enter' && addTask()} />
              <button className="wood primary" onClick={addTask}>PLANT</button>
            </div>
            <div className="ai-row">
              <button className={'wood' + (aiOpen ? ' primary' : '')} onClick={() => { SFX.click(); setAiOpen(o => !o); }}>AI QUESTS</button>
              <span className="ai-hint">GROQ-POWERED IDEAS // FALLBACK OFFLINE</span>
            </div>
            {aiOpen && (
              <div className="ai-box">
                <div className="ai-input">
                  <input value={aiGoal} maxLength={120} placeholder="WHAT DO YOU WANT TO GET DONE?"
                    onChange={e => setAiGoal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && !aiLoading && genQuests()} />
                  <button className="wood primary" onClick={genQuests} disabled={aiLoading}>{aiLoading ? '...' : 'GENERATE'}</button>
                </div>
                {aiQuests.length > 0 && (
                  <div className="ai-results">
                    {aiQuests.map((q, i) => (
                      <div key={i} className="ai-item">
                        <span className="ai-text">{q.text}<small>{q.category} / {q.priority} / {q.minutes} MIN</small></span>
                        <button className="wood" onClick={() => acceptQuest(q)}>PLANT</button>
                      </div>
                    ))}
                    <button className="wood primary" onClick={acceptAll}>PLANT ALL</button>
                  </div>
                )}
              </div>
            )}
            <ul className="task-list">
              {visibleTasks.map(t => editingId === t.id ? (
                <li key={t.id} className="editing">
                  <div className="task-edit">
                    <input value={draft.text} maxLength={140} placeholder="MISSION NAME"
                      onChange={e => setDraft(d => ({ ...d, text: e.target.value }))} />
                    <input className="notes" value={draft.description} maxLength={200} placeholder="NOTES (OPTIONAL)"
                      onChange={e => setDraft(d => ({ ...d, description: e.target.value }))} />
                    <div className="edit-grid">
                      <select value={draft.category} onChange={e => setDraft(d => ({ ...d, category: e.target.value }))} aria-label="category">
                        {CATEGORIES.map(c => <option key={c} value={c}>{c.toUpperCase()}</option>)}
                      </select>
                      <select value={draft.priority} onChange={e => setDraft(d => ({ ...d, priority: e.target.value }))} aria-label="priority">
                        {PRIORITIES.map(p => <option key={p} value={p}>{p.toUpperCase()}</option>)}
                      </select>
                      <input type="date" value={draft.dueAt} onChange={e => setDraft(d => ({ ...d, dueAt: e.target.value }))} aria-label="deadline" />
                      <select value={draft.recurrence} onChange={e => setDraft(d => ({ ...d, recurrence: e.target.value }))} aria-label="repeats">
                        {RECURRENCES.map(r => <option key={r} value={r}>{r === 'none' ? 'ONCE' : r.toUpperCase()}</option>)}
                      </select>
                    </div>
                    <div className="edit-actions">
                      <button className="wood primary" onClick={() => saveEdit(t.id)}>SAVE</button>
                      <button className="wood" onClick={cancelEdit}>CANCEL</button>
                    </div>
                  </div>
                </li>
              ) : (
                <li key={t.id} className={(t.done ? 'done' : '') + (t.dueAt && t.dueAt < todayStr && !t.done ? ' overdue' : '')}>
                  <button className="check" onClick={() => toggleTask(t.id)} title="complete" disabled={t.done}>{t.done ? '✓' : ''}</button>
                  <span className="text">
                    {t.text}
                    <span className="chips">
                      <span className={'chip chip-' + t.category}>{t.category}</span>
                      <span className={'chip chip-pri-' + t.priority}>{t.priority}</span>
                      {t.recurrence !== 'none' && <span className="chip chip-rec">&#8635; {t.recurrence}</span>}
                      {t.dueAt && <span className="chip chip-due">{t.dueAt.slice(5).replace('-', '/')}{t.dueAt < todayStr && !t.done ? ' !' : ''}</span>}
                    </span>
                  </span>
                  <span className="xp">+{t.xp}XP</span>
                  {!t.done && <button className="icon-btn" onClick={() => startEdit(t)} title="edit">&#9998;</button>}
                  {t.done && <button className="icon-btn" onClick={() => reopenTask(t.id)} title="reopen">&#8635;</button>}
                  <button className="del" onClick={() => deleteTask(t.id)} title="delete">&#10005;</button>
                </li>
              ))}
            </ul>
            {visibleTasks.length === 0 && <div className="empty">{tasks.length === 0 ? '-- THE GARDEN IS EMPTY --' : '-- NOTHING HERE WITH THESE FILTERS --'}<br />PLANT A MISSION TO FEED AVO-01</div>}
          </div>
        </section>
      </main>

      <section className="panel meta-panel">
        <div className="meta-col">
          <h2>&#128200; ANALYTICS <span className="meta-sub">LAST 14 DAYS</span></h2>
          <div className="chart">
            {lastDays(stats.history, 14).map(d => (
              <div key={d.key} className="chart-col" title={d.key + ' // ' + d.xp + ' XP // ' + d.q + ' quests // ' + d.m + ' focus min'}>
                <div className="chart-bar" style={{ height: Math.max(2, Math.round(d.xp / Math.max(1, ...lastDays(stats.history, 14).map(x => x.xp)) * 64)) + 'px' }} />
                <span className="chart-label">{d.label}</span>
              </div>
            ))}
          </div>
          <div className="mini-stats meta-stats">
            <div>QUESTS<b>{lastDays(stats.history, 14).reduce((n, d) => n + d.q, 0)}</b></div>
            <div>XP<b>{lastDays(stats.history, 14).reduce((n, d) => n + d.xp, 0)}</b></div>
            <div>FOCUS MIN<b>{lastDays(stats.history, 14).reduce((n, d) => n + d.m, 0)}</b></div>
          </div>
        </div>
        <div className="meta-col">
          <h2>&#127942; ACHIEVEMENTS <span className="meta-sub">{(stats.unlocked || []).length}/{ACHIEVEMENTS.length}</span></h2>
          <div className="badges">
            {ACHIEVEMENTS.map(ach => {
              const on = (stats.unlocked || []).includes(ach.id);
              return (
                <span key={ach.id} className={'badge' + (on ? ' on' : '')} title={ach.name + ' — ' + ach.desc}>
                  <span className="badge-icon">{ach.icon}</span>
                  <b>{ach.name}</b>
                </span>
              );
            })}
          </div>
        </div>
      </section>

      <section className="panel perk-panel">
        <h2>&#127795; PERK TREE
          <span className="meta-sub">POINTS {(perkState({ stats, world })).available} / {(perkState({ stats, world })).total} · LEVEL {stats.level}</span>
        </h2>
        <div className="perk-branches">
          {BRANCHES.map(b => (
            <PerkDiagram key={b.id} branch={b} stats={stats} world={world} onBuy={buyPerk} />
          ))}
        </div>
      </section>

      <section className="panel board-panel">
        <h2>&#127760; LEADERBOARD <span className="meta-sub">WEEKLY XP</span>
          <button className="wood board-refresh" onClick={refreshBoard}>REFRESH</button>
        </h2>
        {board.length === 0 && <div className="empty">NO CHALLENGERS YET // SIGN IN TO JOIN</div>}
        {board.map((e, i) => (
          <div key={e.username} className={'board-row' + (user && e.username === user.username ? ' me' : '')}>
            <span className="board-rank">#{i + 1}</span>
            <span className="board-name">{e.displayName || e.username}</span>
            <span className="board-lv">LV {e.level}</span>
            <b className="board-xp">{e.xp} XP</b>
          </div>
        ))}
      </section>

      <section className="panel world-panel">
        <h2>&#127794; AVO VILLAGE // RPG WORLD</h2>
        <div className="map-bar">
          <label>WORLD
            <select value={world.map.w} onChange={e => pickMap(world.map.d, world.map.c, e.target.value)} aria-label="choose world map">
              {WORLD_MAPS.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
            </select>
          </label>
          <label>MAP
            <select value={world.map.d} onChange={e => pickMap(e.target.value, world.map.c, world.map.w)} aria-label="choose district">
              {DISTRICTS.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
            </select>
          </label>
          <label>SKY
            <select value={world.map.c} onChange={e => pickMap(world.map.d, e.target.value, world.map.w)} aria-label="choose sky">
              {CONDITIONS.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </label>
          <span className="map-tag">50 MAPS // DANGER +{((DISTRICTS.find(d => d.id === world.map.d) || {}).danger || 0) + ((CONDITIONS.find(c => c.id === world.map.c) || {}).danger || 0)}</span>
        </div>
        <div className="world-wrap">
          <canvas ref={worldCanvasRef} width={960} height={380} />
          <div className="world-hud">SCRAP <b>{stats.scrap}</b> // BOPPED <b>{world.bopped || 0}</b> // WORLD LV <b>{1 + Math.floor((world.bopped || 0) / 8)}</b></div>
        </div>
        <div className="world-controls">
          <div className="dpad" aria-label="movement controls">
            <button onPointerDown={() => worldRef.current && worldRef.current.setDir('up', true)} onPointerUp={() => worldRef.current && worldRef.current.setDir('up', false)} onPointerLeave={() => worldRef.current && worldRef.current.setDir('up', false)} aria-label="walk up">&#9650;</button>
            <div>
              <button onPointerDown={() => worldRef.current && worldRef.current.setDir('left', true)} onPointerUp={() => worldRef.current && worldRef.current.setDir('left', false)} onPointerLeave={() => worldRef.current && worldRef.current.setDir('left', false)} aria-label="walk left">&#9664;</button>
              <button onPointerDown={() => worldRef.current && worldRef.current.setDir('down', true)} onPointerUp={() => worldRef.current && worldRef.current.setDir('down', false)} onPointerLeave={() => worldRef.current && worldRef.current.setDir('down', false)} aria-label="walk down">&#9660;</button>
              <button onPointerDown={() => worldRef.current && worldRef.current.setDir('right', true)} onPointerUp={() => worldRef.current && worldRef.current.setDir('right', false)} onPointerLeave={() => worldRef.current && worldRef.current.setDir('right', false)} aria-label="walk right">&#9654;</button>
            </div>
          </div>
          <div className="ability-row">
            <button className="ability" onClick={() => { unlockAudio(); worldRef.current && worldRef.current.activate('jump'); }} title="Jump (J)">J<small>JUMP</small></button>
            <button className="ability" onClick={() => { unlockAudio(); worldRef.current && worldRef.current.activate('dash'); }} title="Dash (K) — level 2">K<small>DASH</small></button>
            <button className="ability" onClick={() => { unlockAudio(); worldRef.current && worldRef.current.activate('shield'); }} title="Shield (L) — level 4">L<small>SHIELD</small></button>
            <button className="ability" onClick={() => { unlockAudio(); worldRef.current && worldRef.current.activate('heal'); }} title="Heal (H) — level 6">H<small>HEAL</small></button>
          </div>
          <button className="bop-btn" onClick={() => { unlockAudio(); worldRef.current && worldRef.current.attack(); }}>BOP!</button>
        </div>
        <div className="bestiary">
          <span className="bestiary-label">BESTIARY</span>
          {ENEMY_TYPES.map(t => (
            <span key={t.name} className={'beast' + (world.bopped >= t.tier * 4 ? ' met' : '')} title={t.name + ' // TIER ' + t.tier + ' // +' + t.reward + ' SCRAP'}>
              {enemyThumbs[t.name] ? <img src={enemyThumbs[t.name]} alt="" /> : <span className="beast-ph" />}
              <span className="beast-name">{t.name}</span>
              <span className="beast-tier">T{t.tier} +{t.reward}</span>
            </span>
          ))}
        </div>
        <section className="armory">
          <div className="armory-head">
            <span>&#9876; ARMORY</span>
            <b>{(() => { const w = WEAPONS.find(x => x.id === world.weapon); return w ? w.name + ' // ATK +' + w.dmg : 'BARE HANDS // ATK +1'; })()}</b>
            <span className="armory-count">120 WEAPONS</span>
          </div>
          <div className="weapon-bases">
            {WEAPON_BASES.map(b => (
              <button key={b.id} className={'wbase' + (armoryBase === b.id ? ' active' : '')} onClick={() => { SFX.click(); setArmoryBase(b.id); }} title={b.name}>
                {weaponThumbs[b.id] ? <img src={weaponThumbs[b.id]} alt="" /> : <span className="wph" />}
                <span className="wbase-name">{b.name}</span>
              </button>
            ))}
          </div>
          <div className="weapon-tiers">
            {WEAPON_TIERS.map((t, i) => {
              const w = WEAPONS.find(x => x.baseId === armoryBase && x.tier === i);
              const owned = world.weapon === w.id;
              return (
                <button key={t} className={'wtier t' + i + (owned ? ' owned' : '') + (stats.scrap < w.cost && !owned ? ' poor' : '')}
                  onClick={() => buyWeapon(w)} title={w.name + ' // ATK +' + w.dmg + ' // ' + w.cost + ' SCRAP'}>
                  <b>{t}</b>
                  <span>{owned ? 'EQUIPPED' : w.cost + ' SCRAP'}</span>
                </button>
              );
            })}
          </div>
        </section>
        <div className="decor-shop">
          {DECOR.map(d => (
            <button
              key={d.id}
              className={'decor-btn' + (placing === d.id ? ' active' : '') + (stats.scrap < d.cost ? ' poor' : '')}
              onClick={() => togglePlacing(d.id)}
              title={d.name + ' — ' + d.cost + ' SCRAP'}
            >
              {worldThumbs[d.id] ? <img src={worldThumbs[d.id]} alt="" /> : <span className="decor-ph" />}
              <span className="decor-name">{d.name}</span>
              <span className="decor-cost">{d.cost} SCRAP</span>
            </button>
          ))}
        </div>
        <div className="world-hint">ARROWS / WASD WALK // J JUMP // K DASH (LV2) // L SHIELD (LV4) // H HEAL (LV6) // SPACE BOP // AVO-01 FOLLOWS YOU // SPACE OR CLICK TO BOP BEASTS (+2 SCRAP) // COINS +1, GEMS +5 // PICK A DECORATION THEN CLICK TO PLACE IT</div>
      </section>

      <footer>MADE BY AARUTO (AARUTO_SOLANKI) // PRESS ENTER TO PLANT // LO-FI SPINS WHILE YOU FOCUS // WATER YOUR TASKS DAILY</footer>

      {authOpen && (
        <div className="modal-bg" onClick={() => setAuthOpen(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <button className="modal-close" onClick={() => setAuthOpen(false)}>&#10005;</button>
            {user ? (
              <>
                <h3>ACCOUNT</h3>
                <p className="modal-line">SIGNED IN AS <b>{user.username}</b></p>
                <label className="modal-check">
                  <input type="checkbox" checked={!(user.privacy && user.privacy.leaderboard === false)} onChange={togglePrivacy} />
                  SHOW ME ON THE LEADERBOARD
                </label>
                <button className="wood" onClick={signOut}>SIGN OUT</button>
              </>
            ) : (
              <>
                <h3>{authMode === 'login' ? 'SIGN IN' : 'CREATE ACCOUNT'}</h3>
                <input placeholder="USERNAME (a-z0-9_, 3-20)" value={authForm.username}
                  onChange={e => setAuthForm(f => ({ ...f, username: e.target.value }))} />
                <input type="password" placeholder="PASSWORD (8+ CHARS)" value={authForm.password}
                  onChange={e => setAuthForm(f => ({ ...f, password: e.target.value }))} />
                {authMode === 'signup' && (
                  <input placeholder="DISPLAY NAME" value={authForm.displayName}
                    onChange={e => setAuthForm(f => ({ ...f, displayName: e.target.value }))} />
                )}
                {authError && <p className="modal-err">{authError.toUpperCase().replace(/_/g, ' ')}</p>}
                <button className="wood primary" onClick={submitAuth}>{authMode === 'login' ? 'SIGN IN' : 'CREATE'}</button>
                <button className="link" onClick={() => setAuthMode(m => m === 'login' ? 'signup' : 'login')}>
                  {authMode === 'login' ? 'NO ACCOUNT? CREATE ONE' : 'HAVE AN ACCOUNT? SIGN IN'}
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
