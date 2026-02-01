import { Request, Response } from 'express';
import bloodRequestService from '../services/blood-request.service';

export class BloodRequestController {
    async createRequest(req: Request, res: Response) {
        try {
            const requesterId = (req as any).user.userId;
            const requestData = { ...req.body, requester: requesterId };
            const bloodRequest = await bloodRequestService.createRequest(requestData);
            res.status(201).json({
                message: 'Blood request created successfully',
                data: bloodRequest,
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async getAllRequests(req: Request, res: Response) {
        try {
            const requests = await bloodRequestService.getAllRequests();
            res.status(200).json({ data: requests });
        } catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    async approveRequest(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const approvedRequest = await bloodRequestService.approveRequest(id);
            res.status(200).json({
                message: 'Blood request approved',
                data: approvedRequest,
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }

    async volunteerForRequest(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const volunteerId = (req as any).user.userId;
            const fulfilledRequest = await bloodRequestService.volunteerForRequest(id, volunteerId);
            res.status(200).json({
                message: 'You have successfully volunteered for this request',
                data: fulfilledRequest,
            });
        } catch (error: any) {
            res.status(400).json({ message: error.message });
        }
    }
}

export default new BloodRequestController();
