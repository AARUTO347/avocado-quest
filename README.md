# AvoQuest 3.0 — Avo Village RPG

Cozy pixel-art productivity app: focus timer, mission garden, rewards, and a playable
RPG village with a hero, Avo companion, beasts, boss tiers, 120 weapons, and 50 map areas.

**Made by AARUTO (AARUTO_SOLANKI).**

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
