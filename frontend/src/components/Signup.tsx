import React, { useState } from "react";
import axios from "axios";

interface UserData {
  nickname: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

const Signup: React.FC = () => {
  const [nickname, setNickname] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>("");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== passwordConfirmation) {
      setError("パスワードが一致しません");
      return;
    }

    try {
      const response = await axios.post("http://localhost:3001/signup", {
        user: {
          nickname,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
      });
      alert("登録成功！");
      // 登録成功後の処理（リダイレクトなど）
    } catch (err) {
      setError(`登録に失敗しました。再度お試しください${err}`);
    }
  };

  return (
    <div>
      <h2>サインアップ</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>ニックネーム</label>
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            required
          />
        </div>
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
        <div>
          <label>パスワード確認</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            required
          />
        </div>
        <button type="submit">登録</button>
      </form>
    </div>
  );
};

export default Signup;
