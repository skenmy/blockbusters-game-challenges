import type { HexCell } from '../../types/game';

interface Props {
  hex: HexCell | null;
  onClose: () => void;
}

export function ChallengeOverlay({ hex, onClose }: Props) {
  if (!hex || hex.status === 'idle' || hex.status === 'awarded') return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-slate-800 rounded-2xl p-10 max-w-2xl w-full mx-6 text-center shadow-2xl border border-slate-600 animate-[fadeIn_0.3s_ease-out]"
        onClick={e => e.stopPropagation()}
      >
        <div className="text-6xl font-black text-blue-400 mb-6">{hex.letter}</div>
        <div className="text-2xl text-slate-100 leading-relaxed">
          {hex.challenge || 'No challenge set'}
        </div>
      </div>
    </div>
  );
}
