import { IsNotEmpty, IsArray, IsOptional } from 'class-validator';

export class CreateAttendanceFormDto {
  date: Date;
  @IsArray() @IsNotEmpty() employees: {
    user_id: string;
    is_present: boolean | null;
    reason: string | null;
  }[];
}
export class UpdateAttendanceFormDto {
  date?: Date;
  @IsOptional() @IsArray() employees?: {
    user_id: string;
    is_present: boolean | null;
    reason: string | null;
  }[];
}
