import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { BasicStrategy as Strategy } from 'passport-http';
import * as process from 'node:process';

@Injectable()
export class BasicStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super();
  }

  public validate(login: string, password: string): boolean {
    if (
      process.env.BASIC_LOGIN === login &&
      process.env.BASIC_PASSWORD === password
    ) {
      return true;
    }
    throw new UnauthorizedException();
  }
}
