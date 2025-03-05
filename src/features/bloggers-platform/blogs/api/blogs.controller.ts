import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
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
import { isValidObjectId } from 'mongoose';
import {
  CreatePostForBlogInputDto,
  CreatePostInputDto,
} from '../../posts/api/dto/input-dto/post-input.dto';
import { PostViewDto } from '../../posts/api/dto/view-dto/post-view.dto';
import { PostsService } from '../../posts/application/posts.service';
import { PostsQueryRepository } from '../../posts/infrastructure/query/posts.query-repository';
import { GetPostsQueryParams } from '../../posts/api/dto/input-dto/get-posts-query-params.input-dto';

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
  async getById(@Param('id') id: string): Promise<BlogViewDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid blog ID format');
    }
    return this.blogsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Put(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateDto: UpdateBlogInputDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid blog ID format');
    }
    await this.blogsService.updateBlog(id, updateDto);
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid blog ID format');
    }

    await this.blogsService.deleteBlog(id);
    return;
  }

  @Post(':id/posts')
  @HttpCode(201)
  async createPost(
    @Param('id') id: string,
    @Body() createDto: CreatePostForBlogInputDto,
  ): Promise<PostViewDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid blog ID format');
    }
    const newCreateDto: CreatePostInputDto = {
      ...createDto,
      blogId: id,
    };

    const postId = await this.postsService.createPost(newCreateDto);
    return this.postsQueryRepository.getByIdOrNotFoundFail(postId);
  }

  @Get(':id/posts')
  @HttpCode(200)
  async getPosts(
    @Param('id') id: string,
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid blog ID format');
    }
    await this.blogsQueryRepository.getByIdOrNotFoundFail(id);
    return this.postsQueryRepository.getAll(query, id);
  }
}
