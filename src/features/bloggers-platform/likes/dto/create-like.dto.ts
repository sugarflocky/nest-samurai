import { LikeStatus } from '../../posts/domain/post.entity';

export class CreateLikeDto {
  status: LikeStatus;
  userId: string;
  parentId: string;
}
