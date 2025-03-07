import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { EmailDto } from '../../../dto/email.dto';
import { toTrimmedString } from '../../../../../core/pipes/to-trimmed-string.pipe';
import { Transform } from 'class-transformer';

export class EmailInputDto implements EmailDto {
  @Transform(({ value }) => toTrimmedString(value))
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
