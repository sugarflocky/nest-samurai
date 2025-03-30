import { CreateCommentInServiceDto } from '../../dto/create-comment.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { UsersRepository } from '../../../../user-accounts/infrastructure/users.repository';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { v4 as uuidv4 } from 'uuid';

export class CreateCommentCommand {
  constructor(public dto: CreateCommentInServiceDto) {}
}

@CommandHandler(CreateCommentCommand)
export class CreateCommentUseCase
  implements ICommandHandler<CreateCommentCommand>
{
  constructor(
    private postsRepository: PostsRepository,
    private usersRepository: UsersRepository,
    private commentsRepository: CommentsRepository,
  ) {}

  async execute(command: CreateCommentCommand): Promise<string> {
    const { dto } = command;

    await this.postsRepository.selectOrNotFoundFail(dto.postId);
    await this.usersRepository.selectOrNotFoundFail(dto.userId);

    const createDto = {
      id: uuidv4(),
      content: dto.content,
      postId: dto.postId,
      userId: dto.userId,
      createdAt: new Date(),
      deletedAt: null,
    };

    await this.commentsRepository.create(createDto);

    return createDto.id;
  }
}
