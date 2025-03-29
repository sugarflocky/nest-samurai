import { UpdateBlogDto } from '../../dto/update-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs-repository';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';

export class UpdateBlogCommand {
  constructor(
    public blogId: string,
    public dto: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: UpdateBlogCommand): Promise<void> {
    const { blogId, dto } = command;
    await this.blogsRepository.update(blogId, dto);
  }
}
