import { LikeStatus } from '../../../../posts/domain/post.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';

export class LikeCommentInputDto {
  @IsEnum(LikeStatus)
  @IsNotEmpty()
  likeStatus: LikeStatus;
}
