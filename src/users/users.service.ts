import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}
  async getUsers(): Promise<Users[]> {
    const users: Users[] = await this.usersModel.aggregate([
      {
        $lookup: {
          from: 'posts',
          localField: '_id',
          foreignField: 'user_id',
          as: 'posts',
          pipeline: [{ $project: { caption: 1, image_url: 1, createdAt: 1 } }],
        },
      },
    ]);
    return users;
  }

  async getUserById(_id: string) {
    const user = await this.usersModel.find({ _id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }
}
