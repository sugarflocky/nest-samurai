import { UpdateCommentInServiceDto } from '../../dto/update-comment.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { UsersRepository } from '../../../../user-accounts/infrastructure/users.repository';

export class UpdateCommentCommand {
  constructor(
    public commentId: string,
    public dto: UpdateCommentInServiceDto,
  ) {}
}

@CommandHandler(UpdateCommentCommand)
export class UpdateCommentUseCase
  implements ICommandHandler<UpdateCommentCommand>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private usersRepository: UsersRepository,
  ) {}

  async execute(command: UpdateCommentCommand): Promise<string> {
    const { commentId, dto } = command;

    const comment = await this.commentsRepository.findOrNotFoundFail(commentId);
    await this.usersRepository.selectOrNotFoundFail(dto.userId);

    if (dto.userId !== comment.commentatorInfo.userId.toString()) {
      throw ForbiddenDomainException.create();
    }

    comment.update(dto.content);
    await this.commentsRepository.save(comment);
    return comment._id.toString();
  }
}
