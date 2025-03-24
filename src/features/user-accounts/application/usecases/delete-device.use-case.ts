import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { SessionRepository } from '../../infrastructure/session.repository';

export class DeleteDeviceCommand {
  constructor(
    public userId: string,
    public deviceId: string,
  ) {}
}

@CommandHandler(DeleteDeviceCommand)
export class DeleteDeviceUseCase
  implements ICommandHandler<DeleteDeviceCommand>
{
  constructor(private sessionRepository: SessionRepository) {}

  async execute(command: DeleteDeviceCommand): Promise<void> {
    const { userId, deviceId } = command;

    await this.sessionRepository.deleteDevice(userId, deviceId);
  }
}
