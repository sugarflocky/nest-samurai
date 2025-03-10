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
import { PostsService } from '../application/posts.service';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { CreatePostInputDto } from './dto/input-dto/post-input.dto';
import { PostViewDto } from './dto/view-dto/post-view.dto';
import { GetPostsQueryParams } from './dto/input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { CommentViewDto } from '../../comments/api/dto/view-dto/comment-view.dto';
import { CommentsService } from '../../comments/application/comments.service';
import { CommentsQueryRepository } from '../../comments/infrastructure/query/comments.query-repository';
import { GetCommentsQueryParams } from '../../comments/api/dto/input-dto/get-comments-query-params-input.dto';
import { BasicAuthGuard } from '../../../../core/guards/basic/basic-auth.guard';
import { LikePostInputDto } from './dto/input-dto/like-post-input.dto';
import { CreateCommentInputDto } from '../../comments/api/dto/input-dto/create-comment-input.dto';
import { UpdatePostInputDto } from './dto/input-dto/update-post-input.dto';
import { ExtractUserIfExistsFromRequest } from '../../../../core/guards/decorators/param/extract-user-if-exist-from-request.decorator';
import { UserContextDto } from '../../../../core/guards/dto/user-context.dto';
import { JwtAuthGuard } from '../../../../core/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../../../core/guards/decorators/param/extract-user-from-request.decorator';
import { JwtOptionalAuthGuard } from '../../../../core/guards/bearer/jwt-optional-auth.guard';

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
  @UseGuards(JwtOptionalAuthGuard)
  async getAll(
    @Query() query: GetPostsQueryParams,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    return this.postsQueryRepository.getAll(query, null, user?.id);
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(JwtOptionalAuthGuard)
  async getById(
    @Param('id') id: string,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<PostViewDto> {
    return this.postsQueryRepository.getByIdOrNotFoundFail(id, user?.id);
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async update(@Param('id') id: string, @Body() updateDto: UpdatePostInputDto) {
    await this.postsService.updatePost(id, updateDto);
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(BasicAuthGuard)
  async delete(@Param('id') id: string) {
    await this.postsService.deletePost(id);
    return;
  }

  @Get(':id/comments')
  @HttpCode(200)
  @UseGuards(JwtOptionalAuthGuard)
  async getComments(
    @Param('id') id: string,
    @Query() query: GetCommentsQueryParams,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ) {
    return this.commentsQueryRepository.getCommentsInPost(query, id, user?.id);
  }

  @Post(':id/comments')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('id') id: string,
    @Body() createDto: CreateCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<CommentViewDto> {
    const commentId = await this.commentsService.createComment({
      ...createDto,
      postId: id,
      userId: user.id,
    });
    return this.commentsQueryRepository.getByIdOrNotFoundFail(commentId);
  }

  @Put(':id/like-status')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async like(
    @Param('id') id: string,
    @Body() dto: LikePostInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    await this.postsService.likePost({
      parentId: id,
      status: dto.likeStatus,
      userId: user.id,
    });
  }
}
