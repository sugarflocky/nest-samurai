import { LikeStatus } from './like-status.enum';

export class CreateLikeDto {
  id: string;
  status: LikeStatus;
  userId: string;
  parentId: string;
  createdAt: Date;
  updatedAt: Date;
}
