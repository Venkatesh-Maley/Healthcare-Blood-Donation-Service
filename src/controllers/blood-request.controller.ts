import { Request, Response } from 'express';
import bloodRequestService from '../services/blood-request.service';
import batchApproveService from '../services/redis-batch.service';

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
    /**
    * NEW: Toggle request in/out of approval batch
    * Frontend calls with {action: 'add'} or {action: 'remove'}
    * UI updates checkbox + count badge instantly
    */
    async toggleApproval(req: Request, res: Response) {
        try {
            const adminId = (req as any).user.userId;
            const requestId = req.params.id as string;
            const action = req.body.action; //add or remove

            if (action === 'add') {
                await batchApproveService.addToBatch(adminId, requestId);

                const count = await batchApproveService.getBatchCount(adminId);

                return res.json({
                    message: 'Added to batch',
                    count,
                    total: count
                });
            }

            await batchApproveService.removeFromBatch(adminId, requestId);
            const count = await batchApproveService.getBatchCount(adminId);
            res.json({
                message: 'Removed from batch',
                count,
                total: count
            });
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }

    /**
    * NEW: Submit ALL batched requests for approval
    * 1. Gets all request IDs from Redis
    * 2. Approves ALL in parallel (Promise.allSettled)
    * 3. Reports success/failure counts
    * 4. Clears Redis batch
    */
    async submitBatchApproval(req: Request, res: Response) {
        try {
            const adminId = (req as any).user.userId;

            // Step 1: Fetch all pending approvals from Redis
            const requestIds = await batchApproveService.getBatch(adminId);
            if (requestIds.length === 0) {
                return res.status(400).json({ message: 'No requests in batch' });
            }

            // Step 2: Process ALL approvals in parallel
            const results = await Promise.allSettled(
                requestIds.map(id => bloodRequestService.approveRequest(id))
            );

            // Step 3: Count successes vs failures
            const approvedCount = results.filter(r => r.status === 'fulfilled').length;
            const failedCount = results.filter(r => r.status === 'rejected').length;

            // Step 4: Clear Redis batch (always, even on partial failure)
            await batchApproveService.clearBatch(adminId);

            res.status(200).json({
                message: `Batch approval completed`,
                summary: {
                    total: requestIds.length,
                    approved: approvedCount,
                    failed: failedCount,
                    failedDetails: results
                        .filter(r => r.status === 'rejected')
                        .map((r: any) => r.reason?.message || 'Unknown error')
                }
            })
        }
        catch (error: any) {
            res.status(500).json({ message: error.message });
        }
    }
}

export default new BloodRequestController();
