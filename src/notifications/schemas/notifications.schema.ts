import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Notification {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: mongoose.Types.ObjectId;

  @Prop({ required: true })
  message: string;

  @Prop({
    type: Map,
    of: Number,
    default: {},
  })
  unreadCount: Map<string, number>;
}

export const NotificationSchema = SchemaFactory.createForClass(Notification);
