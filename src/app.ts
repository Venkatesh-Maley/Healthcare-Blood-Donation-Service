import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import userRoutes from './routes/user.routes';
import adminRoutes from './routes/admin.routes';
import bloodRequestRoutes from './routes/blood-request.routes';
import { errorHandler } from './middlewares/error.middleware';
import { setupSwagger } from './config/swagger';

const app = express();
// Middlewares
app.use(cors());
app.use(express.json());

setupSwagger(app);

// Routes
app.get('/', (req, res) => {
    res.status(200).json({ message: 'Server running successfully' });
});

app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/blood-requests', bloodRequestRoutes);

// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Error Handling Middleware
app.use(errorHandler);

export default app;
