import { Controller, Post, Get, Body, Put, Param, Query } from '@nestjs/common';
import { LeaveRequestService } from '../services/leaverequest.service';
import {
  CreateLeaveRequestDto,
  UpdateLeaveRequestStatusDto,
} from '../services/dto/leaverequest.dto';

@Controller('leave-requests')
export class LeaveRequestController {
  constructor(private readonly leaveRequestService: LeaveRequestService) {}

  @Post()
  async createLeaveRequest(
    @Body() createLeaveRequestDto: CreateLeaveRequestDto,
  ) {
    return await this.leaveRequestService.createLeaveRequest(
      createLeaveRequestDto,
    );
  }

  @Get()
  async getLeaveRequestsByDate(@Query('date') date: string) {
    return await this.leaveRequestService.getLeaveRequestsByDate(
      new Date(date),
    );
  }
  @Get('/user/:userId')
  async getLeaveRequestsByUser(@Param('userId') userId: string) {
    return await this.leaveRequestService.getLeaveRequestsByUser(userId);
  }
  @Put('/:id/status')
  async updateLeaveRequestStatus(
    @Param('id') requestId: string,
    @Body() updateStatusDto: UpdateLeaveRequestStatusDto,
  ) {
    return await this.leaveRequestService.updateLeaveRequestStatus(
      requestId,
      updateStatusDto,
    );
  }
}
