import { BadRequestException, Injectable } from '@nestjs/common';
import { CreatePostDto } from './dto/create-post.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Post } from './schemas/posts.schema';
import { Model, Types } from 'mongoose';
import { UpdatePostDto } from './dto/update-post.dto';

export const POST_AGGREGATE = [
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
            user_id: 1,
            createdAt: 1,
          },
        },
      ],
    },
  },
  {
    $lookup: {
      from: 'users',
      localField: 'user_id',
      foreignField: '_id',
      as: 'user',
      pipeline: [{ $project: { username: 1, image_url: 1 } }],
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

  async createPost(user_id: string, createPostDto: CreatePostDto) {
    const post = await this.postsModel.insertOne({
      ...createPostDto,
      user_id,
    });

    if (!post) {
      throw new BadRequestException({
        code: 'CREATE_POST_FAILED',
        message: 'Failed to create the post',
        success: false,
      });
    }

    return { message: 'Successfully created post', success: true };
  }

  async updatePost(
    post_id: string,
    user_id: string,
    updatePostDto: UpdatePostDto,
  ) {
    const post = await this.postsModel.updateOne(
      {
        _id: post_id,
        user_id,
      },
      {
        $set: updatePostDto,
      },
    );

    if (!post) {
      throw new BadRequestException({
        code: 'UPDATE_POST_FAILED',
        message:
          'Failed to update the post as it may be unavailable or deleted',
        success: false,
      });
    }

    return { message: 'Successfully updated post', success: true };
  }
}
