import { CreateBlogDto } from '../../dto/create-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs-repository';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../../domain/blog.entity';

export class CreateBlogCommand {
  constructor(public readonly dto: CreateBlogDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
  ) {}

  async execute(command: CreateBlogCommand): Promise<string> {
    const dto = command.dto;

    const blog = this.BlogModel.createInstance({
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
    });

    await this.blogsRepository.save(blog);
    return blog._id.toString();
  }
}
