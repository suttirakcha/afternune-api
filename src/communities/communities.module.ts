import { Module } from '@nestjs/common';
import { CommunitiesController } from './communities.controller';
import { CommunitiesService } from './communities.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema } from './schemas/communities.schema';
import {
  CommunityMember,
  CommunityMemberSchema,
} from './schemas/community-members.schema';
import { CommunityEventService } from './community-event.service';
import {
  CommunityEvent,
  CommunityEventSchema,
} from './schemas/community-events.schema';

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
      {
        name: CommunityEvent.name,
        schema: CommunityEventSchema,
      },
    ]),
  ],
  controllers: [CommunitiesController],
  providers: [CommunitiesService, CommunityEventService],
})
export class CommunitiesModule {}
