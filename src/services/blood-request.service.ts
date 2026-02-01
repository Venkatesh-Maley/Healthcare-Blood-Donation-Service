import bloodRequestRepository from '../repositories/blood-request.repository';
import { BloodRequestStatus, IBloodRequest } from '../models/blood-request.model';

export class BloodRequestService {
    async createRequest(data: Partial<IBloodRequest>): Promise<IBloodRequest> {
        return bloodRequestRepository.create(data);
    }

    async getAllRequests(): Promise<IBloodRequest[]> {
        return bloodRequestRepository.findAll();
    }

    async approveRequest(requestId: string): Promise<IBloodRequest> {
        const request = await bloodRequestRepository.findById(requestId);
        if (!request) {
            throw new Error('Blood request not found');
        }
        if (request.status !== BloodRequestStatus.PENDING) {
            throw new Error('Only pending requests can be approved');
        }
        const updatedRequest = await bloodRequestRepository.updateStatus(requestId, BloodRequestStatus.APPROVED);
        if (!updatedRequest) throw new Error('Failed to approve request');
        return updatedRequest;
    }

    async volunteerForRequest(requestId: string, volunteerId: string): Promise<IBloodRequest> {
        const request = await bloodRequestRepository.findById(requestId);
        if (!request) {
            throw new Error('Blood request not found');
        }
        if (request.status !== BloodRequestStatus.APPROVED) {
            throw new Error('Can only volunteer for approved requests');
        }
        if (request.requester.toString() === volunteerId) {
            throw new Error('You cannot volunteer for your own request');
        }
        const updatedRequest = await bloodRequestRepository.addVolunteer(requestId, volunteerId);
        if (!updatedRequest) throw new Error('Failed to volunteer for request');
        return updatedRequest;
    }
}

export default new BloodRequestService();
