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

    const password = await this.cryptoService.generateHash(dto.newPassword);

    const userId = await this.usersRepository.selectByRecoveryCodeOrBadRequest(
      dto.recoveryCode,
    );

    const recoveryDto = {
      userId: userId,
      password: password,
      recoveryCode: dto.recoveryCode,
    };

    await this.usersRepository.useRecoveryCode(recoveryDto);
  }
}
