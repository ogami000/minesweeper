import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { CenteredWrapper } from "../components/CenteredWrapper";
import { API_URL } from "../config/vite";
import { useAuth } from "../context/AuthContext";

interface UserData {
  nickname: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export const Signup: React.FC = () => {
  const [formData, setFormData] = useState<UserData>({
    nickname: "",
    email: "",
    password: "",
    passwordConfirmation: "",
  });
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { setToken } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const { nickname, email, password, passwordConfirmation } = formData;

    if (password !== passwordConfirmation) {
      setError("パスワードが一致しません");
      return;
    }

    try {
      await axios.post(`${API_URL}/api/signup`, {
        user: {
          nickname,
          email,
          password,
          password_confirmation: passwordConfirmation,
        },
      });

      const loginRes = await axios.post(`${API_URL}/api/login`, {
        user: { email, password },
      });

      const token = loginRes.data.authorization;
      localStorage.setItem("authToken", token);
      setToken(token); // Context に反映
      navigate("/dashboard");
    } catch (e) {
      setError(`登録に失敗しました。${e}`);
    }
  };

  return (
    <CenteredWrapper>
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">新規作成</h2>
        {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          {["nickname", "email", "password", "passwordConfirmation"].map(
            (field) => (
              <div key={field}>
                <label className="block mb-1 font-medium">
                  {field === "nickname"
                    ? "ニックネーム"
                    : field === "email"
                      ? "メールアドレス"
                      : field === "password"
                        ? "パスワード"
                        : "パスワード確認"}
                </label>
                <input
                  type={field.includes("password") ? "password" : "text"}
                  name={field}
                  value={formData[field as keyof UserData]}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border rounded-xl"
                />
              </div>
            )
          )}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 mt-4 rounded-xl"
          >
            登録
          </button>
        </form>
        <p className="mt-6 text-center text-sm">
          すでにアカウントをお持ちの方は <Link to="/login">こちら</Link>
        </p>
      </div>
    </CenteredWrapper>
  );
};
