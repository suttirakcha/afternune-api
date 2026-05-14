import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Like {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post_id: string;
}

export const LikesSchema = SchemaFactory.createForClass(Like);
