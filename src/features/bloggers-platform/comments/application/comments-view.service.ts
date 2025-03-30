import { CommentViewDto } from '../api/dto/view-dto/comment-view.dto';
import { Injectable } from '@nestjs/common';
import { LikesRepository } from '../../likes/infrastructure/likes.repository';

@Injectable()
export class CommentsViewService {
  constructor(private likesRepository: LikesRepository) {}

  async mapToView(comment, userId: string): Promise<CommentViewDto> {
    const dto = new CommentViewDto();
    const status = await this.likesRepository.getMyStatus(comment.id, userId);
    const likesInfo = await this.likesRepository.countLikes(comment.id);

    dto.id = comment.id;
    dto.content = comment.content;
    dto.createdAt = comment.createdAt;
    dto.commentatorInfo = {
      userId: comment.userId,
      userLogin: comment.userLogin,
    };
    dto.likesInfo = {
      likesCount: +likesInfo.likesCount,
      dislikesCount: +likesInfo.dislikesCount,
      myStatus: status,
    };

    return dto;
  }

  async mapToViewList(comments, userId: string): Promise<CommentViewDto[]> {
    return Promise.all(
      comments.map((comment) => this.mapToView(comment, userId)),
    );
  }
}
