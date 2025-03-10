import { IsNotEmpty, IsString, Length } from 'class-validator';
import { LoginUserDto } from '../../../dto/login-user.dto';
import { Trim } from '../../../../../core/decorators/transform/trim';

export class LoginInputDto implements LoginUserDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(3, 320)
  loginOrEmail: string;
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(1, 30)
  password: string;
}
