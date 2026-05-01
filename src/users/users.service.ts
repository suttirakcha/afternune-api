import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/users.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}
  async getUsers() {
    const users = await this.usersModel.find();
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
