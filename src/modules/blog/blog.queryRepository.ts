import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from './blog.schemas';
import { Model } from 'mongoose';
import { Pagination } from '../../common/common.types';
import { blogMapper, BlogSortData, BlogViewModel } from './blog.types';

@Injectable()
export class BlogQueryRepository {
  constructor(@InjectModel(Blog.name) private BlogModel: Model<BlogDocument>) {}

  async getBlogs(
    sortData: BlogSortData,
  ): Promise<Pagination<BlogViewModel> | null> {
    try {
      const { sortDirection, sortBy, pageSize, pageNumber, searchNameTerm } =
        sortData;
      let filter = {};

      if (searchNameTerm) {
        filter = {
          name: {
            $regex: searchNameTerm,
            $options: 'i',
          },
        };
      }

      const blogs = await this.BlogModel.find(filter)
        .sort([[sortBy, sortDirection]])
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();

      const totalCount = await this.BlogModel.countDocuments(filter);
      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
        pageSize,
        page: pageNumber,
        pagesCount,
        totalCount,
        items: blogs.map(blogMapper),
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getBlog(id: string): Promise<BlogViewModel | null> {
    try {
      if (id.length !== 24) return null;
      const blog = await this.BlogModel.findById(id);
      if (!blog) return null;
      return blogMapper(blog);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
