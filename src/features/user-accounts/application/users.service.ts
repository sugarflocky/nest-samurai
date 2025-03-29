import { Injectable } from '@nestjs/common';
import { UsersRepository } from '../infrastructure/users.repository';
import {
  BadRequestDomainException,
  ErrorExtension,
} from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async testUnique(login: string, email: string) {
    const loginTest = await this.usersRepository.selectByLogin(login);
    const emailTest = await this.usersRepository.selectByEmail(email);
    if (emailTest || loginTest) {
      const errorsMessages: ErrorExtension[] = [];
      if (emailTest) {
        errorsMessages.push({
          message: 'user with same email already exists',
          field: 'email',
        });
      }
      if (loginTest) {
        errorsMessages.push({
          message: 'user with same login already exists',
          field: 'login',
        });
      }
      throw new BadRequestDomainException(errorsMessages);
    }
  }
}
