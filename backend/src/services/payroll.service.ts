import { Injectable } from '@nestjs/common';
import { Payroll } from '../models/payroll.model';
import { PayrollRepository } from './repositories/payroll.repository';
import { AttendanceRecordRepository } from './repositories/attendancerecord.repository';
import { UserRepository } from 'src/user/repositories/user.repository';
import { Types } from 'mongoose';

@Injectable()
export class PayrollService {
  constructor(
    private readonly payrollRepository: PayrollRepository,
    private readonly attendanceRecordRepository: AttendanceRecordRepository,
    private readonly userRepository: UserRepository,
  ) {}

  async generatePayroll(user_id: string, month: string): Promise<Payroll> {
    const startDate = new Date(`${month}-01`);
    const endDate = new Date(`${month}-31`);
    endDate.setHours(23, 59, 59, 999);

    // Lấy bản ghi điểm danh của nhân viên trong tháng
    const attendanceRecords = await this.attendanceRecordRepository.find({
      user_id: new Types.ObjectId(user_id),
      date: { $gte: startDate, $lte: endDate },
    });

    const totalWorkingDays = attendanceRecords.filter(
      (record) => record.is_present,
    ).length;

    // Lấy mức lương của nhân viên từ trường 'salary' trong User
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new Error('User not found');
    }

    const dailySalary = parseFloat(user.salary);
    if (isNaN(dailySalary)) {
      throw new Error('Invalid salary value');
    }

    const totalSalary = totalWorkingDays * dailySalary;

    // Tạo bảng lương và lưu vào database
    const payroll = await this.payrollRepository.create({
      user_id: new Types.ObjectId(user_id),
      month,
      total_working_days: totalWorkingDays,
      total_salary: totalSalary,
    });

    return payroll;
  }

  async getPayrollByUserAndMonth(
    user_id: string,
    month: string,
  ): Promise<Payroll | null> {
    return this.payrollRepository.findByCondition({
      user_id: new Types.ObjectId(user_id),
      month,
    });
  }
}
