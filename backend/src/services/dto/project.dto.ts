import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProjectDto {
  @IsNotEmpty() name: string;
  @IsOptional() url?: string;
  @IsOptional() description?: string;
  @IsNotEmpty() projectCategory: string;
  @IsOptional() user: string[]; // Array of ObjectIds
  @IsOptional() tasks?: Types.ObjectId[]; // Array of ObjectIds
  @IsNotEmpty() createdBy: string;
}

export class UpdateProjectDto {
  @IsOptional() name?: string;
  @IsOptional() url?: string;
  @IsOptional() description?: string;
  @IsOptional() projectCategory?: string;
  @IsOptional() user: string[];
  @IsOptional() tasks?: Types.ObjectId[];
  @IsOptional() createdBy?: string;
}
