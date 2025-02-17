import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommentDto {
  @IsNotEmpty()
  taskId: Types.ObjectId;

  @IsNotEmpty()
  user: string[];

  @IsNotEmpty()
  content: string;
}
