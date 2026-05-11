import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';
import { Interests } from '../../types/users.type';

@Schema({ timestamps: true })
export class Community {
  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  detail: string;

  @Prop({ required: false })
  image_url?: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  creator_id: string;

  @Prop()
  categories: Interests[];
}

export const CommunitySchema = SchemaFactory.createForClass(Community);
