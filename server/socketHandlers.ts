import type { Server, Socket } from 'socket.io';
import type { ClientToServerEvents, ServerToClientEvents } from '../src/types/game.js';
import * as game from './gameState.js';

type TypedServer = Server<ClientToServerEvents, ServerToClientEvents>;
type TypedSocket = Socket<ClientToServerEvents, ServerToClientEvents>;

export function registerHandlers(io: TypedServer, socket: TypedSocket) {
  // Send current state to newly connected client
  socket.emit('state-update', game.getState());

  socket.on('request-state', () => {
    socket.emit('state-update', game.getState());
  });

  socket.on('update-grid', ({ rows, cols }) => {
    const state = game.updateGrid(rows, cols);
    io.emit('state-update', state);
  });

  socket.on('update-team', ({ teamId, name, color }) => {
    const state = game.updateTeam(teamId, name, color);
    io.emit('state-update', state);
  });

  socket.on('set-challenge', ({ hexId, challenge }) => {
    const state = game.setChallenge(hexId, challenge);
    io.emit('state-update', state);
  });

  socket.on('set-all-challenges', ({ challenges }) => {
    const state = game.setAllChallenges(challenges);
    io.emit('state-update', state);
  });

  socket.on('flip-hex', ({ hexId }) => {
    io.emit('hex-flipping', { hexId });
    const state = game.flipHex(hexId);
    io.emit('state-update', state);
    // Send revealed state after animation completes
    setTimeout(() => {
      io.emit('state-update', game.getState());
    }, 850);
  });

  socket.on('award-hex', ({ hexId, teamId }) => {
    const state = game.awardHex(hexId, teamId);
    io.emit('hex-awarded', { hexId, teamId });
    io.emit('state-update', state);
  });

  socket.on('next-turn', () => {
    const state = game.nextTurn();
    io.emit('state-update', state);
  });

  socket.on('reset-hex', ({ hexId }) => {
    const state = game.resetHex(hexId);
    io.emit('state-update', state);
  });

  socket.on('reset-game', () => {
    const state = game.resetGame();
    io.emit('state-update', state);
  });

  socket.on('assign-random-challenges', ({ pool }) => {
    const state = game.assignRandomChallenges(pool);
    io.emit('state-update', state);
  });

  socket.on('shuffle-challenges', () => {
    const state = game.shuffleChallenges();
    io.emit('state-update', state);
  });

  socket.on('end-game', ({ winner }) => {
    const state = game.endGame(winner);
    io.emit('game-over', { winner });
    io.emit('state-update', state);
  });

  socket.on('demo-win', ({ teamId }) => {
    const state = game.demoWin(teamId);
    io.emit('game-over', { winner: teamId });
    io.emit('state-update', state);
  });
}
