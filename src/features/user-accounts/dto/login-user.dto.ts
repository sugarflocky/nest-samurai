export class LoginUserDto {
  loginOrEmail: string;
  password: string;
}

export class LoginUserInServiceDto {
  loginOrEmail: string;
  password: string;
  ip: string;
  title: string;
}
