import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  User,
  UserModelType,
} from '../../features/user-accounts/domain/user.entity';
import {
  Blog,
  BlogModelType,
} from '../../features/bloggers-platform/blogs/domain/blog.entity';
import {
  Post,
  PostModelType,
} from '../../features/bloggers-platform/posts/domain/post.entity';

@Injectable()
export class TestingService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    @InjectModel(Post.name) private PostModel: PostModelType,
  ) {}

  async deleteAllData() {
    try {
      await this.UserModel.deleteMany({});
      await this.BlogModel.deleteMany({});
      await this.PostModel.deleteMany({});
      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
