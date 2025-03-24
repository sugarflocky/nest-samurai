import { EmailDto } from '../../dto/email.dto';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';
import { add } from 'date-fns';
import { v4 as uuidv4 } from 'uuid';
import { UsersRepository } from '../../infrastructure/users.repository';
import { MailService } from '../mail.service';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class ResendEmailCommand {
  constructor(public dto: EmailDto) {}
}

@CommandHandler(ResendEmailCommand)
export class ResendEmailConfirmationCodeUseCase
  implements ICommandHandler<ResendEmailCommand>
{
  constructor(
    private usersRepository: UsersRepository,
    private mailService: MailService,
  ) {}

  async execute(command: ResendEmailCommand) {
    const { email } = command.dto;
    const user = await this.usersRepository.findByEmail(email);
    if (!user) {
      throw BadRequestDomainException.create(
        'user email doesnt exist',
        'email',
      );
    }

    if (user.emailConfirmation.isConfirmed) {
      throw BadRequestDomainException.create(
        'email already confirmed',
        'email',
      );
    }

    user.emailConfirmation.expirationDate = add(new Date(), { hours: 24 });
    user.emailConfirmation.code = uuidv4();

    this.mailService.sendCode(user.email, user.emailConfirmation.code);

    await this.usersRepository.save(user);
  }
}
