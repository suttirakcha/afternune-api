import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Gender, Interests, Role } from '../../types/users.type';

@Schema({ timestamps: true })
export class User {
  @Prop({ unique: true, required: true })
  username: string;

  @Prop({ unique: true, required: true })
  email: string;

  @Prop({ required: true })
  password: string;

  @Prop({ required: false })
  bio?: string;

  @Prop({ required: false })
  image_url?: string;

  @Prop({ required: true, default: Role.USER })
  role?: Role;

  @Prop({ required: false })
  interests?: Interests[];

  @Prop({ required: false })
  gender?: Gender;

  @Prop()
  refresh_token: string;
}

export const UsersSchema = SchemaFactory.createForClass(User);
