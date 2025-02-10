import { Injectable, NotFoundException } from '@nestjs/common';
import { Application } from '../models/application.model';
import {
  CreateApplicationDto,
  CreateAssessmentDto,
  UpdateApplicationDto,
} from '../services/dto/application.dto';
import { ApplicationRepository } from './repositories/application.repository';

@Injectable()
export class ApplicationService {
  constructor(private readonly applicationRepository: ApplicationRepository) {}

  // Tạo ứng tuyển mới
  async createApplication(
    jobId: string,
    createApplicationDto: CreateApplicationDto,
  ) {
    const submittedAt = createApplicationDto.submittedAt || new Date();

    const application = await this.applicationRepository.create({
      jobId,
      candidate: {
        fullName: createApplicationDto.fullName,
        email: createApplicationDto.email,
        phone: createApplicationDto.phone,
        resume: createApplicationDto.resume,
        submittedAt,
      },
      status: 'pending',
    });

    return application;
  }

  // Lấy tất cả các ứng tuyển
  async getAllApplications(): Promise<Application[]> {
    return await this.applicationRepository.findAll();
  }

  // Lấy ứng tuyển theo ID
  async getApplicationById(id: string): Promise<Application | null> {
    return await this.applicationRepository.findById(id);
  }

  // Cập nhật ứng tuyển
  async updateApplication(
    id: string,
    updateData: UpdateApplicationDto,
  ): Promise<Application> {
    const existingApplication = await this.applicationRepository.findById(id);
    if (!existingApplication) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    const updatedApplication =
      await this.applicationRepository.findByIdAndUpdate(id, updateData);
    return updatedApplication;
  }
  // Phương thức cập nhật toàn bộ thông tin ứng viên
  async addAssessment(
    id: string,
    assessmentData: CreateAssessmentDto,
  ): Promise<Application> {
    const application = await this.applicationRepository.findById(id);
    if (!application) {
      throw new NotFoundException(`Application with id ${id} not found`);
    }

    // Thêm createdAt vào assessment
    const assessment = {
      ...assessmentData,
      createdAt: new Date(),
    };

    // Kiểm tra xem đã có assessment cho vòng phỏng vấn này chưa
    const existingRoundIndex = application.assessments?.findIndex(
      (a) => a.interviewRound === assessmentData.interviewRound,
    );

    if (existingRoundIndex !== -1 && existingRoundIndex !== undefined) {
      // Nếu đã có, cập nhật assessment cho vòng đó
      application.assessments[existingRoundIndex] = assessment;
    } else {
      // Nếu chưa có, thêm assessment mới
      if (!application.assessments) {
        application.assessments = [];
      }
      application.assessments.push(assessment);
    }

    // Sắp xếp assessments theo interviewRound
    application.assessments.sort((a, b) => a.interviewRound - b.interviewRound);

    return await this.applicationRepository.findByIdAndUpdate(id, {
      assessments: application.assessments,
    });
  }
  // Xóa ứng tuyển
  async deleteApplication(id: string): Promise<any> {
    return await this.applicationRepository.deleteOne(id);
  }
}
