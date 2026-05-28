import { useRef, useState, useEffect, useCallback } from 'react';
import { HexCell } from './HexCell';
import type { HexCell as HexCellType } from '../../types/game';

interface Props {
  hexes: HexCellType[];
  rows: number;
  cols: number;
  team1Color: string;
  team2Color: string;
  onHexClick?: (hexId: string) => void;
}

const EDGE_THICKNESS = 6;

export function HexGrid({ hexes, rows, cols, team1Color, team2Color, onHexClick }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [hexSize, setHexSize] = useState(100);

  const computeSize = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;

    const containerW = el.clientWidth;
    const containerH = el.clientHeight;

    // Flat-top hex: width = hexSize, height = hexSize * 0.866
    // Columns spaced at 0.75 * width; odd columns offset down by height / 2
    const totalHexW = (cols - 1) * 0.75 + 1; // in hex-width units
    const totalHexH = (rows + 0.5) * 0.866;  // in hex-size units (half-hex col offset)
    const pad = (EDGE_THICKNESS + 4) * 2;

    const sizeByW = (containerW - pad) / totalHexW;
    const sizeByH = (containerH - pad) / totalHexH;

    setHexSize(Math.max(40, Math.floor(Math.min(sizeByW, sizeByH))));
  }, [rows, cols]);

  useEffect(() => {
    computeSize();
    const observer = new ResizeObserver(computeSize);
    if (containerRef.current) observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, [computeSize]);

  const hexWidth = hexSize;
  const hexHeight = hexSize * 0.866;
  const colStep = hexWidth * 0.75;

  const gridWidth = (cols - 1) * colStep + hexWidth;
  const gridHeight = rows * hexHeight + hexHeight * 0.5;

  return (
    <div ref={containerRef} className="w-full h-full flex items-center justify-center overflow-hidden">
      <div
        style={{
          position: 'relative',
          width: gridWidth,
          height: gridHeight,
        }}
      >
        {/* Top edge — N/S team color */}
        <div
          style={{
            position: 'absolute',
            top: -EDGE_THICKNESS - 2,
            left: 0,
            right: 0,
            height: EDGE_THICKNESS,
            backgroundColor: team1Color,
            borderRadius: EDGE_THICKNESS / 2,
          }}
        />
        {/* Bottom edge — N/S team color */}
        <div
          style={{
            position: 'absolute',
            bottom: -EDGE_THICKNESS - 2,
            left: 0,
            right: 0,
            height: EDGE_THICKNESS,
            backgroundColor: team1Color,
            borderRadius: EDGE_THICKNESS / 2,
          }}
        />
        {/* Left edge — E/W team color */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: -EDGE_THICKNESS - 2,
            width: EDGE_THICKNESS,
            bottom: 0,
            backgroundColor: team2Color,
            borderRadius: EDGE_THICKNESS / 2,
          }}
        />
        {/* Right edge — E/W team color */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: -EDGE_THICKNESS - 2,
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
              style={{
                position: 'absolute',
                left: hex.col * colStep,
                top: hex.row * hexHeight + (isOddCol ? hexHeight / 2 : 0),
              }}
            >
              <HexCell
                hex={hex}
                size={hexSize}
                team1Color={team1Color}
                team2Color={team2Color}
                onClick={() => onHexClick?.(hex.id)}
              />
            </div>
          );
        })}
      </div>
    </div>
  );
}
