import { useMinesweeper } from "../hooks/useMinesweeper";
import { Timer } from "../components/Timer";
import { ResetButton } from "../components/ResetButton";
import { Difficulty } from "../types/minesweeper";
import { CenteredWrapper } from "../components/CenteredWrapper";

export const Minesweeper = () => {
  const {
    board,
    revealCell,
    gameOver,
    gameClear,
    flagCount,
    time,
    toggleFlag,
    resetGame,
    setCurrentDifficulty,
    currentDifficulty,
  } = useMinesweeper();

  return (
    <CenteredWrapper>
      <div className="bg-white p-8 rounded-xl shadow-lg w-full max-w-2xl">
        {/* <h1 className="text-4xl text-center mb-4">Minesweeper</h1> */}
        <div className="flex justify-center items-center gap-10 mb-4">
          <div className="flex justify-center items-center">
            <label className="mr-2 font-bold">難易度:</label>
            <select
              className="border border-gray-400 p-1 rounded"
              value={currentDifficulty}
              onChange={(e) =>
                setCurrentDifficulty(e.target.value as Difficulty)
              }
            >
              <option value="easy">低</option>
              <option value="medium">中</option>
              <option value="hard">高</option>
            </select>
          </div>
          <Timer time={time} />
          <span className="w-13"> 🚩: {flagCount}</span>
          <ResetButton onReset={resetGame} />
        </div>
        <div
          className={`text-center text-3xl mb-4 ${gameOver ? "text-red-500" : "text-green-500"}`}
        >
          {gameOver && "GameOver"}
          {gameClear && "GameClear"}
        </div>
        <div className="flex justify-center">
          <table className="border border-black border-collapse">
            <tbody>
              {board.map((row, y) => (
                <tr key={y}>
                  {row.map((cell, x) => (
                    <td
                      key={`${y}-${x}`}
                      onClick={() => revealCell({ y, x })}
                      onContextMenu={(e) => toggleFlag({ y, x }, e)}
                      className={`w-8 h-8 text-center align-middle  border border-black
                  ${cell.isRevealed ? (cell.isMine ? "bg-red-500" : "bg-gray-300") : "bg-gray-100 cursor-pointer hover:bg-green-200 "}`}
                    >
                      {cell.isRevealed
                        ? cell.isMine
                          ? "💣"
                          : cell.adjacentMines > 0 && cell.adjacentMines
                        : cell.isFlagged && "🚩"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </CenteredWrapper>
  );
};
