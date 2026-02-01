import userRepository from '../repositories/user.repository';
import { IUser } from '../models/user.model';

export class AdminUserService {
    async createUser(userData: Partial<IUser>) {
        const existingUser = await userRepository.findByEmail(userData.email!);
        if (existingUser) {
            throw new Error('User already exists');
        }
        return userRepository.create(userData);
    }

    async getAllUsers() {
        return userRepository.getAll();
    }

    async getUserById(id: string) {
        const user = await userRepository.findById(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async updateUser(id: string, userData: Partial<IUser>) {
        const user = await userRepository.update(id, userData);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }

    async deleteUser(id: string) {
        const user = await userRepository.delete(id);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}

export default new AdminUserService();
