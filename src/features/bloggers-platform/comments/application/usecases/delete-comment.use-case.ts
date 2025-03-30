import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { UsersRepository } from '../../../../user-accounts/infrastructure/users.repository';

export class DeleteCommentCommand {
  constructor(
    public commentId: string,
    public userId: string,
  ) {}
}

@CommandHandler(DeleteCommentCommand)
export class DeleteCommentUseCase
  implements ICommandHandler<DeleteCommentCommand>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: DeleteCommentCommand): Promise<void> {
    const { commentId, userId } = command;

    await this.usersRepository.selectOrNotFoundFail(userId);

    const comment =
      await this.commentsRepository.selectOrNotFoundFail(commentId);

    if (userId !== comment.userId) {
      throw ForbiddenDomainException.create();
    }

    await this.commentsRepository.delete(commentId);
  }
}
