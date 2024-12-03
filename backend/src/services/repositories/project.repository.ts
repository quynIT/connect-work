import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Project } from '../../models/project.model'; // Import Project type for type checking
import { BaseRepository } from 'src/base.repository'; // Import BaseRepository

@Injectable()
export class ProjectRepository extends BaseRepository<Project> {
  constructor(
    @InjectModel('Project') // Inject the Project model here
    private readonly projectModel: Model<Project>,
  ) {
    super(projectModel); // Pass the projectModel to the BaseRepository constructor
  }

  // You can add specific methods for Project-related logic here if needed
}
