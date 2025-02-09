import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  UseInterceptors,
  UploadedFile,
  BadRequestException,
} from '@nestjs/common';
import { JobService } from 'src/services/job.service';
import { CreateJobDto, UpdateJobDto } from 'src/services/dto/job.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleDriveService } from 'src/services/google-drive.service';

@Controller('jobs')
export class JobController {
  constructor(
    private readonly jobService: JobService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        // Mở rộng danh sách các loại file được phép
        const allowedMimes = [
          // Images
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          // Documents
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'application/vnd.ms-excel',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-powerpoint',
          'application/vnd.openxmlformats-officedocument.presentationml.presentation',
          // Text
          'text/plain',
          // Archives
          'application/zip',
          'application/x-rar-compressed',
          // Others
          'application/octet-stream',
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
        fileSize: 10 * 1024 * 1024, // Tăng giới hạn lên 10MB
      },
    }),
  )
  async createJob(
    @UploadedFile() file: Express.Multer.File,
    @Body() createJobDto: CreateJobDto,
  ) {
    if (!file) {
      throw new BadRequestException('File is required');
    }

    try {
      console.log('Uploading file:', {
        filename: file.originalname,
        mimetype: file.mimetype,
        size: file.size,
      });

      const fileData = await this.googleDriveService.uploadFile(file);

      const job = await this.jobService.createJob({
        ...createJobDto,
        attachments: [fileData.downloadLink],
      });

      return {
        success: true,
        data: job,
        file: fileData,
      };
    } catch (error) {
      console.error('Error in createJob:', error);
      throw new BadRequestException(`Failed to create job: ${error.message}`);
    }
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
