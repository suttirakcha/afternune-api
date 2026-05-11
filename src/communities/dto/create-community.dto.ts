import { IsEnum, IsNotEmpty, IsString } from 'class-validator';
import { Interests } from '../../types/users.type';

export class CreateCommunityDto {
  @IsString()
  @IsNotEmpty({ message: 'Title is a required field' })
  title: string;

  @IsString()
  @IsNotEmpty({ message: 'Detail is a required field' })
  detail: string;

  @IsString()
  image_url?: string;

  @IsEnum(Interests, { each: true })
  categories: Interests[];
}
