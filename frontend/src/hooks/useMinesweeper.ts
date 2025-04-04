import { useCallback, useEffect, useState } from "react";
import { useTimer } from "./useTimer";

const BOARD_SIZE = 10;
const MINE_COUNT = 20;
const INITIAL_REVEAL_COUNT = 6;
const ADDITIONAL_REVEAL_COUNT = 8;

const defaultCell = {
  isMine: false,
  isRevealed: false,
  isFlagged: false,
  adjacentMines: 0,
};

type Cell = typeof defaultCell;
type Position = { y: number; x: number };

const isInsideBoard = (pos: Position) => {
  return pos.y >= 0 && pos.x >= 0 && pos.y < BOARD_SIZE && pos.x < BOARD_SIZE;
};

// ボード生成（最初のクリック位置を考慮）
const generateBoard = (firstClick: Position | null): Cell[][] => {
  const board: Cell[][] = Array.from({ length: BOARD_SIZE }, () =>
    Array.from({ length: BOARD_SIZE }, () => ({ ...defaultCell }))
  );

  // MINE_COUNTの数だけ爆弾ランダム生成
  let minesPlaced = 0;
  while (minesPlaced < MINE_COUNT) {
    const y = Math.floor(Math.random() * BOARD_SIZE);
    const x = Math.floor(Math.random() * BOARD_SIZE);

    if (
      (!firstClick || y !== firstClick.y || x !== firstClick.x) &&
      !board[y][x].isMine
    ) {
      board[y][x].isMine = true;
      minesPlaced++;
    }
  }

  // 周囲の爆弾数を計算
  const getMineCount = (pos: Position) => {
    return [-1, 0, 1].reduce(
      (count, dy) =>
        count +
        [-1, 0, 1].reduce((c, dx) => {
          const ny = pos.y + dy,
            nx = pos.x + dx;
          return isInsideBoard({ y: ny, x: nx }) && board[ny][nx].isMine
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

const checkGameClear = (board: Cell[][]) => {
  return board.every((row) =>
    row.every((cell) => cell.isMine || cell.isRevealed)
  );
};

const countFlags = (board: Cell[][]): number => {
  return board.reduce(
    (total, row) => total + row.filter((cell) => cell.isFlagged).length,
    0
  );
};

// 隣接するセルを開放
const expandCells = (
  board: Cell[][],
  startPos: Position,
  openCount: number
): Cell[][] => {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  const opened = new Set<string>();
  const queue: Position[] = [startPos];

  while (queue.length > 0 && opened.size < openCount) {
    const { x, y } = queue.shift()!;
    if (
      opened.has(`${x},${y}`) ||
      !isInsideBoard({ x, y }) ||
      newBoard[y][x].isRevealed ||
      newBoard[y][x].isMine
    ) {
      continue;
    }

    newBoard[y][x].isRevealed = true;
    opened.add(`${x},${y}`);

    [-1, 0, 1].forEach((dy) => {
      [-1, 0, 1].forEach((dx) => {
        const nx = x + dx,
          ny = y + dy;
        if (isInsideBoard({ x: nx, y: ny }) && !opened.has(`${nx},${ny}`)) {
          queue.push({ x: nx, y: ny });
        }
      });
    });
  }

  return newBoard;
};

export const useMinesweeper = () => {
  const [board, setBoard] = useState<Cell[][]>(generateBoard(null));
  const [firstClick, setFirstClick] = useState<Position | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameClear, setGameClear] = useState(false);
  const [flagCount, setFlagCount] = useState(MINE_COUNT);
  const { time, isRunning, startTimer, stopTimer, resetTimer } = useTimer();

  // セルを開放
  const revealCell = useCallback(
    (pos: Position) => {
      if (gameOver || gameClear) return;

      if (!firstClick) {
        setFirstClick(pos);
        const newBoard = generateBoard(pos);
        setBoard(
          expandCells(
            newBoard,
            pos,
            Math.floor(Math.random() * ADDITIONAL_REVEAL_COUNT) +
              INITIAL_REVEAL_COUNT
          )
        );
        return;
      }

      setBoard((prevBoard) => {
        if (
          gameOver ||
          gameClear ||
          prevBoard[pos.y][pos.x].isRevealed ||
          prevBoard[pos.y][pos.x].isFlagged
        )
          return prevBoard;

        const newBoard = prevBoard.map((row) =>
          row.map((cell) => ({ ...cell }))
        );
        newBoard[pos.y][pos.x].isRevealed = true;

        if (newBoard[pos.y][pos.x].adjacentMines === 0) {
          [-1, 0, 1].forEach((dy) => {
            [-1, 0, 1].forEach((dx) => {
              const ny = pos.y + dy;
              const nx = pos.x + dx;
              if (
                isInsideBoard({ y: ny, x: nx }) &&
                !newBoard[ny][nx].isRevealed
              ) {
                revealCell({ y: ny, x: nx });
              }
            });
          });
        }

        if (checkGameClear(newBoard)) {
          setGameClear(true);
        }

        if (newBoard[pos.y][pos.x].isMine) {
          setGameOver(true);
        }

        return newBoard;
      });
    },
    [firstClick, gameClear, gameOver]
  );

  const toggleFlag = useCallback(
    (pos: Position, e: React.MouseEvent) => {
      e.preventDefault();
      if (gameOver || gameClear || board[pos.y][pos.x].isRevealed) return;

      const newBoard = board.map((row) => [...row]);
      newBoard[pos.y][pos.x] = {
        ...newBoard[pos.y][pos.x],
        isFlagged: !newBoard[pos.y][pos.x].isFlagged,
      };

      setFlagCount(MINE_COUNT - countFlags(newBoard));

      setBoard(newBoard);
    },
    [board, gameClear, gameOver]
  );

  useEffect(() => {
    if (gameOver || gameClear) stopTimer();
  }, [gameOver, gameClear, stopTimer]);

  const resetGame = useCallback(() => {
    resetTimer();
    startTimer();
    setGameOver(false);
    setGameClear(false);
    setFlagCount(MINE_COUNT);
    setBoard(generateBoard(null));
    setFirstClick(null);
  }, [
    resetTimer,
    startTimer,
    setGameOver,
    setGameClear,
    setFlagCount,
    setBoard,
  ]);

  return {
    board,
    gameOver,
    gameClear,
    flagCount,
    revealCell,
    toggleFlag,
    time,
    isRunning,
    resetGame,
  };
};
