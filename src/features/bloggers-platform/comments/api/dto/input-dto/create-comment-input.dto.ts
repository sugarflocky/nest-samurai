import { IsNotEmpty, IsString, Length } from 'class-validator';
import { toTrimmedString } from '../../../../../../core/pipes/to-trimmed-string.pipe';
import { Transform } from 'class-transformer';

export class CreateCommentInputDto {
  @Transform(({ value }) => toTrimmedString(value))
  @IsString()
  @IsNotEmpty()
  @Length(20, 300)
  content: string;
}
