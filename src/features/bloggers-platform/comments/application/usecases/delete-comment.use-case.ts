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

    const comment = await this.commentsRepository.findOrNotFoundFail(commentId);

    if (userId !== comment.commentatorInfo.userId.toString()) {
      throw ForbiddenDomainException.create();
    }

    comment.makeDeleted();

    await this.commentsRepository.save(comment);
  }
}
