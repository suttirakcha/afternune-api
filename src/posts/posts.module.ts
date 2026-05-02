import { Module } from '@nestjs/common';
import { PostsController } from './posts.controller';
import { PostsService } from './posts.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Post, PostsSchema } from './schemas/posts.schema';
import { CommentsService } from './comments.service';
import { Comment, CommentsSchema } from './schemas/comments.schema';

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
    ]),
  ],
  controllers: [PostsController],
  providers: [PostsService, CommentsService],
})
export class PostsModule {}
