import { Injectable } from '@nestjs/common';
import { IsNotEmpty } from 'class-validator';
import { ConfigService } from '@nestjs/config';
import { configValidationUtility } from '../../setup/config-validation.utility';

@Injectable()
export class UserAccountsConfig {
  accessTokenExpireIn: string;
  refreshTokenExpireIn: string;
  accessTokenSecret: string;
  refreshTokenSecret: string;
  jwtSecret: string;
  basicLogin: string;
  basicPassword: string;
  mailPass: string;

  constructor(private readonly configService: ConfigService<any, true>) {
    this.accessTokenExpireIn = this.configService.get('ACCESS_TOKEN_EXPIRE_IN');
    this.refreshTokenExpireIn = this.configService.get(
      'REFRESH_TOKEN_EXPIRE_IN',
    );
    this.accessTokenSecret = this.configService.get('ACCESS_TOKEN_SECRET');
    this.refreshTokenSecret = this.configService.get('REFRESH_TOKEN_SECRET');
    this.jwtSecret = this.configService.get('JWT_SECRET');
    this.basicLogin = this.configService.get('BASIC_LOGIN');
    this.basicPassword = this.configService.get('BASIC_PASSWORD');
    this.mailPass = this.configService.get('MAIL_PASS');

    configValidationUtility.validateConfig(this);
  }

  @IsNotEmpty({
    message: 'Set Env variable ACCESS_TOKEN_EXPIRE_IN, examples: 1h, 5m, 2d',
  })
  get getAccessTokenExpireIn(): string {
    return this.accessTokenExpireIn;
  }

  @IsNotEmpty({
    message: 'Set Env variable REFRESH_TOKEN_EXPIRE_IN, examples: 1h, 5m, 2d',
  })
  get getRefreshTokenExpireIn(): string {
    return this.refreshTokenExpireIn;
  }

  @IsNotEmpty({
    message: 'Set Env variable ACCESS_TOKEN_SECRET',
  })
  get getAccessTokenSecret(): string {
    return this.accessTokenSecret;
  }

  @IsNotEmpty({
    message: 'Set Env variable REFRESH_TOKEN_SECRET',
  })
  get getRefreshTokenSecret(): string {
    return this.refreshTokenSecret;
  }
  @IsNotEmpty({
    message: 'Set Env variable BASIC_LOGIN, example : qwerty',
  })
  get getBasicLogin(): string {
    return this.basicLogin;
  }
  @IsNotEmpty({
    message: 'Set Env variable BASIC_PASSWORD, example : qwerty',
  })
  get getBasicPassword(): string {
    return this.basicPassword;
  }
  @IsNotEmpty({
    message: 'Set Env variable MAIL_PASS as, example: qwerty',
  })
  get getMailPass(): string {
    return this.mailPass;
  }
}
