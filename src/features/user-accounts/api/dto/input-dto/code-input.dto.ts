import { IsNotEmpty, IsString, IsUUID } from 'class-validator';
import { CodeDto } from '../../../dto/code.dto';
import { Trim } from '../../../../../core/decorators/transform/trim';

export class CodeInputDto implements CodeDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @IsUUID()
  code: string;
}
