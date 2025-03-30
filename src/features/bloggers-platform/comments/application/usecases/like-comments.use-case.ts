import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLikeDto } from '../../../likes/dto/create-like.dto';
import { CommentsRepository } from '../../infrastructure/comments.repository';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { v4 as uuidv4 } from 'uuid';
import { LikeCommentInputDto } from '../../api/dto/input-dto/like-comment-input.dto';
import { CreateLikeInServiceDto } from '../../../likes/dto/create-like-in-service.dto';

export class LikeCommentCommand {
  constructor(public dto: CreateLikeInServiceDto) {}
}

@CommandHandler(LikeCommentCommand)
export class LikeCommentUseCase implements ICommandHandler<LikeCommentCommand> {
  constructor(
    private commentsRepository: CommentsRepository,
    private likesRepository: LikesRepository,
  ) {}

  async execute(command: LikeCommentCommand): Promise<void> {
    const { dto } = command;

    await this.commentsRepository.selectOrNotFoundFail(dto.parentId);

    const like = await this.likesRepository.selectById(
      dto.parentId,
      dto.userId,
    );

    if (!like) {
      const creationDate = new Date();

      const createDto: CreateLikeDto = {
        id: uuidv4(),
        status: dto.status,
        parentId: dto.parentId,
        userId: dto.userId,
        createdAt: creationDate,
        updatedAt: creationDate,
      };

      await this.likesRepository.create(createDto);
    } else {
      if (like.status != dto.status) {
        await this.likesRepository.update(like.id, dto.status);
      }
    }
  }
}
