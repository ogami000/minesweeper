import React, { useState, useEffect } from "react";
import { CenteredWrapper } from "../components/CenteredWrapper";
import axios from "axios";
import { ClearRecord } from "../types/ranking";
import { Difficulty } from "../types/minesweeper";

export const Ranking: React.FC = () => {
  const [data, setData] = useState<ClearRecord[]>([]);
  const [difficulty, setDifficulty] = useState<Difficulty>("medium");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get("http://localhost:3001/api/clear_records")
      .then((res) => {
        setData(res.data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("取得失敗", err);
        setLoading(false);
      });
  }, []);

  const filtered = data
    .filter((record) => record.difficulty === difficulty)
    .sort((a, b) => a.time_in_seconds - b.time_in_seconds);

  return (
    <CenteredWrapper>
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-2xl">
        <label className="mr-2 font-bold">難易度:</label>
        <select
          className="border border-gray-400 p-1 rounded"
          value={difficulty}
          onChange={(e) => setDifficulty(e.target.value as Difficulty)}
        >
          <option value="easy">低</option>
          <option value="medium">中</option>
          <option value="hard">難</option>
        </select>

        {loading ? (
          <p>読み込み中...</p>
        ) : (
          <div className="max-h-[300px] overflow-y-auto border border-gray-300 mt-4">
            <table className="w-full border-collapse">
              <thead className="sticky top-0 bg-gray-100">
                <tr>
                  <th className="text-left p-2">順位</th>
                  <th className="text-left p-2">ニックネーム</th>
                  <th className="text-left p-2">タイム（秒）</th>
                  <th className="text-left p-2">日付</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((record, index) => (
                  <tr key={record.id}>
                    <td className="p-2">{index + 1}</td>
                    <td className="p-2">{record.nickname ?? "ゲスト"}</td>
                    <td className="p-2">{record.time_in_seconds}</td>
                    <td className="p-2">
                      {new Date(record.created_at).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </CenteredWrapper>
  );
};
