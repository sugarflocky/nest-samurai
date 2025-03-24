import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { CreateLikeDto } from '../../../likes/dto/create-like.dto';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { LikesService } from '../../../likes/application/likes.service';

export class LikePostCommand {
  constructor(public dto: CreateLikeDto) {}
}

@CommandHandler(LikePostCommand)
export class LikePostUseCase implements ICommandHandler<LikePostCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private likesService: LikesService,
  ) {}

  async execute(command: LikePostCommand) {
    const { dto } = command;

    const post = await this.postsRepository.findOrNotFoundFail(dto.parentId);
    await this.likesService.like(dto);

    const { likes, dislikes } = await this.likesService.countLikesAndDislikes(
      dto.parentId,
    );

    post.changeLikesCount(likes, dislikes);
    await this.postsRepository.save(post);
  }
}
