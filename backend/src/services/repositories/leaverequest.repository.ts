import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { LeaveRequest } from '../../models/leaverequest.model';
import { BaseRepository } from 'src/base.repository';

@Injectable()
export class LeaveRequestRepository extends BaseRepository<LeaveRequest> {
  constructor(
    @InjectModel('LeaveRequest')
    private readonly leaveRequestModel: Model<LeaveRequest>,
  ) {
    super(leaveRequestModel);
  }
}
