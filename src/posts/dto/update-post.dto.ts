import { OmitType, PartialType } from '@nestjs/swagger';
import { CreatePostDto } from './create-post.dto';

export class UpdatePostDto extends OmitType(PartialType(CreatePostDto), [
  'user_id',
] as const) {}
