import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Payroll } from 'src/models/payroll.model';
import { BaseRepository } from 'src/base.repository';

@Injectable()
export class PayrollRepository extends BaseRepository<Payroll> {
  constructor(
    @InjectModel('Payroll')
    private readonly payrollModel: Model<Payroll>,
  ) {
    super(payrollModel);
  }
}
