import { createContext, useContext, useEffect, useRef, useState } from "react";
import { AuthContextType } from "@org/shared-types";
import { tokenStore } from "@org/utils/index";

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const accessTokenRef = useRef<string | null>(null);
  const [isAuth, setIsAuth] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch("/api/auth/refresh", { method: "POST", credentials: "include" })
      .then(res => res.ok ? res.json() : null)
      .then(data => {
        if (data?.accessToken) {
          accessTokenRef.current = data.accessToken;
          tokenStore.set(data.accessToken);
          setIsAuth(true);
        }
      })
      .catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    const unsubscribe = tokenStore.subscribe((token) => {
      setIsAuth(!!token);
      accessTokenRef.current = token;
    });
    return () => { unsubscribe(); };
  }, []);

  if (isLoading) return null;

  const login = (token: string) => {
    accessTokenRef.current = token;
    tokenStore.set(token);
    setIsAuth(true);
  };

  const logout = () => {
    accessTokenRef.current = null;
    tokenStore.clear();
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