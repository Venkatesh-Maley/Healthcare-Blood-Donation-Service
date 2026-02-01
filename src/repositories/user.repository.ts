import User, { IUser } from '../models/user.model';

export class UserRepository {
    async findByEmail(email: string): Promise<IUser | null> {
        return User.findOne({ email });
    }

    async findById(id: string): Promise<IUser | null> {
        return User.findById(id);
    }

    async create(userData: Partial<IUser>): Promise<IUser> {
        const user = new User(userData);
        return user.save();
    }

    async getAll(): Promise<IUser[]> {
        return User.find().select('-password');
    }
}

export default new UserRepository();
