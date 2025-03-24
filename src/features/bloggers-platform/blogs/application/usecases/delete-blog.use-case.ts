import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs-repository';

export class DeleteBlogCommand {
  constructor(public blogId: string) {}
}

@CommandHandler(DeleteBlogCommand)
export class DeleteBlogUseCase implements ICommandHandler<DeleteBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: DeleteBlogCommand): Promise<void> {
    const { blogId } = command;
    const blog = await this.blogsRepository.findOrNotFoundFail(blogId);

    blog.makeDeleted();

    await this.blogsRepository.save(blog);
  }
}
