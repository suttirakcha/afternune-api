import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { POST_AGGREGATE } from '../posts/posts.service';
import { Follow } from './schemas/follows.schema';
import { COMMUNITY_AGGREGATE } from '../communities/communities.service';

const USER_LOOKUP: PipelineStage[] = [
  {
    $lookup: {
      from: 'posts',
      localField: '_id',
      foreignField: 'user_id',
      as: 'posts',
      pipeline: [
        { $project: { caption: 1, image_url: 1, createdAt: 1, user_id: 1 } },
        { $sort: { createdAt: -1 } },
        ...POST_AGGREGATE,
      ],
    },
  },
  {
    $lookup: {
      from: 'communities',
      localField: '_id',
      foreignField: 'creator_id',
      as: 'communities',
      pipeline: [{ $sort: { updatedAt: -1 } }, ...COMMUNITY_AGGREGATE],
    },
  },
  {
    $lookup: {
      from: 'follows',
      localField: '_id',
      foreignField: 'follower_id',
      as: 'followers',
      pipeline: [
        {
          $lookup: {
            from: 'users',
            localField: 'following_id',
            foreignField: '_id',
            as: 'user',
            pipeline: [{ $project: { username: 1, image_url: 1 } }],
          },
        },
        { $unwind: '$user' },
        { $replaceRoot: { newRoot: '$user' } },
      ],
    },
  },
  {
    $lookup: {
      from: 'follows',
      localField: '_id',
      foreignField: 'following_id',
      as: 'following',
      pipeline: [
        {
          $lookup: {
            from: 'users',
            localField: 'follower_id',
            foreignField: '_id',
            as: 'user',
            pipeline: [{ $project: { username: 1, image_url: 1 } }],
          },
        },
        { $unwind: '$user' },
        { $replaceRoot: { newRoot: '$user' } },
      ],
    },
  },
  {
    $lookup: {
      from: 'communitymembers',
      localField: '_id',
      foreignField: 'member_id',
      as: 'joined_communities',
      pipeline: [
        {
          $lookup: {
            from: 'communities',
            localField: 'community_id',
            foreignField: '_id',
            as: 'communities',
            pipeline: [{ $project: { title: 1, image_url: 1 } }],
          },
        },
        { $unwind: '$communities' },
        { $replaceRoot: { newRoot: '$communities' } },
      ],
    },
  },
  {
    $project: {
      username: 1,
      image_url: 1,
      email: 1,
      role: 1,
      bio: 1,
      interests: 1,
      gender: 1,
      posts: '$posts',
      communities: '$communities',
      followers: 1,
      following: 1,
      refresh_token: 1,
      is_first_time: 1,
      joined_communities: 1,
    },
  },
];

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
    @InjectModel(Follow.name) private followModel: Model<Follow>,
  ) {}
  async getUsers(search: string = '', limit: number = 5): Promise<User[]> {
    const users: User[] = await this.usersModel.aggregate([
      {
        $match: {
          username: { $regex: search, $options: 'i' },
        },
      },
      ...(limit
        ? [
            {
              $limit: limit,
            },
          ]
        : []),
      ...USER_LOOKUP,
    ]);
    return users;
  }

  async getUserById(_id: string): Promise<User> {
    const user: User[] = await this.usersModel.aggregate([
      {
        $match: {
          _id: new Types.ObjectId(_id),
        },
      },
      ...USER_LOOKUP,
    ]);

    if (!user.length) {
      throw new NotFoundException({
        code: 'USER_NOT_FOUND',
        message: 'User not found',
      });
    }
    return user[0];
  }

  async updateUser(_id: string, updateUserDto: UpdateUserDto) {
    await this.usersModel.updateOne(
      { _id },
      {
        $set: { ...updateUserDto },
      },
    );
    return { success: true, message: 'Successfully updated the profile' };
  }

  async getFollowedUser(_id: string, user_id: string) {
    const follow = await this.followModel.findOne({
      following_id: _id,
      follower_id: user_id,
    });

    if (!follow) {
      return null;
    }

    return follow;
  }

  async followUser(_id: string, user_id: string) {
    const follow = await this.getFollowedUser(_id, user_id);

    if (follow) {
      throw new ConflictException({
        code: 'ALREADY_FOLLOWED',
        message: 'You cannot follow this user as you have already followed',
      });
    }

    if (_id === user_id) {
      throw new ConflictException({
        code: 'FAILED_TO_FOLLOW',
        message: 'You cannot follow yourself',
      });
    }

    await this.followModel.insertOne({
      following_id: _id,
      follower_id: user_id,
    });
  }

  async unfollowUser(_id: string, user_id: string) {
    const follow = await this.getFollowedUser(_id, user_id);

    if (!follow) {
      throw new BadRequestException({
        code: 'FOLLOW_NOT_FOUND',
        message: 'Failed to unfollow user',
      });
    }

    await this.followModel.deleteOne({
      following_id: follow.following_id,
      follower_id: follow.follower_id,
    });

    return { message: 'Successfully unfollowed' };
  }
}
