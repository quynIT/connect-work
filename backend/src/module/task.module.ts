import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { TaskController } from 'src/controllers/task.controller';
import { TaskSchema } from 'src/models/task.model';
import { TaskRepository } from 'src/services/repositories/task.repository';
import { TaskService } from 'src/services/task.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Task', schema: TaskSchema }]), // Đảm bảo dùng 'Task' là tên đúng của model
  ],
  controllers: [TaskController],
  providers: [TaskService, TaskRepository],
  exports: [TaskService, TaskRepository],
})
export class TaskModule {}
