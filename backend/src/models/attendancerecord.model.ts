import { Schema, Document } from 'mongoose';
const AttendanceRecordSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true }, // Nhân viên
    date: { type: Date, required: true }, // Ngày chấm công
    is_present: { type: Boolean, required: true }, // Có mặt hay không
    reason: { type: String, default: null }, // Lý do vắng mặt
    form_id: { type: String, required: true },
  },
  {
    collection: 'attendance_records',
    timestamps: true,
  },
);

export { AttendanceRecordSchema };

export interface AttendanceRecord extends Document {
  user_id: Schema.Types.ObjectId;
  date: Date;
  is_present: boolean;
  reason: string | null;
  form_id: string;
}
//Lưu trữ thông tin chấm công chi tiết từng ngày của nhân viên.
