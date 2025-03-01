import { BlogService } from './blog.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  NotFoundException,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import {
  BlogCreateDto,
  blogMapper,
  BlogSortData,
  BlogUpdateDto,
} from './blog.types';
import { BlogQueryRepository } from './blog.queryRepository';
import { Pagination } from '../../common/common.types';
import { SortOrder } from 'mongoose';
import { PostQueryRepository } from '../post/post.queryRepository';
import { PostCreateDto, PostSortData, PostViewModel } from '../post/post.types';
import { PostService } from '../post/post.service';

@Controller('blogs')
export class BlogController {
  constructor(
    private blogService: BlogService,
    private blogQueryRepository: BlogQueryRepository,
    private postQueryRepository: PostQueryRepository,
    private postService: PostService,
  ) {}

  @Post()
  async createBlog(@Body() createDto: BlogCreateDto) {
    const blog = await this.blogService.createBlog(createDto);
    if (!blog) return null;
    return blogMapper(blog);
  }

  @Get()
  async getBlogs(
    @Query('searchNameTerm') searchNameTerm: string = '',
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortDirection') sortDirection: SortOrder = 'desc',
    @Query('pageNumber') pageNumber: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ) {
    const sortData: BlogSortData = {
      searchNameTerm,
      sortBy,
      sortDirection,
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
    };

    const blogs = await this.blogQueryRepository.getBlogs(sortData);
    return blogs;
  }

  @Get(':id')
  async getBlog(@Param('id') id: string) {
    const blog = await this.blogQueryRepository.getBlog(id);
    if (!blog) throw new NotFoundException();
    return blog;
  }

  @Put(':id')
  @HttpCode(204)
  async updateBlog(@Param('id') id: string, @Body() updateDto: BlogUpdateDto) {
    const result = await this.blogService.updateBlog(id, updateDto);
    if (!result) throw new NotFoundException();
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async deleteBlog(@Param('id') id: string) {
    const result = await this.blogService.deleteBlog(id);
    if (!result) throw new NotFoundException();
    return;
  }

  @Get(':id/posts')
  @HttpCode(200)
  async getPostsForBlog(
    @Param('id') id: string,
    @Query('sortBy') sortBy: string = 'createdAt',
    @Query('sortDirection') sortDirection: SortOrder = 'desc',
    @Query('pageNumber') pageNumber: string = '1',
    @Query('pageSize') pageSize: string = '10',
  ): Promise<Pagination<PostViewModel> | null> {
    const sortData: PostSortData = {
      sortBy,
      sortDirection,
      pageNumber: Number(pageNumber),
      pageSize: Number(pageSize),
    };

    const posts = await this.postQueryRepository.getPostsForBlog(id, sortData);
    if (!posts) throw new NotFoundException();
    return posts;
  }

  @Post(':id/posts')
  @HttpCode(201)
  async createPostForBlog(
    @Param('id') id: string,
    @Body() createDto: PostCreateDto,
  ): Promise<PostViewModel | null> {
    createDto.blogId = id;
    const post = await this.postService.createPost(createDto);
    if (!post) throw new NotFoundException();
    return post;
  }
}
