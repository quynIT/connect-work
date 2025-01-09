import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceRecordService } from '../services/attendanceRecord.service';
import { AttendanceRecordController } from '../controllers/attendanceRecord.controller';
import { AttendanceFormService } from '../services/attendanceForm.service';
import { AttendanceRecordRepository } from '../services/repositories/attendancerecord.repository';
import { AttendanceFormRepository } from '../services/repositories/attendanceform.repository';
import { AttendanceRecordSchema } from '../models/attendanceRecord.model';
import { AttendanceFormSchema } from '../models/attendanceForm.model';
@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'AttendanceRecord', schema: AttendanceRecordSchema },
      { name: 'AttendanceForm', schema: AttendanceFormSchema },
    ]),
  ],
  providers: [
    AttendanceRecordRepository,
    AttendanceRecordService,
    AttendanceFormService,
    AttendanceFormRepository,
  ],
  controllers: [AttendanceRecordController],
  exports: [AttendanceRecordService, AttendanceRecordRepository],
})
export class AttendanceRecordModule {}
