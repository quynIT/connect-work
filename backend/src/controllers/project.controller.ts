import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { ProjectService } from '../services/project.service'; // Import ProjectService
import { Project } from '../models/project.model'; // Import Project model
import {
  CreateProjectDto,
  UpdateProjectDto,
} from 'src/services/dto/project.dto';

@Controller('projects') // Định nghĩa controller cho các route bắt đầu với '/projects'
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  // Tạo dự án mới
  @Post('/create')
  async createProject(
    @Body() createProjectDto: CreateProjectDto,
  ): Promise<Project> {
    return this.projectService.createProject(createProjectDto);
  }

  // Lấy danh sách tất cả các dự án
  @Get('/all')
  async getAllProjects(): Promise<Project[]> {
    return this.projectService.getAllProjects();
  }

  // Lấy chi tiết dự án theo ID
  @Get(':id')
  async getProjectById(@Param('id') id: string): Promise<Project> {
    return this.projectService.getProjectById(id);
  }

  // Cập nhật thông tin dự án theo ID
  @Put('/update/:id')
  async updateProject(
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ): Promise<Project> {
    return this.projectService.updateProject(id, updateProjectDto);
  }

  // Xóa dự án theo ID
  @Delete('/delete/:id')
  async deleteProject(@Param('id') id: string): Promise<any> {
    return this.projectService.deleteProject(id);
  }
}
