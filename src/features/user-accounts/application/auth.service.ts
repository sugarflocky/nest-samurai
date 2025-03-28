import { Injectable } from '@nestjs/common';
import { LoginUserDto } from '../dto/login-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { CryptoService } from './crypto.service';
import { UnauthorizedDomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async validateUser(dto: LoginUserDto): Promise<string> {
    const { loginOrEmail, password } = dto;

    const user = await this.usersRepository.selectByLoginOrEmail(loginOrEmail);
    if (!user) {
      throw UnauthorizedDomainException.create();
    }

    await this.cryptoService.compareHash(password, user.password);

    return user.id;
  }
}
