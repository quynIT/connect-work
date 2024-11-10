import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { PostModule } from './post/post.module';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import * as dotenv from 'dotenv';
dotenv.config();
@Module({
  imports: [
    PostModule,
    UserModule,
    ConfigModule.forRoot(),
    MongooseModule.forRoot(process.env.MONGODB_URL),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
