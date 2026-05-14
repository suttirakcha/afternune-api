import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Community } from './schemas/communities.schema';
import { Model, Types } from 'mongoose';
import { CreateCommunityDto } from './dto/create-community.dto';
import { CommunityMember } from './schemas/community-members.schema';
import { UpdateComunityDto } from './dto/update-community.dto';

export const COMMUNITY_AGGREGATE = [
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
      from: 'communityevents',
      localField: '_id',
      foreignField: 'community_id',
      as: 'events',
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
  async getCommunities(search: string = '', limit?: number) {
    const communities = await this.communitiesModel.aggregate<Community[]>([
      {
        $match: {
          title: { $regex: search, $options: 'i' },
        },
      },
      ...(limit
        ? [
            {
              $limit: limit,
            },
          ]
        : []),
      ...COMMUNITY_AGGREGATE,
    ]);
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

  async updateCommunity(
    community_id: string,
    creator_id: string,
    updateCommunityDto: UpdateComunityDto,
  ) {
    const community = await this.communitiesModel.updateOne(
      {
        _id: community_id,
        creator_id,
      },
      {
        $set: updateCommunityDto,
      },
    );

    if (!community) {
      throw new BadRequestException({
        code: 'UPDATE_COMMUNITY_FAILED',
        message:
          'Failed to update the community as it may be unavailable or deleted, or you may not have the permission to update it',
      });
    }

    return { message: 'Successfully updated community' };
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
