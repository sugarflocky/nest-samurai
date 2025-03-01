import { Injectable } from '@nestjs/common';
import { PostRepository } from './post.repository';
import {
  PostCreateDto,
  postMapper,
  PostUpdateDto,
  PostViewModel,
} from './post.types';
import { BlogRepository } from '../blog/blog.repository';

@Injectable()
export class PostService {
  constructor(
    private readonly postRepository: PostRepository,
    private readonly blogRepository: BlogRepository,
  ) {}

  async createPost(createDto: PostCreateDto): Promise<PostViewModel | null> {
    const blog = await this.blogRepository.getBlog(createDto.blogId.toString());
    if (!blog) return null;
    if (createDto.blogName) return null;
    createDto.blogName = blog.name;

    const createdPost = await this.postRepository.createPost(createDto);
    if (!createdPost) return null;
    return postMapper(createdPost);
  }

  async updatePost(id: string, updateDto: PostUpdateDto): Promise<true | null> {
    const blog = await this.blogRepository.getBlog(updateDto.blogId.toString());
    if (!blog) return null;
    if (updateDto.blogName) return null;
    updateDto.blogName = blog.name;

    const updatedPost = await this.postRepository.updatePost(id, updateDto);
    if (!updatedPost) return null;
    return true;
  }

  async deletePost(id: string): Promise<true | null> {
    const result = await this.postRepository.deletePost(id);
    if (!result) return null;
    return true;
  }
}
