import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { TokensPairDto } from '../dto/tokensPairDto';
import { UserAccountsConfig } from '../user-accounts.config';
import { UnauthorizedDomainException } from '../../../core/exceptions/domain-exceptions';
import { LoginUserDto } from '../dto/login-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { CryptoService } from './crypto.service';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userAccountsConfig: UserAccountsConfig,
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async createTokensPair(userId: string): Promise<TokensPairDto> {
    const accessToken: string = this.jwtService.sign(
      { userId: userId },
      {
        secret: this.userAccountsConfig.getAccessTokenSecret,
        expiresIn: this.userAccountsConfig.getAccessTokenExpireIn,
      },
    );
    const refreshToken: string = this.jwtService.sign(
      { userId: userId },
      {
        secret: this.userAccountsConfig.getRefreshTokenSecret,
        expiresIn: this.userAccountsConfig.getRefreshTokenExpireIn,
      },
    );

    return { accessToken: accessToken, refreshToken: refreshToken };
  }

  async validateUser(dto: LoginUserDto): Promise<string> {
    const { loginOrEmail, password } = dto;

    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);

    const result = await this.cryptoService.compareHash(
      password,
      user.password,
    );
    if (!result) {
      throw UnauthorizedDomainException.create();
    }
    return user._id.toString();
  }
}
