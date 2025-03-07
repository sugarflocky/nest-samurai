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
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import {
  CreatePostInputDto,
  UpdatePostInputDto,
} from './dto/input-dto/post-input.dto';
import { PostViewDto } from './dto/view-dto/post-view.dto';
import { GetPostsQueryParams } from './dto/input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { CommentViewDto } from '../../comments/api/dto/view-dto/comment-view.dto';
import { CommentsService } from '../../comments/application/comments.service';
import { JwtAuthGuard } from '../../../../core/guards/jwt-auth.guard';
import { CommentsQueryRepository } from '../../comments/infrastructure/query/comments.query-repository';
import { GetCommentsQueryParams } from '../../comments/api/dto/input-dto/get-comments-query-params-input.dto';
import { BasicAuthGuard } from '../../../../core/guards/basic-auth.guard';
import { LikePostInputDto } from './dto/input-dto/like-post-input.dto';
import { OptionalJwtGuard } from '../../../../core/guards/optional-jwt-auth.guard';
import { CreateCommentInputDto } from '../../comments/api/dto/input-dto/create-comment-input.dto';
import { ParseObjectIdPipe } from '../../../../core/pipes/parse-object-id.pipe';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsService: PostsService,
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Post()
  @HttpCode(201)
  @UseGuards(BasicAuthGuard)
  async create(@Body() createDto: CreatePostInputDto): Promise<PostViewDto> {
    const id = await this.postsService.createPost(createDto);
    return this.postsQueryRepository.getByIdOrNotFoundFail(id);
  }

  @Get()
  @HttpCode(200)
  @UseGuards(OptionalJwtGuard)
  async getAll(
    @Query() query: GetPostsQueryParams,
    @Request() req,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getAll(query, null, req.user?.id);
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(OptionalJwtGuard)
  async getById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req,
  ): Promise<PostViewDto> {
    return this.postsQueryRepository.getByIdOrNotFoundFail(id, req.user?.id);
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateDto: UpdatePostInputDto,
  ) {
    await this.postsService.updatePost(id, updateDto);
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async delete(@Param('id', ParseObjectIdPipe) id: string) {
    await this.postsService.deletePost(id);
    return;
  }

  @Get(':id/comments')
  @HttpCode(200)
  @UseGuards(OptionalJwtGuard)
  async getComments(
    @Param('id', ParseObjectIdPipe) id: string,
    @Query() query: GetCommentsQueryParams,
    @Request() req,
  ) {
    return this.commentsQueryRepository.getCommentsInPost(
      query,
      id,
      req.user?.id,
    );
  }

  @Post(':id/comments')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() createDto: CreateCommentInputDto,
    @Request() req,
  ): Promise<CommentViewDto> {
    const commentId = await this.commentsService.createComment({
      ...createDto,
      postId: id,
      userId: req.user.id,
    });
    return this.commentsQueryRepository.getByIdOrNotFoundFail(commentId);
  }

  @Put(':id/like-status')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async like(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: LikePostInputDto,
    @Request() req,
  ): Promise<void> {
    await this.postsService.likePost({
      parentId: id,
      status: dto.likeStatus,
      userId: req.user.id,
    });
  }
}
