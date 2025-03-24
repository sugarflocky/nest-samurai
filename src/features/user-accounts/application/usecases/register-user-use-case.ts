import { RegisterUserDto } from '../../dto/register-user.dto';
import { UsersService } from '../users.service';
import { UsersRepository } from '../../infrastructure/users.repository';
import { User, UserModelType } from '../../domain/user.entity';
import { CryptoService } from '../crypto.service';
import { MailService } from '../mail.service';
import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class RegisterUserCommand {
  constructor(public dto: RegisterUserDto) {}
}

@CommandHandler(RegisterUserCommand)
export class RegisterUserUseCase
  implements ICommandHandler<RegisterUserCommand>
{
  constructor(
    private usersService: UsersService,
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
    private mailService: MailService,
    @InjectModel(User.name) private UserModel: UserModelType,
  ) {}

  async execute(command: RegisterUserCommand): Promise<string> {
    const dto = command.dto;

    await this.usersService.testUnique(dto.login, dto.email);
    const passwordHash = await this.cryptoService.generateHash(dto.password);

    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      password: passwordHash,
    });

    await this.usersRepository.save(user);

    this.mailService.sendCode(user.email, user.emailConfirmation.code);
    return user._id.toString();
  }
}
