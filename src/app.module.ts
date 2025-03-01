import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule } from '@nestjs/config';
import * as process from 'node:process';
import { Blog, BlogSchema } from './modules/blog/blog.schemas';
import { BlogRepository } from './modules/blog/blog.repository';
import { BlogService } from './modules/blog/blog.service';
import { BlogController } from './modules/blog/blog.controller';
import { BlogQueryRepository } from './modules/blog/blog.queryRepository';
import { TestingController } from './modules/testing/testing.controller';
import { TestingRepository } from './modules/testing/testing.repository';
import { TestingService } from './modules/testing/testing.service';
import { Post, PostSchema } from './modules/post/post.schemas';
import { PostController } from './modules/post/post.controller';
import { PostRepository } from './modules/post/post.repository';
import { PostService } from './modules/post/post.service';
import { PostQueryRepository } from './modules/post/post.queryRepository';
import { UserQueryRepository } from './modules/user/user.queryRepository';
import { UserRepository } from './modules/user/user.repository';
import { UserService } from './modules/user/user.service';
import { User, UserSchema } from './modules/user/user.schemas';

@Module({
  imports: [
    ConfigModule.forRoot(),
    MongooseModule.forRoot(
      process.env.MONGO_URI ?? 'mongodb://localhost:27017',
    ),
    MongooseModule.forFeature([
      {
        name: Blog.name,
        schema: BlogSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
  ],
  controllers: [TestingController, BlogController, PostController],
  providers: [
    TestingRepository,
    TestingService,
    BlogRepository,
    BlogQueryRepository,
    BlogService,
    PostRepository,
    PostQueryRepository,
    PostService,
    UserRepository,
    UserQueryRepository,
    UserService,
  ],
})
export class AppModule {}
