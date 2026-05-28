import { useState, useEffect } from 'react';
import type { HexCell, TeamId } from '../../types/game';

interface Props {
  hex: HexCell | null;
  onSetChallenge: (hexId: string, challenge: string) => void;
  onFlip: (hexId: string) => void;
  onAward: (hexId: string, teamId: TeamId) => void;
  onReset: (hexId: string) => void;
  team1Name: string;
  team2Name: string;
}

export function HexEditor({ hex, onSetChallenge, onFlip, onAward, onReset, team1Name, team2Name }: Props) {
  const [challenge, setChallenge] = useState('');

  useEffect(() => {
    if (hex) setChallenge(hex.challenge);
  }, [hex?.id, hex?.challenge]);

  if (!hex) {
    return (
      <div className="bg-slate-800 rounded-lg p-4">
        <h3 className="font-bold text-sm text-slate-300 mb-2">Hex Editor</h3>
        <p className="text-sm text-slate-500">Select a hex from the mini-map below</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="font-bold text-sm text-slate-300 mb-3">
        Hex {hex.letter} <span className="text-slate-500 font-normal">({hex.id})</span>
        <span className={`ml-2 text-xs px-2 py-0.5 rounded ${
          hex.status === 'idle' ? 'bg-slate-600 text-slate-300' :
          hex.status === 'flipping' ? 'bg-yellow-600 text-yellow-100' :
          hex.status === 'revealed' ? 'bg-purple-600 text-purple-100' :
          'bg-green-600 text-green-100'
        }`}>
          {hex.status}
        </span>
      </h3>

      {/* Challenge input */}
      <div className="mb-3">
        <textarea
          value={challenge}
          onChange={e => setChallenge(e.target.value)}
          placeholder="Enter challenge text..."
          className="w-full bg-slate-700 text-slate-100 rounded px-3 py-2 text-sm resize-none h-20"
        />
        <button
          onClick={() => onSetChallenge(hex.id, challenge)}
          className="mt-1 bg-slate-600 hover:bg-slate-500 text-white px-3 py-1 rounded text-xs font-medium transition-colors"
        >
          Save Challenge
        </button>
      </div>

      {/* Action buttons */}
      <div className="flex flex-wrap gap-2">
        {hex.status === 'idle' && (
          <button
            onClick={() => onFlip(hex.id)}
            className="bg-yellow-600 hover:bg-yellow-500 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Flip
          </button>
        )}
        {(hex.status === 'revealed' || hex.status === 'flipping') && (
          <>
            <button
              onClick={() => onAward(hex.id, 'team1')}
              className="bg-blue-600 hover:bg-blue-500 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Award to {team1Name}
            </button>
            <button
              onClick={() => onAward(hex.id, 'team2')}
              className="bg-red-600 hover:bg-red-500 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
            >
              Award to {team2Name}
            </button>
          </>
        )}
        {hex.status !== 'idle' && (
          <button
            onClick={() => onReset(hex.id)}
            className="bg-slate-600 hover:bg-slate-500 text-white px-3 py-1.5 rounded text-sm font-medium transition-colors"
          >
            Reset Hex
          </button>
        )}
      </div>
    </div>
  );
}
