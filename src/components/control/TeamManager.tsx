import type { Team, TeamId } from '../../types/game';

interface Props {
  team: Team;
  onUpdate: (teamId: TeamId, name?: string, color?: string) => void;
}

export function TeamManager({ team, onUpdate }: Props) {
  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="font-bold text-sm text-slate-300 mb-3">{team.id === 'team1' ? 'Team 1' : 'Team 2'}</h3>
      <div className="flex items-center gap-3">
        <input
          type="text"
          value={team.name}
          onChange={e => onUpdate(team.id, e.target.value, undefined)}
          className="flex-1 bg-slate-700 text-slate-100 rounded px-3 py-1.5 text-sm"
          placeholder="Team name"
        />
        <input
          type="color"
          value={team.color}
          onChange={e => onUpdate(team.id, undefined, e.target.value)}
          className="w-10 h-8 rounded cursor-pointer bg-transparent border-0"
        />
        <span className="text-sm font-bold tabular-nums" style={{ color: team.color }}>
          {team.score}
        </span>
      </div>
    </div>
  );
}
