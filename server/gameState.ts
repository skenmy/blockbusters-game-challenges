import type { GameState, HexCell, TeamId } from '../src/types/game.js';

const LETTERS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

function generateGrid(rows: number, cols: number): HexCell[] {
  const hexes: HexCell[] = [];
  let letterIdx = 0;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      hexes.push({
        id: `r${r}-c${c}`,
        row: r,
        col: c,
        letter: LETTERS[letterIdx % LETTERS.length],
        challenge: '',
        status: 'idle',
        awardedTo: null,
      });
      letterIdx++;
    }
  }
  return hexes;
}

function shuffleArray<T>(arr: T[]): T[] {
  const shuffled = [...arr];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

function createInitialState(): GameState {
  return {
    rows: 4,
    cols: 5,
    hexes: generateGrid(4, 5),
    team1: { id: 'team1', name: 'Team 1', color: '#3b82f6', score: 0, direction: 'north-south' },
    team2: { id: 'team2', name: 'Team 2', color: '#ef4444', score: 0, direction: 'east-west' },
    currentTurn: 'team1',
    activeHexId: null,
    gameOver: false,
    winner: null,
    challengePool: [],
  };
}

let state: GameState = createInitialState();

export function getState(): GameState {
  return state;
}

export function updateGrid(rows: number, cols: number): GameState {
  state.rows = rows;
  state.cols = cols;
  state.hexes = generateGrid(rows, cols);
  state.activeHexId = null;
  state.gameOver = false;
  state.winner = null;
  state.team1.score = 0;
  state.team2.score = 0;
  return state;
}

export function updateTeam(teamId: TeamId, name?: string, color?: string): GameState {
  const team = state[teamId];
  if (name !== undefined) team.name = name;
  if (color !== undefined) team.color = color;
  return state;
}

export function setChallenge(hexId: string, challenge: string): GameState {
  const hex = state.hexes.find(h => h.id === hexId);
  if (hex) hex.challenge = challenge;
  return state;
}

export function setAllChallenges(challenges: Record<string, string>): GameState {
  for (const [hexId, challenge] of Object.entries(challenges)) {
    const hex = state.hexes.find(h => h.id === hexId);
    if (hex) hex.challenge = challenge;
  }
  return state;
}

export function flipHex(hexId: string): GameState {
  const hex = state.hexes.find(h => h.id === hexId);
  if (hex && hex.status === 'idle') {
    hex.status = 'flipping';
    state.activeHexId = hexId;
    // After a delay the client will show the flip; server marks revealed immediately
    setTimeout(() => {
      hex.status = 'revealed';
    }, 800);
  }
  return state;
}

export function awardHex(hexId: string, teamId: TeamId): GameState {
  const hex = state.hexes.find(h => h.id === hexId);
  if (hex && (hex.status === 'revealed' || hex.status === 'flipping')) {
    hex.status = 'awarded';
    hex.awardedTo = teamId;
    state[teamId].score += 1;
    state.activeHexId = null;
  }
  return state;
}

export function nextTurn(): GameState {
  state.currentTurn = state.currentTurn === 'team1' ? 'team2' : 'team1';
  state.activeHexId = null;
  return state;
}

export function resetHex(hexId: string): GameState {
  const hex = state.hexes.find(h => h.id === hexId);
  if (hex) {
    if (hex.awardedTo) {
      state[hex.awardedTo].score = Math.max(0, state[hex.awardedTo].score - 1);
    }
    hex.status = 'idle';
    hex.awardedTo = null;
    if (state.activeHexId === hexId) {
      state.activeHexId = null;
    }
  }
  return state;
}

export function resetGame(): GameState {
  state = createInitialState();
  return state;
}

export function assignRandomChallenges(pool: string[]): GameState {
  state.challengePool = pool;
  const needed = state.hexes.length;
  const selected = shuffleArray(pool).slice(0, needed);
  for (let i = 0; i < state.hexes.length; i++) {
    state.hexes[i].challenge = selected[i] ?? '';
  }
  return state;
}

export function shuffleChallenges(): GameState {
  if (state.challengePool.length === 0) return state;
  const needed = state.hexes.length;
  const selected = shuffleArray(state.challengePool).slice(0, needed);
  for (let i = 0; i < state.hexes.length; i++) {
    state.hexes[i].challenge = selected[i] ?? '';
  }
  return state;
}

export function endGame(winner: TeamId): GameState {
  state.gameOver = true;
  state.winner = winner;
  return state;
}

export function demoWin(teamId: TeamId): GameState {
  // Reset all hexes first
  for (const hex of state.hexes) {
    hex.status = 'idle';
    hex.awardedTo = null;
  }
  state.team1.score = 0;
  state.team2.score = 0;
  state.activeHexId = null;

  // Build a winning path
  const team = state[teamId];
  const pathIds: string[] = [];

  if (team.direction === 'north-south') {
    // Vertical path down the middle column
    const col = Math.floor(state.cols / 2);
    for (let r = 0; r < state.rows; r++) {
      pathIds.push(`r${r}-c${col}`);
    }
  } else {
    // Horizontal path across the middle row
    const row = Math.floor(state.rows / 2);
    for (let c = 0; c < state.cols; c++) {
      pathIds.push(`r${row}-c${c}`);
    }
  }

  // Award path hexes
  for (const id of pathIds) {
    const hex = state.hexes.find(h => h.id === id);
    if (hex) {
      hex.status = 'awarded';
      hex.awardedTo = teamId;
      state[teamId].score += 1;
    }
  }

  state.gameOver = true;
  state.winner = teamId;
  return state;
}
