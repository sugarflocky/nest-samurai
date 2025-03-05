import * as process from 'node:process';
import { Module } from '@nestjs/common';
import { UsersController } from './api/users.controller';
import { UsersService } from './application/users.service';
import { User, UserSchema } from './domain/user.entity';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersRepository } from './infrastructure/users.repository';
import { UsersQueryRepository } from './infrastructure/query/users.query-repository';
import { BasicStrategy } from '../../core/strategies/basic.strategy';
import { AuthController } from './api/auth.controller';
import { AuthService } from './application/auth.service';
import { BcryptService } from './application/bcrypt.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from '../../core/strategies/jwt.strategy';
import * as dotenv from 'dotenv';
import { MailService } from './application/mail.service';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: process.env.ACCESS_TOKEN_EXPIRESIN },
    }),
  ],
  controllers: [UsersController, AuthController],
  providers: [
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    AuthService,
    BcryptService,
    BasicStrategy,
    JwtStrategy,
    MailService,
  ],
})
export class UserAccountsModule {}
