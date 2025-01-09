import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendanceFormController } from 'src/controllers/attendanceform.controller';
import { AttendanceFormSchema } from 'src/models/attendanceform.model';
import { AttendanceFormService } from 'src/services/attendanceform.service';
import { AttendanceFormRepository } from 'src/services/repositories/attendanceform.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule, // Kết nối module User để sử dụng thông tin người dùng
    MongooseModule.forFeature([
      { name: 'AttendanceForm', schema: AttendanceFormSchema },
    ]), // Sử dụng schema AttendanceForm
  ],
  controllers: [AttendanceFormController], // Định nghĩa controller cho AttendanceForm
  providers: [AttendanceFormService, AttendanceFormRepository], // Cung cấp service và repository
  exports: [AttendanceFormService, AttendanceFormRepository], // Export service và repository cho các module khác nếu cần
})
export class AttendanceFormModule {}
