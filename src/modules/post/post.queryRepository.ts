import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Post, PostDocument } from './post.schemas';
import { Model, Types } from 'mongoose';
import { Pagination } from '../../common/common.types';
import { postMapper, PostSortData, PostViewModel } from './post.types';
import { BlogRepository } from '../blog/blog.repository';

@Injectable()
export class PostQueryRepository {
  constructor(
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
    private blogRepository: BlogRepository,
  ) {}

  async getPosts(
    sortData: PostSortData,
  ): Promise<Pagination<PostViewModel> | null> {
    try {
      const { sortDirection, sortBy, pageSize, pageNumber } = sortData;
      const filter = {};

      const posts = await this.PostModel.find(filter)
        .sort([[sortBy, sortDirection]])
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();

      const totalCount = await this.PostModel.countDocuments(filter);
      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
        pageSize,
        page: pageNumber,
        pagesCount,
        totalCount,
        items: posts.map(postMapper),
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getPostsForBlog(
    blogId: string,
    sortData: PostSortData,
  ): Promise<Pagination<PostViewModel> | null> {
    try {
      const { sortDirection, sortBy, pageSize, pageNumber } = sortData;
      const blog = await this.blogRepository.getBlog(blogId);
      if (!blog) return null;
      if (blogId.length !== 24) return null;

      const posts = await this.PostModel.find({
        blogId: new Types.ObjectId(blogId),
      })
        .sort([[sortBy, sortDirection]])
        .skip((pageNumber - 1) * pageSize)
        .limit(pageSize)
        .lean();

      const totalCount = await this.PostModel.countDocuments({
        blogId: new Types.ObjectId(blogId),
      });
      const pagesCount = Math.ceil(totalCount / pageSize);

      return {
        pageSize,
        page: pageNumber,
        pagesCount,
        totalCount,
        items: posts.map(postMapper),
      };
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  async getPost(id: string): Promise<PostViewModel | null> {
    try {
      if (id.length !== 24) return null;
      const post = await this.PostModel.findById(id);
      if (!post) return null;
      return postMapper(post);
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
