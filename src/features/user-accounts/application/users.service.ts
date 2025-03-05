import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../domain/user.entity';
import { CreateUserDto } from '../dto/create-user.dto';
import { UsersRepository } from '../infrastructure/users.repository';
import { BcryptService } from './bcrypt.service';
import { AuthService } from './auth.service';
import { MailService } from './mail.service';
import { v4 as uuidv4 } from 'uuid';
import { CodeInputDto } from '../api/dto/input-dto/code-input.dto';
import { EmailInputDto } from '../api/dto/input-dto/email-input.dto';
import { add } from 'date-fns';

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
      const errorsMessages: { message: string; field: string }[] = [];
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
      throw new BadRequestException(errorsMessages);
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

  async confirmEmail(codeDto: CodeInputDto) {
    const { code } = codeDto;
    const user = await this.usersRepository.findOrBadRequestByCode(code);

    if (user.emailConfirmation.isConfirmed)
      throw new BadRequestException([
        {
          message:
            'confirmation code is incorrect, expired or already been applied',
          field: 'code',
        },
      ]);
    if (user.emailConfirmation.expirationDate < new Date())
      throw new BadRequestException([
        {
          message:
            'confirmation code is incorrect, expired or already been applied',
          field: 'code',
        },
      ]);
    user.confirmEmail();
    await this.usersRepository.save(user);
  }

  async resendEmail(emailDto: EmailInputDto) {
    const { email } = emailDto;
    const user = await this.usersRepository.findByEmail(email);
    if (!user)
      throw new BadRequestException([
        {
          message: 'user email doesnt exist',
          field: 'email',
        },
      ]);
    if (user.emailConfirmation.isConfirmed) {
      throw new BadRequestException([
        {
          message: 'email already confirmed',
          field: 'email',
        },
      ]);
    }

    user.emailConfirmation.expirationDate = add(new Date(), { hours: 24 });
    user.emailConfirmation.code = uuidv4();

    this.mailService.sendCode(user.email, user.emailConfirmation.code);

    await this.usersRepository.save(user);
  }

  async deleteUser(id: string) {
    const user = await this.usersRepository.findOrNotFoundFail(id);

    user.makeDeleted();

    await this.usersRepository.save(user);
  }
}
