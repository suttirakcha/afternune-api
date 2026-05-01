import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Posts {
  @Prop({ required: true })
  caption: string;

  @Prop({ required: true })
  image_url: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Users' })
  user_id: mongoose.Types.ObjectId;
}

export const PostsSchema = SchemaFactory.createForClass(Posts);
