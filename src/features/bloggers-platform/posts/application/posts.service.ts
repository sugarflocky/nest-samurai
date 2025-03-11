import { Injectable } from '@nestjs/common';
import { PostsRepository } from '../infrastructure/posts.repository';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostModelType } from '../domain/post.entity';
import { BlogsRepository } from '../../blogs/infrastructure/blogs-repository';
import { CreatePostInputDto } from '../api/dto/input-dto/post-input.dto';
import { CreateLikeDto } from '../../likes/dto/create-like.dto';
import { LikesService } from '../../likes/application/likes.service';
import { Types } from 'mongoose';
import { UpdatePostInputDto } from '../api/dto/input-dto/update-post-input.dto';
import {
  BadRequestDomainException,
  NotFoundDomainException,
} from '../../../../core/exceptions/domain-exceptions';

@Injectable()
export class PostsService {
  constructor(
    @InjectModel(Post.name) private PostModel: PostModelType,
    private readonly postsRepository: PostsRepository,
    private readonly blogsRepository: BlogsRepository,
    private readonly likesService: LikesService,
  ) {}

  async createPost(dto: CreatePostInputDto): Promise<string> {
    if (!Types.ObjectId.isValid(dto.blogId)) {
      throw BadRequestDomainException.create('incorrect blogId', 'blogId');
    }

    const blog = await this.blogsRepository.findById(dto.blogId.toString());
    if (!blog) {
      throw NotFoundDomainException.create('blog not found');
    }

    const post = this.PostModel.createInstance({
      ...dto,
      blogName: blog.name,
    });

    await this.postsRepository.save(post);
    return post._id.toString();
  }

  async updatePost(id: string, dto: UpdatePostInputDto): Promise<string> {
    if (!Types.ObjectId.isValid(dto.blogId)) {
      throw BadRequestDomainException.create('incorrect blogId', 'blogId');
    }

    const blog = await this.blogsRepository.findById(dto.blogId);
    if (!blog) {
      throw NotFoundDomainException.create('blog not found');
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

  async likePost(dto: CreateLikeDto) {
    const post = await this.postsRepository.findOrNotFoundFail(dto.parentId);
    await this.likesService.like(dto);

    const { likes, dislikes } = await this.likesService.countLikesAndDislikes(
      dto.parentId,
    );

    post.changeLikesCount(likes, dislikes);
    await this.postsRepository.save(post);
  }
}
