import { Blog, BlogSchema } from './blogs/domain/blog.entity';
import { BlogsController } from './blogs/api/blogs.controller';
import { BlogsService } from './blogs/application/blogs.service';
import { BlogsRepository } from './blogs/infrastructure/blogs-repository';
import { BlogsQueryRepository } from './blogs/infrastructure/query/blogs.query-repository';
import { MongooseModule } from '@nestjs/mongoose';
import { Module } from '@nestjs/common';
import { PostsController } from './posts/api/posts.controller';
import { PostsQueryRepository } from './posts/infrastructure/query/posts.query-repository';
import { PostsRepository } from './posts/infrastructure/posts.repository';
import { Post, PostSchema } from './posts/domain/post.entity';
import { Comment, CommentSchema } from './comments/domain/comment.entity';
import { CommentsController } from './comments/api/comments.controller';
import { CommentsRepository } from './comments/infrastructure/comments.repository';
import { CommentsQueryRepository } from './comments/infrastructure/query/comments.query-repository';
import { UserAccountsModule } from '../user-accounts/user-accounts.module';
import { LikesService } from './likes/application/likes.service';
import { LikesRepository } from './likes/infrastructure/likes.repository';
import { Like, LikeSchema } from './likes/domain/like.entity';
import { CommentsViewService } from './comments/application/comments-view.service';
import * as dotenv from 'dotenv';
import { PostsViewService } from './posts/application/posts-view.service';
import { BlogExistsValidator } from '../../core/validators/blog-exists.validator';

dotenv.config();

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Blog.name, schema: BlogSchema },
      { name: Post.name, schema: PostSchema },
      { name: Comment.name, schema: CommentSchema },
      { name: Like.name, schema: LikeSchema },
    ]),
    UserAccountsModule,
  ],
  controllers: [BlogsController, PostsController, CommentsController],
  providers: [
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsViewService,
    PostsRepository,
    PostsQueryRepository,
    CommentsViewService,
    CommentsRepository,
    CommentsQueryRepository,
    LikesService,
    LikesRepository,
    BlogExistsValidator,
  ],
})
export class BloggersPlatformModule {}
