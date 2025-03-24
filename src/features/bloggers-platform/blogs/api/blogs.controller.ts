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
import { CreatePostInputDto } from '../../posts/api/dto/input-dto/post-input.dto';
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

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsQueryRepository: PostsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Post()
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  async create(@Body() createDto: CreateBlogInputDto): Promise<BlogViewDto> {
    const blogId: string = await this.commandBus.execute(
      new CreateBlogCommand(createDto),
    );
    return this.blogsQueryRepository.getByIdOrNotFoundFail(blogId);
  }

  @Get()
  @HttpCode(200)
  async getAll(
    @Query() query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    return this.blogsQueryRepository.getAll(query);
  }

  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id') id: string): Promise<BlogViewDto> {
    return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async update(@Param('id') id: string, @Body() updateDto: UpdateBlogInputDto) {
    await this.commandBus.execute(new UpdateBlogCommand(id, updateDto));
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async delete(@Param('id') id: string) {
    await this.commandBus.execute(new DeleteBlogCommand(id));
    return;
  }

  @Post(':id/posts')
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  async createPost(
    @Param('id') id: string,
    @Body() createDto: CreatePostForBlogInputDto,
  ): Promise<PostViewDto> {
    const dto: CreatePostInputDto = {
      ...createDto,
      blogId: id,
    };

    const postId: string = await this.commandBus.execute(
      new CreatePostCommand(dto),
    );
    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @Get(':id/posts')
  @HttpCode(200)
  @UseGuards(JwtOptionalAuthGuard)
  async getPosts(
    @Param('id') id: string,
    @Query() query: GetPostsQueryParams,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    await this.blogsQueryRepository.getByIdOrNotFoundFail(id);
    return this.postsQueryRepository.getAll(query, id, user?.id);
  }
}
