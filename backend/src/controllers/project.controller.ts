import { AuthGuard } from '@nestjs/passport';
import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
  Req,
  UseGuards,
  NotFoundException,
  Query,
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
  @UseGuards(AuthGuard('jwt'))
  async createPost(@Req() req: any, @Body() post: CreateProjectDto) {
    return this.projectService.createProject(req.user, post);
  }

  // Lấy danh sách tất cả các dự án
  @Get('/all')
  async getAllProjects(): Promise<Project[]> {
    return this.projectService.getAllProjectsWithUsers();
  }

  // Lấy chi tiết dự án theo ID
  @Get('/detail/:id')
  async getProjectById(@Param('id') id: string): Promise<Project> {
    return this.projectService.getProjectByUser(id);
  }

  // Cập nhật thông tin dự án theo ID
  @Put('/update/:id')
  async updateProject(
    @Param('id') id: string,
    @Body() updateData: UpdateProjectDto,
  ): Promise<Project> {
    try {
      return await this.projectService.updateProject(id, updateData);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
      throw error;
    }
  }

  // Xóa dự án theo ID
  @Delete('/delete/:id')
  async deleteProject(@Param('id') id: string): Promise<any> {
    return this.projectService.deleteProject(id);
  }

  @Get('/search')
  async searchProjects(@Query('name') name: string) {
    return this.projectService.findProjectsByName(name);
  }
}
