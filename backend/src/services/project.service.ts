import { Injectable } from '@nestjs/common';
import { Project } from '../models/project.model';
import { ProjectRepository } from './repositories/project.repository';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { Types } from 'mongoose';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  // Tạo dự án mới
  async createProject(createProjectDto: CreateProjectDto): Promise<Project> {
    // Chuyển đổi members và tasks từ string[] thành ObjectId[] nếu có
    if (createProjectDto.members) {
      createProjectDto.members = createProjectDto.members.map(
        (memberId) => new Types.ObjectId(memberId), // Chuyển từ string sang ObjectId
      );
    }
    if (createProjectDto.tasks) {
      createProjectDto.tasks = createProjectDto.tasks.map(
        (taskId) => new Types.ObjectId(taskId), // Chuyển từ string sang ObjectId
      );
    }

    // Tạo mới dự án
    return await this.projectRepository.create(createProjectDto);
  }

  // Lấy tất cả các dự án
  async getAllProjects(): Promise<Project[]> {
    return await this.projectRepository.findAll();
  }

  // Lấy dự án theo ID
  async getProjectById(id: string): Promise<Project | null> {
    return await this.projectRepository.findById(id);
  }

  // Tìm dự án theo tên
  async findProjectByName(name: string): Promise<Project | null> {
    return await this.projectRepository.findByCondition({ name });
  }

  // Cập nhật dự án
  async updateProject(
    id: string,
    updateProjectDto: UpdateProjectDto,
  ): Promise<Project | null> {
    // Chuyển đổi members và tasks từ string[] thành ObjectId[] nếu có
    if (updateProjectDto.members) {
      updateProjectDto.members = updateProjectDto.members.map(
        (memberId) => new Types.ObjectId(memberId), // Chuyển từ string sang ObjectId
      );
    }
    if (updateProjectDto.tasks) {
      updateProjectDto.tasks = updateProjectDto.tasks.map(
        (taskId) => new Types.ObjectId(taskId), // Chuyển từ string sang ObjectId
      );
    }

    // Cập nhật dự án
    return await this.projectRepository.findByIdAndUpdate(id, updateProjectDto);
  }

  // Xóa dự án
  async deleteProject(id: string): Promise<any> {
    return await this.projectRepository.deleteOne(id);
  }
}
