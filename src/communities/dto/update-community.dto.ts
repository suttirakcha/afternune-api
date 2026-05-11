import { PartialType } from '@nestjs/swagger';
import { CreateCommunityDto } from './create-community.dto';

export class UpdateComunityDto extends PartialType(CreateCommunityDto) {}
