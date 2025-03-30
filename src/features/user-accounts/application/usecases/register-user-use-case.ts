import { RegisterUserDto } from '../../dto/register-user.dto';
import { UsersService } from '../users.service';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CryptoService } from '../crypto.service';
import { MailService } from '../mail.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateUserDto } from '../../dto/create-user.dto';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

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
  ) {}

  async execute(command: RegisterUserCommand): Promise<string> {
    const dto = command.dto;

    await this.usersService.testUnique(dto.login, dto.email);
    const passwordHash = await this.cryptoService.generateHash(dto.password);

    const createUserDto: CreateUserDto = {
      id: uuidv4(),
      login: dto.login,
      password: passwordHash,
      email: dto.email,
      createdAt: new Date(),
      deletedAt: null,
      code: uuidv4(),
      expirationDate: add(new Date(), { hours: 24 }),
      isConfirmed: false,
    };

    await this.usersRepository.create(createUserDto);

    this.mailService.sendCode(createUserDto.email, createUserDto.code!);
    return createUserDto.id;
  }
}
