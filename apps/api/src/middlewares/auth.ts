import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../services/auth.service";
import "@org/shared-types";

export function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header) {
    return res.status(401).json({ error: "Немає авторизаційного токена" });
  }

  const token = header.split(" ")[1];

  try {
    const decoded = verifyAccessToken(token);
    req.user = decoded;
    next();
  } catch {
    return res.status(401).json({ error: "Невірний токен" });
  }
}