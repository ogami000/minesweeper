import React from "react";

const Dashboard: React.FC = () => {
  const handleLogout = () => {
    localStorage.removeItem("authToken");
    window.location.href = "/login";
  };

  return (
    <div>
      <h1>ログイン成功！</h1>
      <p>こちらは仮のダッシュボード画面です。</p>
      <button onClick={handleLogout}>ログアウト</button>
    </div>
  );
};

export default Dashboard;
