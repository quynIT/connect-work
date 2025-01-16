import { Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { LeaveRequestRepository } from './repositories/leaverequest.repository';
import {
  CreateLeaveRequestDto,
  UpdateLeaveRequestStatusDto,
} from '../services/dto/leaverequest.dto';
import { LeaveRequest } from '../models/leaverequest.model';

@Injectable()
export class LeaveRequestService {
  constructor(
    private readonly leaveRequestRepository: LeaveRequestRepository,
  ) {}

  async createLeaveRequest(
    createLeaveRequestDto: CreateLeaveRequestDto,
  ): Promise<LeaveRequest> {
    const { user_id, date, reason } = createLeaveRequestDto;

    const newLeaveRequest = await this.leaveRequestRepository.create({
      user_id: new Types.ObjectId(user_id),
      date,
      reason,
      status: 'pending',
      admin_comment: null,
    });

    return newLeaveRequest;
  }

  async getLeaveRequestsByDate(date: Date): Promise<LeaveRequest[]> {
    const startOfDay = new Date(date.setHours(0, 0, 0, 0));
    const endOfDay = new Date(date.setHours(23, 59, 59, 999));

    return await this.leaveRequestRepository.getByCondition(
      {
        date: {
          $gte: startOfDay,
          $lte: endOfDay,
        },
      },
      null, // không cần lọc các trường trong LeaveRequest
      null, // không cần option nào đặc biệt
      { path: 'user_id', select: 'name position' }, // populate 'user_id' và lấy các trường 'name' và 'position'
    );
  }
  async getLeaveRequestsByUser(userId: string): Promise<LeaveRequest[]> {
    const userObjectId = new Types.ObjectId(userId);

    const leaveRequests = await this.leaveRequestRepository.getByCondition(
      { user_id: userObjectId },
      null,
      null,
      { path: 'user_id', select: 'name position' },
    );

    if (!leaveRequests || leaveRequests.length === 0) {
      throw new NotFoundException(
        `No leave requests found for user ID ${userId}`,
      );
    }

    return leaveRequests;
  }
  async updateLeaveRequestStatus(
    requestId: string,
    updateStatusDto: UpdateLeaveRequestStatusDto,
  ): Promise<LeaveRequest> {
    const { status, admin_comment } = updateStatusDto;

    const existingRequest =
      await this.leaveRequestRepository.findById(requestId);
    if (!existingRequest) {
      throw new NotFoundException(
        `Leave request with ID ${requestId} not found`,
      );
    }

    // Sửa lại chỗ này, bỏ option { new: true }
    const updatedRequest = await this.leaveRequestRepository.findByIdAndUpdate(
      requestId,
      {
        status,
        admin_comment: admin_comment || null,
      },
    );

    // Nếu cần document mới, fetch lại sau khi update
    if (updatedRequest) {
      return await this.leaveRequestRepository.findById(requestId);
    }

    return updatedRequest;
  }
}
