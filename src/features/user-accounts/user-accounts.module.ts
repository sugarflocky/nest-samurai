import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { CryptoService } from './application/crypto.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
import { MailService } from './application/mail.service';
import { UserAccountsConfig } from './user-accounts.config';
import { Module } from '@nestjs/common';
import { JwtStrategy } from '../../core/guards/bearer/jwt.strategy';
import { LocalStrategy } from '../../core/guards/local/local.strategy';
import { SessionRepository } from './infrastructure/session.repository';
import { ConfirmEmailUseCase } from './application/usecases/confirm-email-by-code-use-case';
import { CreateUserUseCase } from './application/usecases/create-user-use-case';
import { DeleteUserUseCase } from './application/usecases/delete-user-use-case';
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
import { DevicesController } from './api/devices-controller';
import { DevicesQueryRepository } from './infrastructure/query/devices.query-repository';

dotenv.config();

@Module({
  imports: [
    JwtModule,
    //TypeOrmModule.forFeature([User]),
    //TypeOrmModule.forFeature([Session]),
  ],
  controllers: [UsersController, AuthController, DevicesController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    AuthService,
    CryptoService,
    MailService,
    UserAccountsConfig,
    SessionRepository,
    DevicesQueryRepository,
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
