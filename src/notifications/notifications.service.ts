import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas/notifications.schema';
import { Model, Types } from 'mongoose';
import { NotificationType } from '../types/notifications.type';
import { UsersService } from '../users/users.service';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationsModel: Model<Notification>,
    private readonly usersService: UsersService,
  ) {}

  async getNotifications(userId: string) {
    const notifications = await this.notificationsModel.find({
      recipient: new Types.ObjectId(userId),
    });
    return notifications;
  }

  async notifyUser(
    recipientId: string,
    senderId: string,
    type: NotificationType,
  ) {
    const user = await this.usersService.getUserById(senderId);
    const message = (type: NotificationType) => {
      switch (type) {
        case NotificationType.LIKE:
          return `${user.username} liked your post`;
        case NotificationType.COMMENT:
          return `${user.username} commented on your post`;
        default:
          return 'You have a new notification';
      }
    };
    const notification = await this.notificationsModel.insertOne({
      recipient: new Types.ObjectId(recipientId),
      sender: new Types.ObjectId(senderId),
      type,
      message: message(type),
    });

    return { message: notification.message };
  }

  async readNotification() {
    //     const notification = await this.notificationsModel.insertOne({
    //   user_id: new Types.ObjectId(user_id),
    //   message: message ?? 'Test',
    //   unreadCount: {},
    // });
  }
}
