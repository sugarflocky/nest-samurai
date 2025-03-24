import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TestingService } from './testing.service';
import { MongooseModule } from '@nestjs/mongoose';
import { User, UserSchema } from '../user-accounts/domain/user.entity';
import {
  Blog,
  BlogSchema,
} from '../bloggers-platform/blogs/domain/blog.entity';
import {
  Post,
  PostSchema,
} from '../bloggers-platform/posts/domain/post.entity';
import {
  Comment,
  CommentSchema,
} from '../bloggers-platform/comments/domain/comment.entity';
import {
  Like,
  LikeSchema,
} from '../bloggers-platform/likes/domain/like.entity';
import { Session, SessionSchema } from '../user-accounts/domain/session.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Like.name, schema: LikeSchema },
      { name: Session.name, schema: SessionSchema },
    ]),
  ],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
