import { createContext, useContext, useRef, useState } from "react";
import { AuthContextType } from "@org/shared-types";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const accessTokenRef = useRef<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);

  const login = (token: string) => {
    accessTokenRef.current = token;
    setIsAuth(true);
  };

  const logout = () => {
    accessTokenRef.current = null;
    setIsAuth(false);
    fetch("/api/auth/logout", { method: "POST" }).catch(console.error);
  };

  const getToken = () => accessTokenRef.current;

  return (
    <AuthContext.Provider value={{ isAuth, login, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth повинен бути використаний всередині AuthProvider");
  return ctx;
};

export default { AuthProvider, useAuth };