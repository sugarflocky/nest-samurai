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
  Request,
} from '@nestjs/common';
import { BlogsService } from '../application/blogs.service';
import { BlogsQueryRepository } from '../infrastructure/query/blogs.query-repository';
import {
  CreateBlogInputDto,
  UpdateBlogInputDto,
} from './dto/input-dto/blog-input.dto';
import { BlogViewDto } from './dto/view-dto/blog-view.dto';
import { GetBlogsQueryParams } from './dto/input-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import {
  CreatePostForBlogInputDto,
  CreatePostInputDto,
} from '../../posts/api/dto/input-dto/post-input.dto';
import { PostViewDto } from '../../posts/api/dto/view-dto/post-view.dto';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from '../../posts/api/dto/input-dto/get-posts-query-params.input-dto';
import { BasicAuthGuard } from '../../../../core/guards/basic-auth.guard';
import { OptionalJwtGuard } from '../../../../core/guards/optional-jwt-auth.guard';
import { ParseObjectIdPipe } from '../../../../core/pipes/parse-object-id.pipe';

@Controller('blogs')
export class BlogsController {
  constructor(
    private readonly blogsService: BlogsService,
    private readonly blogsQueryRepository: BlogsQueryRepository,
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Post()
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  async create(@Body() createDto: CreateBlogInputDto): Promise<BlogViewDto> {
    const id = await this.blogsService.createBlog(createDto);
    return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
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
  async getById(
    @Param('id', ParseObjectIdPipe) id: string,
  ): Promise<BlogViewDto> {
    return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateDto: UpdateBlogInputDto,
  ) {
    await this.blogsService.updateBlog(id, updateDto);
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    await this.blogsService.deleteBlog(id);
    return;
  }

  @Post(':id/posts')
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  async createPost(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() createDto: CreatePostForBlogInputDto,
  ): Promise<PostViewDto> {
    const newCreateDto: CreatePostInputDto = {
      ...createDto,
      blogId: id,
    };

    const postId = await this.postsService.createPost(newCreateDto);
    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @Get(':id/posts')
  @HttpCode(200)
  @UseGuards(OptionalJwtGuard)
  async getPosts(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query() query: GetPostsQueryParams,
    @Request() req,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    await this.blogsQueryRepository.getByIdOrNotFoundFail(id);
    return this.postsQueryRepository.getAll(query, id, req.user?.id);
  }
}
