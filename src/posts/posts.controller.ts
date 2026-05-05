import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
  ) {}
  @Get()
  getPosts() {
    return this.postsService.getPosts();
  }

  @Get(':postId')
  getPostById(@Param('postId') postId: string) {
    return this.postsService.getPostById(postId);
  }

  @UseGuards(AccessTokenGuard)
  @Post()
  createPost(
    @Body() createPostDto: CreatePostDto,
    @CurrentUser('sub') sub: string,
  ) {
    return this.postsService.createPost(createPostDto, sub);
  }

  @Get(':postId/comments')
  getCommentsByPostId(@Param('postId') postId: string) {
    return this.commentsService.getCommentsByPostId(postId);
  }

  @UseGuards(AccessTokenGuard)
  @Post(':postId/comment')
  addComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    @CurrentUser('sub') sub: string,
  ) {
    return this.commentsService.addComment(createCommentDto, postId, sub);
  }
}
