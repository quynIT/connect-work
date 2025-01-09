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
}
