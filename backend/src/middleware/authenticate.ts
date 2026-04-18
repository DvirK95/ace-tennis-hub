import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    sub: string;
    email: string;
    role: string;
  };
}

export function authenticate(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction,
): void {
  const authHeader = req.headers.authorization;

  const token = authHeader?.slice(7) ?? '';
  try {
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET ?? 'development-jwt-secret',
    ) as AuthenticatedRequest['user'];

    req.user = payload;
    next();
  } catch {
    res.status(401).json();
  }
}
