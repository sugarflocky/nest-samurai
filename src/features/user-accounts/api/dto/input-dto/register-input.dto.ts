import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';

export class RegisterInputDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;
}
