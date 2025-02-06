import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { JobService } from 'src/services/job.service';
import { CreateJobDto, UpdateJobDto } from 'src/services/dto/job.dto';

@Controller('jobs')
export class JobController {
  constructor(private readonly jobService: JobService) {}

  @Post()
  async create(@Body() createJobDto: CreateJobDto) {
    return await this.jobService.createJob(createJobDto);
  }

  @Get()
  async findAll() {
    return await this.jobService.getAllJobs();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.jobService.getJobById(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateJobDto: UpdateJobDto) {
    return await this.jobService.updateJob(id, updateJobDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.jobService.deleteJob(id);
  }
}
