import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeDocument, LikeModelType } from '../domain/like.entity';
import { Types } from 'mongoose';
import { LikeStatus } from '../../posts/domain/post.entity';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class LikesRepository {
  constructor(@InjectModel(Like.name) private LikeModel: LikeModelType) {}

  async findOrNotFoundFail(id: string): Promise<LikeDocument> {
    const like = await this.LikeModel.findOne({
      _id: id,
    });
    if (!like) {
      throw NotFoundDomainException.create();
    }

    return like;
  }

  async findByUserAndParentId(
    userId: string,
    parentId: string,
  ): Promise<LikeDocument | null> {
    const like = await this.LikeModel.findOne({
      userId: new Types.ObjectId(userId),
      parentId: new Types.ObjectId(parentId),
    });

    return like;
  }

  async countLikesAndDislikes(parentId: string) {
    const likes = await this.LikeModel.countDocuments({
      parentId: new Types.ObjectId(parentId),
      status: LikeStatus.Like,
    });

    const dislikes = await this.LikeModel.countDocuments({
      parentId: new Types.ObjectId(parentId),
      status: LikeStatus.Dislike,
    });

    return { likes, dislikes };
  }

  async getThreeLastLikes(parentId: string) {
    const likes = await this.LikeModel.find({
      parentId: new Types.ObjectId(parentId),
      status: LikeStatus.Like,
    })
      .sort([['updatedAt', 'desc']])
      .limit(3)
      .exec();
    return likes;
  }

  async save(like: LikeDocument): Promise<void> {
    await like.save();
  }

  async selectById(id: string) {}

  async selectOrNotFoundFail(id: string) {}

  async create(dto) {}

  async update(dto) {}

  async delete(dto) {}
}
