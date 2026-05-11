import { Module } from '@nestjs/common';
import { CommunitiesController } from './communities.controller';
import { CommunitiesService } from './communities.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Community, CommunitySchema } from './schemas/community.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Community.name,
        schema: CommunitySchema,
      },
    ]),
  ],
  controllers: [CommunitiesController],
  providers: [CommunitiesService],
})
export class CommunitiesModule {}
