import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Notification } from '../../models/notification.model';
import { BaseRepository } from '../../base.repository';

@Injectable()
export class NotificationRepository extends BaseRepository<Notification> {
  constructor(
    @InjectModel('Notification')
    private readonly notificationModel: Model<Notification>,
  ) {
    super(notificationModel);
  }
}
