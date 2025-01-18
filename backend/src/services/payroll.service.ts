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

    // Tạo hoặc cập nhật bảng lương
    const filter = {
      user_id: new Types.ObjectId(user_id),
      month,
    };

    const update = {
      user_id: new Types.ObjectId(user_id),
      month,
      total_working_days: totalWorkingDays,
      total_salary: totalSalary,
    };

    // Sử dụng findByConditionAndUpdate để cập nhật nếu tồn tại, hoặc tạo mới nếu chưa có
    let payroll = await this.payrollRepository.findByConditionAndUpdate(
      filter,
      update,
    );

    if (!payroll) {
      // Nếu không tìm thấy bản ghi để cập nhật, tạo mới
      payroll = await this.payrollRepository.create(update);
    }

    return payroll;
  }

  async updatePaymentStatus(
    user_id: string,
    month: string,
    isPaid: boolean,
    note: string = '',
  ): Promise<Payroll> {
    // Tìm bảng lương theo user_id và tháng
    const filter = {
      user_id: new Types.ObjectId(user_id),
      month,
    };

    // Tính ngày trả lương nếu đã trả
    const paymentDate = isPaid ? new Date() : null;

    // Cập nhật bảng lương với trạng thái trả lương, ngày trả lương và ghi chú
    const update = {
      isPaid,
      paymentDate,
      note,
    };

    // Cập nhật bảng lương đã tồn tại
    const updatedPayroll =
      await this.payrollRepository.findByConditionAndUpdate(filter, update);

    if (!updatedPayroll) {
      throw new Error('Payroll record not found');
    }

    return updatedPayroll;
  }

  async getPayrollByUserAndMonth(
    user_id: string,
    month: string,
  ): Promise<Payroll | null> {
    return this.payrollRepository.findByCondition(
      {
        user_id: new Types.ObjectId(user_id),
        month,
      },
      null,
      null,
      {
        path: 'user_id',
        select: 'name avt salary',
      },
    );
  }
  // Hàm mới: Lấy thông tin tổng lương của user
  async getPayrollSummaries(): Promise<
    {
      _id: string;
      name: string;
      avt: string;
      salary: number;
      totalExpectedSalary: number;
      totalPaidSalary: number;
      totalUnpaidSalary: number;
    }[]
  > {
    // Lấy danh sách tất cả user với các thông tin cần thiết
    const users = await this.userRepository.getByCondition(
      {}, // Không có điều kiện để lấy tất cả user
      'name avt salary _id',
    );

    // Kiểm tra nếu không có user nào
    if (!users || users.length === 0) {
      throw new Error('No users found');
    }

    // Lấy danh sách bảng lương của tất cả user
    const payrolls = await this.payrollRepository.getByCondition(
      {}, // Không có điều kiện để lấy tất cả bảng lương
      'user_id total_salary isPaid',
    );

    // Tạo kết quả bằng cách map qua từng user
    const summaries = users.map((user) => {
      // Lấy bảng lương tương ứng với từng user
      const userPayrolls = payrolls.filter(
        (payroll) => payroll.user_id.toString() === user._id.toString(),
      );

      // Tính toán lương
      const totalExpectedSalary = userPayrolls.reduce(
        (sum, payroll) => sum + payroll.total_salary,
        0,
      );
      const totalPaidSalary = userPayrolls
        .filter((payroll) => payroll.isPaid)
        .reduce((sum, payroll) => sum + payroll.total_salary, 0);
      const totalUnpaidSalary = totalExpectedSalary - totalPaidSalary;

      return {
        _id: user._id.toString(),
        name: user.name,
        avt: user.avt,
        salary: parseFloat(user.salary),
        totalExpectedSalary,
        totalPaidSalary,
        totalUnpaidSalary,
      };
    });

    return summaries;
  }
}
