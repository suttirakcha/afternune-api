import { Module } from '@nestjs/common';
import { MessagesController } from './messages.controller';
import { MessagesService } from './messages.service';
import { PusherService } from './pusher.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from './schemas/messages.schema';
import { ChatRoom, ChatRoomSchema } from './schemas/chat-rooms.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: ChatMessage.name,
        schema: ChatMessageSchema,
      },
      {
        name: ChatRoom.name,
        schema: ChatRoomSchema,
      },
    ]),
  ],
  controllers: [MessagesController],
  providers: [MessagesService, PusherService],
  exports: [MessagesService, PusherService],
})
export class MessagesModule {}
