import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { AuthService } from '../../../features/user-accounts/application/auth.service';
import { UserContextDto } from '../dto/user-context.dto';
import { UnauthorizedDomainException } from '../../exceptions/domain-exceptions';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super({ usernameField: 'loginOrEmail' });
  }

  async validate(
    loginOrEmail: string,
    password: string,
  ): Promise<UserContextDto> {
    const user = await this.authService.validateUser({
      loginOrEmail: loginOrEmail,
      password: password,
    });
    if (!user) {
      throw UnauthorizedDomainException.create();
    }

    return { id: user };
  }
}
