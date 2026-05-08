import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  async getUsers(@Query('search') search?: string) {
    return await this.usersService.getUsers(search);
  }

  @Get(':id')
  async getUserById(@Param('id') id: string) {
    return await this.usersService.getUserById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Patch()
  async updateUser(
    @CurrentUser('sub') sub: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.usersService.updateUser(sub, updateUserDto);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':userId/followed')
  async getFollowedUser(
    @CurrentUser('sub') sub: string,
    @Param('userId') userId: string,
  ) {
    return await this.usersService.getFollowedUser(sub, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':userId/follow')
  async followUser(
    @CurrentUser('sub') sub: string,
    @Param('userId') userId: string,
  ) {
    return await this.usersService.followUser(sub, userId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':userId/unfollow')
  async unfollowUser(
    @CurrentUser('sub') sub: string,
    @Param('userId') userId: string,
  ) {
    return await this.usersService.unfollowUser(sub, userId);
  }
}
