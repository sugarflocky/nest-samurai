import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokensPairDto } from '../../dto/tokensPairDto';
import {
  CreateSessionDto,
  CreateSessionInServiceDto,
} from '../../dto/create-session.dto';
import { v4 as uuidv4 } from 'uuid';
import { JwtService } from '@nestjs/jwt';
import { UserAccountsConfig } from '../../user-accounts.config';
import { SessionRepository } from '../../infrastructure/session.repository';

export class LoginUserCommand {
  constructor(public dto: CreateSessionInServiceDto) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(
    private jwtService: JwtService,
    private userAccountsConfig: UserAccountsConfig,
    private sessionRepository: SessionRepository,
  ) {}

  async execute(command: LoginUserCommand): Promise<TokensPairDto> {
    const { ip, title, userId } = command.dto;

    const dto: CreateSessionInServiceDto = {
      ip: ip,
      title: title,
      userId: userId,
    };

    const deviceId = uuidv4();

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
      deviceId: deviceId,
      userId: dto.userId,
      ip: dto.ip,
      title: dto.title,
      issuedAt: issuedAt,
      createdAt: new Date(),
      deletedAt: null,
    };

    await this.sessionRepository.create(createSessionDto);

    return { accessToken: accessToken, refreshToken: refreshToken };
  }
}
