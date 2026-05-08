import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like } from './schemas/likes.schema';
import { Model } from 'mongoose';

@Injectable()
export class LikesService {
  constructor(@InjectModel(Like.name) private likesModel: Model<Like>) {}

  async likePost(post_id: string, user_id: string) {
    await this.likesModel.insertOne({
      post_id,
      user_id,
    });
  }

  async unlikePost(post_id: string, user_id: string) {
    await this.likesModel.deleteOne({
      post_id,
      user_id,
    });
  }
}
