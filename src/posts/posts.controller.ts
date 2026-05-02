import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

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

  @Post()
  createPost(@Body() createPostDto: CreatePostDto) {
    return this.postsService.createPost(createPostDto);
  }

  @Get(':postId/comments')
  getCommentsByPostId(@Param('postId') postId: string) {
    return this.commentsService.getCommentsByPostId(postId);
  }

  @Post(':postId/comment')
  addComment(
    @Body() createCommentDto: CreateCommentDto,
    @Param('postId') postId: string,
    userId: string,
  ) {
    return this.commentsService.addComment(createCommentDto, postId, userId);
  }
}
