export const defaultCell = {
  isMine: false,
  isRevealed: false,
  isFlagged: false,
  adjacentMines: 0,
};

export const DIFFICULTY_SETTINGS: Record<
  Difficulty,
  {
    size: number;
    mines: number;
    initialReveal: number;
    additionalReveal: number;
  }
> = {
  // easy: { size: 8, mines: 10, initialReveal: 6, additionalReveal: 8 },
  easy: { size: 4, mines: 1, initialReveal: 6, additionalReveal: 8 },
  // medium: { size: 10, mines: 20, initialReveal: 8, additionalReveal: 10 },
  medium: { size: 4, mines: 1, initialReveal: 6, additionalReveal: 8 },
  hard: { size: 15, mines: 50, initialReveal: 12, additionalReveal: 14 },
};

export type Cell = typeof defaultCell;
export type Position = { y: number; x: number };
export type Difficulty = "easy" | "medium" | "hard";
