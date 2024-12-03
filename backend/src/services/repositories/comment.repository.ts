import { Injectable } from '@nestjs/common';
import { Comment } from '../../models/comment.model';
import { BaseRepository } from 'src/base.repository'; // Import BaseRepository
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class CommentRepository extends BaseRepository<Comment> {
  constructor(
    @InjectModel('Comment') private readonly commentModel: Model<Comment>,
  ) {
    super(commentModel); // Gọi constructor của BaseRepository
  }
}
