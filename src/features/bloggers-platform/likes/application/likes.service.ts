import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Like, LikeModelType } from '../domain/like.entity';
import { LikesRepository } from '../infrastructure/likes.repository';
import { CreateLikeDto } from '../dto/create-like.dto';
import { LikeStatus } from '../../posts/domain/post.entity';

@Injectable()
export class LikesService {
  constructor(
    @InjectModel(Like.name) private LikeModel: LikeModelType,
    private readonly likesRepository: LikesRepository,
  ) {}

  async like(dto: CreateLikeDto) {
    let like = await this.likesRepository.findByUserAndParentId(
      dto.userId,
      dto.parentId,
    );

    if (!like) {
      like = this.LikeModel.createInstance(dto);
    } else {
      like.changeStatus(dto.status);
    }
    await this.likesRepository.save(like);
  }

  async countLikesAndDislikes(parentId: string) {
    return this.likesRepository.countLikesAndDislikes(parentId);
  }

  async getStatus(userId: string, parentId: string) {
    const like = await this.likesRepository.findByUserAndParentId(
      userId,
      parentId,
    );
    if (!like) return LikeStatus.None;
    return like.status;
  }

  async getThreeLastLikes(parentId: string) {
    const likes = await this.likesRepository.getThreeLastLikes(parentId);
    return likes;
  }
}
