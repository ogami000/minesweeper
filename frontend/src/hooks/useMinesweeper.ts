import { useCallback, useEffect, useState } from "react";
import { useTimer } from "./useTimer";

const BOARD_SIZE = 10;
const MINE_COUNT = 20;

const defaultCell = {
  isMine: false,
  isRevealed: false,
  isFlagged: false,
  adjacentMines: 0,
};

type Cell = typeof defaultCell;
type Position = { y: number; x: number };

const generateBoard = (): Cell[][] => {
  const board: Cell[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({ ...defaultCell }))
  );

  let minesPlaced = 0;
  while (minesPlaced < MINE_COUNT) {
    const y = Math.floor(Math.random() * BOARD_SIZE);
    const x = Math.floor(Math.random() * BOARD_SIZE);
    if (!board[y][x].isMine) {
      board[y][x].isMine = true;
      minesPlaced++;
    }
  }

  const getMineCount = ({ y, x }: Position) => {
    return [-1, 0, 1].reduce(
      (count, dy) =>
        count +
        [-1, 0, 1].reduce((c, dx) => {
          const ny = y + dy,
            nx = x + dx;
          return ny >= 0 &&
            nx >= 0 &&
            ny < BOARD_SIZE &&
            nx < BOARD_SIZE &&
            board[ny][nx].isMine
            ? c + 1
            : c;
        }, 0),
      0
    );
  };

  return board.map((row, y) =>
    row.map((cell, x) => ({ ...cell, adjacentMines: getMineCount({ y, x }) }))
  );
};

export const useMinesweeper = () => {
  const [board, setBoard] = useState<Cell[][]>(generateBoard);
  const [gameOver, setGameOver] = useState(false);
  const { time, isRunning, startTimer, stopTimer, resetTimer } = useTimer();

  const revealCell = useCallback(
    (pos: Position) => {
      setBoard((prevBoard) => {
        if (
          gameOver ||
          prevBoard[pos.y][pos.x].isRevealed ||
          prevBoard[pos.y][pos.x].isFlagged
        )
          return prevBoard;

        const newBoard = prevBoard.map((row) =>
          row.map((cell) => ({ ...cell }))
        );
        newBoard[pos.y][pos.x].isRevealed = true;

        if (newBoard[pos.y][pos.x].isMine) {
          setGameOver(true);
        } else if (newBoard[pos.y][pos.x].adjacentMines === 0) {
          [-1, 0, 1].forEach((dy) => {
            [-1, 0, 1].forEach((dx) => {
              const ny = pos.y + dy,
                nx = pos.x + dx;
              if (
                ny >= 0 &&
                nx >= 0 &&
                ny < BOARD_SIZE &&
                nx < BOARD_SIZE &&
                !newBoard[ny][nx].isRevealed
              ) {
                revealCell({ y: ny, x: nx });
              }
            });
          });
        }

        return newBoard;
      });
    },
    [gameOver]
  );

  const toggleFlag = useCallback(
    (pos: Position, e: React.MouseEvent) => {
      e.preventDefault();
      if (gameOver || board[pos.y][pos.x].isRevealed) return;

      const newBoard = board.map((row) => [...row]);
      newBoard[pos.y][pos.x] = {
        ...newBoard[pos.y][pos.x],
        isFlagged: !newBoard[pos.y][pos.x].isFlagged,
      };

      setBoard(newBoard);
    },
    [board, gameOver]
  );

  useEffect(() => {
    if (gameOver) stopTimer();
  }, [gameOver, stopTimer]);

  const resetGame = useCallback(() => {
    resetTimer();
    startTimer();
    setGameOver(false);
    setBoard(generateBoard());
  }, [resetTimer, startTimer, setGameOver, setBoard]);

  return {
    board,
    gameOver,
    revealCell,
    toggleFlag,
    time,
    isRunning,
    resetGame,
  };
};
