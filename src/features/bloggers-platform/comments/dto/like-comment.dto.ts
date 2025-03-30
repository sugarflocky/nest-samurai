import { LikeStatus } from '../../likes/dto/like-status.enum';

export class LikeCommentDto {
  status: LikeStatus;
  userId: string;
}
