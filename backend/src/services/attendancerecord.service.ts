import { Injectable } from '@nestjs/common';
import { AttendanceRecordRepository } from '../services/repositories/attendancerecord.repository';
import { AttendanceRecord } from '../models/attendanceRecord.model';
import { AttendanceForm } from '../models/attendanceForm.model';

@Injectable()
export class AttendanceRecordService {
  constructor(
    private readonly attendanceRecordRepository: AttendanceRecordRepository,
  ) {}

  // Lấy dữ liệu từ AttendanceForm và lưu vào AttendanceRecord
  async saveRecordsFromForm(attendanceForm: AttendanceForm): Promise<void> {
    const { _id: form_id, date, employees } = attendanceForm;

    for (const employee of employees) {
      // Kiểm tra bản ghi tồn tại, form_id luôn là chuỗi
      const existingRecord =
        await this.attendanceRecordRepository.findByCondition({
          form_id: form_id.toString(), // Đảm bảo form_id là string
          user_id: employee.user_id,
        });

      if (existingRecord) {
        // Nếu đã tồn tại, cập nhật bản ghi
        await this.attendanceRecordRepository.update(
          existingRecord._id.toString(),
          {
            is_present: employee.is_present,
            reason: employee.reason || null,
            date,
          },
        );
      } else {
        // Nếu chưa tồn tại, tạo bản ghi mới
        await this.attendanceRecordRepository.create({
          form_id: form_id.toString(), // Lưu form_id dưới dạng string
          user_id: employee.user_id,
          date,
          is_present: employee.is_present,
          reason: employee.reason || null,
        });
      }
    }
  }

  async getAttendanceByDate(date: Date): Promise<AttendanceRecord[]> {
    return await this.attendanceRecordRepository.findAllByDate(date);
  }

  async getAttendanceByUserAndDate(
    user_id: string,
    date: Date,
  ): Promise<AttendanceRecord | null> {
    return await this.attendanceRecordRepository.findByUserAndDate(
      user_id,
      date,
    );
  }

  // Lấy tất cả thông tin chấm công của user trong 1 năm
  async getUserAttendanceDetailsInYear(
    userId: string,
    year: number,
  ): Promise<
    {
      date: Date;
      is_present: boolean | null;
      reason: string | null;
    }[]
  > {
    const startOfYear = new Date(`${year}-01-01`);
    const endOfYear = new Date(`${year}-12-31`);

    return await this.attendanceRecordRepository.find({
      user_id: userId,
      date: { $gte: startOfYear, $lte: endOfYear },
    });
  }
  async getUserAttendanceDetails(userId: string): Promise<
    {
      date: Date;
      is_present: boolean | null;
      reason: string | null;
    }[]
  > {
    // Fetch all attendance records for the given user without limiting to a specific year
    return await this.attendanceRecordRepository.find({
      user_id: userId,
    });
  }
}
