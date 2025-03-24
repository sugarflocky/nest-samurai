import { UsersRepository } from '../../infrastructure/users.repository';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';

export class DeleteUserCommand {
  constructor(public userId: string) {}
}

@CommandHandler(DeleteUserCommand)
export class DeleteUserUseCase implements ICommandHandler<DeleteUserCommand> {
  constructor(private usersRepository: UsersRepository) {}

  async execute(command: DeleteUserCommand): Promise<void> {
    const userId = command.userId;

    const user = await this.usersRepository.findOrNotFoundFail(userId);

    user.makeDeleted();

    await this.usersRepository.save(user);
  }
}
