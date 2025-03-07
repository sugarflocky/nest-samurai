import { IsNotEmpty, IsString, Length } from 'class-validator';
import { LoginUserDto } from '../../../dto/login-user.dto';
import { toTrimmedString } from '../../../../../core/pipes/to-trimmed-string.pipe';
import { Transform } from 'class-transformer';

export class LoginInputDto implements LoginUserDto {
  @Transform(({ value }) => toTrimmedString(value))
  @IsString()
  @IsNotEmpty()
  @Length(3, 320)
  loginOrEmail: string;
  @Transform(({ value }) => toTrimmedString(value))
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  password: string;
}
