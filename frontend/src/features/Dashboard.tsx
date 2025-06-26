import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CenteredWrapper } from "../components/CenteredWrapper";

const Dashboard: React.FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      navigate("/login");
    }
    console.log(localStorage.getItem("authToken"));
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    navigate("/login");
  };

  return (
    <CenteredWrapper>
      <div className="bg-white p-8 rounded-2xl shadow-md w-full max-w-md text-center">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          ログイン成功！
        </h1>
        <p className="mb-6 text-gray-700">
          こちらは仮のダッシュボード画面です。
        </p>
        <button
          onClick={handleLogout}
          className="px-6 py-2 bg-red-500 text-white rounded-xl hover:bg-red-600 transition duration-200"
        >
          ログアウト
        </button>
      </div>
    </CenteredWrapper>
  );
};

export default Dashboard;
