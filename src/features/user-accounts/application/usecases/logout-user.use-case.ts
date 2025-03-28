import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';

export class LogoutUserCommand {
  constructor(
    public deviceId: string,
    public userId: string,
  ) {}
}

@CommandHandler(LogoutUserCommand)
export class LogoutUserUseCase implements ICommandHandler<LogoutUserCommand> {
  constructor(private sessionRepository: SessionRepository) {}

  async execute(command: LogoutUserCommand): Promise<void> {
    const { deviceId, userId } = command;
    await this.sessionRepository.delete(deviceId, userId);
  }
}
