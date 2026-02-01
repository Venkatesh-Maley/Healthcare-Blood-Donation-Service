import { Request, Response } from 'express';
import adminUserService from '../services/admin-user.service';

export class AdminUserController {
    async createUser(req: Request, res: Response) {
        try {
            const user = await adminUserService.createUser(req.body);
            res.status(201).json(user);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllUsers(req: Request, res: Response) {
        try {
            const users = await adminUserService.getAllUsers();
            res.status(200).json(users);
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async getUserById(req: Request, res: Response) {
        try {
            const user = await adminUserService.getUserById(req.params.id as string);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }

    async updateUser(req: Request, res: Response) {
        try {
            const user = await adminUserService.updateUser(req.params.id as string, req.body);
            res.status(200).json(user);
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async deleteUser(req: Request, res: Response) {
        try {
            await adminUserService.deleteUser(req.params.id as string);
            res.status(200).json({ message: 'User deleted successfully' });
        } catch (error: any) {
            res.status(404).json({ message: error.message });
        }
    }
}

export default new AdminUserController();
