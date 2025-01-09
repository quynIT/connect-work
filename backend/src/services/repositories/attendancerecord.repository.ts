import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AttendanceRecord } from '../../models/attendanceRecord.model';
import { BaseRepository } from '../../base.repository';

@Injectable()
export class AttendanceRecordRepository extends BaseRepository<AttendanceRecord> {
  constructor(
    @InjectModel('AttendanceRecord')
    private readonly attendanceRecordModel: Model<AttendanceRecord>,
  ) {
    super(attendanceRecordModel);
  }

  async create(record: Partial<AttendanceRecord>): Promise<AttendanceRecord> {
    const newRecord = new this.attendanceRecordModel(record);
    return await newRecord.save();
  }

  async findByUserAndDate(
    user_id: string,
    date: Date,
  ): Promise<AttendanceRecord | null> {
    const formattedDate = new Date(date.toISOString().split('T')[0]);
    return this.attendanceRecordModel
      .findOne({ user_id, date: formattedDate })
      .exec();
  }

  async findAllByDate(date: Date): Promise<AttendanceRecord[]> {
    return await this.attendanceRecordModel.find({ date }).exec();
  }

  async update(
    id: string,
    updateData: Partial<AttendanceRecord>,
  ): Promise<AttendanceRecord | null> {
    return await this.attendanceRecordModel
      .findByIdAndUpdate(id, updateData, {
        new: true,
      })
      .exec();
  }

  async find(filter: any): Promise<AttendanceRecord[]> {
    return this.attendanceRecordModel.find(filter).exec();
  }
}
