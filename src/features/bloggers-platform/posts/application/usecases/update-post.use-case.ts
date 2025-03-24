import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { NotFoundDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs-repository';
import { UpdatePostInputDto } from '../../api/dto/input-dto/update-post-input.dto';

export class UpdatePostCommand {
  constructor(
    public postId: string,
    public dto: UpdatePostInputDto,
  ) {}
}

@CommandHandler(UpdatePostCommand)
export class UpdatePostUseCase implements ICommandHandler<UpdatePostCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
  ) {}

  async execute(command: UpdatePostCommand): Promise<string> {
    const { postId, dto } = command;

    const blog = await this.blogsRepository.findById(dto.blogId);
    if (!blog) {
      throw NotFoundDomainException.create();
    }

    const post = await this.postsRepository.findOrNotFoundFail(postId);

    post.update({
      ...dto,
      blogName: blog.name,
    });
    await this.postsRepository.save(post);

    return post._id.toString();
  }
}
