import mongoose, { Schema, Document } from 'mongoose';
export enum Status {
  Pending = 'pending',
  Passed = 'passed',
  Interview = 'interview',
  Probation = 'probation',
  Test = 'test',
  Rejected = 'rejected',
}
const ApplicationSchema = new Schema(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'Job', required: true }, // ID của công việc ứng tuyển
    candidate: {
      fullName: { type: String, required: true },
      email: { type: String, required: true },
      phone: { type: String, required: true },
      resume: [{ type: String }], // Link đến file CV
      submittedAt: { type: Date, default: Date.now },
    },
    status: {
      type: String,
      enum: ['pending', 'passed', 'interview', 'test', 'probation', 'rejected'],
      default: 'pending',
    },
    reviewedBy: { type: Schema.Types.ObjectId, ref: 'User', default: null }, // HR duyệt hồ sơ
    reviewedAt: { type: Date, default: null },
    notes: { type: String, default: null },

    assessments: [
      {
        interviewRound: { type: Number, required: true },
        // assessors: [{ type: Schema.Types.ObjectId, ref: 'User' }], // Người chấm điểm
        scores: {
          skills: { type: Number, min: 0, max: 10, required: true },
          knowledge: { type: Number, min: 0, max: 10, required: true },
          expertise: { type: Number, min: 0, max: 10, required: true },
        },
        totalScore: { type: Number, required: true },
        comments: { type: String, default: null },
        createdAt: { type: Date, default: Date.now },
      },
    ],
  },
  {
    collection: 'applications',
    timestamps: true,
  },
);

export const ApplicationModel = mongoose.model(
  'Application',
  ApplicationSchema,
);
export { ApplicationSchema };

export interface Application extends Document {
  jobId: string;
  candidate: {
    fullName: string;
    email: string;
    phone: string;
    resume?: string[];
    submittedAt: Date;
  };
  status:
    | 'pending'
    | 'passed'
    | 'interview'
    | 'test'
    | 'probation'
    | 'rejected';
  reviewedBy?: string;
  reviewedAt?: Date;
  notes?: string;
  assessments?: {
    interviewRound: number;
    // assessors: string[];
    scores: {
      skills: number;
      knowledge: number;
      expertise: number;
    };
    totalScore: number;
    comments?: string;
    createdAt: Date;
  }[];
}
