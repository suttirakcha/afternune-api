import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import { Model, PipelineStage, Types } from 'mongoose';
import { UpdateUserDto } from './dto/update-user.dto';
import { POST_AGGREGATE } from '../posts/posts.service';

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
    $project: {
      username: 1,
      bio: 1,
      interests: 1,
      gender: 1,
      posts: '$posts',
    },
  },
];

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private usersModel: Model<User>) {}
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
      throw new NotFoundException('User not found');
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
    return { message: 'Successfully updated the profile' };
  }

  async searchUser(username: string) {
    await this.usersModel.find({ username });
  }
}
