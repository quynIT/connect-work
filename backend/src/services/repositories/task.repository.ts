import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Task } from '../../models/task.model'; // Import Task model
import { BaseRepository } from 'src/base.repository'; // Import BaseRepository

@Injectable()
export class TaskRepository extends BaseRepository<Task> {
  constructor(
    @InjectModel('Task') // Inject the Task model here
    private readonly taskModel: Model<Task>,
  ) {
    super(taskModel); // Pass the taskModel to the BaseRepository constructor
  }

  // You can add specific methods for Task-related logic here if needed
}
