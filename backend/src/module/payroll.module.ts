// payroll.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { PayrollSchema } from '../models/payroll.model';
import { PayrollService } from '../services/payroll.service';
import { PayrollRepository } from '../services/repositories/payroll.repository';
import { PayrollController } from '../controllers/payroll.controller';
import { AttendanceRecordRepository } from '../services/repositories/attendancerecord.repository';
import { UserRepository } from '../user/repositories/user.repository';
import { AttendanceRecordSchema } from 'src/models/attendanceRecord.model';
import { UserSchema } from 'src/user/models/user.model';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: 'Payroll', schema: PayrollSchema },
      { name: 'AttendanceRecord', schema: AttendanceRecordSchema }, // Đăng ký schema AttendanceRecord
      { name: 'User', schema: UserSchema }, // Đăng ký schema User
    ]),
  ],
  providers: [
    PayrollService,
    PayrollRepository,
    AttendanceRecordRepository,
    UserRepository,
  ],
  controllers: [PayrollController],
})
export class PayrollModule {}
