import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs-repository';

export class DeletePostCommand {
  constructor(
    public blogId: string,
    public postId: string,
  ) {}
}

@CommandHandler(DeletePostCommand)
export class DeletePostUseCase implements ICommandHandler<DeletePostCommand> {
  constructor(
    private postsRepository: PostsRepository,
    private blogsRepository: BlogsRepository,
  ) {}

  async execute(command: DeletePostCommand): Promise<void> {
    const { blogId, postId } = command;
    await this.blogsRepository.selectOrNotFoundFail(blogId);
    await this.postsRepository.delete(blogId, postId);
  }
}
