import React from "react";
import { Link, useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const navigate = useNavigate();
  const isLoggedIn = !!localStorage.getItem("authToken");

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <header className="bg-white shadow-md py-2 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold text-blue-600">
        <Link to="/">マインスイーパー</Link>
      </h1>

      <nav className="flex items-center space-x-4">
        {isLoggedIn ? (
          <>
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              ダッシュボード
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-4 py-2 rounded-xl hover:bg-red-600 transition duration-200"
            >
              ログアウト
            </button>
          </>
        ) : (
          <>
            <Link
              to="/login"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              ログイン
            </Link>
            <Link
              to="/signup"
              className="bg-blue-500 text-white px-4 py-2 rounded-xl hover:bg-blue-600 transition duration-200"
            >
              新規登録
            </Link>
          </>
        )}
      </nav>
    </header>
  );
};

export default Header;
