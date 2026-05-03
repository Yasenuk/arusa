type AuthContextType = {
  isAuth: boolean;
  login: (token: string) => void;
  logout: () => void;
  getToken: () => string | null;
};

export type { AuthContextType };