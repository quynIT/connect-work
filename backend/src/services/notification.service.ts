import { Injectable, NotFoundException } from '@nestjs/common';
import {
  CreateNotificationDto,
  UpdateNotificationDto,
} from '../services/dto/notification.dto';
import { Notification } from '../models/notification.model';
import { NotificationRepository } from '../services/repositories/notification.repository';
import { UserService } from 'src/user/services/user.service';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class NotificationService {
  constructor(
    private readonly notificationRepository: NotificationRepository,
    private readonly userService: UserService,
    private readonly mailerService: MailerService,
  ) {}

  async createNotification(
    notification: CreateNotificationDto,
  ): Promise<Notification> {
    const newNotification = await this.notificationRepository.create(
      notification as Partial<Notification>,
    );

    // Nếu priority là high, gửi email cho tất cả user
    if (notification.priority === 'high') {
      await this.sendNotificationEmailToAllUsers(newNotification);
    }

    return newNotification;
  }

  async getAllNotifications(): Promise<Notification[]> {
    return await this.notificationRepository.findAll();
  }

  async getNotificationById(id: string): Promise<Notification | null> {
    return await this.notificationRepository.findById(id);
  }

  async updateNotification(
    id: string,
    updateData: UpdateNotificationDto,
  ): Promise<Notification> {
    const existingNotification = await this.notificationRepository.findById(id);
    if (!existingNotification) {
      throw new NotFoundException(`Notification with id ${id} not found`);
    }

    const updatedNotification =
      await this.notificationRepository.findByIdAndUpdate(id, updateData);
    if (!updatedNotification) {
      throw new NotFoundException(
        `Failed to update notification with id ${id}`,
      );
    }

    return updatedNotification;
  }

  async deleteNotification(id: string): Promise<any> {
    return await this.notificationRepository.deleteOne(id);
  }
  private async sendNotificationEmailToAllUsers(notification: Notification) {
    try {
      // Lấy danh sách tất cả user
      const users = await this.userService.getAllUsers();

      // Gửi email cho từng user
      const emailPromises = users.map((user) => {
        return this.mailerService.sendMail({
          to: user.email,
          from: '"Connect Work" <trungquyen2902@gmail.com>',
          subject: `Thông báo quan trọng: ${notification.title}`,
          html: `
            <h2>${notification.title}</h2>
            <p>Mức độ ưu tiên: Cao</p>
            <p>Loại thông báo: ${notification.type}</p>
            <p>${notification.content}</p>
            ${
              notification.attachments && notification.attachments.length > 0
                ? `<p>File đính kèm: <a href="${notification.attachments[0]}">Xem tại đây</a></p>`
                : ''
            }
          `,
        });
      });

      await Promise.all(emailPromises);
      console.log(`Sent notification emails to ${users.length} users`);
    } catch (error) {
      console.error('Error sending notification emails:', error);
      // Không throw error để không ảnh hưởng đến việc tạo notification
    }
  }
}
