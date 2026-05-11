import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Community } from './schemas/communities.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { CreateCommunityDto } from './dto/create-community.dto';
import { CommunityMember } from './schemas/community-members.schema';

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
    $lookup: {
      from: 'communitymembers',
      localField: '_id',
      foreignField: 'community_id',
      as: 'members',
      pipeline: [
        {
          $project: { member_id: 1 },
        },
        {
          $lookup: {
            from: 'users',
            localField: 'member_id',
            foreignField: '_id',
            as: 'member',
            pipeline: [{ $project: { username: 1, image_url: 1 } }],
          },
        },
        { $unwind: '$member' },
        {
          $replaceRoot: { newRoot: '$member' },
        },
      ],
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
    @InjectModel(CommunityMember.name)
    private communityMembersModel: Model<CommunityMember>,
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

  async findCommunityMembers(member_id: string, community_id: string) {
    const member = await this.communityMembersModel.findOne({
      member_id,
      community_id,
    });

    if (!member) {
      return null;
    }

    return member;
  }

  async joinCommunity(member_id: string, community_id: string) {
    const member = await this.findCommunityMembers(member_id, community_id);

    if (member) {
      throw new ConflictException({
        code: 'ALREADY_JOINED',
        message: 'You have already joined this community',
      });
    }

    await this.communityMembersModel.insertOne({
      member_id,
      community_id,
    });
  }

  async leaveCommunity(member_id: string, community_id: string) {
    const member = await this.findCommunityMembers(member_id, community_id);

    if (!member) {
      throw new ConflictException({
        code: 'NOT_JOINED',
        message: 'You have not joined this community yet',
      });
    }

    await this.communityMembersModel.deleteOne({
      member_id,
      community_id,
    });

    return { message: 'Successfully left the community' };
  }
}
