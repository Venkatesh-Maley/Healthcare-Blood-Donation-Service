import app from './app';
import connectDB from './config/db';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to Database
connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`==================================================`);
        console.log(`🚀 Server is running at http://localhost:${PORT}`);
        console.log(`📂 API Docs: http://localhost:${PORT}/api-docs`);
        console.log(`==================================================`);
    });
});
