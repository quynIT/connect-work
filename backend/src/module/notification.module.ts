import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { NotificationController } from '../controllers/notification.controller';
import { GoogleDriveService } from '../services/google-drive.service';
import { NotificationService } from '../services/notification.service';
import { NotificationRepository } from '../services/repositories/notification.repository';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { NotificationSchema } from 'src/models/notification.model';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: 'Notification', schema: NotificationSchema },
    ]),
    MulterModule.register({
      storage: memoryStorage(),
    }),
  ],
  controllers: [NotificationController],
  providers: [NotificationService, NotificationRepository, GoogleDriveService],
  exports: [NotificationService, NotificationRepository],
})
export class NotificationModule {}
