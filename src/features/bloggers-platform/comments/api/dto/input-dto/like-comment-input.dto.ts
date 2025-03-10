import { LikeStatus } from '../../../../posts/domain/post.entity';
import { IsEnum, IsNotEmpty } from 'class-validator';
import { Trim } from '../../../../../../core/decorators/transform/trim';

export class LikeCommentInputDto {
  @Trim()
  @IsEnum(LikeStatus)
  @IsNotEmpty()
  likeStatus: LikeStatus;
}
