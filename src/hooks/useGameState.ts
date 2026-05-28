import { useEffect, useState } from 'react';
import { socket } from '../socket';
import type { GameState } from '../types/game';

export function useGameState() {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [connected, setConnected] = useState(socket.connected);

  useEffect(() => {
    function onConnect() {
      setConnected(true);
      socket.emit('request-state');
    }
    function onDisconnect() {
      setConnected(false);
    }
    function onStateUpdate(state: GameState) {
      setGameState(state);
    }

    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);
    socket.on('state-update', onStateUpdate);

    // If already connected, request state
    if (socket.connected) {
      socket.emit('request-state');
    }

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('state-update', onStateUpdate);
    };
  }, []);

  return { gameState, connected };
}
