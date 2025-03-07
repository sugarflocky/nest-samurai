import { IsNotEmpty, IsString } from 'class-validator';
import { CodeDto } from '../../../dto/code.dto';
import { toTrimmedString } from '../../../../../core/pipes/to-trimmed-string.pipe';
import { Transform } from 'class-transformer';

export class CodeInputDto implements CodeDto {
  @Transform(({ value }) => toTrimmedString(value))
  @IsString()
  @IsNotEmpty()
  code: string;
}
