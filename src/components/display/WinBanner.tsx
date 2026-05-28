import type { Team } from '../../types/game';

interface Props {
  winner: Team;
}

export function WinBanner({ winner }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md">
      <div className="text-center animate-[fadeIn_0.5s_ease-out]">
        <div className="text-8xl font-black mb-4" style={{ color: winner.color }}>
          {winner.name}
        </div>
        <div className="text-4xl font-bold text-yellow-400 tracking-wider">
          WINS!
        </div>
        <div className="mt-6 text-6xl">
          🏆
        </div>
      </div>
    </div>
  );
}
