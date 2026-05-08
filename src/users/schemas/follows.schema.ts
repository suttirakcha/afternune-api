import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Follow {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  following_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  follower_id: string;
}

export const FollowSchema = SchemaFactory.createForClass(Follow);
