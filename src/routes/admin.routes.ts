import { Router, Response } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { UserRole } from '../models/user.model';

const router = Router();

import bloodRequestController from '../controllers/blood-request.controller';

// Only ADMIN can access these routes
router.use(authenticateJWT, authorizeRoles(UserRole.ADMIN));

/**
 * @swagger
 * /admin/blood-requests:
 *   get:
 *     summary: Get all blood requests (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Successful
 *       403:
 *         description: Access denied
 */
router.get('/blood-requests', bloodRequestController.getAllRequests);

/**
 * @swagger
 * /admin/blood-requests/{id}/approve:
 *   patch:
 *     summary: Approve a blood request (Admin only)
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Approved
 *       403:
 *         description: Access denied
 */
router.patch('/blood-requests/:id/approve', bloodRequestController.approveRequest);

export default router;
