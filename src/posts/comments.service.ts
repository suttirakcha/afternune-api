import { Injectable } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Comment } from './schemas/comments.schema';
import { Model, Types } from 'mongoose';

@Injectable()
export class CommentsService {
  constructor(
    @InjectModel(Comment.name) private commentsModel: Model<Comment>,
  ) {}

  async getCommentsByPostId(post_id: string): Promise<Comment[]> {
    const comments: Comment[] = await this.commentsModel.aggregate([
      {
        $match: {
          post_id: new Types.ObjectId(post_id),
        },
      },
    ]);

    return comments;
  }

  async addComment(
    createCommentDto: CreateCommentDto,
    post_id: string,
    user_id: string,
  ) {
    await this.commentsModel.insertOne({
      detail: createCommentDto.detail,
      user_id,
      post_id,
    });
  }

  async removeComment(comment_id: string, user_id: string) {
    await this.commentsModel.deleteOne({ _id: comment_id, user_id });
  }
}
