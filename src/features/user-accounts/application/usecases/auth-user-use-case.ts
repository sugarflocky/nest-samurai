import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth.service';
import { TokensPairDto } from '../../dto/tokensPairDto';

export class AuthUserCommand {
  constructor(public userId: string) {}
}

@Injectable()
export class AuthUserUseCase {
  constructor(private authService: AuthService) {}

  async execute(command: AuthUserCommand): Promise<TokensPairDto> {
    const userId = command.userId;

    const tokens: TokensPairDto =
      await this.authService.createTokensPair(userId);

    return tokens;
  }
}
