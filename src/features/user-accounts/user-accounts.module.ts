import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { User, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { BcryptService } from './application/bcrypt.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { MailService } from './application/mail.service';
import { UserAccountsConfig } from './user-accounts.config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants/auth-token.inject-constant';
import { JwtStrategy } from '../../core/guards/bearer/jwt.strategy';
import { LocalStrategy } from '../../core/guards/local/local.strategy';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    AuthService,
    BcryptService,
    MailService,
    UserAccountsConfig,
    {
      provide: ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.getAccessTokenSecret,
          signOptions: { expiresIn: userAccountConfig.getAccessTokenExpireIn },
        });
      },
      inject: [UserAccountsConfig],
    },
    {
      provide: REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
      useFactory: (userAccountConfig: UserAccountsConfig): JwtService => {
        return new JwtService({
          secret: userAccountConfig.getRefreshTokenSecret,
          signOptions: { expiresIn: userAccountConfig.getRefreshTokenExpireIn },
        });
      },
      inject: [UserAccountsConfig],
    },
    JwtStrategy,
    LocalStrategy,
  ],
  exports: [UsersRepository, JwtModule],
})
export class UserAccountsModule {}
