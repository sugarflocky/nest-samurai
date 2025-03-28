import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { Trim } from '../../../../../core/decorators/transform/trim';

export class CreateUserInputDto {
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
