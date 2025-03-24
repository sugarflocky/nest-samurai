import { Injectable } from '@nestjs/common';
import { EmailDto } from '../../dto/email.dto';
import { UsersRepository } from '../../infrastructure/users.repository';
import { MailService } from '../mail.service';

export class SendRecoverCodeCommand {
  constructor(public dto: EmailDto) {}
}

@Injectable()
export class SendRecoveryCodeUseCase {
  constructor(
    private usersRepository: UsersRepository,
    private mailService: MailService,
  ) {}

  async execute(command: SendRecoverCodeCommand) {
    const { email } = command.dto;
    const user = await this.usersRepository.findByEmail(email);
    if (!user) return;

    user.recoveryPassword();

    this.mailService.sendRecoveryCode(user.email, user.passwordRecovery!.code);
    await this.usersRepository.save(user);
  }
}
