import { createContext, useContext, useState } from "react";
import { TOKEN_KEY } from "../api/client";

interface AuthValue {
  isAuthenticated: boolean;
  logout: () => void;
  refresh: () => void;
}
const Ctx = createContext<AuthValue | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setToken] = useState(() => localStorage.getItem(TOKEN_KEY));
  const logout = () => {
    localStorage.removeItem(TOKEN_KEY);
    setToken(null);
  };
  const refresh = () => setToken(localStorage.getItem(TOKEN_KEY));
  return <Ctx.Provider value={{ isAuthenticated: !!token, logout, refresh }}>{children}</Ctx.Provider>;
};

export const useAuth = () => {
  const v = useContext(Ctx);
  if (!v) throw new Error("useAuth must be used within AuthProvider");
  return v;
};
