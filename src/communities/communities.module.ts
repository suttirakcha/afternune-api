import { Module } from '@nestjs/common';
import { CommunitiesController } from './communities.controller';
import { CommunitiesService } from './communities.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema } from './schemas/communities.schema';
import {
  CommunityMember,
  CommunityMemberSchema,
} from './schemas/community-members.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Community.name,
        schema: CommunitySchema,
      },
      {
        name: CommunityMember.name,
        schema: CommunityMemberSchema,
      },
    ]),
  ],
  controllers: [CommunitiesController],
  providers: [CommunitiesService],
})
export class CommunitiesModule {}
