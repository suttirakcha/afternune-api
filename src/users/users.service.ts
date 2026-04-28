import { Injectable, NotFoundException } from '@nestjs/common';

export const users = [
  {
    id: '1',
    username: 'Jennie',
    email: 'jennie@mail.com',
  },
  {
    id: '2',
    username: 'Mike',
    email: 'mike@mail.com',
  },
  {
    id: '3',
    username: 'Susan',
    email: 'susan@mail.com',
  },
];

@Injectable()
export class UsersService {
  getUsers() {
    return users;
  }

  getUserById(id: string) {
    const user = users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  getProfile() {
    return users[2];
  }
}
