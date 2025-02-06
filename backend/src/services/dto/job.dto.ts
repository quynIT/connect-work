import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreateJobDto {
  @IsNotEmpty() title: string;
  @IsNotEmpty() description: string;
  @IsNotEmpty() location: string;
  @IsOptional() salaryRange?: string;
  @IsOptional() attachments?: string[];
}

export class UpdateJobDto {
  @IsOptional() title?: string;
  @IsOptional() description?: string;
  @IsOptional() location?: string;
  @IsOptional() salaryRange?: string;
  @IsOptional() status?: 'open' | 'closed';
  @IsOptional() attachments?: string[];
}
