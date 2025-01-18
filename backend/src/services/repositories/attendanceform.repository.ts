import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttendanceForm } from '../../models/attendanceform.model';
import { BaseRepository } from 'src/base.repository';

@Injectable()
export class AttendanceFormRepository extends BaseRepository<AttendanceForm> {
  constructor(
    @InjectModel('AttendanceForm')
    private readonly attendanceFormModel: Model<AttendanceForm>,
  ) {
    super(attendanceFormModel);
  }
  async findByIdWithPopulate(id: string, populateOptions: any) {
    return this.attendanceFormModel.findById(id).populate(populateOptions);
  }
  async findByDate(date: Date): Promise<AttendanceForm | null> {
    return this.attendanceFormModel
      .findOne({
        date: {
          $gte: new Date(date.setHours(0, 0, 0, 0)), // Đảm bảo so sánh theo ngày
          $lt: new Date(date.setHours(23, 59, 59, 999)), // Đến hết ngày
        },
      })
      .exec();
  }
}
