import { IsEnum, IsNotEmpty } from 'class-validator';
import { Trim } from '../../../../../../core/decorators/transform/trim';
import { LikeStatus } from '../../../../likes/dto/like-status.enum';

export class LikeCommentInputDto {
  @Trim()
  @IsEnum(LikeStatus)
  @IsNotEmpty()
  likeStatus: LikeStatus;
}
