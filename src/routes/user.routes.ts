import { Router } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import userController from '../controllers/user.controller';

const router = Router();

/**
 * @swagger
 * /users/profile:
 *   get:
 *     summary: Get user profile
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User profile fetched successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 */
router.get('/profile', authenticateJWT, userController.getProfile);

export default router;
