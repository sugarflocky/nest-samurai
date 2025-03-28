import { CodeDto } from '../../dto/code.dto';
import { UsersRepository } from '../../infrastructure/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';

export class ConfirmEmailCommand {
  constructor(public dto: CodeDto) {}
}

@CommandHandler(ConfirmEmailCommand)
export class ConfirmEmailUseCase
  implements ICommandHandler<ConfirmEmailCommand>
{
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: ConfirmEmailCommand) {
    const { code } = command.dto;
    const codeData = await this.usersRepository.selectByEmailCode(code);
    if (!codeData) {
      throw BadRequestDomainException.create(
        'confirmation code is incorrect, expired or already been applied',
        'code',
      );
    }
    if (codeData.expirationDate < new Date()) {
      throw BadRequestDomainException.create(
        'confirmation code is incorrect, expired or already been applied',
        'code',
      );
    }
    if (codeData.isConfirmed === true) {
      throw BadRequestDomainException.create(
        'confirmation code is incorrect, expired or already been applied',
        'code',
      );
    }

    await this.usersRepository.confirmEmail(codeData.userId);
  }
}
