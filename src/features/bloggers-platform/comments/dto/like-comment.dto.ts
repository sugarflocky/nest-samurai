import { LikeStatus } from '../../posts/domain/post.entity';

export class LikeCommentDto {
  status: LikeStatus;
  userId: string;
}
