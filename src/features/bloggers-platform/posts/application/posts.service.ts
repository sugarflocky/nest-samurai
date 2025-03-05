import { Injectable, NotFoundException } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../domain/post.entity';
import { BlogsRepository } from '../../blogs/infrastructure/blogs-repository';
import {
  CreatePostInputDto,
  UpdatePostInputDto,
} from '../api/dto/input-dto/post-input.dto';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    private readonly postsRepository: PostsRepository,
    private readonly blogsRepository: BlogsRepository,
  ) {}

  async createPost(dto: CreatePostInputDto): Promise<string> {
    const blog = await this.blogsRepository.findById(dto.blogId.toString());
    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    const post = this.PostModel.createInstance({
      ...dto,
      blogName: blog.name,
    });

    await this.postsRepository.save(post);
    return post._id.toString();
  }

  async updatePost(id: string, dto: UpdatePostInputDto): Promise<string> {
    const blog = await this.blogsRepository.findById(dto.blogId.toString());
    if (!blog) {
      throw new NotFoundException('blog not found');
    }

    const post = await this.postsRepository.findOrNotFoundFail(id);

    post.update({
      ...dto,
      blogName: blog.name,
    });
    await this.postsRepository.save(post);

    return post._id.toString();
  }

  async deletePost(id: string) {
    const post = await this.postsRepository.findOrNotFoundFail(id);

    post.makeDeleted();

    await this.postsRepository.save(post);
  }
}
