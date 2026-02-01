import { Router } from 'express';
import bloodRequestController from '../controllers/blood-request.controller';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { UserRole } from '../models/user.model';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: BloodRequests
 *   description: Blood request management
 */

/**
 * @swagger
 * /blood-requests:
 *   post:
 *     summary: Create a blood request
 *     tags: [BloodRequests]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - bloodGroup
 *               - unitsNeeded
 *               - location
 *               - reason
 *             properties:
 *               bloodGroup:
 *                 type: string
 *               unitsNeeded:
 *                 type: number
 *               location:
 *                 type: string
 *               reason:
 *                 type: string
 *     responses:
 *       201:
 *         description: Request created
 *       400:
 *         description: Bad request
 */
router.post('/', authenticateJWT, bloodRequestController.createRequest);

/**
 * @swagger
 * /blood-requests:
 *   get:
 *     summary: Get all blood requests
 *     tags: [BloodRequests]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/', bloodRequestController.getAllRequests);

/**
 * @swagger
 * /blood-requests/{id}/approve:
 *   patch:
 *     summary: Approve a blood request (Admin only)
 *     tags: [BloodRequests]
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
router.patch('/:id/approve', authenticateJWT, authorizeRoles(UserRole.ADMIN), bloodRequestController.approveRequest);

/**
 * @swagger
 * /blood-requests/{id}/volunteer:
 *   patch:
 *     summary: Volunteer for a blood request
 *     tags: [BloodRequests]
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
 *         description: Fulfilled
 *       400:
 *         description: Validation error
 */
router.patch('/:id/volunteer', authenticateJWT, bloodRequestController.volunteerForRequest);

export default router;
