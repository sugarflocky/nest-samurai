import { CreateCommentInServiceDto } from '../../dto/create-comment.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { UsersRepository } from '../../../../user-accounts/infrastructure/users.repository';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Comment, CommentModelType } from '../../domain/comment.entity';

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
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
  ) {}

  async execute(command: CreateCommentCommand): Promise<string> {
    const { dto } = command;

    await this.postsRepository.findOrNotFoundFail(dto.postId);
    const user = await this.usersRepository.selectOrNotFoundFail(dto.userId);

    const comment = this.CommentModel.createInstance({
      content: dto.content,
      postId: dto.postId,
      userId: dto.userId,
      userLogin: user.login,
    });

    await this.commentsRepository.save(comment);
    return comment._id.toString();
  }
}
