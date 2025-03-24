import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { Types } from 'mongoose';
import {
  BadRequestDomainException,
  NotFoundDomainException,
} from '../../../../../core/exceptions/domain-exceptions';
import { BlogsRepository } from '../../../blogs/infrastructure/blogs-repository';
import { PostsRepository } from '../../infrastructure/posts.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../../domain/post.entity';
import { CreatePostInputDto } from '../../api/dto/input-dto/post-input.dto';

export class CreatePostCommand {
  constructor(public dto: CreatePostInputDto) {}
}

@CommandHandler(CreatePostCommand)
export class CreatePostUseCase implements ICommandHandler<CreatePostCommand> {
  constructor(
    private blogsRepository: BlogsRepository,
    private postsRepository: PostsRepository,
    @InjectModel(Post.name) private PostModel: PostModelType,
  ) {}

  async execute(command: CreatePostCommand): Promise<string> {
    const { dto } = command;

    if (!Types.ObjectId.isValid(dto.blogId)) {
      throw BadRequestDomainException.create('incorrect blogId', 'blogId');
    }

    const blog = await this.blogsRepository.findById(dto.blogId.toString());
    if (!blog) {
      throw NotFoundDomainException.create();
    }

    const post = this.PostModel.createInstance({
      ...dto,
      blogName: blog.name,
    });

    await this.postsRepository.save(post);
    return post._id.toString();
  }
}
