import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User } from './schemas/users.schema';
import { Model, PipelineStage, Types } from 'mongoose';

const POST_LOOKUP: PipelineStage[] = [
  {
    $lookup: {
      from: 'posts',
      localField: '_id',
      foreignField: 'user_id',
      as: 'posts',
      pipeline: [
        { $project: { caption: 1, image_url: 1, createdAt: 1 } },
        { $sort: { createdAt: -1 } },
      ],
    },
  },
];

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private usersModel: Model<User>) {}
  async getUsers(): Promise<User[]> {
    const users: User[] = await this.usersModel.aggregate(POST_LOOKUP);
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
}
