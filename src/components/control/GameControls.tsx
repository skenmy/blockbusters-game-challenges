import type { GameState, TeamId } from '../../types/game';

interface Props {
  gameState: GameState;
  onNextTurn: () => void;
  onResetGame: () => void;
  onEndGame: (winner: TeamId) => void;
  onDemoWin: (teamId: TeamId) => void;
}

export function GameControls({ gameState, onNextTurn, onResetGame, onEndGame, onDemoWin }: Props) {
  const currentTeam = gameState[gameState.currentTurn];

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="font-bold text-sm text-slate-300 mb-3">Game Controls</h3>

      <div className="mb-3 text-sm">
        Current turn:{' '}
        <span className="font-bold" style={{ color: currentTeam.color }}>
          {currentTeam.name}
        </span>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          onClick={onNextTurn}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors"
        >
          Next Turn
        </button>

        <button
          onClick={() => onEndGame('team1')}
          className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
        >
          {gameState.team1.name} Wins
        </button>

        <button
          onClick={() => onEndGame('team2')}
          className="bg-red-600 hover:bg-red-500 text-white px-3 py-2 rounded text-sm font-medium transition-colors"
        >
          {gameState.team2.name} Wins
        </button>

        <button
          onClick={onResetGame}
          className="bg-slate-600 hover:bg-slate-500 text-white px-4 py-2 rounded text-sm font-medium transition-colors ml-auto"
        >
          Reset Game
        </button>
      </div>

      <div className="flex flex-wrap gap-2 mt-2">
        <span className="text-xs text-slate-500 self-center">Demo:</span>
        <button
          onClick={() => onDemoWin('team1')}
          className="border border-blue-600 hover:bg-blue-600/20 text-blue-400 px-3 py-1.5 rounded text-xs font-medium transition-colors"
        >
          {gameState.team1.name} Win
        </button>
        <button
          onClick={() => onDemoWin('team2')}
          className="border border-red-600 hover:bg-red-600/20 text-red-400 px-3 py-1.5 rounded text-xs font-medium transition-colors"
        >
          {gameState.team2.name} Win
        </button>
      </div>

      {gameState.gameOver && (
        <div className="mt-3 p-2 bg-yellow-900/40 rounded text-sm text-yellow-300 font-medium">
          Game Over — {gameState.winner ? gameState[gameState.winner].name : ''} wins!
        </div>
      )}
    </div>
  );
}
