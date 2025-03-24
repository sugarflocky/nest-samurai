import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserAccountsConfig } from '../user-accounts.config';
import { LoginUserDto } from '../dto/login-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { CryptoService } from './crypto.service';
import { Session, SessionModelType } from '../domain/session.entity';
import { InjectModel } from '@nestjs/mongoose';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userAccountsConfig: UserAccountsConfig,
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
    @InjectModel(Session.name) private SessionModel: SessionModelType,
  ) {}

  async validateUser(dto: LoginUserDto): Promise<string> {
    const { loginOrEmail, password } = dto;

    const user = await this.usersRepository.findByLoginOrEmail(loginOrEmail);

    await this.cryptoService.compareHash(password, user.password);

    return user._id.toString();
  }
}
