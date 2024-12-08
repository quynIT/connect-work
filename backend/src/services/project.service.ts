import { Injectable, NotFoundException } from '@nestjs/common';
import { Project } from '../models/project.model';
import { ProjectRepository } from './repositories/project.repository';
import { CreateProjectDto, UpdateProjectDto } from './dto/project.dto';
import { Types } from 'mongoose';
import { User } from 'src/user/models/user.model';

@Injectable()
export class ProjectService {
  constructor(private readonly projectRepository: ProjectRepository) {}

  // Tạo dự án mới
  async createProject(user: User, project: CreateProjectDto) {
    // Thêm user ID hiện tại vào danh sách users nếu chưa tồn tại
    if (!project.user) {
      project.user = [];
    }
    if (project.user.length === 0) {
      project.user.push(user._id.toString());
    }

    // Lưu dự án vào cơ sở dữ liệu
    const newProject = await this.projectRepository.create(
      project as unknown as Partial<Project>,
    );
    return newProject;
  }

  // Lấy tất cả các dự án
  async getAllProjectsWithUsers(): Promise<Project[]> {
    const projects = await this.projectRepository.findByConditionAll(
      {},
      null, // Trả về tất cả các trường
      null, // Không có tùy chọn nào cho query
      {
        path: 'user', // Populating thông tin người dùng
        select: 'name avt', // Chỉ lấy các trường 'name' và 'avt' từ user
      },
    );
    return projects;
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
    updateData: UpdateProjectDto,
  ): Promise<Project> {
    // Check if the project exists
    const existingProject = await this.projectRepository.findById(id);
    if (!existingProject) {
      throw new NotFoundException(`Project with id ${id} not found`);
    }

    // Update project fields
    if (updateData.user) {
      // Convert user from string[] to ObjectId[] if needed
      updateData.user = updateData.user.map(
        (userId) => new Types.ObjectId(userId),
      ) as unknown as string[];
    }

    // Update project in the database
    const updatedProject = await this.projectRepository.findByIdAndUpdate(
      id,
      updateData as unknown as Partial<Project>,
    );

    if (!updatedProject) {
      throw new NotFoundException(`Failed to update project with id ${id}`);
    }

    return updatedProject;
  }

  // Xóa dự án
  async deleteProject(id: string): Promise<any> {
    return await this.projectRepository.deleteOne(id);
  }

  async getProjectByUser(project_id: string) {
    // Sử dụng await để lấy đối tượng Project
    const project = await this.projectRepository.findById(project_id);

    if (project) {
      // Gọi populate trên đối tượng project sau khi đã lấy được
      await project.populate({
        path: 'user', // Populate các trường trong mảng 'user'
        select: 'name avt', // Chỉ lấy các trường 'name' và 'avt'
      });

      return project; // Project đã được populate thông tin các user
    } else {
      throw new NotFoundException(`Project with id ${project_id} not found`);
    }
  }
  // Tìm dự án theo tên (gần đúng)
  async findProjectsByName(name: string): Promise<Project[]> {
    const projects = await this.projectRepository.findByConditionAll(
      { name: { $regex: name, $options: 'i' } }, // Sử dụng RegEx để tìm tên gần đúng (không phân biệt chữ hoa/thường)
      null, // Trả về tất cả các trường
      null, // Không có tùy chọn nào cho query
      {
        path: 'user', // Populating thông tin người dùng
        select: 'name avt', // Chỉ lấy các trường 'name' và 'avt' từ user
      },
    );

    if (!projects || projects.length === 0) {
      throw new NotFoundException(`No projects found with name like "${name}"`);
    }

    return projects;
  }
}
