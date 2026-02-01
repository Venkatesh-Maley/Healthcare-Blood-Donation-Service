import app from '../src/app';
import connectDB from '../src/config/db';
import dotenv from 'dotenv';

dotenv.config();

// Pre-connect to DB for serverless environment
const connect = async () => {
    try {
        await connectDB();
        console.log('MongoDB connected for serverless');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

connect();

export default app;
