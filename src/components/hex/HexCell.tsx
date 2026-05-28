import type { HexCell as HexCellType } from '../../types/game';
import './hex.css';

interface Props {
  hex: HexCellType;
  size: number;
  team1Color: string;
  team2Color: string;
  onClick?: () => void;
}

export function HexCell({ hex, size, team1Color, team2Color, onClick }: Props) {
  const isFlipped = hex.status === 'flipping' || hex.status === 'revealed' || hex.status === 'awarded';
  const awardedClass = hex.awardedTo ? `awarded-${hex.awardedTo}` : '';

  const letterSize = size * 0.35;
  const challengeSize = Math.max(10, size * 0.1);

  return (
    <div
      className="hex-scene"
      style={{
        width: size,
        height: size * 0.866,
        ['--team1-color' as string]: team1Color,
        ['--team2-color' as string]: team2Color,
      }}
      onClick={onClick}
    >
      <div className={`hex-card ${isFlipped ? 'flipped' : ''} ${awardedClass}`}>
        <div className="hex-face hex-front">
          <span className="hex-letter" style={{ fontSize: letterSize }}>
            {hex.letter}
          </span>
        </div>
        <div className="hex-face hex-back">
          {hex.awardedTo ? (
            <span className="hex-letter" style={{ fontSize: letterSize }}>
              {hex.letter}
            </span>
          ) : (
            <span className="hex-challenge" style={{ fontSize: challengeSize }}>
              {hex.challenge || '?'}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
