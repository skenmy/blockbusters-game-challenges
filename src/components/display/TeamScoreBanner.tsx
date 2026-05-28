import type { Team } from '../../types/game';

interface Props {
  team: Team;
  isActive: boolean;
}

export function TeamScoreBanner({ team, isActive }: Props) {
  return (
    <div
      className={`flex items-center gap-3 px-5 py-3 rounded-lg transition-all duration-300 ${
        isActive ? 'ring-2 ring-yellow-400 scale-105' : 'opacity-80'
      }`}
      style={{ backgroundColor: team.color + '33', borderLeft: `4px solid ${team.color}` }}
    >
      <div
        className="w-4 h-4 rounded-full"
        style={{ backgroundColor: team.color }}
      />
      <span className="font-bold text-lg">{team.name}</span>
      <span className="text-sm opacity-60">{team.direction === 'north-south' ? '↕' : '↔'}</span>
      <span className="text-3xl font-black ml-auto tabular-nums">{team.score}</span>
    </div>
  );
}
