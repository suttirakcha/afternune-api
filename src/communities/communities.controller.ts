import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { CreateCommunityDto } from './dto/create-community.dto';
import { CommunitiesService } from './communities.service';
import { CommunityEventService } from './community-event.service';
import { CreateCommunityEventDto } from './dto/create-event.dto';

@Controller('communities')
export class CommunitiesController {
  constructor(
    private readonly communitiesService: CommunitiesService,
    private readonly communityEventService: CommunityEventService,
  ) {}
  @Get()
  getCommunities() {
    return this.communitiesService.getCommunities();
  }

  @Get(':communityId')
  getCommunityById(@Param('communityId') communityId: string) {
    return this.communitiesService.getCommunityById(communityId);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  createCommunity(
    @CurrentUser('sub') sub: string,
    @Body() createCommunityDto: CreateCommunityDto,
  ) {
    return this.communitiesService.createCommunity(sub, createCommunityDto);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':communityId')
  updateCommunity(
    @Param('communityId') communityId: string,
    @CurrentUser('sub') sub: string,
    @Body() createCommunityDto: CreateCommunityDto,
  ) {
    return this.communitiesService.updateCommunity(
      communityId,
      sub,
      createCommunityDto,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post(':communityId/join')
  joinCommunity(
    @CurrentUser('sub') sub: string,
    @Param('communityId') communityId: string,
  ) {
    return this.communitiesService.joinCommunity(sub, communityId);
  }

  @UseGuards(AccessTokenGuard)
  @Get(':communityId/members')
  getCommunityMembers(
    @CurrentUser('sub') sub: string,
    @Param('communityId') communityId: string,
  ) {
    return this.communitiesService.findCommunityMembers(sub, communityId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':communityId/leave')
  leaveCommunity(
    @CurrentUser('sub') sub: string,
    @Param('communityId') communityId: string,
  ) {
    return this.communitiesService.leaveCommunity(sub, communityId);
  }

  @Get(':communityId/events')
  getEventsByCommunityId(@Param('communityId') communityId: string) {
    return this.communityEventService.getEventsFromCommunityId(communityId);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':communityId/create-event')
  createCommunityEvent(
    @CurrentUser('sub') sub: string,
    @Param('communityId') communityId: string,
    @Body() createCommunityEventDto: CreateCommunityEventDto,
  ) {
    return this.communityEventService.createCommunityEvent(
      communityId,
      sub,
      createCommunityEventDto,
    );
  }

  @UseGuards(AccessTokenGuard)
  @Post(':communityId/update-event/:communityEventId')
  updateCommunityEvent(
    @CurrentUser('sub') sub: string,
    @Param('communityId') communityId: string,
    @Param('communityEventId') communityEventId: string,
    @Body() createCommunityEventDto: CreateCommunityEventDto,
  ) {
    return this.communityEventService.updateCommunityEvent(
      communityId,
      communityEventId,
      sub,
      createCommunityEventDto,
    );
  }
}
