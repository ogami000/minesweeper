import { useState } from "react";

// 盤面のサイズ & 地雷数
const BOARD_SIZE = 10;
const MINE_COUNT = 5;

type Cell = {
  isMine: boolean; //爆弾
  isRevealed: boolean; //生還
  isFlagged: boolean; //フラグ
  adjacentMines: number; //周囲の爆弾数
};

const generateBoard = (): Cell[][] => {
  let board: Cell[][] = Array(BOARD_SIZE)
    .fill(null)
    .map(() =>
      Array(BOARD_SIZE).fill({
        isMine: false,
        isRevealed: false,
        isFlagged: false,
        adjacentMines: 0,
      })
    );

  // 地雷をランダム配置
  let minesPlaced = 0;
  while (minesPlaced < MINE_COUNT) {
    const y = Math.floor(Math.random() * BOARD_SIZE);
    const x = Math.floor(Math.random() * BOARD_SIZE);
    if (!board[y][x].isMine) {
      board[y][x] = { ...board[y][x], isMine: true };
      minesPlaced++;
    }
  }

  // 各セルの周囲の地雷数を計算
  const getMineCount = (y: number, x: number) => {
    let count = 0;
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const ny = y + dy;
        const nx = x + dx;
        if (ny >= 0 && nx >= 0 && ny < BOARD_SIZE && nx < BOARD_SIZE) {
          if (board[ny][nx].isMine) count++;
        }
      }
    }
    return count;
  };

  // 2D 配列を正しくマッピング
  board = board.map((row, y) =>
    row.map((cell, x) => ({
      ...cell,
      adjacentMines: getMineCount(y, x),
    }))
  );

  return board;
};

export const Home = () => {
  const [board, setBoard] = useState<Cell[][]>(generateBoard);
  const [gameOver, setGameOver] = useState(false);

  // セルを開く処理
  const revealCell = (y: number, x: number) => {
    if (gameOver || board[y][x].isRevealed || board[y][x].isFlagged) return;

    const newBoard = [...board];
    newBoard[y][x] = { ...newBoard[y][x], isRevealed: true };

    if (newBoard[y][x].isMine) {
      setGameOver(true);
    } else if (newBoard[y][x].adjacentMines === 0) {
      // 再帰的に開く
      for (let dy = -1; dy <= 1; dy++) {
        for (let dx = -1; dx <= 1; dx++) {
          const ny = y + dy;
          const nx = x + dx;
          if (ny >= 0 && nx >= 0 && ny < BOARD_SIZE && nx < BOARD_SIZE) {
            if (!newBoard[ny][nx].isRevealed) revealCell(ny, nx);
          }
        }
      }
    }

    setBoard(newBoard);
  };

  // フラグを設置・解除
  const toggleFlag = (y: number, x: number, e: React.MouseEvent) => {
    e.preventDefault();
    if (gameOver || board[y][x].isRevealed) return;

    const newBoard = [...board];
    newBoard[y] = [...newBoard[y]]; // ネストされた配列を変更するためにスプレッド演算子でコピー
    newBoard[y][x] = {
      ...newBoard[y][x],
      isFlagged: !newBoard[y][x].isFlagged,
    };

    setBoard(newBoard);
  };

  return (
    <div>
      <h1>マインスイーパー</h1>
      {gameOver && <h2>ゲームオーバー</h2>}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${BOARD_SIZE}, 30px)`,
          gap: "2px",
        }}
      >
        {board.map((row, y) =>
          row.map((cell, x) => (
            <div
              key={`${y}-${x}`}
              onClick={() => revealCell(y, x)}
              onContextMenu={(e) => toggleFlag(y, x, e)}
              style={{
                width: "30px",
                height: "30px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: cell.isRevealed
                  ? cell.isMine
                    ? "red"
                    : "lightgray"
                  : "darkgray",
                border: "1px solid black",
                cursor: "pointer",
              }}
            >
              {cell.isRevealed
                ? cell.isMine
                  ? "💣"
                  : cell.adjacentMines > 0
                    ? cell.adjacentMines
                    : ""
                : cell.isFlagged
                  ? "🚩"
                  : ""}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
