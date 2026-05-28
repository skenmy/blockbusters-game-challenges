import { useState, useEffect } from 'react';

interface Props {
  hexCount: number;
  challengePool: string[];
  onAssign: (pool: string[]) => void;
  onShuffle: () => void;
}

export function ChallengePaster({ hexCount, challengePool, onAssign, onShuffle }: Props) {
  const [text, setText] = useState('');

  // Populate textarea from server pool on mount / when pool changes
  useEffect(() => {
    if (challengePool.length > 0 && text === '') {
      setText(challengePool.join('\n'));
    }
  }, [challengePool]);

  const lines = text
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 0);

  const enough = lines.length >= hexCount;

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="font-bold text-sm text-slate-300 mb-3">Bulk Challenges</h3>

      <textarea
        value={text}
        onChange={e => setText(e.target.value)}
        placeholder="Paste challenges here, one per line..."
        className="w-full bg-slate-700 text-slate-100 rounded px-3 py-2 text-sm resize-none h-40 font-mono"
      />

      <div className="flex items-center justify-between mt-2">
        <span className={`text-xs ${enough ? 'text-slate-400' : 'text-amber-400'}`}>
          {lines.length} pasted / {hexCount} needed
          {lines.length > hexCount && ` (${lines.length - hexCount} extra — will be randomly excluded)`}
          {!enough && lines.length > 0 && ` (need ${hexCount - lines.length} more)`}
        </span>

        <div className="flex gap-2">
          {challengePool.length >= hexCount && (
            <button
              onClick={onShuffle}
              className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1.5 rounded text-xs font-medium transition-colors"
            >
              Shuffle
            </button>
          )}
          <button
            onClick={() => onAssign(lines)}
            disabled={!enough}
            className={`px-3 py-1.5 rounded text-xs font-medium transition-colors ${
              enough
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white'
                : 'bg-slate-700 text-slate-500 cursor-not-allowed'
            }`}
          >
            Assign Randomly
          </button>
        </div>
      </div>
    </div>
  );
}
