import { useMinesweeper } from "../hooks/useMinesweeper";
import { Timer } from "../components/Timer";
import { ResetButton } from "../components/ResetButton";

export const Minesweeper = () => {
  const { board, revealCell, gameOver, time, toggleFlag, resetGame } =
    useMinesweeper();

  return (
    <div>
      <h1 className="text-4xl text-center my-4">Minesweeper</h1>
      <div className="flex justify-center items-center gap-10">
        <Timer time={time} />
        <ResetButton onReset={resetGame} />
      </div>
      <div className="text-center pt-4 text-3xl text-red-500">
        {gameOver && "GameOver"}
      </div>
      <div className="flex justify-center mt-20">
        <table className="border border-black border-collapse">
          <tbody>
            {board.map((row, y) => (
              <tr key={y}>
                {row.map((cell, x) => (
                  <td
                    key={`${y}-${x}`}
                    onClick={() => revealCell({ y, x })}
                    onContextMenu={(e) => toggleFlag({ y, x }, e)}
                    className={`w-10 h-10 text-center align-middle cursor-pointer border border-black
                    ${cell.isRevealed ? (cell.isMine ? "bg-red-500" : "bg-gray-300") : "bg-gray-100"}`}
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
  );
};
