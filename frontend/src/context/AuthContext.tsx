// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../config/vite";

interface AuthContextType {
  nickname: string;
  token: string | null;
  setToken: (token: string | null) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  nickname: "",
  token: null,
  setToken: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [nickname, setNickname] = useState("");
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );

  const fetchUser = async (token: string) => {
    try {
      const res = await axios.get(`${API_URL}/api/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNickname(res.data.nickname);
    } catch {
      setNickname("");
      setToken(null);
      localStorage.removeItem("authToken");
    }
  };

  useEffect(() => {
    if (token) fetchUser(token);
    else setNickname("");
  }, [token]);

  const logout = () => {
    setToken(null);
    setNickname("");
    localStorage.removeItem("authToken");
  };

  return (
    <AuthContext.Provider value={{ nickname, token, setToken, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
