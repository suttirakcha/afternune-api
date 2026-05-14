import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose from 'mongoose';

@Schema({ timestamps: true })
export class CommunityMember {
  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'User' })
  member_id: string;

  @Prop({ type: mongoose.Schema.Types.ObjectId, ref: 'Community' })
  community_id: string;
}

export const CommunityMemberSchema =
  SchemaFactory.createForClass(CommunityMember);
