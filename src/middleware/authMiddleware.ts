import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
  adminId?: string;
}

interface JwtPayload {
  adminId: string;
}

export function verifyToken(
  req: AuthRequest,
  res: Response,
  next: NextFunction
): void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "No token provided" });
    return;
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Token is malformed" });
    return;
  }

  try {
    const secret = process.env.JWT_SECRET;

    if (!secret) {
      res.status(500).json({ message: "JWT secret is not configured" });
      return;
    }

    const decoded = jwt.verify(token, secret) as JwtPayload;
    req.adminId = decoded.adminId;
    next();
  } catch {
    res.status(401).json({ message: "Token is invalid or expired" });
  }
}