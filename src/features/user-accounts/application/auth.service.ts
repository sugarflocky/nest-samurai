import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokensPairDto } from '../dto/tokensPairDto';
import { UserAccountsConfig } from '../user-accounts.config';
import { LoginUserDto } from '../dto/login-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { CryptoService } from './crypto.service';
import { Session, SessionModelType } from '../domain/session.entity';
import { InjectModel } from '@nestjs/mongoose';
import {
  CreateSessionDto,
  CreateSessionInServiceDto,
} from '../dto/create-session.dto';
import { Types } from 'mongoose';
import { SessionRepository } from '../infrastructure/session.repository';
import { UnauthorizedDomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userAccountsConfig: UserAccountsConfig,
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
    private sessionRepository: SessionRepository,
    @InjectModel(Session.name) private SessionModel: SessionModelType,
  ) {}

  async createTokensPair(
    dto: CreateSessionInServiceDto,
  ): Promise<TokensPairDto> {
    const deviceId = new Types.ObjectId().toString();

    const accessToken: string = this.jwtService.sign(
      { userId: dto.userId },
      {
        secret: this.userAccountsConfig.getAccessTokenSecret,
        expiresIn: this.userAccountsConfig.getAccessTokenExpireIn,
      },
    );
    const refreshToken: string = this.jwtService.sign(
      { userId: dto.userId, deviceId: deviceId },
      {
        secret: this.userAccountsConfig.getRefreshTokenSecret,
        expiresIn: this.userAccountsConfig.getRefreshTokenExpireIn,
      },
    );

    const decodedRefreshToken = this.jwtService.decode(refreshToken);
    const issuedAt: string = decodedRefreshToken.iat;

    const createSessionDto: CreateSessionDto = {
      ...dto,
      issuedAt,
      deviceId,
    };

    const session = this.SessionModel.createInstance(createSessionDto);
    await session.save();

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async validateUser(dto: LoginUserDto): Promise<string> {
    const { loginOrEmail, password } = dto;

    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);

    await this.cryptoService.compareHash(password, user.password);

    return user._id.toString();
  }

  async validateDevice(refreshToken: string): Promise<void> {}
}
