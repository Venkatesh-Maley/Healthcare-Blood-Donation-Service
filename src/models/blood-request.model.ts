import mongoose, { Schema, Document } from 'mongoose';

export enum BloodRequestStatus {
    PENDING = 'PENDING',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
    FULFILLED = 'FULFILLED',
}

export interface IBloodRequest extends Document {
    requester: mongoose.Types.ObjectId;
    bloodGroup: string;
    unitsNeeded: number;
    location: string;
    reason: string;
    status: BloodRequestStatus;
    volunteer?: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const bloodRequestSchema: Schema = new Schema(
    {
        requester: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        bloodGroup: { type: String, required: true },
        unitsNeeded: { type: Number, required: true },
        location: { type: String, required: true },
        reason: { type: String, required: true },
        status: { type: String, enum: Object.values(BloodRequestStatus), default: BloodRequestStatus.PENDING },
        volunteer: { type: Schema.Types.ObjectId, ref: 'User' },
    },
    { timestamps: true }
);

export default mongoose.model<IBloodRequest>('BloodRequest', bloodRequestSchema);
