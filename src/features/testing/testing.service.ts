import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserModelType } from '../user-accounts/domain/user.entity';
import {
  Blog,
  BlogModelType,
} from '../bloggers-platform/blogs/domain/blog.entity';
import {
  Post,
  PostModelType,
} from '../bloggers-platform/posts/domain/post.entity';
import {
  Comment,
  CommentModelType,
} from '../bloggers-platform/comments/domain/comment.entity';
import {
  Like,
  LikeModelType,
} from '../bloggers-platform/likes/domain/like.entity';

@Injectable()
export class TestingService {
  constructor(
    @InjectModel(User.name) private UserModel: UserModelType,
    @InjectModel(Blog.name) private BlogModel: BlogModelType,
    @InjectModel(Post.name) private PostModel: PostModelType,
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    @InjectModel(Like.name) private LikeModel: LikeModelType,
  ) {}

  async deleteAllData() {
    try {
      await this.UserModel.deleteMany({});
      await this.BlogModel.deleteMany({});
      await this.PostModel.deleteMany({});
      await this.CommentModel.deleteMany({});
      await this.LikeModel.deleteMany({});
      return true;
    } catch (error) {
      console.log(error);
      return null;
    }
  }
}
