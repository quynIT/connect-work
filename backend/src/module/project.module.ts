import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ProjectController } from 'src/controllers/project.controller';
import { ProjectSchema } from 'src/models/project.model';
import { ProjectService } from 'src/services/project.service';
import { ProjectRepository } from 'src/services/repositories/project.repository';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Project', schema: ProjectSchema }]),
  ],
  controllers: [ProjectController],
  providers: [ProjectService, ProjectRepository],
  exports: [ProjectService, ProjectRepository],
})
export class ProjectModule {}
