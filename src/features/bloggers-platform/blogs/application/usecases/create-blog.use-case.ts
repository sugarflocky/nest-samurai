import { CreateBlogDto } from '../../dto/create-blog.dto';
import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { BlogsRepository } from '../../infrastructure/blogs-repository';
import { CreateBlogInputDto } from '../../api/dto/input-dto/blog-input.dto';
import { v4 as uuidv4 } from 'uuid';

export class CreateBlogCommand {
  constructor(public readonly dto: CreateBlogInputDto) {}
}

@CommandHandler(CreateBlogCommand)
export class CreateBlogUseCase implements ICommandHandler<CreateBlogCommand> {
  constructor(private blogsRepository: BlogsRepository) {}

  async execute(command: CreateBlogCommand): Promise<string> {
    const dto = command.dto;

    const createDto: CreateBlogDto = {
      id: uuidv4(),
      name: dto.name,
      description: dto.description,
      websiteUrl: dto.websiteUrl,
      isMembership: false,
      createdAt: new Date(),
      deletedAt: null,
    };

    await this.blogsRepository.create(createDto);

    return createDto.id;
  }
}
