import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobController } from 'src/controllers/job.controller';
import { JobSchema } from 'src/models/job.model';
import { GoogleDriveService } from 'src/services/google-drive.service';
import { JobService } from 'src/services/job.service';
import { JobRepository } from 'src/services/repositories/job.repository';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]), // Đảm bảo đăng ký schema Job
    MulterModule.register({
      storage: memoryStorage(), // Lưu file trong memory thay vì disk
    }),
  ],
  controllers: [JobController],
  providers: [JobService, JobRepository, GoogleDriveService],
  exports: [JobService, JobRepository],
})
export class JobModule {}
