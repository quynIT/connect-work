import { IsNotEmpty, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class CreateProjectDto {
  @IsNotEmpty() name: string;
  @IsOptional() url?: string;
  @IsOptional() description?: string;
  @IsNotEmpty() projectCategory: string;
  @IsOptional() members?: Types.ObjectId[]; // Array of ObjectIds
  @IsOptional() tasks?: Types.ObjectId[]; // Array of ObjectIds
}

export class UpdateProjectDto {
  @IsOptional() name?: string;
  @IsOptional() url?: string;
  @IsOptional() description?: string;
  @IsOptional() projectCategory?: string;
  @IsOptional() members?: Types.ObjectId[];
  @IsOptional() tasks?: Types.ObjectId[];
}
