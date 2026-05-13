import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ReportType } from '../../types/reports.type';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class Report {
  @Prop()
  type: ReportType;

  @Prop({ required: true })
  reason: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  user_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Post' })
  post_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Community' })
  community_id: string;
}

export const ReportSchema = SchemaFactory.createForClass(Report);
