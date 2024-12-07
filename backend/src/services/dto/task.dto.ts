import { IsNotEmpty, IsOptional, IsEnum } from 'class-validator';
import { Types } from 'mongoose';

export class CreateTaskDto {
  @IsNotEmpty() name: string;
  @IsOptional() description?: string;
  @IsNotEmpty() projectId: Types.ObjectId; // ID của dự án
  @IsNotEmpty() user?: string[]; // Nhận mảng chuỗi từ client
  @IsEnum(['To Do', 'In Progress', 'In Review', 'Done']) status: string;
  @IsOptional() dueDate?: Date;
}

export class UpdateTaskDto {
  @IsOptional() name?: string;
  @IsOptional() description?: string;
  @IsOptional() projectId?: Types.ObjectId;
  @IsOptional() user?: string[];
  @IsOptional() status?: string;
  @IsOptional() dueDate?: Date;
}
