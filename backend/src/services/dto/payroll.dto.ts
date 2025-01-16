// src/payroll/dto/payroll.dto.ts
import { IsString, IsBoolean, IsOptional } from 'class-validator';
import { Types } from 'mongoose';

export class PayrollDto {
  user_id: Types.ObjectId;

  month: string;

  total_working_days: number;

  total_salary: number;

  @IsBoolean()
  isPaid: boolean;

  @IsString()
  note?: string;

  @IsOptional()
  paymentDate?: Date | null;
}
