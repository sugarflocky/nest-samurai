import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { UserContextDto } from '../dto/user-context.dto';
import { UserAccountsConfig } from '../../../features/user-accounts/user-accounts.config';

@Injectable()
export class AccessTokenJwtStrategy extends PassportStrategy(Strategy) {
  constructor(userAccountsConfig: UserAccountsConfig) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: userAccountsConfig.getAccessTokenSecret,
    });
  }

  async validate(payload: { userId: string }): Promise<UserContextDto> {
    return {
      id: payload.userId,
    };
  }
}
