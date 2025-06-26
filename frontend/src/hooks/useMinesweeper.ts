import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useTimer } from "./useTimer";
import {
  Cell,
  defaultCell,
  Difficulty,
  DIFFICULTY_SETTINGS,
  Position,
} from "../types/minesweeper";

const isInsideBoard = (pos: Position, boardSize: number) => {
  return pos.y >= 0 && pos.x >= 0 && pos.y < boardSize && pos.x < boardSize;
};

const generateBoard = (
  firstClick: Position | null,
  boardSize: number,
  mineCount: number
): Cell[][] => {
  const board: Cell[][] = Array.from({ length: boardSize }, () =>
    Array.from({ length: boardSize }, () => ({ ...defaultCell }))
  );

  let minesPlaced = 0;
  while (minesPlaced < mineCount) {
    const y = Math.floor(Math.random() * boardSize);
    const x = Math.floor(Math.random() * boardSize);

    if (
      (!firstClick || y !== firstClick.y || x !== firstClick.x) &&
      !board[y][x].isMine
    ) {
      board[y][x].isMine = true;
      minesPlaced++;
    }
  }

  const getMineCount = (pos: Position) => {
    return [-1, 0, 1].reduce(
      (count, dy) =>
        count +
        [-1, 0, 1].reduce((c, dx) => {
          const ny = pos.y + dy,
            nx = pos.x + dx;
          return isInsideBoard({ y: ny, x: nx }, boardSize) &&
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

const checkGameClear = (board: Cell[][]) =>
  board.every((row) => row.every((cell) => cell.isMine || cell.isRevealed));

const countFlags = (board: Cell[][]): number =>
  board.reduce(
    (total, row) => total + row.filter((cell) => cell.isFlagged).length,
    0
  );

const expandCells = (
  board: Cell[][],
  startPos: Position,
  openCount: number,
  boardSize: number
): Cell[][] => {
  const newBoard = board.map((row) => row.map((cell) => ({ ...cell })));
  const opened = new Set<string>();
  const queue: Position[] = [startPos];

  while (queue.length > 0 && opened.size < openCount) {
    const { y, x } = queue.shift()!;
    if (
      opened.has(`${y},${x}`) ||
      !isInsideBoard({ y, x }, boardSize) ||
      newBoard[y][x].isRevealed ||
      newBoard[y][x].isMine
    ) {
      continue;
    }

    newBoard[y][x].isRevealed = true;
    opened.add(`${y},${x}`);

    [-1, 0, 1].forEach((dy) => {
      [-1, 0, 1].forEach((dx) => {
        const ny = y + dy,
          nx = x + dx;
        if (
          isInsideBoard({ y: ny, x: nx }, boardSize) &&
          !opened.has(`${ny},${nx}`)
        ) {
          queue.push({ y: ny, x: nx });
        }
      });
    });
  }

  return newBoard;
};

export const useMinesweeper = () => {
  const [currentDifficulty, setCurrentDifficulty] =
    useState<Difficulty>("medium");
  const {
    size: boardSize,
    mines: mineCount,
    initialReveal,
    additionalReveal,
  } = DIFFICULTY_SETTINGS[currentDifficulty];

  const [board, setBoard] = useState<Cell[][]>(
    generateBoard(null, boardSize, mineCount)
  );
  const [firstClick, setFirstClick] = useState<Position | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameClear, setGameClear] = useState(false);
  const [flagCount, setFlagCount] = useState(mineCount);
  const { time, isRunning, startTimer, stopTimer, resetTimer } = useTimer();

  const revealCell = useCallback(
    (pos: Position) => {
      if (gameOver || gameClear) return;

      if (!firstClick) {
        setFirstClick(pos);
        startTimer();
        const newBoard = generateBoard(pos, boardSize, mineCount);
        setBoard(
          expandCells(
            newBoard,
            pos,
            Math.floor(Math.random() * additionalReveal) + initialReveal,
            boardSize
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
                isInsideBoard({ y: ny, x: nx }, boardSize) &&
                !newBoard[ny][nx].isRevealed
              ) {
                revealCell({ y: ny, x: nx });
              }
            });
          });
        }

        if (checkGameClear(newBoard)) {
          setGameClear(true);

          // 成功時に保存
          const token = localStorage.getItem("authToken");
          if (!token) {
            console.log("トークンが存在しません");
          } else {
            console.log("トークン:", token);
          }
          if (token) {
            axios
              .post(
                "http://localhost:3001/api/clear_records",
                { clear_record: { time_in_seconds: time } },
                {
                  headers: {
                    Authorization: `Bearer ${token}`, // ← ここが必須！
                    "Content-Type": "application/json",
                  },
                }
              )
              .then(() => console.log("記録保存成功"))
              .catch((err) => console.error("記録保存失敗", err));
          } else {
            axios
              .post("http://localhost:3001/api/clear_records", {
                clear_record: { time_in_seconds: time },
              })
              .then(() => console.log("記録保存成功"))
              .catch((err) => console.error("記録保存失敗", err));
          }
        }

        if (newBoard[pos.y][pos.x].isMine) {
          setGameOver(true);
        }

        return newBoard;
      });
    },
    [
      additionalReveal,
      boardSize,
      firstClick,
      gameClear,
      gameOver,
      initialReveal,
      mineCount,
      startTimer,
      time,
    ]
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

      setFlagCount(mineCount - countFlags(newBoard));
      setBoard(newBoard);
    },
    [board, gameClear, gameOver, mineCount]
  );

  useEffect(() => {
    if (gameOver || gameClear) stopTimer();
  }, [gameOver, gameClear, stopTimer]);

  const resetGame = useCallback(() => {
    resetTimer();
    stopTimer();
    setGameOver(false);
    setGameClear(false);
    setFlagCount(mineCount);
    setBoard(generateBoard(null, boardSize, mineCount));
    setFirstClick(null);
  }, [boardSize, mineCount, resetTimer, stopTimer]);

  useEffect(() => {
    resetGame();
  }, [currentDifficulty, resetGame]);

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
    setCurrentDifficulty,
    currentDifficulty,
  };
};
