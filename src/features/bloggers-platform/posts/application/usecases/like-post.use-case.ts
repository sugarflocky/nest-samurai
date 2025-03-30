import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { v4 as uuidv4 } from 'uuid';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { LikesRepository } from '../../../likes/infrastructure/likes.repository';
import { CreateLikeInServiceDto } from '../../../likes/dto/create-like-in-service.dto';
import { CreateLikeDto } from '../../../likes/dto/create-like.dto';

export class LikePostCommand {
  constructor(public dto: CreateLikeInServiceDto) {}
}

@CommandHandler(LikePostCommand)
export class LikePostUseCase implements ICommandHandler<LikePostCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private likesRepository: LikesRepository,
  ) {}

  async execute(command: LikePostCommand) {
    const { dto } = command;

    await this.postsRepository.selectOrNotFoundFail(dto.parentId);

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
