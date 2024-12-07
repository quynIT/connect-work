import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './repositories/task.repository'; // Import TaskRepository
import { CreateTaskDto, UpdateTaskDto } from './dto/task.dto'; // Import DTOs
import { Task } from '../models/task.model'; // Import Task model
import { Types } from 'mongoose';
import { User } from 'src/user/models/user.model';

@Injectable()
export class TaskService {
  constructor(private readonly taskRepository: TaskRepository) {}

  // Tạo công việc mới
  async createTask(user: User, task: CreateTaskDto) {
    if (!task.user) {
      task.user = [];
    }
    task.user.push(user._id.toString());

    // Lưu dự án vào cơ sở dữ liệu
    const newProject = await this.taskRepository.create(
      task as unknown as Partial<Task>,
    );
    return newProject;
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
  async updateTask(id: string, updateData: UpdateTaskDto): Promise<Task> {
    const existingProject = await this.taskRepository.findById(id);
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
    const updatedProject = await this.taskRepository.findByIdAndUpdate(
      id,
      updateData as unknown as Partial<Task>,
    );

    if (!updatedProject) {
      throw new NotFoundException(`Failed to update project with id ${id}`);
    }

    return updatedProject;
  }

  // Xóa công việc theo ID
  async deleteTask(id: string): Promise<any> {
    const deletedTask = await this.taskRepository.deleteOne(id);
    if (!deletedTask.deletedCount) {
      throw new Error('Task not found');
    }
    return deletedTask;
  }
  async getTaskByUser(task_id: string) {
    // Sử dụng await để lấy đối tượng Project
    const task = await this.taskRepository.findById(task_id);

    if (task) {
      // Gọi populate trên đối tượng project sau khi đã lấy được
      await task.populate({
        path: 'user', // Populate các trường trong mảng 'user'
        select: 'name avt', // Chỉ lấy các trường 'name' và 'avt'
      });

      return task; // Project đã được populate thông tin các user
    } else {
      throw new NotFoundException(`Project with id ${task_id} not found`);
    }
  }
  async getTasksByProjectId(projectId: string): Promise<Task[]> {
    try {
      // Sử dụng `findByCondition` để lấy các task liên kết với projectId
      const tasks = await this.taskRepository.getByCondition(
        { projectId }, // Điều kiện lọc
        null, // Không giới hạn trường
        null, // Không cần option đặc biệt
        { path: 'user', select: 'name avt' }, // Populate thông tin user
      );
      return tasks;
    } catch (e) {
      throw new NotFoundException(
        `Tasks for project with id ${projectId} not found.`,
      );
    }
  }
  // Tìm kiếm task theo tên
  async findTasksByName(taskName: string): Promise<Task[]> {
    try {
      const tasks = await this.taskRepository.getByCondition(
        { name: { $regex: taskName, $options: 'i' } }, // Điều kiện lọc theo tên
        null, // Không giới hạn trường
        null, // Không cần option đặc biệt
        { path: 'user', select: 'name avt' }, // Populate thông tin user
      );
      return tasks;
    } catch (e) {
      throw new NotFoundException(`No tasks found matching name: ${taskName}`);
    }
  }
}
