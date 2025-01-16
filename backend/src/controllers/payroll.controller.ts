import { Controller, Post, Get, Query, Put, Param, Body } from '@nestjs/common';
import { PayrollService } from '../services/payroll.service';
import { PayrollDto } from 'src/services/dto/payroll.dto';

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

  // Cập nhật trạng thái thanh toán của bảng lương
  @Put('/update/:user_id/:month')
  async updatePaymentStatus(
    @Param('user_id') user_id: string,
    @Param('month') month: string,
    @Body() updatePaymentStatusDto: PayrollDto,
  ) {
    const updatedPayroll = await this.payrollService.updatePaymentStatus(
      user_id,
      month,
      updatePaymentStatusDto.isPaid,
      updatePaymentStatusDto.note,
    );
    return { message: 'Payroll updated successfully', updatedPayroll };
  }
  @Get('summary')
  async getPayrollSummaries() {
    return this.payrollService.getPayrollSummaries();
  }
}
