import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokensPairDto } from '../../dto/tokensPairDto';
import { AuthService } from '../auth.service';
import {
  CreateSessionDto,
  CreateSessionInServiceDto,
} from '../../dto/create-session.dto';
import { Types } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { UserAccountsConfig } from '../../user-accounts.config';
import { InjectModel } from '@nestjs/mongoose';
import { Session, SessionModelType } from '../../domain/session.entity';

export class LoginUserCommand {
  constructor(public dto: CreateSessionInServiceDto) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(
    private jwtService: JwtService,
    private userAccountsConfig: UserAccountsConfig,
    @InjectModel(Session.name) private SessionModel: SessionModelType,
  ) {}

  async execute(command: LoginUserCommand): Promise<TokensPairDto> {
    const { ip, title, userId } = command.dto;

    const dto: CreateSessionInServiceDto = {
      ip: ip,
      title: title,
      userId: userId,
    };

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
}
