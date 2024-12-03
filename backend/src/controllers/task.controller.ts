import {
  Controller,
  Post,
  Get,
  Param,
  Body,
  Put,
  Delete,
} from '@nestjs/common';
import { TaskService } from '../services/task.service'; // Import TaskService
import { CreateTaskDto, UpdateTaskDto } from '../services/dto/task.dto'; // Import DTOs
import { Task } from '../models/task.model'; // Import Task model

@Controller('tasks') // Định nghĩa controller cho các route bắt đầu với '/tasks'
export class TaskController {
  constructor(private readonly taskService: TaskService) {}

  // Tạo công việc mới
  @Post('/create')
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.taskService.createTask(createTaskDto);
  }

  // Lấy danh sách tất cả công việc
  @Get('/list-task')
  async getAllTasks(): Promise<Task[]> {
    return this.taskService.getAllTasks();
  }

  // Lấy chi tiết công việc theo ID
  @Get(':id')
  async getTaskById(@Param('id') id: string): Promise<Task> {
    return this.taskService.getTaskById(id);
  }

  // Cập nhật thông tin công việc theo ID
  @Put('/update/:id')
  async updateTask(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
  ): Promise<Task> {
    return this.taskService.updateTask(id, updateTaskDto);
  }

  // Xóa công việc theo ID
  @Delete('/delete/:id')
  async deleteTask(@Param('id') id: string): Promise<any> {
    return this.taskService.deleteTask(id);
  }
}
