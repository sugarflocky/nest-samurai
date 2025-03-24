import { CreateUserDto } from '../../dto/create-user.dto';
import { CryptoService } from '../crypto.service';
import { User, UserModelType } from '../../domain/user.entity';
import { UsersService } from '../users.service';
import { UsersRepository } from '../../infrastructure/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class CreateUserCommand {
  constructor(public dto: CreateUserDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private cryptoService: CryptoService,
    private usersService: UsersService,
    private usersRepository: UsersRepository,
    @InjectModel(User.name) private UserModel: UserModelType,
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
    const dto = command.dto;

    await this.usersService.testUnique(dto.login, dto.email);

    const passwordHash = await this.cryptoService.generateHash(dto.password);

    const user = this.UserModel.createInstance({
      email: dto.email,
      login: dto.login,
      password: passwordHash,
    });

    user.confirmEmail();
    await this.usersRepository.save(user);
    return user._id.toString();
  }
}
