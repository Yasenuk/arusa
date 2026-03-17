import { Request, Response, NextFunction } from "express";
import "@org/shared-types";

export function adminMiddleware(req: Request, res: Response, next: NextFunction) {
  if (req.user?.role !== "admin") {
    return res.status(403).json({ error: "Доступ заборонено" });
  }

  next();
}