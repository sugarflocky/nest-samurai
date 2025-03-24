import { EmailDto } from '../../dto/email.dto';
import { UsersRepository } from '../../infrastructure/users.repository';
import { MailService } from '../mail.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

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
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return;

    user.recoveryPassword();

    this.mailService.sendRecoveryCode(user.email, user.passwordRecovery!.code);
    await this.usersRepository.save(user);
  }
}
