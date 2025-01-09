import { Schema, Document, Types } from 'mongoose';

export const LeaveRequestSchema = new Schema(
  {
    user_id: { type: Types.ObjectId, ref: 'User', required: true },
    date: { type: Date, required: true },
    reason: { type: String, required: true },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
    admin_comment: { type: String, default: null },
  },
  {
    collection: 'leave_requests',
    timestamps: true,
  },
);

export interface LeaveRequest extends Document {
  user_id: Types.ObjectId;
  date: Date;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  admin_comment: string | null;
  createdAt: Date;
  updatedAt: Date;
}
