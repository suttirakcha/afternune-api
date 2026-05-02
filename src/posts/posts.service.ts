import { Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/posts.schema';
import { Model, Types } from 'mongoose';

const POST_AGGREGATE = [
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
    $lookup: {
      from: 'comments',
      localField: '_id',
      foreignField: 'post_id',
      as: 'comments',
      pipeline: [
        {
          $project: {
            detail: 1,
            _id: 0,
            user_id: 1,
            createdAt: 1,
          },
        },
      ],
    },
  },
  {
    $addFields: {
      user: { $first: '$user' },
    },
  },
];

@Injectable()
export class PostsService {
  constructor(@InjectModel(Post.name) private postsModel: Model<Post>) {}
  async getPosts(): Promise<Post[]> {
    const posts: Post[] = await this.postsModel.aggregate([
      ...POST_AGGREGATE,
      {
        $sort: { createdAt: -1 },
      },
    ]);
    return posts;
  }

  async getPostById(_id: string): Promise<Post> {
    const post: Post[] = await this.postsModel.aggregate([
      ...POST_AGGREGATE,
      {
        $match: {
          _id: new Types.ObjectId(_id),
        },
      },
    ]);
    return post[0];
  }

  async createPost(createPostDto: CreatePostDto) {
    await this.postsModel.insertOne(createPostDto);
    return { message: 'Successfully created post' };
  }
}
