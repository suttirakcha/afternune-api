import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class ChatRoom {
  @Prop({
    type: [mongoose.Schema.Types.ObjectId],
    ref: 'User',
  })
  participants: mongoose.Types.ObjectId[];

  @Prop()
  lastMessage: string;

  @Prop({
    type: Map,
    of: Number,
    default: {},
  })
  unreadCount: Map<string, number>;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
