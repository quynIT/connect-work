import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AttendanceRecordService } from '../services/attendanceRecord.service';
import { AttendanceFormService } from '../services/attendanceForm.service';

@Controller('attendance-records')
export class AttendanceRecordController {
  constructor(
    private readonly attendanceRecordService: AttendanceRecordService,
    private readonly attendanceFormService: AttendanceFormService,
  ) {}

  // Lưu dữ liệu từ form điểm danh
  @Post('/from-form')
  async saveRecordsFromForm(@Body('form_id') form_id: string) {
    const attendanceForm =
      await this.attendanceFormService.getFormById(form_id);
    await this.attendanceRecordService.saveRecordsFromForm(attendanceForm);
    return { message: 'Attendance records saved successfully' };
  }

  // Lấy danh sách chấm công theo ngày
  @Get('/by-date')
  async getAttendanceByDate(@Query('date') date: string) {
    const attendanceDate = new Date(date);
    return await this.attendanceRecordService.getAttendanceByDate(
      attendanceDate,
    );
  }

  // API lấy dữ liệu chấm công của một user trong năm
  @Get('/user-attendance-details-in-year')
  async getUserAttendanceDetailsInYear(
    @Query('user_id') userId: string,
    @Query('year') year: number,
  ) {
    return await this.attendanceRecordService.getUserAttendanceDetailsInYear(
      userId,
      year,
    );
  }
  // API lấy dữ liệu chấm công của một user (không giới hạn theo năm)
  @Get('/user-attendance-details')
  async getUserAttendanceDetails(@Query('user_id') userId: string) {
    return await this.attendanceRecordService.getUserAttendanceDetails(userId);
  }
}
