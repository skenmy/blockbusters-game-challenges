import { useState, useEffect } from 'react';
import { useGameState } from '../hooks/useGameState';
import { HexGrid } from '../components/hex/HexGrid';
import { TeamScoreBanner } from '../components/display/TeamScoreBanner';
import { ChallengeOverlay } from '../components/display/ChallengeOverlay';
import { WinBanner } from '../components/display/WinBanner';
import { socket } from '../socket';
import type { HexCell } from '../types/game';

export function DisplayPage() {
  const { gameState, connected } = useGameState();
  const [overlayHex, setOverlayHex] = useState<HexCell | null>(null);

  // Listen for flip animation events to show overlay
  useEffect(() => {
    function onFlipping({ hexId }: { hexId: string }) {
      if (!gameState) return;
      const hex = gameState.hexes.find(h => h.id === hexId);
      if (hex) {
        // Show overlay after flip animation starts
        setTimeout(() => {
          setOverlayHex(hex);
        }, 700);
      }
    }

    function onAwarded() {
      setOverlayHex(null);
    }

    socket.on('hex-flipping', onFlipping);
    socket.on('hex-awarded', onAwarded);
    return () => {
      socket.off('hex-flipping', onFlipping);
      socket.off('hex-awarded', onAwarded);
    };
  }, [gameState]);

  // Update overlay hex when state changes
  useEffect(() => {
    if (overlayHex && gameState) {
      const updated = gameState.hexes.find(h => h.id === overlayHex.id);
      if (updated && updated.status === 'awarded') {
        setOverlayHex(null);
      } else if (updated) {
        setOverlayHex(updated);
      }
    }
  }, [gameState, overlayHex?.id]);

  if (!gameState) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-slate-400">
          {connected ? 'Loading...' : 'Connecting to server...'}
        </div>
      </div>
    );
  }

  const winnerTeam = gameState.winner
    ? gameState[gameState.winner]
    : null;

  return (
    <div className="h-screen flex flex-col overflow-hidden p-4">
      {/* Top bar: scores */}
      <div className="flex justify-between items-stretch gap-4 mb-4">
        <div className="flex-1">
          <TeamScoreBanner
            team={gameState.team1}
            isActive={gameState.currentTurn === 'team1'}
          />
        </div>
        <div className="flex items-center">
          <div className="text-xs text-slate-500 px-3">
            {connected ? '● Connected' : '○ Disconnected'}
          </div>
        </div>
        <div className="flex-1">
          <TeamScoreBanner
            team={gameState.team2}
            isActive={gameState.currentTurn === 'team2'}
          />
        </div>
      </div>

      {/* Hex grid */}
      <div className="flex-1 min-h-0">
        <HexGrid
          hexes={gameState.hexes}
          rows={gameState.rows}
          cols={gameState.cols}
          team1Color={gameState.team1.color}
          team2Color={gameState.team2.color}
        />
      </div>

      {/* Overlays */}
      <ChallengeOverlay hex={overlayHex} onClose={() => setOverlayHex(null)} />
      {winnerTeam && <WinBanner winner={winnerTeam} />}
    </div>
  );
}
