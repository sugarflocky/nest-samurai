import { Module } from '@nestjs/common';
import { TestingController } from './testing.controller';
import { TestingService } from './testing.service';
import { MongooseModule } from '@nestjs/mongoose';
import {
  User,
  UserSchema,
} from '../../features/user-accounts/domain/user.entity';
import {
  Blog,
  BlogSchema,
} from '../../features/bloggers-platform/blogs/domain/blog.entity';
import {
  Post,
  PostSchema,
} from '../../features/bloggers-platform/posts/domain/post.entity';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
    ]),
  ],
  controllers: [TestingController],
  providers: [TestingService],
})
export class TestingModule {}
