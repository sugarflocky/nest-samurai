import { EmailDto } from '../../dto/email.dto';
import { UsersRepository } from '../../infrastructure/users.repository';
import { MailService } from '../mail.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { add } from 'date-fns';

export class SendRecoveryCodeCommand {
  constructor(public dto: EmailDto) {}
}

@CommandHandler(SendRecoveryCodeCommand)
export class SendRecoveryCodeUseCase
  implements ICommandHandler<SendRecoveryCodeCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private mailService: MailService,
  ) {}

  async execute(command: SendRecoveryCodeCommand) {
    const { email } = command.dto;
    const user = await this.usersRepository.selectByEmail(email);
    if (!user) return;

    const recoveryDto = {
      userId: user.id,
      code: uuidv4(),
      expirationDate: add(new Date(), { minutes: 30 }),
    };

    await this.usersRepository.updateRecoveryCode(recoveryDto);

    this.mailService.sendRecoveryCode(user.email, recoveryDto.code);
  }
}
