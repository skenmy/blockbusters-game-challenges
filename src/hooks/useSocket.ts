import { useCallback } from 'react';
import { socket } from '../socket';
import type { TeamId } from '../types/game';

export function useSocket() {
  const updateGrid = useCallback((rows: number, cols: number) => {
    socket.emit('update-grid', { rows, cols });
  }, []);

  const updateTeam = useCallback((teamId: TeamId, name?: string, color?: string) => {
    socket.emit('update-team', { teamId, name, color });
  }, []);

  const setChallenge = useCallback((hexId: string, challenge: string) => {
    socket.emit('set-challenge', { hexId, challenge });
  }, []);

  const setAllChallenges = useCallback((challenges: Record<string, string>) => {
    socket.emit('set-all-challenges', { challenges });
  }, []);

  const flipHex = useCallback((hexId: string) => {
    socket.emit('flip-hex', { hexId });
  }, []);

  const awardHex = useCallback((hexId: string, teamId: TeamId) => {
    socket.emit('award-hex', { hexId, teamId });
  }, []);

  const nextTurn = useCallback(() => {
    socket.emit('next-turn');
  }, []);

  const resetHex = useCallback((hexId: string) => {
    socket.emit('reset-hex', { hexId });
  }, []);

  const resetGame = useCallback(() => {
    socket.emit('reset-game');
  }, []);

  const endGame = useCallback((winner: TeamId) => {
    socket.emit('end-game', { winner });
  }, []);

  const assignRandomChallenges = useCallback((pool: string[]) => {
    socket.emit('assign-random-challenges', { pool });
  }, []);

  const shuffleChallenges = useCallback(() => {
    socket.emit('shuffle-challenges');
  }, []);

  const demoWin = useCallback((teamId: TeamId) => {
    socket.emit('demo-win', { teamId });
  }, []);

  return {
    updateGrid,
    updateTeam,
    setChallenge,
    setAllChallenges,
    flipHex,
    awardHex,
    nextTurn,
    resetHex,
    resetGame,
    endGame,
    demoWin,
    assignRandomChallenges,
    shuffleChallenges,
  };
}
