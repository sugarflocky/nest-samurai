import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
import { EmailDto } from '../../../dto/email.dto';
import { Trim } from '../../../../../core/decorators/transform/trim';

export class EmailInputDto implements EmailDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
