import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { User, UserSchema } from './domain/user.entity';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { CryptoService } from './application/crypto.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { MailService } from './application/mail.service';
import { UserAccountsConfig } from './user-accounts.config';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { JwtStrategy } from '../../core/guards/bearer/jwt.strategy';
import { LocalStrategy } from '../../core/guards/local/local.strategy';
import {
  ACCESS_TOKEN_STRATEGY_INJECT_TOKEN,
  REFRESH_TOKEN_STRATEGY_INJECT_TOKEN,
} from './constants/auth-token.inject-constant';
import { SessionRepository } from './infrastructure/session.repository';
import { Session, SessionSchema } from './domain/session.entity';
import { ConfirmEmailUseCase } from './application/usecases/confirm-email-by-code-use-case';
import { CreateUserUseCase } from './application/usecases/create-user-use-case';
import {
  DeleteUserCommand,
  DeleteUserUseCase,
} from './application/usecases/delete-user-use-case';
import { LoginUserUseCase } from './application/usecases/login-user.use-case';
import { RecoveryPasswordByCodeUseCase } from './application/usecases/recovery-password-by-code-use-case';
import { RegisterUserUseCase } from './application/usecases/register-user-use-case';
import { ResendEmailConfirmationCodeUseCase } from './application/usecases/resend-email-confirmation-code-use-case';
import { SendRecoveryCodeUseCase } from './application/usecases/send-recovery-code-use-case';
import { RefreshTokenJwtStrategy } from '../../core/guards/bearer/refresh-token-jwt.strategy';
import { LogoutUserUseCase } from './application/usecases/logout-user.use-case';
import { GenerateNewRefreshTokenUseCase } from './application/usecases/generate-new-refresh-token-use.case';
import { DeleteDeviceUseCase } from './application/usecases/delete-device.use-case';
import { DeleteOtherDevicesUseCase } from './application/usecases/delete-other-devices.use-case';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
    JwtModule,
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    AuthService,
    CryptoService,
    MailService,
    UserAccountsConfig,
    SessionRepository,
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
    RefreshTokenJwtStrategy,
    ConfirmEmailUseCase,
    CreateUserUseCase,
    DeleteUserUseCase,
    LoginUserUseCase,
    RecoveryPasswordByCodeUseCase,
    RegisterUserUseCase,
    ResendEmailConfirmationCodeUseCase,
    SendRecoveryCodeUseCase,
    LogoutUserUseCase,
    GenerateNewRefreshTokenUseCase,
    DeleteDeviceUseCase,
    DeleteOtherDevicesUseCase,
  ],
  exports: [UsersRepository, JwtModule],
})
export class UserAccountsModule {}
