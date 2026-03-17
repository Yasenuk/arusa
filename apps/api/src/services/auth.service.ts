import jwt from "jsonwebtoken";
import { AuthUser } from "@org/shared-types";

const ACCESS_SECRET = process.env.JWT_ACCESS_SECRET || "access_secret";
const REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || "refresh_secret";

export function createAccessToken(user: { id: string; role: string }) {
  return jwt.sign(user, ACCESS_SECRET, { expiresIn: "15m" });
}

export function createRefreshToken(user: { id: string; role: string }) {
  return jwt.sign(user, REFRESH_SECRET, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  return jwt.verify(token, ACCESS_SECRET) as AuthUser;
}

export function verifyRefreshToken(token: string) {
  return jwt.verify(token, REFRESH_SECRET);
}