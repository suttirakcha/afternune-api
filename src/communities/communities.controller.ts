import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { CreateCommunityDto } from './dto/create-community.dto';
import { CommunitiesService } from './communities.service';

@Controller('communities')
export class CommunitiesController {
  constructor(private readonly communitiesService: CommunitiesService) {}
  @Get()
  getCommunities() {
    return this.communitiesService.getCommunities();
  }

  @Get(':id')
  getCommunityById(@Param('id') id: string) {
    return this.communitiesService.getCommunityById(id);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  createCommunity(
    @CurrentUser('sub') sub: string,
    @Body() createCommunityDto: CreateCommunityDto,
  ) {
    return this.communitiesService.createCommunity(sub, createCommunityDto);
  }
}
