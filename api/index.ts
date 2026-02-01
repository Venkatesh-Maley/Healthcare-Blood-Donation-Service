import app from '../src/app';
import connectDB from '../src/config/db';
import dotenv from 'dotenv';

dotenv.config();

let isConnected = false;

const connect = async () => {
    if (isConnected) return;
    try {
        await connectDB();
        isConnected = true;
        console.log('MongoDB connected for serverless');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

// Vercel serverless function entry point
export default async (req: any, res: any) => {
    await connect();
    return app(req, res);
};
