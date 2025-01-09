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
    const { date, employees } = attendanceForm;

    for (const employee of employees) {
      await this.attendanceRecordRepository.create({
        user_id: employee.user_id,
        date: date,
        is_present: employee.is_present,
        reason: employee.reason || null,
      });
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
}
