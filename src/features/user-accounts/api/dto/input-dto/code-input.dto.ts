import { IsNotEmpty, IsString } from 'class-validator';

export class CodeInputDto {
  @IsString()
  @IsNotEmpty()
  code: string;
}
