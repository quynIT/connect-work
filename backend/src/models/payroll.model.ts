import { Schema, Document, Types } from 'mongoose';

const PayrollSchema = new Schema(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    month: { type: String, required: true }, // Tháng tính lương
    total_working_days: { type: Number, required: true }, // Tổng ngày làm việc
    total_salary: { type: Number, required: true }, // Tổng lương
    isPaid: { type: Boolean, default: false }, // Trạng thái trả lương (đã trả chưa)
    paymentDate: { type: Date, default: null }, // Ngày trả lương
    note: { type: String, default: '' }, // Ghi chú (nếu có)
  },
  {
    collection: 'payrolls',
    timestamps: true,
  },
);

export { PayrollSchema };

export interface Payroll extends Document {
  user_id: Types.ObjectId;
  month: string;
  total_working_days: number;
  total_salary: number;
  isPaid: boolean;
  paymentDate: Date | null;
  note: string;
}
