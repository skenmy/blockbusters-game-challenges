import type { HexCell } from '../../types/game';
import '../hex/hex.css';

interface Props {
  hexes: HexCell[];
  rows: number;
  cols: number;
  selectedHexId: string | null;
  team1Color: string;
  team2Color: string;
  onSelect: (hexId: string) => void;
}

const EDGE_THICKNESS = 4;

export function HexMiniMap({ hexes, rows, cols, selectedHexId, team1Color, team2Color, onSelect }: Props) {
  const hexSize = 52;
  const hexHeight = hexSize * 0.866;
  const colStep = hexSize * 0.75;

  const gridWidth = (cols - 1) * colStep + hexSize;
  const gridHeight = rows * hexHeight + hexHeight * 0.5;

  function getHexBg(hex: HexCell): string {
    if (hex.awardedTo === 'team1') return team1Color;
    if (hex.awardedTo === 'team2') return team2Color;
    if (hex.status === 'revealed' || hex.status === 'flipping') return '#7c3aed';
    return '#334155';
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="font-bold text-sm text-slate-300 mb-3">Hex Map</h3>
      <div
        className="relative mx-auto"
        style={{
          width: gridWidth,
          height: gridHeight,
        }}
      >
        {/* Top edge — N/S team */}
        <div
          style={{
            position: 'absolute',
            top: -EDGE_THICKNESS - 1,
            left: 0,
            right: 0,
            height: EDGE_THICKNESS,
            backgroundColor: team1Color,
            borderRadius: EDGE_THICKNESS / 2,
          }}
        />
        {/* Bottom edge — N/S team */}
        <div
          style={{
            position: 'absolute',
            bottom: -EDGE_THICKNESS - 1,
            left: 0,
            right: 0,
            height: EDGE_THICKNESS,
            backgroundColor: team1Color,
            borderRadius: EDGE_THICKNESS / 2,
          }}
        />
        {/* Left edge — E/W team */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: -EDGE_THICKNESS - 1,
            width: EDGE_THICKNESS,
            bottom: 0,
            backgroundColor: team2Color,
            borderRadius: EDGE_THICKNESS / 2,
          }}
        />
        {/* Right edge — E/W team */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: -EDGE_THICKNESS - 1,
            width: EDGE_THICKNESS,
            bottom: 0,
            backgroundColor: team2Color,
            borderRadius: EDGE_THICKNESS / 2,
          }}
        />

        {hexes.map(hex => {
          const isOddCol = hex.col % 2 === 1;
          return (
            <div
              key={hex.id}
              className={`hex-mini absolute text-white ${selectedHexId === hex.id ? 'selected' : ''}`}
              style={{
                width: hexSize,
                height: hexHeight,
                left: hex.col * colStep,
                top: hex.row * hexHeight + (isOddCol ? hexHeight / 2 : 0),
                backgroundColor: getHexBg(hex),
              }}
              onClick={() => onSelect(hex.id)}
            >
              {hex.letter}
              {hex.challenge ? '' : <span className="text-[8px] text-slate-400 absolute bottom-1">...</span>}
            </div>
          );
        })}
      </div>
    </div>
  );
}
