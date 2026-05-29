# blockbusters-game-challenges

A web-native take on the *Blockbusters* game show, designed for use as
a stream segment during speedrunning marathons. The host runs the
control panel; the public watches the hex grid fill in on `/display`,
mirrored into the broadcast as an OBS browser source.

Live at **<https://blockbuster.skenmy.com>** —
`/display` is the OBS-ready scoreboard, `/control` is the host UI
(auth-gated via the [tools.skenmy.com](https://tools.skenmy.com)
embed pill).

## What it is

- **Hex grid.** Configurable rows × cols; teams race to connect their
  edge to the opposite edge by claiming adjacent hexes. Team 1 runs
  north-south, team 2 east-west.
- **Challenges.** Each hex carries a question / dare / speed-challenge
  pasted into the bulk paster (one per line). The host flips, the team
  answers, the host awards the hex to one team or resets it.
- **Teams.** Two teams (`team1` / `team2`) with editable names and
  colour pickers; the UI tracks current turn and per-team score.
- **Mini-map.** Tiny live preview of the grid on the control panel so
  the host can pick a hex without alt-tabbing to OBS.
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

Event names are kebab-case. The server emits `state-update` (full
`gameState`) after every mutation, plus targeted animation hints
(`hex-flipping`, `hex-awarded`, `game-over`). The full set of typed
events lives in [`src/types/game.ts`](src/types/game.ts).

Client → server:

| event | data |
|---|---|
| `request-state` | — |
| `update-grid` | `{ rows, cols }` |
| `update-team` | `{ teamId, name?, color? }` |
| `set-challenge` | `{ hexId, challenge }` |
| `set-all-challenges` | `{ challenges: Record<hexId, string> }` |
| `assign-random-challenges` | `{ pool: string[] }` |
| `shuffle-challenges` | — |
| `flip-hex` | `{ hexId }` |
| `award-hex` | `{ hexId, teamId }` |
| `reset-hex` | `{ hexId }` |
| `next-turn` | — |
| `reset-game` | — |
| `end-game` | `{ winner: teamId }` |
| `demo-win` | `{ teamId }` |

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
