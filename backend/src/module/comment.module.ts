import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CommentService } from '../services/comment.service'; // Import CommentService
import { CommentSchema } from '../models/comment.model'; // Import Comment model
import { CommentController } from 'src/controllers/comment.controller';
import { CommentRepository } from 'src/services/repositories/comment.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Comment', schema: CommentSchema }]),
  ],
  controllers: [CommentController],
  providers: [CommentService, CommentRepository],
  exports: [CommentService, CommentRepository],
})
export class CommentModule {}
