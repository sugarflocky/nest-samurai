import { Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserContextDto } from '../dto/user-context.dto';
import { UserAccountsConfig } from '../../../features/user-accounts/user-accounts.config';
import { AuthService } from '../../../features/user-accounts/application/auth.service';
import { UnauthorizedDomainException } from '../../exceptions/domain-exceptions';
import { SessionRepository } from '../../../features/user-accounts/infrastructure/session.repository';
import { Request } from 'express';

const fromCookie = (cookieName: string) => {
  return (req: Request) => {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies[cookieName];
    }
    return token;
  };
};

@Injectable()
export class RefreshTokenJwtStrategyJwtStrategy extends PassportStrategy(
  Strategy,
) {
  constructor(
    userAccountsConfig: UserAccountsConfig,
    private authService: AuthService,
    private sessionRepository: SessionRepository,
  ) {
    super({
      jwtFromRequest: fromCookie('refreshToken'),
      ignoreExpiration: false,
      secretOrKey: userAccountsConfig.getRefreshTokenSecret,
    });
  }

  async validate(payload: {
    userId: string;
    iat: string;
    deviceId: string;
  }): Promise<UserContextDto> {
    const { userId, iat, deviceId } = payload;

    const session = await this.sessionRepository.findOrUnauthorized(deviceId);
    if (
      iat !== session.issuedAt ||
      deviceId !== session.deviceId.toString() ||
      userId !== session.userId.toString()
    ) {
      throw UnauthorizedDomainException.create();
    }

    return {
      id: payload.userId,
    };
  }
}
