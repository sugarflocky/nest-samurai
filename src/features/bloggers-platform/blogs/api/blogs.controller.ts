import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import {
  CreateBlogInputDto,
  UpdateBlogInputDto,
} from './dto/input-dto/blog-input.dto';
import { BlogViewDto } from './dto/view-dto/blog-view.dto';
import { GetBlogsQueryParams } from './dto/input-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { PostViewDto } from '../../posts/api/dto/view-dto/post-view.dto';
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from '../../posts/api/dto/input-dto/get-posts-query-params.input-dto';
import { BasicAuthGuard } from '../../../../core/guards/basic/basic-auth.guard';
import { CreatePostForBlogInputDto } from '../../posts/api/dto/input-dto/create-post-for-blog-input.dto';
import { ExtractUserIfExistsFromRequest } from '../../../../core/guards/decorators/param/extract-user-if-exist-from-request.decorator';
import { UserContextDto } from '../../../../core/guards/dto/user-context.dto';
import { JwtOptionalAuthGuard } from '../../../../core/guards/bearer/jwt-optional-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { CreateBlogCommand } from '../application/usecases/create-blog.use-case';
import { UpdateBlogCommand } from '../application/usecases/update-blog.use-case';
import { DeleteBlogCommand } from '../application/usecases/delete-blog.use-case';
import { CreatePostCommand } from '../../posts/application/usecases/create-post.use-case';
import { UpdatePostInputDto } from '../../posts/api/dto/input-dto/update-post-input.dto';
import { UpdatePostCommand } from '../../posts/application/usecases/update-post.use-case';
import { DeletePostCommand } from '../../posts/application/usecases/delete-post.use-case';

@Controller()
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get('blogs/:id')
  @HttpCode(200)
  async getById(@Param('id') id: string): Promise<BlogViewDto> {
    return this.blogsQueryRepository.selectByIdOrNotFound(id);
  }

  @Get('/blogs')
  @HttpCode(200)
  async getAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.selectAll(query);
  }

  @Get('blogs/:id/posts')
  @HttpCode(200)
  @UseGuards(JwtOptionalAuthGuard)
  async getPosts(
    @Param('id') id: string,
    @Query() query: GetPostsQueryParams,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    await this.blogsQueryRepository.selectByIdOrNotFound(id);
    return this.postsQueryRepository.selectAllForBlog(query, id, user?.id);
  }

  @Get('sa/blogs')
  @HttpCode(200)
  @UseGuards(BasicAuthGuard)
  async superGetAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.selectAll(query);
  }

  @Post('sa/blogs')
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  async create(@Body() createDto: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId: string = await this.commandBus.execute(
      new CreateBlogCommand(createDto),
    );
    return this.blogsQueryRepository.selectByIdOrNotFound(blogId);
  }

  @Put('sa/blogs/:id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async update(@Param('id') id: string, @Body() updateDto: UpdateBlogInputDto) {
    await this.commandBus.execute(new UpdateBlogCommand(id, updateDto));
    return;
  }

  @Delete('sa/blogs/:id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async delete(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteBlogCommand(id));
    return;
  }

  @Post('sa/blogs/:blogId/posts')
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  async createPost(
    @Param('blogId') blogId: string,
    @Body() createDto: CreatePostForBlogInputDto,
  ): Promise<PostViewDto> {
    const postId: string = await this.commandBus.execute(
      new CreatePostCommand(blogId, createDto),
    );
    return this.postsQueryRepository.selectByIdOrNotFound(postId);
  }

  @Get('sa/blogs/:id/posts')
  @HttpCode(200)
  @UseGuards(BasicAuthGuard, JwtOptionalAuthGuard)
  async superGetPosts(
    @Param('id') id: string,
    @Query() query: GetPostsQueryParams,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    await this.blogsQueryRepository.selectByIdOrNotFound(id);
    return this.postsQueryRepository.selectAllForBlog(query, id, user?.id);
  }

  @Put('sa/blogs/:blogId/posts/:postId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async updatePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
    @Body() updateDto: UpdatePostInputDto,
  ): Promise<void> {
    await this.commandBus.execute(
      new UpdatePostCommand(blogId, postId, updateDto),
    );
  }

  @Delete('sa/blogs/:blogId/posts/:postId')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async deletePost(
    @Param('blogId') blogId: string,
    @Param('postId') postId: string,
  ) {
    await this.commandBus.execute(new DeletePostCommand(blogId, postId));
    return;
  }
}
