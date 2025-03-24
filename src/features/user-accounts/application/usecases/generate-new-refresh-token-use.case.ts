import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokensPairDto } from '../../dto/tokensPairDto';
import { SessionRepository } from '../../infrastructure/session.repository';
import { JwtService } from '@nestjs/jwt';
import { UserAccountsConfig } from '../../user-accounts.config';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModelType } from '../../domain/session.entity';
import {
  UpdateSessionDto,
  UpdateSessionInServiceDto,
} from '../../dto/update-session.dto';

export class GenerateNewRefreshTokenCommand {
  constructor(public dto: UpdateSessionInServiceDto) {}
}

@CommandHandler(GenerateNewRefreshTokenCommand)
export class GenerateNewRefreshTokenUseCase
  implements ICommandHandler<GenerateNewRefreshTokenCommand>
{
  constructor(
    private sessionRepository: SessionRepository,
    private jwtService: JwtService,
    private userAccountsConfig: UserAccountsConfig,
    @InjectModel(Session.name) private SessionModel: SessionModelType,
  ) {}

  async execute(
    command: GenerateNewRefreshTokenCommand,
  ): Promise<TokensPairDto> {
    const dto = command.dto;

    const session = await this.sessionRepository.findOrUnauthorized(
      dto.deviceId,
    );

    const accessToken: string = this.jwtService.sign(
      { userId: dto.userId },
      {
        secret: this.userAccountsConfig.getAccessTokenSecret,
        expiresIn: this.userAccountsConfig.getAccessTokenExpireIn,
      },
    );
    const refreshToken: string = this.jwtService.sign(
      { userId: dto.userId, deviceId: dto.deviceId },
      {
        secret: this.userAccountsConfig.getRefreshTokenSecret,
        expiresIn: this.userAccountsConfig.getRefreshTokenExpireIn,
      },
    );

    const decodedRefreshToken = this.jwtService.decode(refreshToken);
    const issuedAt: string = decodedRefreshToken.iat;

    const updateSessionDto: UpdateSessionDto = {
      ip: dto.ip,
      title: dto.title,
      issuedAt: issuedAt,
    };

    session.updateSession(updateSessionDto);
    await session.save();

    return { accessToken: accessToken, refreshToken: refreshToken };
  }
}
