import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Application } from '../../models/application.model'; // Import Application type
import { BaseRepository } from 'src/base.repository'; // Import BaseRepository

@Injectable()
export class ApplicationRepository extends BaseRepository<Application> {
  constructor(
    @InjectModel('Application') // Inject the Application model here
    private readonly applicationModel: Model<Application>,
  ) {
    super(applicationModel); // Pass the applicationModel to the BaseRepository constructor
  }

  // Các phương thức đặc thù cho Application có thể được thêm vào đây nếu cần
}
