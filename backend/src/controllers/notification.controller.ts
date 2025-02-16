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
import { NotificationService } from '../services/notification.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from '../services/dto/notification.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { GoogleDriveService } from '../services/google-drive.service';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  @Post()
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'application/zip',
          'application/x-rar-compressed',
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
        fileSize: 10 * 1024 * 1024, // 10MB limit
      },
    }),
  )
  async createNotification(
    @UploadedFile() file: Express.Multer.File,
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    try {
      let attachments = [];

      if (file) {
        console.log('Uploading file:', {
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        });

        const fileData = await this.googleDriveService.uploadFile(file);
        attachments = [fileData.downloadLink];
      }

      const notification = await this.notificationService.createNotification({
        ...createNotificationDto,
        attachments,
      });

      return {
        success: true,
        data: notification,
        file: file ? { downloadLink: attachments[0] } : null,
      };
    } catch (error) {
      console.error('Error in createNotification:', error);
      throw new BadRequestException(
        `Failed to create notification: ${error.message}`,
      );
    }
  }

  @Get()
  async findAll() {
    return await this.notificationService.getAllNotifications();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.notificationService.getNotificationById(id);
  }

  @Put(':id')
  @UseInterceptors(
    FileInterceptor('file', {
      fileFilter: (req, file, callback) => {
        const allowedMimes = [
          'image/jpeg',
          'image/png',
          'image/gif',
          'image/webp',
          'application/pdf',
          'application/msword',
          'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
          'text/plain',
          'application/zip',
          'application/x-rar-compressed',
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
        fileSize: 10 * 1024 * 1024,
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @UploadedFile() file?: Express.Multer.File,
  ) {
    try {
      let fileData = null;

      if (file) {
        console.log('Uploading file for update:', {
          filename: file.originalname,
          mimetype: file.mimetype,
          size: file.size,
        });

        fileData = await this.googleDriveService.uploadFile(file);
        updateNotificationDto.attachments = [fileData.downloadLink];
      }

      const updatedNotification =
        await this.notificationService.updateNotification(
          id,
          updateNotificationDto,
        );

      return {
        success: true,
        data: updatedNotification,
        file: fileData,
      };
    } catch (error) {
      console.error('Error in updateNotification:', error);
      throw new BadRequestException(
        `Failed to update notification: ${error.message}`,
      );
    }
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.notificationService.deleteNotification(id);
  }
}
