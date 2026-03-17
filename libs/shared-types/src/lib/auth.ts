type AuthContextType = {
  isAuth: boolean;
  login: (token: string) => void;
  logout: () => void;
};

export type { AuthContextType };