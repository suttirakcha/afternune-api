import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Users } from './schemas/users.schema';
import { Model } from 'mongoose';

// export const users = [
//   {
//     id: '1',
//     username: 'Jennie',
//     email: 'jennie@mail.com',
//   },
//   {
//     id: '2',
//     username: 'Mike',
//     email: 'mike@mail.com',
//   },
//   {
//     id: '3',
//     username: 'Susan',
//     email: 'susan@mail.com',
//   },
// ];

@Injectable()
export class UsersService {
  constructor(@InjectModel(Users.name) private usersModel: Model<Users>) {}
  async getUsers() {
    const users = await this.usersModel.find();
    return users;
  }

  async getUserById(id: string) {
    const user = await this.usersModel.find({ _id: id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  // getProfile() {
  //   return users[2];
  // }
}
