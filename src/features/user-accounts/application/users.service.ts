import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { BcryptService } from './bcrypt.service';
import { AuthService } from './auth.service';
import { MailService } from './mail.service';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';
import { EmailDto } from '../dto/email.dto';
import { ChangePasswordDto } from '../dto/change-password.dto';
import { CodeDto } from '../dto/code.dto';
import {
  BadRequestDomainException,
  ErrorExtension,
} from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class UsersService {
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    private usersRepository: UsersRepository,
    private bcryptService: BcryptService,
    private authService: AuthService,
    private mailService: MailService,
  ) {}

  async createUser(dto: CreateUserDto): Promise<string> {
    await this.testUnique(dto.login, dto.email);

    const passwordHash = await this.bcryptService.generateHash(dto.password);

    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      password: passwordHash,
    });

    user.confirmEmail();
    await this.usersRepository.save(user);
    return user._id.toString();
  }

  async testUnique(login: string, email: string) {
    const loginTest = await this.usersRepository.findByLogin(login);
    const emailTest = await this.usersRepository.findByEmail(email);
    if (emailTest || loginTest) {
      const errorsMessages: ErrorExtension[] = [];
      if (emailTest) {
        errorsMessages.push({
          message: 'user with same email already exists',
          field: 'email',
        });
      }
      if (loginTest) {
        errorsMessages.push({
          message: 'user with same login already exists',
          field: 'login',
        });
      }
      throw new BadRequestDomainException(errorsMessages);
    }
  }

  async registerUser(dto: CreateUserDto): Promise<string> {
    await this.testUnique(dto.login, dto.email);
    const passwordHash = await this.bcryptService.generateHash(dto.password);

    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      password: passwordHash,
    });

    await this.usersRepository.save(user);

    this.mailService.sendCode(user.email, user.emailConfirmation.code);
    return user._id.toString();
  }

  async confirmEmail(codeDto: CodeDto) {
    const { code } = codeDto;
    const user = await this.usersRepository.findOrBadRequestByEmailCode(code);

    if (user.emailConfirmation.isConfirmed) {
      throw BadRequestDomainException.create(
        'recovery code is incorrect, expired or already been applied',
        'code',
      );
    }
    if (user.emailConfirmation.expirationDate < new Date()) {
      throw BadRequestDomainException.create(
        'recovery code is incorrect, expired or already been applied',
        'code',
      );
    }
    user.confirmEmail();
    await this.usersRepository.save(user);
  }

  async resendEmail(emailDto: EmailDto) {
    const { email } = emailDto;
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw BadRequestDomainException.create(
        'user email doesnt exist',
        'email',
      );
    }

    if (user.emailConfirmation.isConfirmed) {
      throw BadRequestDomainException.create(
        'email already confirmed',
        'email',
      );
    }

    user.emailConfirmation.expirationDate = add(new Date(), { hours: 24 });
    user.emailConfirmation.code = uuidv4();

    this.mailService.sendCode(user.email, user.emailConfirmation.code);

    await this.usersRepository.save(user);
  }

  async recoveryPassword(emailDto: EmailDto) {
    const { email } = emailDto;
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return;

    user.recoveryPassword();

    this.mailService.sendRecoveryCode(user.email, user.passwordRecovery!.code);
    await this.usersRepository.save(user);
  }

  async changePassword(changePasswordDto: ChangePasswordDto) {
    const user = await this.usersRepository.findOrBadRequestByRecoveryCode(
      changePasswordDto.recoveryCode,
    );

    const password = await this.bcryptService.generateHash(
      changePasswordDto.newPassword,
    );

    user.changePassword(password);
    await this.usersRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOrNotFoundFail(id);

    user.makeDeleted();

    await this.usersRepository.save(user);
  }
}
