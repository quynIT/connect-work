import { Schema, Document } from 'mongoose';

const AttendanceFormSchema = new Schema(
  {
    date: {
      type: Date,
      required: true,
      default: Date.now, // Nếu không có giá trị date, sẽ sử dụng ngày hiện tại
    },
    employees: [
      {
        user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Nhân viên trong form
        is_present: { type: Boolean, default: null }, // Có mặt hay không
        reason: { type: String, default: null }, // Lý do vắng (nếu có)
      },
    ],
  },
  {
    collection: 'attendance_forms',
    timestamps: true, // Tự động tạo `createdAt` và `updatedAt`
  },
);

export { AttendanceFormSchema };

export interface AttendanceForm extends Document {
  date: Date;
  employees: {
    user_id: Schema.Types.ObjectId;
    is_present: boolean | null;
    reason: string | null;
  }[];
}
//Lưu trữ các form điểm danh mà admin tạo.
