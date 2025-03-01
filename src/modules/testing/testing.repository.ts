import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Blog, BlogDocument } from '../blog/blog.schemas';
import { Model } from 'mongoose';
import { Post, PostDocument } from '../post/post.schemas';

@Injectable()
export class TestingRepository {
  constructor(
    @InjectModel(Blog.name) private BlogModel: Model<BlogDocument>,
    @InjectModel(Post.name) private PostModel: Model<PostDocument>,
  ) {}

  async deleteAllData() {
    try {
      await this.BlogModel.deleteMany({});
      await this.PostModel.deleteMany({});
      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
