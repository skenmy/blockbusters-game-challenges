# CLAUDE.md

Notes for Claude on this repo's non-obvious bits. See `README.md` for the
user-facing description.

## Stack at a glance

- Vite + React 18 + TypeScript + Tailwind v4 (`@tailwindcss/vite`).
- Express 5 + Socket.IO 4 server.
- Two routes only: `/display` (OBS source) and `/control` (host UI).
  Everything else redirects to `/display`.
- Single Node process in production; Express serves the built `dist/`
  and the Socket.IO endpoint on the same port (`PORT`, default 5001).

## Layout

- `src/` — client. `pages/`, `components/{control,display,hex}/`,
  `hooks/{useSocket,useGameState}.ts`, `socket.ts` (shared client).
- `server/` — `index.ts` (HTTP + Socket.IO bootstrap),
  `socketHandlers.ts` (event wiring), `gameState.ts` (authoritative
  state + mutators).
- `src/types/game.ts` — shared types AND the typed
  `ClientToServerEvents` / `ServerToClientEvents` socket maps. Imported
  by both client and server.

## Conventions that bite

- **Socket event names are kebab-case** (`update-grid`, `flip-hex`,
  `state-update`), not colon-namespaced. The full set is the source of
  truth in `src/types/game.ts`.
- **Server imports use `.js` extensions** even though the files are
  `.ts` (e.g. `from '../src/types/game.js'`). This is the ESM + tsx
  pattern — do not strip the extension or change to `.ts`.
- **Server is never compiled.** Both dev and prod run it via `tsx`. The
  Dockerfile installs `tsx` into the runtime image and starts with
  `node --import tsx server/index.ts`. `tsc -b` in `npm run build`
  only type-checks the client.
- **In-memory state, no persistence.** `gameState.ts` keeps a
  module-level `let state`. A server restart (or container redeploy)
  wipes the active game. There is no DB, no file persistence, no
  multi-room support — one global game per process.
- **Hardcoded 2 teams.** `team1` / `team2` are concrete fields on
  `GameState`, not an array. Adding teams means editing the type,
  initial state, the `updateTeam` mutator, both pages, and the
  `nextTurn` toggle. The README used to claim "up to four teams" — it
  doesn't.
- **Team direction is fixed:** `team1` is north-south, `team2` is
  east-west. Set in `createInitialState()`; the demo-win uses it to
  pick a winning path.

## Animation timing (don't desync these)

- `flip-hex` flow: server emits `hex-flipping` immediately, sets the
  hex to `flipping`, then 800ms later flips it to `revealed` and
  re-emits `state-update` at 850ms (in `socketHandlers.ts`).
- `DisplayPage` shows the `ChallengeOverlay` 700ms after receiving
  `hex-flipping`, so the card lands as the flip completes.
- If you change one timer, change the others — they're tuned together.

## Dev / build

- `npm run dev` runs Vite on :5000 and `tsx watch server/index.ts` on
  :5001 in parallel via `concurrently`. Vite proxies `/socket.io` to
  :5001 so the client connects to one origin in dev (see
  `vite.config.ts`).
- `npm run preview` = `build` + `start`. There is no `vite preview` —
  this script intentionally boots the Express server against the built
  `dist/` for a real production smoke.
- `npm run lint` is ESLint flat config (`eslint.config.js`). There are
  no tests in this repo.

## Auth pill (control surface only)

`ControlPage.tsx` injects `https://tools.skenmy.com/embed.js` with
`data-app="blockbuster"` and `data-role="admin"` on mount, and removes
the resulting `.sk-auth-pill` element on unmount. The `/display`
surface deliberately stays clean for OBS — don't add the embed there.

## Deploy

- CI: `.github/workflows/ci.yml` runs `npm ci && npm run build` on
  every push/PR. On push to `main` (or a `v*` tag) it also builds and
  pushes `ghcr.io/skenmy/blockbusters-game-challenges` and then
  `workflow_dispatch`es `deploy.yml` in the `skenmy-vps` repo with
  `service=blockbusters` and `tag=sha-<short_sha>`.
- The Dockerfile is multi-stage: build stage runs `npm run build`;
  runtime stage installs prod deps + `tsx` and copies `dist/`,
  `server/`, `src/types/` (the only client code the server needs).

## Things not to do

- Don't add a database or persistence layer without checking with the
  owner — the "wipes on restart" property is intentional for a stream
  segment.
- Don't rename socket events to colon-namespaced — the typed event
  maps in `src/types/game.ts` are the contract and clients expect
  kebab-case.
- Don't drop `tsx` from the runtime image or try to compile the server
  to JS — `import.meta`, `.js`-suffixed TS imports, and the runtime
  config all assume tsx is present.
