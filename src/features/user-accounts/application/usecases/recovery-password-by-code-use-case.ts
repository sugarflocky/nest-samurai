import { ChangePasswordDto } from '../../dto/change-password.dto';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CryptoService } from '../crypto.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class RecoveryPasswordCommand {
  constructor(public dto: ChangePasswordDto) {}
}

@CommandHandler(RecoveryPasswordCommand)
export class RecoveryPasswordByCodeUseCase
  implements ICommandHandler<RecoveryPasswordCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private cryptoService: CryptoService,
  ) {}

  async execute(command: RecoveryPasswordCommand) {
    const dto = command.dto;

    const user = await this.usersRepository.findOrBadRequestByRecoveryCode(
      dto.recoveryCode,
    );

    const password = await this.cryptoService.generateHash(dto.newPassword);

    user.changePassword(password);
    await this.usersRepository.save(user);
  }
}
