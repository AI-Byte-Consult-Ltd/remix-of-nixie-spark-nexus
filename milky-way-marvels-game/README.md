# Milky Way Marvels: Orbit Rush

A simple ready-to-run HTML5 arcade game concept for the **Milky Way Marvels** NFT collection on Cronos.

## What the game is

You control a collector ship inside a solar storm. The mission is to collect NFT-style planets and solar-system objects, gather `$RAVERSE` crystals, survive waves, and avoid asteroids and black holes.

## Competition logic

- Competition starts today and runs for 4 days.
- Every `1 $CRO` purchase = `1 tournament point`.
- Prizes shown in-game:
  - 1st: `10,000 $RAVERSE + 3 Planets`
  - 2nd: `5,000 $RAVERSE + 2 Planets`
  - 3rd: `2,500 $RAVERSE + 1 Planet`

The game includes a local browser leaderboard. Real wallet-based rankings can be added later by connecting sales data from Ebisu's Bay / Cronos transactions.

## How to run

Just open `index.html` in any modern browser.

For local hosting:

```bash
python3 -m http.server 8080
```

Then open:

```text
http://localhost:8080
```

## Controls

- Move: `WASD`, arrow keys, or drag on mobile
- Boost: `Space` or double tap
- Pause: `P`

## How to publish

Upload these files to any static host:

- GitHub Pages
- Netlify
- Vercel
- Your existing website hosting

No build step is required.

## Where to customize

Open `game.js` and edit the `CONFIG` object:

```js
const CONFIG = {
  collectionUrl: 'https://app.ebisusbay.com/collection/cronos/milky-way-marvels/',
  competitionDays: 4,
  pointsRule: 'Every 1 $CRO purchase = 1 point',
  prizes: [
    { place: '1st', ravers: 10000, planets: 3 },
    { place: '2nd', ravers: 5000, planets: 2 },
    { place: '3rd', ravers: 2500, planets: 1 }
  ],
  launchDate: null
};
```

Set `launchDate` to an official ISO date if you do not want the timer to start when a user first opens the page.

Example:

```js
launchDate: '2026-07-09T12:00:00+03:00'
```

## MVP limitations

This is a complete playable browser MVP, but it is not yet connected to wallets or marketplace sales. For a real public trading competition, add:

1. wallet connect;
2. collection purchase tracking;
3. server-side leaderboard;
4. anti-cheat validation;
5. prize-claim flow.
