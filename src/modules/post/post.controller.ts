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
import { PostService } from './post.service';
import { PostQueryRepository } from './post.queryRepository';
import {
  PostCreateDto,
  PostSortData,
  PostUpdateDto,
  PostViewModel,
} from './post.types';
import { SortOrder } from 'mongoose';
import { Pagination } from '../../common/common.types';

@Controller('posts')
export class PostController {
  constructor(
    private postService: PostService,
    private postQueryRepository: PostQueryRepository,
  ) {}

  @Post()
  @HttpCode(201)
  async createPost(
    @Body() createDto: PostCreateDto,
  ): Promise<PostViewModel | null> {
    const post = await this.postService.createPost(createDto);
    if (!post) return null;
    return post;
  }

  @Get()
  @HttpCode(200)
  async getPosts(
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

    const posts = await this.postQueryRepository.getPosts(sortData);
    return posts;
  }

  @Get(':id')
  @HttpCode(200)
  async getPost(@Param('id') id: string): Promise<PostViewModel> {
    const post = await this.postQueryRepository.getPost(id);
    if (!post) throw new NotFoundException();
    return post;
  }

  @Put(':id')
  @HttpCode(204)
  async updatePost(@Param('id') id: string, @Body() updateDto: PostUpdateDto) {
    const result = await this.postService.updatePost(id, updateDto);
    if (!result) throw new NotFoundException();
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async deletePost(@Param('id') id: string) {
    const result = await this.postService.deletePost(id);
    if (!result) throw new NotFoundException();
    return;
  }
}
