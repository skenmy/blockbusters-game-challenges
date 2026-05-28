import { useEffect, useState } from 'react';
import { useGameState } from '../hooks/useGameState';
import { useSocket } from '../hooks/useSocket';
import { GridConfigurator } from '../components/control/GridConfigurator';
import { TeamManager } from '../components/control/TeamManager';
import { HexEditor } from '../components/control/HexEditor';
import { HexMiniMap } from '../components/control/HexMiniMap';
import { GameControls } from '../components/control/GameControls';
import { ChallengePaster } from '../components/control/ChallengePaster';

export function ControlPage() {
  const { gameState, connected } = useGameState();
  const {
    updateGrid, updateTeam, setChallenge, flipHex,
    awardHex, nextTurn, resetHex, resetGame, endGame, demoWin,
    assignRandomChallenges, shuffleChallenges,
  } = useSocket();
  const [selectedHexId, setSelectedHexId] = useState<string | null>(null);

  // tools.skenmy.com auth pill (signed-in user + role chip in the top-right).
  // Only mounted on the control surface; the public /display view stays clean for OBS.
  useEffect(() => {
    if (document.getElementById('sk-embed-script')) return;
    const s = document.createElement('script');
    s.id = 'sk-embed-script';
    s.src = 'https://tools.skenmy.com/embed.js';
    s.dataset.app = 'blockbuster';
    s.dataset.role = 'admin';
    document.head.appendChild(s);
    return () => {
      s.remove();
      document.querySelector('.sk-auth-pill')?.remove();
    };
  }, []);

  if (!gameState) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-xl text-slate-400">
          {connected ? 'Loading...' : 'Connecting to server...'}
        </div>
      </div>
    );
  }

  const selectedHex = selectedHexId
    ? gameState.hexes.find(h => h.id === selectedHexId) ?? null
    : null;

  return (
    <div className="min-h-screen p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-xl font-bold text-slate-100">Blockbusters Control Panel</h1>
        <span className={`text-xs px-2 py-1 rounded ${connected ? 'bg-green-900 text-green-300' : 'bg-red-900 text-red-300'}`}>
          {connected ? 'Connected' : 'Disconnected'}
        </span>
      </div>

      <div className="space-y-4">
        {/* Grid + Teams row */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <GridConfigurator
            currentRows={gameState.rows}
            currentCols={gameState.cols}
            onUpdate={updateGrid}
          />
          <TeamManager team={gameState.team1} onUpdate={updateTeam} />
          <TeamManager team={gameState.team2} onUpdate={updateTeam} />
        </div>

        {/* Game controls */}
        <GameControls
          gameState={gameState}
          onNextTurn={nextTurn}
          onResetGame={resetGame}
          onEndGame={endGame}
          onDemoWin={demoWin}
        />

        {/* Bulk challenge paster */}
        <ChallengePaster
          hexCount={gameState.hexes.length}
          challengePool={gameState.challengePool}
          onAssign={assignRandomChallenges}
          onShuffle={shuffleChallenges}
        />

        {/* Hex editor */}
        <HexEditor
          hex={selectedHex}
          onSetChallenge={setChallenge}
          onFlip={flipHex}
          onAward={awardHex}
          onReset={resetHex}
          team1Name={gameState.team1.name}
          team2Name={gameState.team2.name}
        />

        {/* Mini map */}
        <HexMiniMap
          hexes={gameState.hexes}
          rows={gameState.rows}
          cols={gameState.cols}
          selectedHexId={selectedHexId}
          team1Color={gameState.team1.color}
          team2Color={gameState.team2.color}
          onSelect={setSelectedHexId}
        />
      </div>
    </div>
  );
}
