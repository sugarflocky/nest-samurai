import { CreateUserDto } from '../../../dto/create-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Trim } from '../../../../../core/decorators/transform/trim';

export class CreateUserInputDto implements CreateUserDto {
  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @Trim()
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @Trim()
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
