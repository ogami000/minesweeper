import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export const Hamburger = () => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { token, logout } = useAuth();
  const isLoggedIn = !!token;

  const toggleMenu = () => setIsOpen(!isOpen);

  // 外クリックで閉じる処理
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={menuRef}>
      <button
        className="p-2 rounded-md bg-white text-black"
        onClick={toggleMenu}
        aria-label="メニューを開く"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {isOpen && (
        <nav className="absolute top-full right-0 z-50 flex flex-col bg-white shadow-md p-4 rounded-md space-y-2 w-30 mt-4">
          <Link
            to="/"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            ホーム
          </Link>
          <Link
            to="/ranking"
            className="text-gray-700 hover:text-blue-600 font-medium"
          >
            ランキング
          </Link>
          {isLoggedIn ? (
            <Link
              onClick={logout}
              to="/login"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              ログアウト
            </Link>
          ) : (
            <>
              <Link
                to="/signup"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                新規登録
              </Link>
              <Link
                to="/login"
                className="text-gray-700 hover:text-blue-600 font-medium"
              >
                ログイン
              </Link>
            </>
          )}
        </nav>
      )}
    </div>
  );
};
