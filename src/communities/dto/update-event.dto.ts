import { PartialType } from '@nestjs/swagger';
import { CreateCommunityEventDto } from './create-event.dto';

export class UpdateComunityEventDto extends PartialType(
  CreateCommunityEventDto,
) {}
