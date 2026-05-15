import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UsersSchema } from './schemas/users.schema';
import { Follow, FollowSchema } from './schemas/follows.schema';
import { UserBlock, UserBlockSchema } from './schemas/blocks.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UsersSchema,
      },
      {
        name: Follow.name,
        schema: FollowSchema,
      },
      {
        name: UserBlock.name,
        schema: UserBlockSchema,
      },
    ]),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService],
})
export class UsersModule {}
