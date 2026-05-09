import { IsString, IsNotEmpty } from 'class-validator';

export class CreatePostDto {
  @IsString()
  @IsNotEmpty()
  caption: string;

  @IsNotEmpty()
  image_url: string;
}
