import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs-repository';
import { UpdatePostInputDto } from '../../api/dto/input-dto/update-post-input.dto';
import { UpdatePostDto } from '../../dto/update-post.dto';

export class UpdatePostCommand {
  constructor(
    public blogId: string,
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

  async execute(command: UpdatePostCommand): Promise<void> {
    const { blogId, postId, dto } = command;

    const blog = await this.blogsRepository.selectOrNotFoundFail(blogId);

    const updateDto: UpdatePostDto = {
      ...dto,
    };

    await this.postsRepository.update(blogId, postId, updateDto);
  }
}
