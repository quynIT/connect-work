import { IsNotEmpty } from 'class-validator';
import { Types } from 'mongoose';

export class CreateCommentDto {
  @IsNotEmpty()
  taskId: Types.ObjectId; // ID của Task

  @IsNotEmpty()
  user: string[]; // ID của User

  @IsNotEmpty()
  content: string; // Nội dung comment
}
