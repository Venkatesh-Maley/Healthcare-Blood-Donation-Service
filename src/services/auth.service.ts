import userRepository from '../repositories/user.repository';
import { IUser } from '../models/user.model';
import * as jwtUtil from '../utils/jwt.util';

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
        const user = await userRepository.findByEmail(email);
        if (!user || !(await user.comparePassword(password))) {
            throw new Error('Invalid credentials');
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
