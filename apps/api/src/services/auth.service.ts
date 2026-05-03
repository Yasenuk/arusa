import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { AuthUser } from "@org/shared-types";
import { prisma } from "../db/prisma";
import { createUser } from "./user.service";
import { createCart } from "./cart.service";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

export function createAccessToken(user: { id: string; role: string }) {
  return jwt.sign(user, ACCESS_SECRET, { expiresIn: "15m" });
}

export function createRefreshToken(user: { id: string; role: string }) {
  return jwt.sign(user, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string): AuthUser {
  return jwt.verify(token, ACCESS_SECRET) as AuthUser;
}

export function verifyRefreshToken(token: string): AuthUser {
  return jwt.verify(token, REFRESH_SECRET) as AuthUser;
}

export async function loginUser(email: string, password: string) {
  const user = await prisma.users.findUnique({ where: { email } });

  if (!user) throw { status: 400, message: "Невірні облікові дані" };

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) throw { status: 400, message: "Невірні облікові дані" };

  const payload = { id: user.id.toString(), role: user.role };

  return {
    accessToken: createAccessToken(payload),
    refreshToken: createRefreshToken(payload),
    user: payload
  };
}

export async function registerUser(
  first_name: string,
  last_name: string,
  middle_name: string,
  email: string,
  password: string,
  password_confirm: string
) {
  if (password !== password_confirm)
    throw { status: 400, message: "Паролі не співпадають" };

  const exists = await prisma.users.findUnique({ where: { email } });
  if (exists) throw { status: 400, message: "Email вже використовується" };

  const password_hash = await bcrypt.hash(password, 10);

  const result = await prisma.$transaction(async (tx) => {
    const user = await createUser(first_name, last_name, middle_name, email, password_hash);
    await createCart(Number(user.id));
    return user;
  });

  const payload = { id: result.id.toString(), role: result.role };

  return {
    accessToken: createAccessToken(payload),
    refreshToken: createRefreshToken(payload),
    user: payload
  };
}