import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class EmailInputDto {
  @IsString()
  @IsNotEmpty()
  @IsEmail()
  email: string;
}
