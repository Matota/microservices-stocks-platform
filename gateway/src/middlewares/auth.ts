import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UserPayload } from 'stock-common';

export const currentUser = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers.authorization) {
        return next();
    }

    try {
        const payload = jwt.verify(
            req.headers.authorization.split(' ')[1], // Bearer <token>
            process.env.JWT_SECRET!
        ) as UserPayload;

        // Attach to request for use in proxies?
        // HttpProxyMiddleware can modify headers. We can mutate req.headers.
        req.headers['x-user-id'] = payload.id;
        req.headers['x-user-email'] = payload.email;
    } catch (err) { }
    next();
};

export const requireAuth = (req: Request, res: Response, next: NextFunction) => {
    if (!req.headers['x-user-id']) {
        return res.status(401).send({ message: 'Not authorized' });
    }
    next();
};
