import mongoose, { Schema, Document } from 'mongoose';

const JobSchema = new Schema(
  {
    title: { type: String, required: true }, // Tên vị trí tuyển dụng
    description: { type: String, required: true }, // Mô tả công việc (gộp cả yêu cầu)
    location: { type: String, required: true, default: 'Địa chỉ công ty' }, // Địa điểm làm việc (mặc định là "Địa chỉ công ty")
    salaryRange: { type: String, default: null }, // Mức lương
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    dueDate: { type: Date, default: null },
    attachments: [{ type: String }], // Danh sách file đính kèm (lưu URL hoặc đường dẫn file)
    // createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  {
    collection: 'jobs',
    timestamps: true,
  },
);

export const JobModel = mongoose.model('Job', JobSchema);
export { JobSchema };

export interface Job extends Document {
  title: string;
  description: string;
  location: string;
  salaryRange?: string;
  status: 'open' | 'closed';
  dueDate?: Date;
  attachments?: string[]; // Danh sách file đính kèm
  //createdBy: string;
}
