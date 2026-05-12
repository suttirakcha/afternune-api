import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class CommunityEvent {
  @Prop({ required: true })
  event_name: string;

  @Prop({ required: true })
  event_detail: string;

  @Prop({ required: false })
  image_url?: string;

  @Prop({ required: true })
  start_date: Date;

  @Prop({ required: true })
  end_date: Date;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Community' })
  community_id: string;
}

export const CommunityEventSchema =
  SchemaFactory.createForClass(CommunityEvent);
