import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UnauthorizedDomainException } from '../../../core/exceptions/domain-exceptions';

@Injectable()
export class CryptoService {
  async generateHash(password: string): Promise<string> {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  }

  async compareHash(password: string, hash: string): Promise<void> {
    const result = await bcrypt.compare(password, hash);
    if (!result) {
      throw UnauthorizedDomainException.create();
    }
  }
}
