import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { LeaveRequestController } from 'src/controllers/leaverequest.controller';
import { LeaveRequestSchema } from 'src/models/leaverequest.model';
import { LeaveRequestService } from 'src/services/leaverequest.service';
import { LeaveRequestRepository } from 'src/services/repositories/leaverequest.repository';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule, // Kết nối module User để sử dụng thông tin người dùng
    MongooseModule.forFeature([
      { name: 'LeaveRequest', schema: LeaveRequestSchema },
    ]), // Sử dụng schema LeaveRequest
  ],
  controllers: [LeaveRequestController], // Định nghĩa controller cho LeaveRequest
  providers: [LeaveRequestService, LeaveRequestRepository], // Cung cấp service và repository
  exports: [LeaveRequestService, LeaveRequestRepository], // Export service và repository cho các module khác nếu cần
})
export class LeaveRequestModule {}
