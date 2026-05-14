import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ChatMessageDto } from './dto/chat-message.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { MessagesService } from './messages.service';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('messages')
@UseGuards(AccessTokenGuard)
export class MessagesController {
  constructor(private readonly messagesService: MessagesService) {}

  @Get('receiver/:receiver_id')
  fetchChatRoom(
    @CurrentUser('sub') sub: string,
    @Param('receiver_id') receiver_id: string,
  ) {
    return this.messagesService.fetchChatRoom(sub, receiver_id);
  }

  @Get('all')
  getAllChatRooms(@CurrentUser('sub') sub: string) {
    return this.messagesService.getAllChatRooms(sub);
  }

  @Post('receiver/:receiver_id/send')
  async sendMessage(
    @CurrentUser('sub') sub: string,
    @Param('receiver_id') receiver_id: string,
    @Body() body: ChatMessageDto,
  ) {
    return this.messagesService.pushMessage(sub, receiver_id, body);
  }
}
