import { Controller, Post, Get, Query } from '@nestjs/common';
import { PayrollService } from '../services/payroll.service';

@Controller('payrolls')
export class PayrollController {
  constructor(private readonly payrollService: PayrollService) {}

  // Tạo bảng lương cho nhân viên trong tháng
  @Post('/generate')
  async generatePayroll(
    @Query('user_id') user_id: string,
    @Query('month') month: string,
  ) {
    const payroll = await this.payrollService.generatePayroll(user_id, month);
    return { message: 'Payroll generated successfully', payroll };
  }

  // Lấy bảng lương của nhân viên trong tháng
  @Get('/by-month')
  async getPayrollByUserAndMonth(
    @Query('user_id') user_id: string,
    @Query('month') month: string,
  ) {
    const payroll = await this.payrollService.getPayrollByUserAndMonth(
      user_id,
      month,
    );
    return payroll ? payroll : { message: 'Payroll not found' };
  }
}
