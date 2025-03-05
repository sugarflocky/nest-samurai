import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blog.schemas';
import { Model } from 'mongoose';
import { BlogCreateDto, BlogUpdateDto } from './blog.types';

@Injectable()
export class BlogRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}

  async createBlog(createDto: BlogCreateDto): Promise<BlogDocument | null> {
    try {
      const createdBlog = await this.BlogModel.create(createDto);
      return createdBlog;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getBlog(id: string): Promise<BlogDocument | null> {
    try {
      if (id.length !== 24) return null;
      const blog = await this.BlogModel.findById(id);
      return blog;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async updateBlog(
    id: string,
    updateDto: BlogUpdateDto,
  ): Promise<BlogDocument | null> {
    try {
      if (id.length !== 24) return null;
      const updatedBlog = await this.BlogModel.findByIdAndUpdate(id, updateDto);
      return updatedBlog;
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async deleteBlog(id: string): Promise<BlogDocument | null> {
    try {
      if (id.length !== 24) return null;
      const result = await this.BlogModel.findByIdAndDelete(id);
      return result;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
