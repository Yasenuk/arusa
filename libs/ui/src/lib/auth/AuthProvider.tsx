import { createContext, useContext, useState } from "react";
import { AuthContextType } from "@org/shared-types";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("accessToken"));

  const login = (token: string) => {
    localStorage.setItem("accessToken", token);
    setIsAuth(true);
  };

  const logout = () => {
    localStorage.removeItem("accessToken");
    setIsAuth(false);
  };

  return (
    <AuthContext.Provider value={{ isAuth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth повинен бути використаний всередині AuthProvider");
  return ctx;
};

export default { AuthProvider, useAuth };