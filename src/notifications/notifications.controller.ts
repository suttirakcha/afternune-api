import { Controller, Get, UseGuards } from '@nestjs/common';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { NotificationsService } from './notifications.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {}
  @UseGuards(AccessTokenGuard)
  @Get()
  async getNotifications(@CurrentUser('sub') sub: string) {
    return this.notificationsService.getNotifications(sub);
  }
}
