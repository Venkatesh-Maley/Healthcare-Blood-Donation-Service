import userRepository from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import * as jwtUtil from '../utils/jwt.util';
import rateLimitService from './rate-limit.service';

export class AuthService {
    async register(userData: Partial<IUser>) {
        const existingUser = await userRepository.findByEmail(userData.email!);
        if (existingUser) {
            throw new Error('User already exists');
        }
        const user = await userRepository.create(userData);
        return {
            id: (user._id as any).toString(),
            name: user.name,
            email: user.email,
            role: user.role,
        };
    }

    async login(email: string, password: string) {
        const isProduction = process.env.NODE_ENV === 'production';

        // 1. Check if user is blocked (Skip in Production)
        if (!isProduction && await rateLimitService.isBlocked(email)) {
            const minutesLeft = await rateLimitService.getRemainingTime(email);
            throw new Error(`Too many login attempts. Please try again in ${minutesLeft} minutes.`);
        }

        const user = await userRepository.findByEmail(email);

        // 2. Validate credentials
        if (!user || !(await user.comparePassword(password))) {
            if (!isProduction) {
                await rateLimitService.incrementAttempts(email);
            }
            throw new Error('Invalid credentials');
        }

        // 3. Success: Reset attempts (Skip in Production)
        if (!isProduction) {
            await rateLimitService.resetAttempts(email);
        }

        const payload = { userId: (user._id as any).toString(), role: user.role };
        const accessToken = jwtUtil.generateAccessToken(payload);
        const refreshToken = jwtUtil.generateRefreshToken(payload);

        return {
            accessToken,
            refreshToken,
            user: {
                id: (user._id as any).toString(),
                name: user.name,
                email: user.email,
                role: user.role,
            },
        };
    }

    async refreshToken(token: string) {
        try {
            const decoded = jwtUtil.verifyRefreshToken(token);
            const payload = { userId: decoded.userId, role: decoded.role };
            const accessToken = jwtUtil.generateAccessToken(payload);
            return { accessToken };
        } catch (error) {
            throw new Error('Invalid refresh token');
        }
    }
}

export default new AuthService();
