import { IsEnum, IsNotEmpty } from 'class-validator';
import { LikeStatus } from '../../../domain/post.entity';

export class LikePostInputDto {
  @IsEnum(LikeStatus)
  @IsNotEmpty()
  likeStatus: LikeStatus;
}
