import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommentDto {
  @IsNotEmpty()
  taskId: Types.ObjectId; // ID của Task

  @IsNotEmpty()
  userId: Types.ObjectId; // ID của User

  @IsNotEmpty()
  content: string; // Nội dung comment
}
