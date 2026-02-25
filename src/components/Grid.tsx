import { BlockData } from '../types';
import { Block } from './Block';

interface GridProps {
  grid: (BlockData | null)[][];
  selectedIndices: { row: number; col: number }[];
  onBlockClick: (row: number, col: number) => void;
}

export const Grid = ({ grid, selectedIndices, onBlockClick }: GridProps) => {
  return (
    <div className="grid grid-cols-7 gap-1 p-2 bg-white/10 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/20">
      {grid.map((row, r) =>
        row.map((block, c) => (
          <div key={`${r}-${c}-${block?.id || 'empty'}`}>
            <Block
              block={block}
              isSelected={selectedIndices.some(idx => idx.row === r && idx.col === c)}
              onClick={() => onBlockClick(r, c)}
            />
          </div>
        ))
      )}
    </div>
  );
};
