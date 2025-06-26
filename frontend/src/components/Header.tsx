import axios from "axios";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Hamburger } from "./Hamburger";

export const Header: React.FC = () => {
  const [nickname, setNickname] = useState<string>("");

  axios
    .get("http://localhost:3001/me", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("authToken")}`,
      },
    })
    .then((res) => {
      setNickname(res.data.nickname);
    })
    .catch((err) => {
      console.error("認証エラーや未ログインです", err);
    });

  return (
    <header className="bg-white shadow-md py-2 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">
        <Link to="/">マインスイーパー</Link>
      </h1>
      <div className="flex gap-2 items-center">
        {nickname && <span>{nickname} さん</span>}
        <Hamburger />
      </div>
    </header>
  );
};
