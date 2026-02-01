import { Response } from 'express';
import { AuthRequest } from '../middlewares/auth.middleware';
import userService from '../services/user.service';

export class UserController {
    async getProfile(req: AuthRequest, res: Response) {
        try {
            const userId = req.user!.userId;
            const user = await userService.getUserProfile(userId);

            res.status(200).json({
                message: 'User profile fetched successfully',
                data: {
                    id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    dateOfBirth: user.dateOfBirth,
                    bloodGroup: user.bloodGroup,
                    location: user.location,
                    isActive: user.isActive,
                    createdAt: user.createdAt,
                },
            });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }
}

export default new UserController();
