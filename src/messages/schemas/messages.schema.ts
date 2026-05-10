import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' })
  chat_room_id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  sender: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  receiver: mongoose.Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({ default: false })
  is_read: boolean;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
