import { Injectable } from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository'; // Import TaskRepository
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto'; // Import DTOs
import { Task } from '../models/task.model'; // Import Task model
import { Types } from 'mongoose';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  // Tạo công việc mới
  async createTask(createTaskDto: CreateTaskDto): Promise<Task> {
    // Convert IDs in the assignedTo array to ObjectId
    const taskData: Partial<Task> = {
      ...createTaskDto,
      assignedTo: createTaskDto.assignedTo?.map(
        (id) => new Types.ObjectId(id), // Chuyển trực tiếp sang ObjectId mà không cần ép kiểu any
      ),
    };

    // Save task to the database
    const task = await this.taskRepository.create(taskData);
    return task;
  }

  // Lấy danh sách tất cả công việc
  async getAllTasks(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }

  // Lấy chi tiết công việc theo ID
  async getTaskById(id: string): Promise<Task> {
    const task = await this.taskRepository.findById(id);
    if (!task) {
      throw new Error('Task not found');
    }
    return task;
  }

  // Cập nhật thông tin công việc theo ID
  async updateTask(id: string, updateTaskDto: UpdateTaskDto): Promise<Task> {
    const updateData: Partial<Task> = {
      ...updateTaskDto,
      assignedTo: updateTaskDto.assignedTo?.map((id) => new Types.ObjectId(id)),
    };

    const updatedTask = await this.taskRepository.findByIdAndUpdate(
      id,
      updateData,
    );
    if (!updatedTask) {
      throw new Error('Task not found');
    }
    return updatedTask;
  }

  // Xóa công việc theo ID
  async deleteTask(id: string): Promise<any> {
    const deletedTask = await this.taskRepository.deleteOne(id);
    if (!deletedTask.deletedCount) {
      throw new Error('Task not found');
    }
    return deletedTask;
  }
}
