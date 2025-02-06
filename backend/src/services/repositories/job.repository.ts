import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Job } from '../../models/job.model';
import { BaseRepository } from 'src/base.repository';

@Injectable()
export class JobRepository extends BaseRepository<Job> {
  constructor(@InjectModel('Job') private readonly jobModel: Model<Job>) {
    super(jobModel);
  }
}
