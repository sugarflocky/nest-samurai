import { Injectable } from '@nestjs/common';
import { BlogsRepository } from '../infrastructure/blogs-repository';

@Injectable()
export class BlogsService {
  constructor(private blogsRepository: BlogsRepository) {}

  async exists(blogId: string): Promise<boolean> {
    const blog = await this.blogsRepository.selectById(blogId);
    return !!blog;
  }
}
