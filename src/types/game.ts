export type HexStatus = 'idle' | 'flipping' | 'revealed' | 'awarded';
export type TeamId = 'team1' | 'team2';

export interface HexCell {
  id: string;        // e.g. "r0-c0"
  row: number;
  col: number;
  letter: string;    // A-Z
  challenge: string;
  status: HexStatus;
  awardedTo: TeamId | null;
}

export interface Team {
  id: TeamId;
  name: string;
  color: string;
  score: number;
  direction: 'north-south' | 'east-west';
}

export interface GameState {
  rows: number;
  cols: number;
  hexes: HexCell[];
  team1: Team;
  team2: Team;
  currentTurn: TeamId;
  activeHexId: string | null;
  gameOver: boolean;
  winner: TeamId | null;
  challengePool: string[];
}

// Socket events: Control → Server
export interface ClientToServerEvents {
  'update-grid': (data: { rows: number; cols: number }) => void;
  'update-team': (data: { teamId: TeamId; name?: string; color?: string }) => void;
  'set-challenge': (data: { hexId: string; challenge: string }) => void;
  'set-all-challenges': (data: { challenges: Record<string, string> }) => void;
  'flip-hex': (data: { hexId: string }) => void;
  'award-hex': (data: { hexId: string; teamId: TeamId }) => void;
  'next-turn': () => void;
  'reset-hex': (data: { hexId: string }) => void;
  'reset-game': () => void;
  'end-game': (data: { winner: TeamId }) => void;
  'demo-win': (data: { teamId: TeamId }) => void;
  'assign-random-challenges': (data: { pool: string[] }) => void;
  'shuffle-challenges': () => void;
  'request-state': () => void;
}

// Socket events: Server → All Clients
export interface ServerToClientEvents {
  'state-update': (state: GameState) => void;
  'hex-flipping': (data: { hexId: string }) => void;
  'hex-awarded': (data: { hexId: string; teamId: TeamId }) => void;
  'game-over': (data: { winner: TeamId }) => void;
}
