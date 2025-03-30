import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs-repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { v4 as uuidv4 } from 'uuid';
import { CreatePostDto } from '../../dto/create-post.dto';
import { CreatePostForBlogInputDto } from '../../api/dto/input-dto/create-post-for-blog-input.dto';

export class CreatePostCommand {
  constructor(
    public blogId: string,
    public dto: CreatePostForBlogInputDto,
  ) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: CreatePostCommand): Promise<string> {
    const { blogId, dto } = command;

    const blog = await this.blogsRepository.selectById(blogId);
    if (!blog) {
      throw NotFoundDomainException.create();
    }

    const createDto: CreatePostDto = {
      id: uuidv4(),
      title: dto.title,
      shortDescription: dto.shortDescription,
      content: dto.content,
      blogId: blogId,
      createdAt: new Date(),
      deletedAt: null,
    };

    await this.postsRepository.create(createDto);

    return createDto.id;
  }
}
