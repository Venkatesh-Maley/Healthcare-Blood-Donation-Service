import { Router, Response } from 'express';
import { authenticateJWT } from '../middlewares/auth.middleware';
import { authorizeRoles } from '../middlewares/role.middleware';
import { UserRole } from '../models/user.model';

const router = Router();

import bloodRequestController from '../controllers/blood-request.controller';
import adminUserController from '../controllers/admin-user.controller';

// Only ADMIN can access these routes
router.use(authenticateJWT, authorizeRoles(UserRole.ADMIN));

/**
 * @swagger
 * /admin/users:
 *   post:
 *     summary: Create a new user (Admin only)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRegistration'
 *     responses:
 *       201:
 *         description: User created successfully
 *       400:
 *         description: Invalid input
 */
router.post('/users', adminUserController.createUser);

/**
 * @swagger
 * /admin/users:
 *   get:
 *     summary: Get all users (Admin only)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all users
 */
router.get('/users', adminUserController.getAllUsers);

/**
 * @swagger
 * /admin/users/{id}:
 *   get:
 *     summary: Get user by ID (Admin only)
 *     tags: [Admin - Users]
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
 *         description: User details
 *       404:
 *         description: User not found
 */
router.get('/users/:id', adminUserController.getUserById);

/**
 * @swagger
 * /admin/users/{id}:
 *   patch:
 *     summary: Update user details (Admin only)
 *     tags: [Admin - Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserUpdate'
 *     responses:
 *       200:
 *         description: User updated
 *       404:
 *         description: User not found
 */
router.patch('/users/:id', adminUserController.updateUser);

/**
 * @swagger
 * /admin/users/{id}:
 *   delete:
 *     summary: Delete a user (Admin only)
 *     tags: [Admin - Users]
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
 *         description: User deleted
 *       404:
 *         description: User not found
 */
router.delete('/users/:id', adminUserController.deleteUser);

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

/**
 * @swagger
 * /admin/blood-requests/{id}/toggle-approval:
 *   patch:
 *     summary: Add or remove a request from the admin's approval batch
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the blood request
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - action
 *             properties:
 *               action:
 *                 type: string
 *                 enum: [add, remove]
 *                 description: Whether to add or remove from batch
 *     responses:
 *       200:
 *         description: Success
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 count:
 *                   type: integer
 *                 total:
 *                   type: integer
 *       500:
 *         description: Server error
 */
router.patch('/blood-requests/:id/toggle-approval', bloodRequestController.toggleApproval);

/**
 * @swagger
 * /admin/blood-requests/batch-approve:
 *   post:
 *     summary: Approve all blood requests currently in the admin's batch
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Batch approval completed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 summary:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                     approved:
 *                       type: integer
 *                     failed:
 *                       type: integer
 *                     failedDetails:
 *                       type: array
 *                       items:
 *                         type: string
 *       400:
 *         description: Batch is empty
 *       500:
 *         description: Server error
 */
router.post('/blood-requests/batch-approve', bloodRequestController.submitBatchApproval);
export default router;
