import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLikeDto } from '../../../likes/dto/create-like.dto';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { LikesService } from '../../../likes/application/likes.service';

export class LikeCommentCommand {
  constructor(public dto: CreateLikeDto) {}
}

@CommandHandler(LikeCommentCommand)
export class LikeCommentsCommand
  implements ICommandHandler<LikeCommentCommand>
{
  constructor(
    private commentsRepository: CommentsRepository,
    private likesService: LikesService,
  ) {}

  async execute(command: LikeCommentCommand): Promise<void> {
    const { dto } = command;

    const comment = await this.commentsRepository.findOrNotFoundFail(
      dto.parentId,
    );

    await this.likesService.like(dto);
    const { likes, dislikes } = await this.likesService.countLikesAndDislikes(
      dto.parentId,
    );

    comment.changeLikesCount(likes, dislikes);
    await this.commentsRepository.save(comment);
  }
}
