import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';

export class DeletePostCommand {
  constructor(public postId: string) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(private postsRepository: PostsRepository) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const { postId } = command;

    const post = await this.postsRepository.findOrNotFoundFail(postId);

    post.makeDeleted();

    await this.postsRepository.save(post);
  }
}
