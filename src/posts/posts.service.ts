import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Posts } from './schemas/posts.schema';
import { Model } from 'mongoose';

@Injectable()
export class PostsService {
  constructor(@InjectModel(Posts.name) private postsModel: Model<Posts>) {}
  async getPosts(): Promise<Posts[]> {
    const posts: Posts[] = await this.postsModel.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'user_id',
          foreignField: '_id',
          as: 'user',
          pipeline: [{ $project: { username: 1, _id: 0, image_url: 1 } }],
        },
      },
      {
        $addFields: {
          user: { $first: '$user' },
        },
      },
    ]);
    return posts;
  }

  async getPostById(_id: string) {
    const post = await this.postsModel.findOne({ _id });
    return post;
  }

  async createPost(createPostDto: CreatePostDto) {
    await this.postsModel.insertOne(createPostDto);
    return { message: 'Successfully created post' };
  }
}
