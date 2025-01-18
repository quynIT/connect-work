import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  Req,
  NotFoundException,
  Query,
  BadRequestException,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { AttendanceFormService } from '../services/attendanceform.service';
import { AttendanceForm } from '../models/attendanceform.model';
import {
  CreateAttendanceFormDto,
  UpdateAttendanceFormDto,
} from 'src/services/dto/attendanceform.dto';

@Controller('attendance-forms')
export class AttendanceFormController {
  constructor(private readonly attendanceFormService: AttendanceFormService) {}

  // Tạo form điểm danh mới
  @Post('/create')
  async createAttendanceForm(
    @Req() req: any,
    @Body() createForm: CreateAttendanceFormDto,
  ) {
    try {
      // Gọi service để tạo form điểm danh
      const newForm = await this.attendanceFormService.createAttendanceForm(
        req.user, // Lấy thông tin người dùng từ request (đã được bảo vệ bởi guard JWT)
        createForm, // Tham số form điểm danh
      );
      return newForm; // Trả về form điểm danh vừa tạo
    } catch (error) {
      // Nếu có lỗi (ví dụ: ngày đã có form), ném lỗi và trả về thông báo
      throw new HttpException(error.message, HttpStatus.BAD_REQUEST);
    }
  }

  // Lấy tất cả các form điểm danh
  @Get('/all')
  async getAllAttendanceForms(): Promise<AttendanceForm[]> {
    return this.attendanceFormService.getAllAttendanceForms();
  }
  @Get('search-by-date')
  async searchByDate(@Query('date') date: string) {
    if (!date) {
      throw new BadRequestException('Vui lòng cung cấp ngày để tìm kiếm');
    }

    return await this.attendanceFormService.searchFormsByDate(date);
  }
  // Lấy form điểm danh theo ID
  @Get('/detail/:id')
  async getAttendanceFormById(
    @Param('id') id: string,
  ): Promise<AttendanceForm> {
    const form = await this.attendanceFormService.getAttendanceFormById(id);
    if (!form) {
      throw new NotFoundException(`Attendance form with id ${id} not found`);
    }
    return form;
  }

  // Cập nhật form điểm danh
  @Put('/update/:id')
  async updateAttendanceForm(
    @Param('id') id: string,
    @Body() updateData: UpdateAttendanceFormDto,
  ): Promise<AttendanceForm> {
    try {
      return await this.attendanceFormService.updateAttendanceForm(
        id,
        updateData,
      );
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  // Xóa form điểm danh
  @Delete('/delete/:id')
  async deleteAttendanceForm(@Param('id') id: string): Promise<any> {
    return this.attendanceFormService.deleteAttendanceForm(id);
  }
}
