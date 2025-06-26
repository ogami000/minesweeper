import React, { useState, useEffect } from "react";
import axios from "axios";

interface ApiResponse {
  id: number;
  name: string;
  email: string;
}

export const FetchData: React.FC = () => {
  const [data, setData] = useState<ApiResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    axios
      .get("https://api.example.com/data")
      .then((response) => {
        setData(response.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <p>読み込み中...</p>;
  }

  return (
    <div>
      <h1>データ:</h1>
      {data ? (
        <pre>{JSON.stringify(data, null, 2)}</pre>
      ) : (
        <p>データが見つかりませんでした</p>
      )}
    </div>
  );
};
