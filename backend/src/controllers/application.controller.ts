import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  UseInterceptors,
  BadRequestException,
  UploadedFiles,
  Logger,
} from '@nestjs/common';

import { ApplicationService } from '../services/application.service';
import {
  CreateApplicationDto,
  CreateAssessmentDto,
  UpdateApplicationDto,
} from 'src/services/dto/application.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GoogleDriveService } from 'src/services/google-drive.service';

@Controller('applications')
export class ApplicationController {
  private readonly logger = new Logger(ApplicationController.name);
  constructor(
    private readonly applicationService: ApplicationService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  @Post(':jobId')
  @UseInterceptors(
    FilesInterceptor('files', 3, {
      fileFilter: (req, file, callback) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/pdf',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        ];

        if (!allowedMimes.includes(file.mimetype)) {
          return callback(
            new BadRequestException(
              `File type not allowed. Allowed types are: ${allowedMimes.join(', ')}`,
            ),
            false,
          );
        }
        callback(null, true);
      },
      limits: {
        fileSize: 10 * 1024 * 1024, // 5MB per file
      },
    }),
  )
  async create(
    @Param('jobId') jobId: string,
    @UploadedFiles() files: Express.Multer.File[],
    @Body() createApplicationDto: CreateApplicationDto,
  ) {
    if (!files || files.length === 0) {
      throw new BadRequestException('At least one resume file is required');
    }

    if (files.length > 3) {
      throw new BadRequestException('Maximum 3 files are allowed');
    }

    try {
      this.logger.log(`Uploading ${files.length} files for application`);

      // Upload all files to Google Drive
      const uploadPromises = files.map((file) =>
        this.googleDriveService.uploadFile(file),
      );

      const uploadedFiles = await Promise.all(uploadPromises);
      const resumeLinks = uploadedFiles.map((file) => file.downloadLink);

      this.logger.log('Files uploaded successfully, creating application');

      // Create application with file links
      const application = await this.applicationService.createApplication(
        jobId,
        {
          ...createApplicationDto,
          resume: resumeLinks,
        },
      );

      return {
        success: true,
        data: application,
        files: uploadedFiles,
      };
    } catch (error) {
      this.logger.error('Error in create application:', error);
      throw new BadRequestException(
        `Failed to create application: ${error.message}`,
      );
    }
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
