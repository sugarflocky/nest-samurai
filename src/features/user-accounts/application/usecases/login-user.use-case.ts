import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { TokensPairDto } from '../../dto/tokensPairDto';
import { AuthService } from '../auth.service';
import { CreateSessionInServiceDto } from '../../dto/create-session.dto';

export class LoginUserCommand {
  constructor(public dto: CreateSessionInServiceDto) {}
}

@CommandHandler(LoginUserCommand)
export class LoginUserUseCase implements ICommandHandler<LoginUserCommand> {
  constructor(private authService: AuthService) {}

  async execute(command: LoginUserCommand): Promise<TokensPairDto> {
    const { ip, title, userId } = command.dto;

    const dto: CreateSessionInServiceDto = {
      ip: ip,
      title: title,
      userId: userId,
    };

    const tokens = await this.authService.createTokensPair(dto);
    return tokens;
  }
}
