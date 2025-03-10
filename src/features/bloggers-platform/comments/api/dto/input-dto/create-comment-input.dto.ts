import { IsNotEmpty, IsString, Length } from 'class-validator';
import { Trim } from '../../../../../../core/decorators/transform/trim';

export class CreateCommentInputDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(20, 300)
  content: string;
}
