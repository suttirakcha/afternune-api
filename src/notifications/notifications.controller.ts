import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';
import { NotificationType } from '../types/notifications.type';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @UseGuards(AccessTokenGuard)
  @Get()
  async getNotifications(@CurrentUser('sub') sub: string) {
    return this.notificationsService.getNotifications(sub);
  }

  @Post(':userId')
  async notifyUser(
    @Param('userId') userId: string,
    @CurrentUser('sub') sub: string,
    @Body('type') type: NotificationType,
  ) {
    return this.notificationsService.notifyUser(userId, sub, type);
  }
}
