/*
import { AuthService } from '../auth.service';
import { TokensPairDto } from '../../dto/tokensPairDto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class AuthUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(AuthUserCommand)
export class AuthUserUseCase implements ICommandHandler<AuthUserCommand> {
  constructor(private authService: AuthService) {}

  async execute(command: AuthUserCommand): Promise<TokensPairDto> {
    const userId = command.userId;

    const tokens: TokensPairDto =
      await this.authService.createTokensPair(userId);

    return tokens;
  }
}
*/
