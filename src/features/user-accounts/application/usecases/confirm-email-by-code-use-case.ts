import { Injectable } from '@nestjs/common';
import { CodeDto } from '../../dto/code.dto';
import { BadRequestDomainException } from '../../../../core/exceptions/domain-exceptions';
import { UsersRepository } from '../../infrastructure/users.repository';

export class ConfirmEmailCommand {
  constructor(public dto: CodeDto) {}
}

@Injectable()
export class ConfirmEmailUseCase {
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: ConfirmEmailCommand) {
    const { code } = command.dto;
    const user = await this.usersRepository.findOrBadRequestByEmailCode(code);

    if (user.emailConfirmation.isConfirmed) {
      throw BadRequestDomainException.create(
        'recovery code is incorrect, expired or already been applied',
        'code',
      );
    }
    if (user.emailConfirmation.expirationDate < new Date()) {
      throw BadRequestDomainException.create(
        'recovery code is incorrect, expired or already been applied',
        'code',
      );
    }
    user.confirmEmail();
    await this.usersRepository.save(user);
  }
}
