import React, { useState } from "react";
import axios from "axios";

interface LoginData {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:3001/login", {
        user: { email, password },
      });
      setToken(response.data.authorization); // JWTトークンを状態に保存
      alert("ログイン成功！");
      // トークンを localStorage に保存
      localStorage.setItem("authToken", response.data.authorization);
    } catch (err) {
      setError(
        "ログインに失敗しました。メールアドレスとパスワードを確認してください。"
      );
    }
  };

  return (
    <div>
      <h2>ログイン</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleLogin}>
        <div>
          <label>メールアドレス</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label>パスワード</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">ログイン</button>
      </form>
      {token && <p>取得したトークン: {token}</p>}
    </div>
  );
};

export default Login;
