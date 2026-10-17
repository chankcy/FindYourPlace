import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Role } from '@prisma/client';
import { AppError } from './errorHandler';

export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: Role;
  };
}

export const authenticateToken = (
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return next(new AppError('Access denied. Token missing.', 401));
  }

  try {
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'fallback_secret'
    ) as { userId: string; role: Role };

    req.user = decoded;
    next();
  } catch (error) {
    return next(new AppError('Invalid or expired token.', 403));
  }
};

export const authorizeRoles = (...allowedRoles: Role[]) => {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(new AppError('User authentication required.', 401));
    }

    if (!allowedRoles.includes(req.user.role)) {
      return next(new AppError('Access denied. Insufficient privileges.', 403));
    }

    next();
  };
};