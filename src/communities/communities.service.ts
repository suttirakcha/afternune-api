import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Community } from './schemas/community.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { CreateCommunityDto } from './dto/create-community.dto';

const COMMUNITY_AGGREGATE: PipelineStage[] = [
  {
    $lookup: {
      from: 'users',
      localField: 'creator_id',
      foreignField: '_id',
      as: 'creator',
      pipeline: [{ $project: { username: 1, image_url: 1 } }],
    },
  },
  {
    $unwind: '$creator',
  },
  {
    $addFields: {
      creator: '$creator',
    },
  },
];

@Injectable()
export class CommunitiesService {
  constructor(
    @InjectModel(Community.name) private communitiesModel: Model<Community>,
  ) {}
  async getCommunities() {
    const communities =
      await this.communitiesModel.aggregate<Community[]>(COMMUNITY_AGGREGATE);
    return communities;
  }

  async getCommunityById(_id: string) {
    const [community] = await this.communitiesModel.aggregate<Community>([
      {
        $match: {
          _id: new Types.ObjectId(_id),
        },
      },
      ...COMMUNITY_AGGREGATE,
    ]);

    if (!community) {
      throw new NotFoundException({
        code: 'COMMUNITY_NOT_FOUND',
        message: 'Community not found',
      });
    }

    return community;
  }

  async createCommunity(
    creator_id: string,
    createCommunityDto: CreateCommunityDto,
  ) {
    await this.communitiesModel.insertOne({
      creator_id,
      ...createCommunityDto,
    });

    return { message: 'Successfully created community' };
  }
}
