import { Injectable } from '@nestjs/common';
import { SuccessLoginViewDto } from '../api/dto/view-dto/success-login-view.dto';
import { LoginInputDto } from '../api/dto/input-dto/login-input.dto';
import { BcryptService } from './bcrypt.service';
import { UsersRepository } from '../infrastructure/users.repository';
import { JwtService } from '@nestjs/jwt';
import { UnauthorizedDomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class AuthService {
  constructor(
    private bcryptService: BcryptService,
    private usersRepository: UsersRepository,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDto: LoginInputDto): Promise<string> {
    const { loginOrEmail, password } = loginDto;
    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);

    const result = await this.bcryptService.compareHash(
      password,
      user.password,
    );
    if (!result) {
      throw UnauthorizedDomainException.create('Invalid login or password');
    }
    return user._id.toString();
  }

  async login(loginDto: LoginInputDto): Promise<SuccessLoginViewDto> {
    const userId = await this.validateUser(loginDto);

    const accessToken: string = this.jwtService.sign({ userId: userId });

    return { accessToken: accessToken };
  }
}
