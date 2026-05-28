# blockbusters-game-challenges

A web-native take on the *Blockbusters* game show, designed for use as
a stream segment during speedrunning marathons. The host runs the
control panel; the public watches the hex grid fill in on `/display`,
mirrored into the broadcast as an OBS browser source.

Live at **<https://blockbuster.skenmy.com>** —
`/display` is the OBS-ready scoreboard, `/control` is the host UI
(Twitch-gated via [tools.skenmy.com](https://tools.skenmy.com)).

## What it is

- **Hex grid.** Configurable rows × cols; teams race to connect their
  edge to the opposite edge by claiming adjacent hexes.
- **Challenges.** Each hex carries a question / dare / speed-challenge
  pasted from a CSV or text bank. The host flips, the team answers,
  the host awards the hex to one team (or marks it failed).
- **Teams.** Up to four colour-coded teams with custom names; the UI
  tracks current turn and total hex count.
- **Mini-map.** Tiny live preview of the grid on the control panel so
  the host can see the public scoreboard without alt-tabbing to OBS.
- **Real-time.** Every browser on `/display` and `/control` sees state
  changes within a tick — Socket.IO broadcasts every mutation to every
  client; the in-memory `gameState` on the server is authoritative.

## Architecture

- **Client** (`src/`) — Vite + React + TypeScript + Tailwind. Two
  routes: `/display` and `/control` (everything else redirects to
  `/display`).
- **Server** (`server/`) — Express + Socket.IO. Serves the built
  client from `dist/` in production and the WebSocket from the same
  port (`PORT=5001` by default). State lives in memory only — no DB,
  no persistence — so a restart wipes the active game.
- **Types** (`src/types/game.ts`) are shared between client and server
  via a relative import (the server gets it via `tsx` at runtime, no
  build step needed for the server).

## Socket.IO protocol

The server emits `state:update` after every change with the full
`gameState`. The client emits these requests:

| client → server | data |
|---|---|
| `grid:update` | `{ rows, cols, layout }` |
| `team:update` | `{ id, name?, colour? }` |
| `challenge:set` | `{ hexId, text }` |
| `challenge:shuffle` / `challenge:assignRandom` | `{}` |
| `hex:flip` | `{ hexId }` |
| `hex:award` | `{ hexId, teamId }` |
| `hex:reset` | `{ hexId }` |
| `turn:next` | `{}` |
| `game:reset` / `game:end` / `game:demoWin` | `{}` |

## Local dev

```sh
npm install
npm run dev                        # Vite on :5000, server on :5001
```

Open the host UI at `/control` and the public scoreboard at `/display`
in different tabs to see the sync.

For a production smoke (built client, server, no HMR):

```sh
npm run preview                    # builds + boots server on :5001
```

## Env

| var | default |
|---|---|
| `PORT` | `5001` |

## Deploy

Standard skenmy-vps pattern: push to `main` → CI runs the lint + build
job and then builds + pushes the Docker image
(`ghcr.io/skenmy/blockbusters-game-challenges`). The image is multi-stage —
the Vite client is compiled in a build stage; the runtime stage runs
the Express server via `tsx`. Auto-dispatches the skenmy-vps deploy on
success.
