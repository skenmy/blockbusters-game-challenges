import { useState } from 'react';

interface Props {
  currentRows: number;
  currentCols: number;
  onUpdate: (rows: number, cols: number) => void;
}

export function GridConfigurator({ currentRows, currentCols, onUpdate }: Props) {
  const [rows, setRows] = useState(currentRows);
  const [cols, setCols] = useState(currentCols);

  function handleApply() {
    if (rows >= 2 && rows <= 8 && cols >= 2 && cols <= 8) {
      onUpdate(rows, cols);
    }
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4">
      <h3 className="font-bold text-sm text-slate-300 mb-3">Grid Size</h3>
      <div className="flex items-center gap-3">
        <label className="text-sm text-slate-400">
          Rows
          <input
            type="number"
            min={2}
            max={8}
            value={rows}
            onChange={e => setRows(Number(e.target.value))}
            className="ml-2 w-16 bg-slate-700 text-slate-100 rounded px-2 py-1 text-sm"
          />
        </label>
        <label className="text-sm text-slate-400">
          Cols
          <input
            type="number"
            min={2}
            max={8}
            value={cols}
            onChange={e => setCols(Number(e.target.value))}
            className="ml-2 w-16 bg-slate-700 text-slate-100 rounded px-2 py-1 text-sm"
          />
        </label>
        <button
          onClick={handleApply}
          className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-1 rounded text-sm font-medium transition-colors"
        >
          Apply
        </button>
      </div>
      <p className="text-xs text-slate-500 mt-2">
        Current: {currentRows} x {currentCols} ({currentRows * currentCols} hexes)
      </p>
    </div>
  );
}
