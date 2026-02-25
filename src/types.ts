export type GameMode = 'classic' | 'time';

export interface BlockData {
  id: string;
  value: number;
  color: string;
}

export interface GameState {
  grid: (BlockData | null)[][];
  target: number;
  score: number;
  selectedIndices: { row: number; col: number }[];
  gameOver: boolean;
  mode: GameMode;
  timeLeft: number;
  combo: number;
}
