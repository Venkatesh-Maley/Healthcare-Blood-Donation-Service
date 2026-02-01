import userRepository from '../repositories/user.repository';
import { IUser } from '../models/user.model';

export class UserService {
    async getUserProfile(userId: string): Promise<IUser> {
        const user = await userRepository.findById(userId);
        if (!user) {
            throw new Error('User not found');
        }
        return user;
    }
}

export default new UserService();
