import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
import { MailerModule } from '@nestjs-modules/mailer';
import { ProjectModule } from './module/project.module';
import { TaskModule } from './module/task.module';
import { CommentModule } from './module/comment.module';
import { AttendanceFormModule } from './module/attendanceform.module';
import { AttendanceRecordModule } from './module/attendancerecord.module';
import { LeaveRequestModule } from './module/leaverequest.module';
import { PayrollModule } from './module/payroll.module';

dotenv.config();
@Module({
  imports: [
    UserModule,
    ProjectModule,
    TaskModule,
    CommentModule,
    AttendanceFormModule,
    AttendanceRecordModule,
    LeaveRequestModule,
    PayrollModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL),
    MailerModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        // transport: config.get('MAIL_TRANSPORT'),
        transport: {
          host: config.get('MAIL_HOST'),
          secure: false,
          auth: {
            user: config.get('MAIL_USER'),
            pass: config.get('MAIL_PASSWORD'),
          },
        },
        defaults: {
          from: `"No Reply" <${config.get('MAIL_FROM')}>`,
        },
      }),
      inject: [ConfigService],
    }),
    // BullModule.forRoot({
    //   redis: {
    //     host: 'localhost',
    //     port: 6379,
    //   },
    // }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
