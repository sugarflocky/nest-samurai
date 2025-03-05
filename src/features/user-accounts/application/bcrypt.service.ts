import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class BcryptService {
  async generateHash(password: string): Promise<string> {
    const passwordHash = await bcrypt.hash(password, 10);
    return passwordHash;
  }

  async compareHash(password: string, hash: string): Promise<boolean> {
    const result = await bcrypt.compare(password, hash);
    return result;
  }
}
