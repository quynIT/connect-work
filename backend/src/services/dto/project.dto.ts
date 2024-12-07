import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateProjectDto {
  @IsNotEmpty() name: string;
  @IsOptional() url?: string;
  @IsOptional() description?: string;
  @IsNotEmpty() projectCategory: string;
  @IsOptional() user: string[]; // Array of ObjectIds
  @IsNotEmpty() createdBy: string;
}

export class UpdateProjectDto {
  @IsOptional() name?: string;
  @IsOptional() url?: string;
  @IsOptional() description?: string;
  @IsOptional() projectCategory?: string;
  @IsOptional() user: string[];
  @IsOptional() createdBy?: string;
}
