import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { CenteredWrapper } from "../components/CenteredWrapper";

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
      const token = response.data.authorization;
      setToken(token);
      localStorage.setItem("authToken", token);
      window.location.href = "/dashboard";
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
          {["email", "password"].map((field) => (
            <div>
              <label className="block mb-1 font-medium">
                {field === "email" ? "メールアドレス" : "パスワード"}
              </label>
              <input
                type={field === "email" ? "email" : "password"}
                value={field === "email" ? email : password}
                onChange={(e) =>
                  field === "email"
                    ? setEmail(e.target.value)
                    : setPassword(e.target.value)
                }
                required
                className="w-full px-4 py-2 border rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 mt-4 rounded-xl hover:bg-blue-600 transition duration-200"
          >
            ログイン
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-gray-600">
          アカウントをお持ちでない方は
          <Link
            to="/signup"
            className="text-blue-500 hover:underline hover:text-blue-700 transition duration-200"
          >
            こちら
          </Link>
        </p>
        {token && (
          <p className="mt-4 text-sm text-gray-600 break-all">
            取得したトークン: {token}
          </p>
        )}
      </div>
    </CenteredWrapper>
  );
};

export default Login;
