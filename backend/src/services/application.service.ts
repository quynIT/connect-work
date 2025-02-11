import { Injectable, NotFoundException } from '@nestjs/common';
import { Application, Status } from '../models/application.model';
import {
  CreateApplicationDto,
  CreateAssessmentDto,
  UpdateApplicationDto,
} from '../services/dto/application.dto';
import { ApplicationRepository } from './repositories/application.repository';
import { MailerService } from '@nestjs-modules/mailer';
import * as path from 'path';
import { promises as fs } from 'fs';

@Injectable()
export class ApplicationService {
  constructor(
    private readonly applicationRepository: ApplicationRepository,
    private mailerService: MailerService,
  ) {}

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
      await this.applicationRepository.findByIdAndUpdate(id, {
        ...updateData,
        reviewedAt: new Date(), // Thêm thời gian review
      });

    // Gửi email dựa trên trạng thái mới
    if (updateData.status) {
      const candidateEmail = existingApplication.candidate.email;
      const candidateName = existingApplication.candidate.fullName;
      switch (updateData.status) {
        case Status.Passed:
          await this.sendEmail(
            candidateEmail,
            'Chúc mừng! Bạn đã vượt qua vòng CV',
            'cv-passed',
            {
              name: candidateName,
            },
          );
          break;

        case Status.Rejected:
          await this.sendEmail(
            candidateEmail,
            'Thông báo kết quả ứng tuyển',
            'cv-rejected',
            {
              name: candidateName,
            },
          );
          break;

        case Status.Probation:
          await this.sendEmail(
            candidateEmail,
            'Chúc mừng! Chào mừng bạn đến với Connect Work',
            'welcome-probation',
            {
              name: candidateName,
              position: existingApplication.jobId,
              startDate: new Date().toLocaleDateString('vi-VN'),
            },
          );
          break;
      }
    }

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
  async readTemplate(
    templateName: string,
    variables: Record<string, string>,
  ): Promise<string> {
    const templatePath = path.join(
      process.cwd(),
      'src/templates/email',
      `${templateName}.html`,
    );
    let template = await fs.readFile(templatePath, 'utf-8');

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      template = template.replace(regex, value);
    }

    return template;
  }

  async sendEmail(
    to: string,
    subject: string,
    templateName: string,
    variables: Record<string, string> = {},
  ) {
    const emailContent = await this.readTemplate(templateName, variables);

    await this.mailerService.sendMail({
      to,
      from: '"Connect Work" <your-email@example.com>',
      subject,
      html: emailContent,
    });
  }
}
