import jwt from 'jsonwebtoken';
import { AppError } from './errorHandler.js';
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
export const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return next(new AppError(401, 'UNAUTHORIZED', 'No token provided'));
    }
    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        req.user = { userId: decoded.userId };
        next();
    }
    catch (error) {
        next(new AppError(401, 'INVALID_TOKEN', 'Invalid or expired token'));
    }
};
