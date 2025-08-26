import React, { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { CenteredWrapper } from "../components/CenteredWrapper";
import { API_URL } from "../config/vite";
import { useAuth } from "../context/AuthContext";

export const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${API_URL}/api/login`, {
        user: { email, password },
      });
      const token = response.data.authorization;
      localStorage.setItem("authToken", token);
      setToken(token); // Context に反映
      navigate("/");
    } catch (e) {
      setError(`ログイン失敗です。${e}`);
    }
  };

  return (
    <CenteredWrapper>
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">ログイン</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <label>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-xl"
          />
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-2 border rounded-xl"
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 mt-4 rounded-xl"
          >
            ログイン
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          アカウントをお持ちでない方は <Link to="/signup">こちら</Link>
        </p>
      </div>
    </CenteredWrapper>
  );
};
