import { UpdateCommentInServiceDto } from '../../dto/update-comment.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ForbiddenDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { UsersRepository } from '../../../../user-accounts/infrastructure/users.repository';

export class UpdateCommentCommand {
  constructor(
    public id: string,
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

  async execute(command: UpdateCommentCommand): Promise<void> {
    const { id, dto } = command;

    const comment = await this.commentsRepository.selectOrNotFoundFail(id);
    await this.usersRepository.selectOrNotFoundFail(dto.userId);

    if (dto.userId !== comment.userId) {
      throw ForbiddenDomainException.create();
    }

    await this.commentsRepository.update(id, dto.content);
  }
}
