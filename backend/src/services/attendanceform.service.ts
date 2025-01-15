import { Injectable, NotFoundException } from '@nestjs/common';
import { AttendanceFormRepository } from '../services/repositories/attendanceform.repository';
import {
  CreateAttendanceFormDto,
  UpdateAttendanceFormDto,
} from './dto/attendanceform.dto';
import { AttendanceForm } from '../models/attendanceform.model';
import { User } from 'src/user/models/user.model';

@Injectable()
export class AttendanceFormService {
  constructor(
    private readonly attendanceFormRepository: AttendanceFormRepository,
  ) {}

  // Tạo form điểm danh mới
  async createAttendanceForm(
    user: User,
    attendanceFormDto: CreateAttendanceFormDto,
  ) {
    // Thêm user ID vào danh sách nhân viên nếu chưa có
    const newAttendanceForm = await this.attendanceFormRepository.create(
      attendanceFormDto as unknown as Partial<AttendanceForm>,
    );
    return newAttendanceForm;
  }

  // Lấy tất cả các form điểm danh
  async getAllAttendanceForms(): Promise<AttendanceForm[]> {
    return await this.attendanceFormRepository.findAll();
  }

  // Lấy form điểm danh theo ID
  async getAttendanceFormById(id: string): Promise<AttendanceForm | null> {
    return await this.attendanceFormRepository.findByIdWithPopulate(id, {
      path: 'employees.user_id',
      select: 'name',
    });
  }

  // Cập nhật form điểm danh
  async updateAttendanceForm(
    id: string,
    updateData: UpdateAttendanceFormDto,
  ): Promise<AttendanceForm> {
    const existingForm = await this.attendanceFormRepository.findById(id);
    if (!existingForm) {
      throw new NotFoundException(`Attendance form with id ${id} not found`);
    }

    const updatedForm = await this.attendanceFormRepository.findByIdAndUpdate(
      id,
      updateData as unknown as Partial<AttendanceForm>,
    );
    if (!updatedForm) {
      throw new NotFoundException(
        `Failed to update attendance form with id ${id}`,
      );
    }

    return updatedForm;
  }

  // Xóa form điểm danh
  async deleteAttendanceForm(id: string): Promise<any> {
    return await this.attendanceFormRepository.deleteOne(id);
  }
  async getFormById(id: string): Promise<AttendanceForm> {
    const form = await this.attendanceFormRepository.findById(id);
    if (!form) {
      throw new NotFoundException(`Attendance form with ID ${id} not found`);
    }
    return form;
  }
  // Tìm kiếm form điểm danh theo ngày
  async searchFormsByDate(date: string): Promise<AttendanceForm[]> {
    // Xử lý tham số ngày
    const searchDate = new Date(date);
    if (isNaN(searchDate.getTime())) {
      throw new Error('Ngày tìm kiếm không hợp lệ');
    }

    // Tìm kiếm form điểm danh trong khoảng thời gian của ngày
    const startOfDay = new Date(searchDate.setHours(0, 0, 0, 0));
    const endOfDay = new Date(searchDate.setHours(23, 59, 59, 999));

    // Sử dụng repository để tìm form
    return await this.attendanceFormRepository.getByCondition({
      date: { $gte: startOfDay, $lt: endOfDay },
    });
  }
}
