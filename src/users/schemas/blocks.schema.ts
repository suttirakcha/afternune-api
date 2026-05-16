import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class UserBlock {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  blocked_user_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  blocking_user_id: string;
}

export const UserBlockSchema = SchemaFactory.createForClass(UserBlock);
