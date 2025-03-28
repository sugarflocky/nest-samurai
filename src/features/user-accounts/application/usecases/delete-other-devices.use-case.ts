import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';

export class DeleteOtherDevicesCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteOtherDevicesCommand)
export class DeleteOtherDevicesUseCase
  implements ICommandHandler<DeleteOtherDevicesCommand>
{
  constructor(private sessionRepository: SessionRepository) {}

  async execute(command: DeleteOtherDevicesCommand): Promise<void> {
    const { userId, deviceId } = command;
    await this.sessionRepository.deleteOtherDevices(deviceId, userId);
  }
}
