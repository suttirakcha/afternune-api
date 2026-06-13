import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Notification } from './schemas/notifications.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class NotificationsService {
  constructor(
    @InjectModel(Notification.name)
    private notificationsModel: Model<Notification>,
  ) {}

  async getNotifications(user_id: string) {
    const notifications = await this.notificationsModel.find({
      user_id: new Types.ObjectId(user_id),
    });
    return notifications;
  }

  async notifyUser(user_id: string, message: string) {
    const notification = await this.notificationsModel.insertOne({
      user_id: new Types.ObjectId(user_id),
      message: message ?? 'Test',
      unreadCount: {},
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
