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

    async update(id: string, userData: Partial<IUser>): Promise<IUser | null> {
        return User.findByIdAndUpdate(id, userData, { new: true }).select('-password');
    }

    async delete(id: string): Promise<IUser | null> {
        return User.findByIdAndDelete(id);
    }
}

export default new UserRepository();
