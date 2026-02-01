import { Request, Response, NextFunction } from 'express';
import * as jwtUtil from '../utils/jwt.util';

export interface AuthRequest extends Request {
    user?: jwtUtil.TokenPayload;
}

export const authenticateJWT = (req: AuthRequest, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;

    if (authHeader) {
        const token = authHeader.split(' ')[1];

        try {
            const decoded = jwtUtil.verifyAccessToken(token);
            req.user = decoded;
            next();
        } catch (error) {
            return res.status(403).json({ message: 'Invalid or expired token' });
        }
    } else {
        res.status(401).json({ message: 'Authorization header missing' });
    }
};
