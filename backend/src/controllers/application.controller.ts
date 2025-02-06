import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
} from '@nestjs/common';
import { ApplicationService } from '../services/application.service';
import {
  CreateApplicationDto,
  CreateAssessmentDto,
  UpdateApplicationDto,
} from 'src/services/dto/application.dto';

@Controller('applications')
export class ApplicationController {
  constructor(private readonly applicationService: ApplicationService) {}

  @Post(':jobId')
  create(
    @Param('jobId') jobId: string,
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    return this.applicationService.createApplication(
      jobId,
      createApplicationDto,
    );
  }

  @Get()
  findAll() {
    return this.applicationService.getAllApplications();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.applicationService.getApplicationById(id);
  }

  @Put('status/:id')
  update(
    @Param('id') id: string,
    @Body() updateApplicationDto: UpdateApplicationDto,
  ) {
    return this.applicationService.updateApplication(id, updateApplicationDto);
  }
  @Post('assessments/:id')
  addAssessment(
    @Param('id') id: string,
    @Body() assessment: CreateAssessmentDto,
  ) {
    return this.applicationService.addAssessment(id, assessment);
  }
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.applicationService.deleteApplication(id);
  }
}
