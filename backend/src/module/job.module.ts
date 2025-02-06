import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JobController } from 'src/controllers/job.controller';
import { JobSchema } from 'src/models/job.model';
import { JobService } from 'src/services/job.service';
import { JobRepository } from 'src/services/repositories/job.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Job', schema: JobSchema }]), // Đảm bảo đăng ký schema Job
  ],
  controllers: [JobController],
  providers: [JobService, JobRepository],
  exports: [JobService, JobRepository],
})
export class JobModule {}
