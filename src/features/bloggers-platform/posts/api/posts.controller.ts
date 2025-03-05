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
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import {
  CreatePostInputDto,
  UpdatePostInputDto,
} from './dto/input-dto/post-input.dto';
import { PostViewDto } from './dto/view-dto/post-view.dto';
import { GetPostsQueryParams } from './dto/input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { isValidObjectId } from 'mongoose';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
  ) {}

  @Post()
  @HttpCode(201)
  async create(@Body() createDto: CreatePostInputDto): Promise<PostViewDto> {
    if (!isValidObjectId(createDto.blogId)) {
      throw new BadRequestException('Invalid blogId format');
    }
    const id = await this.postsService.createPost(createDto);
    return this.postsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get()
  @HttpCode(200)
  async getAll(
    @Query() query: GetPostsQueryParams,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getAll(query);
  }

  @Get(':id')
  @HttpCode(200)
  async getById(@Param('id') id: string): Promise<PostViewDto> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid post id format');
    }

    return this.postsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Put(':id')
  @HttpCode(204)
  async update(@Param('id') id: string, @Body() updateDto: UpdatePostInputDto) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid post Id format');
    }
    if (!isValidObjectId(updateDto.blogId)) {
      throw new BadRequestException('Invalid blogId format');
    }

    await this.postsService.updatePost(id, updateDto);
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  async delete(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid post Id format');
    }

    await this.postsService.deletePost(id);
    return;
  }
}
