import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Comment {
  @Prop({ required: true })
  detail: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: mongoose.Types.ObjectId;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post_id: mongoose.Types.ObjectId;
}

export const CommentsSchema = SchemaFactory.createForClass(Comment);
