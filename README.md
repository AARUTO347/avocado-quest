# AvoQuest 3.0 — Avo Village RPG

Cozy pixel-art productivity app: focus timer, mission garden, rewards, and a playable
RPG village with a hero, Avo companion, beasts, boss tiers, 120 weapons, and 50 map areas.

**Made by AARUTO (AARUTO_SOLANKI).**

## Live

GitHub Pages (free static): https://aaruto347.github.io/avocado-quest/

Netlify (when credits available): https://avoquest-aaruto.netlify.app/

https://avoquest-aaruto.netlify.app/

## Run locally

```bash
npm install
node server/index.js
```

Open http://localhost:4173/ or double-click `start-avocado.bat` (Windows).

## Build

```bash
npm run build
```

## What's inside

- Focus turntable with editable durations, long breaks, clock alarm, lo-fi engine
- Mission garden: categories, priorities, deadlines, recurrence, edit/reopen
- RPG village: 8 beast types with tiers and levels, world levels, bestiary,
  coin/gem pickups, 33 decorations, 120 weapons (12 bases x 10 tiers), 50 map areas
  (10 districts x 5 sky conditions), minimap, keyboard + on-screen controls
- 7 color themes, cloud/local save, optional accounts API (Express + Netlify Functions)

## Notes

- Guest mode stores progress in `server/data.json` (git-ignored) or localStorage.
- The trusted server engine lives in `server/core.mjs` and `netlify/functions/api.mjs`.

## New in this release

- Timestamp-authoritative focus timer (survives background tabs)
- Tab-sync notice when another tab saves over yours
- 21 achievements with unlock toasts + 14-day analytics dashboard
- AI quest generator (Groq server-side, template fallback) with approval flow
- Accounts: sign up / sign in, privacy toggle, weekly XP leaderboard, trusted quest rewards
- PWA: installable app, service worker, offline shell, OG/social tags
- Error boundary, focus styles, reduced-motion support
- 7 unit tests + GitHub Actions CI

Set GROQ_API_KEY in the environment (or Netlify env vars) to enable real AI quests.

## World maps

Three real backgrounds selectable in-game (WORLD selector): Farm Valley (default), Old Village, Enchanted Forest. Each has its own land/water mask used for spawning and collision.
