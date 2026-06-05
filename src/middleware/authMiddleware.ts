import { Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { ExtendedRequest } from './requestHandler.js';
import { AppError } from './errorHandler.js';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export interface AuthRequest extends ExtendedRequest {
  user?: {
    userId: string;
  };
}

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError(401, 'UNAUTHORIZED', 'No token provided'));
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token!, JWT_SECRET) as { userId: string };
    req.user = { userId: decoded.userId };
    next();
  } catch (error) {
    next(new AppError(401, 'INVALID_TOKEN', 'Invalid or expired token'));
  }
};
