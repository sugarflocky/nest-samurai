import { CreateUserDto } from '../../../dto/create-user.dto';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  Matches,
} from 'class-validator';
import { toTrimmedString } from '../../../../../core/pipes/to-trimmed-string.pipe';
import { Transform } from 'class-transformer';

export class CreateUserInputDto implements CreateUserDto {
  @Transform(({ value }) => toTrimmedString(value))
  @IsString()
  @IsNotEmpty()
  @Length(3, 10)
  @Matches(/^[a-zA-Z0-9_-]*$/)
  login: string;

  @Transform(({ value }) => toTrimmedString(value))
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;

  @Transform(({ value }) => toTrimmedString(value))
  @IsEmail()
  @IsNotEmpty()
  email: string;
}
