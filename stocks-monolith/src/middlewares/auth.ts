import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import logger from '../utils/logger.js';

const JWT_SECRET = process.env.JWT_SECRET || 'supersecret';

export interface AuthRequest extends Request {
    user?: {
        id: string;
        email: string;
    };
}

export const generateToken = (payload: object) => {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '24h' });
};

export const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(401).json({ error: 'Authentication required' });
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as { id: string; email: string };
        req.user = decoded;
        next();
    } catch (error) {
        logger.error('JWT Verification failed:', error);
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
