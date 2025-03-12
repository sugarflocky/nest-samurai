import { Injectable } from '@nestjs/common';
import { SuccessLoginViewDto } from '../api/dto/view-dto/success-login-view.dto';
import { LoginInputDto } from '../api/dto/input-dto/login-input.dto';
import { BcryptService } from './bcrypt.service';
import { UsersRepository } from '../infrastructure/users.repository';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedDomainException } from '../../../core/exceptions/domain-exceptions';
import { TokensPairDto } from '../dto/tokensPairDto';
import { UserAccountsConfig } from '../user-accounts.config';

@Injectable()
export class AuthService {
  constructor(
    private bcryptService: BcryptService,
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
    private userAccountsConfig: UserAccountsConfig,
  ) {}

  async validateUser(loginDto: LoginInputDto): Promise<string> {
    const { loginOrEmail, password } = loginDto;
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);

    const result = await this.bcryptService.compareHash(
      password,
      user.password,
    );
    if (!result) {
      throw UnauthorizedDomainException.create();
    }
    return user._id.toString();
  }

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
}
