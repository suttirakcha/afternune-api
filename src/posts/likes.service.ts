import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from './schemas/likes.schema';
import { Model } from 'mongoose';
import { Post } from './schemas/posts.schema';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private likesModel: Model<Like>,
    @InjectModel(Post.name) private postsModel: Model<Post>,
  ) {}

  async findPost(post_id: string) {
    const post = await this.postsModel.findOne({ _id: post_id });

    if (!post) {
      throw new NotFoundException({
        code: 'POST_NOT_FOUND',
        message: 'Post not found',
        success: false,
      });
    }

    return post;
  }

  async likePost(post_id: string, user_id: string) {
    const post = await this.findPost(post_id);

    await this.likesModel.insertOne({
      post_id: post.id,
      user_id,
    });
  }

  async unlikePost(post_id: string, user_id: string) {
    const post = await this.findPost(post_id);

    await this.likesModel.deleteOne({
      post_id: post.id,
      user_id,
    });
  }
}
