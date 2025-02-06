import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateJobDto, UpdateJobDto } from './dto/job.dto';
import { Job } from '../models/job.model';
import { JobRepository } from './repositories/job.repository';

@Injectable()
export class JobService {
  constructor(private readonly jobRepository: JobRepository) {}

  async createJob(job: CreateJobDto): Promise<Job> {
    const newJob = await this.jobRepository.create(job as Partial<Job>);
    return newJob;
  }

  async getAllJobs(): Promise<Job[]> {
    return await this.jobRepository.findAll();
  }

  async getJobById(id: string): Promise<Job | null> {
    return await this.jobRepository.findById(id);
  }

  async updateJob(id: string, updateData: UpdateJobDto): Promise<Job> {
    const existingJob = await this.jobRepository.findById(id);
    if (!existingJob) {
      throw new NotFoundException(`Job with id ${id} not found`);
    }

    const updatedJob = await this.jobRepository.findByIdAndUpdate(
      id,
      updateData,
    );
    if (!updatedJob) {
      throw new NotFoundException(`Failed to update job with id ${id}`);
    }

    return updatedJob;
  }

  async deleteJob(id: string): Promise<any> {
    return await this.jobRepository.deleteOne(id);
  }
}
