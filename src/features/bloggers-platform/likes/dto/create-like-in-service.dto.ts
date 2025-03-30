import { LikeStatus } from './like-status.enum';

export class CreateLikeInServiceDto {
  status: LikeStatus;
  userId: string;
  parentId: string;
}
