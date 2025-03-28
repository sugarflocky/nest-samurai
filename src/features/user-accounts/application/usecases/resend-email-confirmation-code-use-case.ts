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
    const codeData = await this.usersRepository.selectByEmailJoinCode(email);
    if (!codeData) {
      throw BadRequestDomainException.create(
        'user email doesnt exist',
        'email',
      );
    }

    if (codeData.isConfirmed) {
      throw BadRequestDomainException.create(
        'email already confirmed',
        'email',
      );
    }

    const resendCodeDto = {
      userId: codeData.userId,
      code: uuidv4(),
      expirationDate: add(new Date(), { hours: 24 }),
    };

    await this.usersRepository.resendCode(resendCodeDto);

    const result = this.mailService.sendCode(email, resendCodeDto.code);
  }
}
