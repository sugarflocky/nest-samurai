import { LikesService } from '../../likes/application/likes.service';
import { CommentDocument } from '../domain/comment.entity';
import { CommentViewDto } from '../api/dto/view-dto/comment-view.dto';
import { Injectable } from '@nestjs/common';

@Injectable()
export class CommentsViewService {
  constructor(private readonly likesService: LikesService) {}

  async mapToView(
    comment: CommentDocument,
    userId: string,
  ): Promise<CommentViewDto> {
    const dto = new CommentViewDto();

    dto.id = comment._id.toString();
    dto.content = comment.content;
    dto.commentatorInfo = {
      userId: comment.commentatorInfo.userId.toString(),
      userLogin: comment.commentatorInfo.userLogin,
    };
    dto.createdAt = comment.createdAt;
    dto.likesInfo = {
      likesCount: comment.likesInfo.likesCount,
      dislikesCount: comment.likesInfo.dislikesCount,
      myStatus: await this.likesService.getStatus(
        userId,
        comment._id.toString(),
      ),
    };

    return dto;
  }

  async mapToViewList(
    comments: CommentDocument[],
    userId: string,
  ): Promise<CommentViewDto[]> {
    return Promise.all(
      comments.map((comment) => this.mapToView(comment, userId)),
    );
  }
}
