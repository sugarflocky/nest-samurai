import { CreateUserDto } from '../../dto/create-user.dto';
import { CryptoService } from '../crypto.service';
import { User, UserModelType } from '../../domain/user.entity';
import { UsersService } from '../users.service';
import { UsersRepository } from '../../infrastructure/users.repository';
import { InjectModel } from '@nestjs/mongoose';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { CreateUserInputDto } from '../../api/dto/input-dto/user-input.dto';

export class CreateUserCommand {
  constructor(public dto: CreateUserInputDto) {}
}

@CommandHandler(CreateUserCommand)
export class CreateUserUseCase implements ICommandHandler<CreateUserCommand> {
  constructor(
    private cryptoService: CryptoService,
    private usersService: UsersService,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: CreateUserCommand): Promise<string> {
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
      code: null,
      expirationDate: null,
      isConfirmed: true,
    };

    await this.usersRepository.create(createUserDto);
    return createUserDto.id;
  }
}
