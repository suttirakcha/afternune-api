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

const POST_LOOKUP: PipelineStage[] = [
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
      from: 'follows',
      localField: '_id',
      foreignField: 'follower_id',
      as: 'followers',
      // pipeline: [{ $project: { username: 1 } }],
    },
  },
  {
    $lookup: {
      from: 'follows',
      localField: '_id',
      foreignField: 'following_id',
      as: 'following',
      // pipeline: [{ $project: { username: 1 } }],
    },
  },
  {
    $project: {
      username: 1,
      bio: 1,
      interests: 1,
      gender: 1,
      posts: '$posts',
      followers: 1,
      following: 1,
    },
  },
];

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name) private usersModel: Model<User>,
    @InjectModel(Follow.name) private followModel: Model<Follow>,
  ) {}
  async getUsers(search: string = ''): Promise<User[]> {
    const users: User[] = await this.usersModel.aggregate([
      {
        $match: {
          username: { $regex: search, $options: 'i' },
        },
      },
      ...POST_LOOKUP,
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
      ...POST_LOOKUP,
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
