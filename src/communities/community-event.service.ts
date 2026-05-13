import { ForbiddenException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CommunityEvent } from './schemas/community-events.schema';
import { Model } from 'mongoose';
import { CreateCommunityEventDto } from './dto/create-event.dto';
import { Community } from './schemas/communities.schema';
import { UpdateComunityEventDto } from './dto/update-event.dto';

@Injectable()
export class CommunityEventService {
  constructor(
    @InjectModel(CommunityEvent.name)
    private communityEventsModel: Model<CommunityEvent>,
    @InjectModel(Community.name) private communitiesModel: Model<Community>,
  ) {}

  async getEventsFromCommunityId(community_id: string) {
    const communityEvents = await this.communityEventsModel.find({
      community_id,
    });
    return communityEvents;
  }

  async createCommunityEvent(
    community_id: string,
    creator_id: string,
    createCommunityEventDto: CreateCommunityEventDto,
  ) {
    const foundCommunity = await this.communitiesModel.findOne({
      _id: community_id,
      creator_id,
    });
    if (!foundCommunity) {
      throw new ForbiddenException({
        code: 'FORBIDDEN_CREATION',
        message: 'Only the community creator can create the events',
      });
    }

    await this.communityEventsModel.insertOne({
      ...createCommunityEventDto,
      community_id,
    });

    return { message: 'Successfully created the event' };
  }

  async updateCommunityEvent(
    community_id: string,
    community_event_id: string,
    creator_id: string,
    updateCommunityEventDto: UpdateComunityEventDto,
  ) {
    const foundCommunity = await this.communitiesModel.findOne({
      _id: community_id,
      creator_id,
    });
    if (!foundCommunity) {
      throw new ForbiddenException({
        code: 'FORBIDDEN_CREATION',
        message: 'Only the community creator can create the events',
      });
    }

    await this.communityEventsModel.updateOne(
      {
        community_id,
        _id: community_event_id,
      },
      {
        $set: updateCommunityEventDto,
      },
    );

    return { message: 'Successfully created the event' };
  }
}
