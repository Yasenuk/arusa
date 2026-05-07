export type User = {
  id: string;
  first_name: string;
  last_name: string;
  middle_name: string;
  email: string;
  phone: string;
  password: string;
  role: "user" | "admin";
};

export type AuthUser = Pick<User, "id" | "role">;