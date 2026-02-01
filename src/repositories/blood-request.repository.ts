import BloodRequest, { IBloodRequest, BloodRequestStatus } from '../models/blood-request.model';

export class BloodRequestRepository {
    async create(data: Partial<IBloodRequest>): Promise<IBloodRequest> {
        const request = new BloodRequest(data);
        return request.save();
    }

    async findById(id: string): Promise<IBloodRequest | null> {
        return BloodRequest.findById(id).populate('requester volunteer', '-password');
    }

    async findAll(): Promise<IBloodRequest[]> {
        return BloodRequest.find().populate('requester volunteer', '-password');
    }

    async updateStatus(id: string, status: BloodRequestStatus): Promise<IBloodRequest | null> {
        return BloodRequest.findByIdAndUpdate(id, { status }, { new: true });
    }

    async addVolunteer(requestId: string, volunteerId: string): Promise<IBloodRequest | null> {
        return BloodRequest.findByIdAndUpdate(
            requestId,
            { volunteer: volunteerId, status: BloodRequestStatus.FULFILLED },
            { new: true }
        );
    }
}

export default new BloodRequestRepository();
