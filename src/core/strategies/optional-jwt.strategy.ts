import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { UsersRepository } from '../../features/user-accounts/infrastructure/users.repository';

@Injectable()
export class OptionalJwtStrategy extends PassportStrategy(
  Strategy,
  'optional-jwt',
) {
  constructor(private usersRepository: UsersRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET || 'abracadabra',
    });
  }

  async validate(payload: { userId: string }) {
    const user = await this.usersRepository.findById(payload.userId);
    if (user) {
      return { id: payload.userId };
    }
    return null;
  }
}
