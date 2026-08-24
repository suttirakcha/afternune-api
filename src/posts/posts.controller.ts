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
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';
import { AccessTokenGuard } from '../common/guards/access-token.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { LikesService } from './likes.service';
import { UpdatePostDto } from './dto/update-post.dto';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly commentsService: CommentsService,
    private readonly likesService: LikesService,
  ) {}
  @Get()
  getPosts(
    // @Query('search') search?: string,
    @Query('limit') limit?: number,
    @Query('skip') skip?: number,
    @Query('userId') userId?: string,
  ) {
    return this.postsService.getPosts(limit, skip, userId);
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
    return this.postsService.createPost(sub, createPostDto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch(':postId')
  updatePost(
    @Body() updatePostDto: UpdatePostDto,
    @CurrentUser('sub') sub: string,
    @Param('postId') postId: string,
  ) {
    return this.postsService.updatePost(postId, sub, updatePostDto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':postId')
  deletePost(@CurrentUser('sub') sub: string, @Param('postId') postId: string) {
    return this.postsService.deletePost(postId, sub);
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

  @UseGuards(AccessTokenGuard)
  @Post(':postId/like/:recipientId')
  likePost(
    @Param('postId') postId: string,
    @CurrentUser('sub') sub: string,
    @Param('recipientId') recipientId: string,
  ) {
    return this.likesService.likePost(postId, sub, recipientId);
  }

  @UseGuards(AccessTokenGuard)
  @Delete(':postId/unlike')
  unlikePost(@Param('postId') postId: string, @CurrentUser('sub') sub: string) {
    return this.likesService.unlikePost(postId, sub);
  }
}
