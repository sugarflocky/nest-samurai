import { Injectable } from '@nestjs/common';
import { BlogRepository } from './blog.repository';
import { BlogCreateDto, BlogUpdateDto } from './blog.types';
import { BlogDocument } from './blog.schemas';

@Injectable()
export class BlogService {
  constructor(private readonly blogRepository: BlogRepository) {}

  async createBlog(createDto: BlogCreateDto): Promise<BlogDocument | null> {
    const createdBlog = await this.blogRepository.createBlog(createDto);
    return createdBlog;
  }

  async updateBlog(
    id: string,
    updateDto: BlogUpdateDto,
  ): Promise<BlogDocument | null> {
    const updatedBlog = await this.blogRepository.updateBlog(id, updateDto);
    return updatedBlog;
  }

  async deleteBlog(id: string): Promise<BlogDocument | null> {
    const result = await this.blogRepository.deleteBlog(id);
    return result;
  }
}
