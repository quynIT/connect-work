import { IsNotEmpty, IsEmail, IsOptional, Min, Max } from 'class-validator';
import { Status } from '../../models/application.model';
import { Type } from 'class-transformer';
export class CreateApplicationDto {
  @IsNotEmpty() fullName: string;
  @IsNotEmpty() @IsEmail() email: string;
  @IsNotEmpty() phone: string;
  @IsNotEmpty() resume: string[];
  @IsOptional() submittedAt?: Date;
}

export class UpdateApplicationDto {
  @IsOptional() fullName?: string;
  @IsOptional() email?: string;
  @IsOptional() phone?: string;
  @IsOptional() resume?: string[];
  @IsOptional() status?: Status;
  @IsOptional() notes?: string;
  @IsOptional() reviewedBy?: string;
  @IsOptional() reviewedAt?: Date;
  @IsOptional() assessments?: any;
}
export class AssessmentScoreDto {
  @IsNotEmpty()
  @Min(0)
  @Max(10)
  skills: number;

  @IsNotEmpty()
  @Min(0)
  @Max(10)
  knowledge: number;

  @IsNotEmpty()
  @Min(0)
  @Max(10)
  expertise: number;
}

export class CreateAssessmentDto {
  @IsNotEmpty()
  @Min(1)
  interviewRound: number;

  @IsNotEmpty()
  @Type(() => AssessmentScoreDto)
  scores: AssessmentScoreDto;

  @IsNotEmpty()
  @Min(0)
  @Max(30)
  totalScore: number;

  @IsOptional()
  comments?: string;
}
