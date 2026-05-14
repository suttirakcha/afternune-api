import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostsSchema } from './schemas/posts.schema';
import { CommentsService } from './comments.service';
import { Comment, CommentsSchema } from './schemas/comments.schema';
import { Like, LikesSchema } from './schemas/likes.schema';
import { LikesService } from './likes.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: Post.name,
        schema: PostsSchema,
      },
      {
        name: Comment.name,
        schema: CommentsSchema,
      },
      {
        name: Like.name,
        schema: LikesSchema,
      },
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, CommentsService, LikesService],
})
export class PostsModule {}
