import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationService } from 'src/services/application.service';
import { ApplicationRepository } from 'src/services/repositories/application.repository';

import { UserModule } from 'src/user/user.module';
import { ApplicationSchema } from 'src/models/application.model';
import { ApplicationController } from 'src/controllers/application.controller';
import { GoogleDriveService } from 'src/services/google-drive.service';
import { MulterModule } from '@nestjs/platform-express';

@Module({
  imports: [
    UserModule,
    MulterModule.register(),
    MongooseModule.forFeature([
      { name: 'Application', schema: ApplicationSchema },
    ]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, ApplicationRepository, GoogleDriveService],
  exports: [ApplicationService, ApplicationRepository],
})
export class ApplicationModule {}
