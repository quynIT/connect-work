import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ApplicationService } from 'src/services/application.service';
import { ApplicationRepository } from 'src/services/repositories/application.repository';

import { UserModule } from 'src/user/user.module';
import { ApplicationSchema } from 'src/models/application.model';
import { ApplicationController } from 'src/controllers/application.controller';

@Module({
  imports: [
    UserModule,
    MongooseModule.forFeature([
      { name: 'Application', schema: ApplicationSchema },
    ]),
  ],
  controllers: [ApplicationController],
  providers: [ApplicationService, ApplicationRepository],
  exports: [ApplicationService, ApplicationRepository],
})
export class ApplicationModule {}
