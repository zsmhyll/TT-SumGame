import { useState, useEffect, useCallback, useRef } from 'react';
import { BlockData, GameMode, GameState } from '../types';
import { GRID_ROWS, GRID_COLS, INITIAL_ROWS, MAX_VALUE, MIN_VALUE, COLORS, TARGET_RANGE, TIME_LIMIT } from '../constants';

const generateBlock = (): BlockData => ({
  id: Math.random().toString(36).substr(2, 9),
  value: Math.floor(Math.random() * (MAX_VALUE - MIN_VALUE + 1)) + MIN_VALUE,
  color: COLORS[Math.floor(Math.random() * COLORS.length)],
});

const generateTarget = () => Math.floor(Math.random() * (TARGET_RANGE.max - TARGET_RANGE.min + 1)) + TARGET_RANGE.min;

export const useGameLogic = (mode: GameMode) => {
  const [state, setState] = useState<GameState>(() => {
    const grid: (BlockData | null)[][] = Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null));
    
    // Fill initial rows at the bottom
    for (let r = GRID_ROWS - INITIAL_ROWS; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        grid[r][c] = generateBlock();
      }
    }

    return {
      grid,
      target: generateTarget(),
      score: 0,
      selectedIndices: [],
      gameOver: false,
      mode,
      timeLeft: TIME_LIMIT,
      combo: 1,
    };
  });

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const addRow = useCallback(() => {
    setState(prev => {
      // Check if any block is in the top row
      if (prev.grid[0].some(cell => cell !== null)) {
        return { ...prev, gameOver: true };
      }

      const newGrid = prev.grid.map((row, r) => {
        if (r === 0) return prev.grid[1]; // This is actually shifting down if we think 0 is top
        // We want to shift everything UP
        return prev.grid[r + 1] || Array(GRID_COLS).fill(null).map(() => generateBlock());
      });

      // Correct logic for shifting UP:
      // Row 0 gets Row 1, Row 1 gets Row 2, ..., Row N-1 gets new row
      const shiftedGrid: (BlockData | null)[][] = [];
      for (let r = 0; r < GRID_ROWS - 1; r++) {
        shiftedGrid[r] = [...prev.grid[r + 1]];
      }
      shiftedGrid[GRID_ROWS - 1] = Array(GRID_COLS).fill(null).map(() => generateBlock());

      // Check game over after shift
      if (prev.grid[0].some(cell => cell !== null)) {
        return { ...prev, gameOver: true };
      }

      return { ...prev, grid: shiftedGrid, timeLeft: TIME_LIMIT };
    });
  }, []);

  const selectBlock = (row: number, col: number) => {
    if (state.gameOver) return;

    setState(prev => {
      const isSelected = prev.selectedIndices.some(idx => idx.row === row && idx.col === col);
      let newSelected = [...prev.selectedIndices];

      if (isSelected) {
        newSelected = newSelected.filter(idx => !(idx.row === row && idx.col === col));
      } else {
        newSelected.push({ row, col });
      }

      const currentSum = newSelected.reduce((sum, idx) => sum + (prev.grid[idx.row][idx.col]?.value || 0), 0);

      if (currentSum === prev.target) {
        // Success! Clear blocks
        const newGrid = prev.grid.map(r => [...r]);
        newSelected.forEach(idx => {
          newGrid[idx.row][idx.col] = null;
        });

        // Apply gravity (optional, but prompt says "selected blocks will be eliminated")
        // In Blokmatik, they usually don't fall, but let's see. 
        // Actually, if they don't fall, the game gets harder. Let's stick to the prompt.
        
        const nextState = {
          ...prev,
          grid: newGrid,
          score: prev.score + (currentSum * newSelected.length * prev.combo),
          selectedIndices: [],
          target: generateTarget(),
          combo: prev.combo + 1,
          timeLeft: TIME_LIMIT,
        };

        // In classic mode, add a row after success
        if (mode === 'classic') {
          // We'll handle the row addition in a separate effect or here
          // Adding it here for immediate feedback
          return addRowToState(nextState);
        }

        return nextState;
      } else if (currentSum > prev.target) {
        // Exceeded target, reset selection
        return { ...prev, selectedIndices: [], combo: 1 };
      }

      return { ...prev, selectedIndices: newSelected };
    });
  };

  const addRowToState = (prevState: GameState): GameState => {
    if (prevState.grid[0].some(cell => cell !== null)) {
      return { ...prevState, gameOver: true };
    }
    const shiftedGrid: (BlockData | null)[][] = [];
    for (let r = 0; r < GRID_ROWS - 1; r++) {
      shiftedGrid[r] = [...prevState.grid[r + 1]];
    }
    shiftedGrid[GRID_ROWS - 1] = Array(GRID_COLS).fill(null).map(() => generateBlock());
    
    return { ...prevState, grid: shiftedGrid };
  };

  // Timer for Time Mode
  useEffect(() => {
    if (mode === 'time' && !state.gameOver) {
      timerRef.current = setInterval(() => {
        setState(prev => {
          if (prev.timeLeft <= 1) {
            // Time's up, add row and reset timer
            const next = addRowToState(prev);
            return { ...next, timeLeft: TIME_LIMIT, combo: 1 };
          }
          return { ...prev, timeLeft: prev.timeLeft - 1 };
        });
      }, 1000);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [mode, state.gameOver]);

  const resetGame = () => {
    const grid: (BlockData | null)[][] = Array(GRID_ROWS).fill(null).map(() => Array(GRID_COLS).fill(null));
    for (let r = GRID_ROWS - INITIAL_ROWS; r < GRID_ROWS; r++) {
      for (let c = 0; c < GRID_COLS; c++) {
        grid[r][c] = generateBlock();
      }
    }
    setState({
      grid,
      target: generateTarget(),
      score: 0,
      selectedIndices: [],
      gameOver: false,
      mode,
      timeLeft: TIME_LIMIT,
      combo: 1,
    });
  };

  return { state, selectBlock, resetGame };
};
