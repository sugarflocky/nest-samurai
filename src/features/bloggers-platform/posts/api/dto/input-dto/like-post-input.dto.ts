import { IsEnum, IsNotEmpty } from 'class-validator';

import { LikeStatus } from '../../../../likes/dto/like-status.enum';

export class LikePostInputDto {
  @IsEnum(LikeStatus)
  @IsNotEmpty()
  likeStatus: LikeStatus;
}
