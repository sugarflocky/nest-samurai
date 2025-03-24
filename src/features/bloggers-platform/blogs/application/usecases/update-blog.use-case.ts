import { UpdateBlogDto } from '../../dto/update-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs-repository';

export class UpdateBlogCommand {
  constructor(
    public blogId: string,
    public dto: UpdateBlogDto,
  ) {}
}

@CommandHandler(UpdateBlogCommand)
export class UpdateBlogUseCase implements ICommandHandler<UpdateBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: UpdateBlogCommand): Promise<string> {
    const { blogId, dto } = command;

    const blog = await this.blogsRepository.findOrNotFoundFail(blogId);

    blog.update(dto);

    await this.blogsRepository.save(blog);

    return blog._id.toString();
  }
}
