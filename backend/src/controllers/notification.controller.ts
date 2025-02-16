import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  UseInterceptors,
  UploadedFiles,
  BadRequestException,
} from '@nestjs/common';
import { NotificationService } from '../services/notification.service';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from '../services/dto/notification.dto';
import { FilesInterceptor } from '@nestjs/platform-express';
import { GoogleDriveService } from '../services/google-drive.service';

@Controller('notifications')
export class NotificationController {
  constructor(
    private readonly notificationService: NotificationService,
    private readonly googleDriveService: GoogleDriveService,
  ) {}

  @Post()
  @UseInterceptors(
    FilesInterceptor('files', 3, {
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
    @UploadedFiles() files: Express.Multer.File[], // Thay đổi từ UploadedFile sang UploadedFiles
    @Body() createNotificationDto: CreateNotificationDto,
  ) {
    try {
      let attachments = [];

      if (files && files.length > 0) {
        console.log(
          'Uploading files:',
          files.map((file) => ({
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          })),
        );

        // Upload tất cả các file và lưu download links
        const uploadPromises = files.map((file) =>
          this.googleDriveService.uploadFile(file),
        );
        const uploadedFiles = await Promise.all(uploadPromises);
        attachments = uploadedFiles.map((fileData) => fileData.downloadLink);
      }

      const notification = await this.notificationService.createNotification({
        ...createNotificationDto,
        attachments,
      });

      return {
        success: true,
        data: notification,
        files:
          attachments.length > 0
            ? attachments.map((link) => ({ downloadLink: link }))
            : null,
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
    FilesInterceptor('files', 3, {
      // Thay đổi từ FileInterceptor sang FilesInterceptor, giới hạn 3 file
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
        fileSize: 10 * 1024 * 1024, // 10MB limit per file
      },
    }),
  )
  async update(
    @Param('id') id: string,
    @Body() updateNotificationDto: UpdateNotificationDto,
    @UploadedFiles() files?: Express.Multer.File[], // Thay đổi từ UploadedFile sang UploadedFiles
  ) {
    try {
      let uploadedFiles = [];

      if (files && files.length > 0) {
        console.log(
          'Uploading files for update:',
          files.map((file) => ({
            filename: file.originalname,
            mimetype: file.mimetype,
            size: file.size,
          })),
        );

        // Upload tất cả các file đồng thời
        const uploadPromises = files.map((file) =>
          this.googleDriveService.uploadFile(file),
        );
        uploadedFiles = await Promise.all(uploadPromises);

        // Cập nhật mảng attachments với các download links mới
        updateNotificationDto.attachments = uploadedFiles.map(
          (file) => file.downloadLink,
        );
      }

      const updatedNotification =
        await this.notificationService.updateNotification(
          id,
          updateNotificationDto,
        );

      return {
        success: true,
        data: updatedNotification,
        files: uploadedFiles.length > 0 ? uploadedFiles : null,
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
