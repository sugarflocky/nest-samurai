import { IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginInputDto {
  @IsString()
  @IsNotEmpty()
  @Length(3, 320)
  loginOrEmail: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  password: string;
}
