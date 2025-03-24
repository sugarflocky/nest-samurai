import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogModelType } from '../domain/blog.entity';
import { Types } from 'mongoose';

@Injectable()
export class BlogsService {
  constructor(@InjectModel(Blog.name) private BlogModel: BlogModelType) {}

  async exists(blogId: string): Promise<boolean> {
    if (!Types.ObjectId.isValid(blogId)) {
      return false;
    }
    const blog = await this.BlogModel.findById(blogId);
    return !!blog;
  }
}
