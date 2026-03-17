export type User = {
  id: string;
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  password: string;
  role: "user" | "admin";
};

export type AuthUser = Pick<User, "id" | "role">;