import mongoose, { Schema, Document } from 'mongoose';
import bcrypt from 'bcrypt';

export enum UserRole {
    ADMIN = 'ADMIN',
    USER = 'USER',
}

export interface IUser extends Document {
    name: string;
    email: string;
    password: string;
    role: UserRole;
    dateOfBirth: Date;
    bloodGroup: string;
    location: string;
    isActive: boolean;
    createdAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

const userSchema: Schema = new Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true, lowercase: true },
        password: { type: String, required: true },
        role: { type: String, enum: Object.values(UserRole), default: UserRole.USER },
        dateOfBirth: { type: Date, required: true },
        bloodGroup: { type: String, required: true },
        location: { type: String, required: true },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

// Hash password before saving
userSchema.pre<IUser>('save', async function (next) {
    if (!this.isModified('password')) return next();
    try {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error: any) {
        next(error);
    }
});

// Method to compare password
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    return bcrypt.compare(password, this.password);
};

export default mongoose.model<IUser>('User', userSchema);
