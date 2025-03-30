import {
  Body,
  Controller,
  Get,
  HttpCode,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { PostsQueryRepository } from '../infrastructure/query/posts.query-repository';
import { PostViewDto } from './dto/view-dto/post-view.dto';
import { GetPostsQueryParams } from './dto/input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { CommentViewDto } from '../../comments/api/dto/view-dto/comment-view.dto';
import { CommentsQueryRepository } from '../../comments/infrastructure/query/comments.query-repository';
import { GetCommentsQueryParams } from '../../comments/api/dto/input-dto/get-comments-query-params-input.dto';
import { LikePostInputDto } from './dto/input-dto/like-post-input.dto';
import { CreateCommentInputDto } from '../../comments/api/dto/input-dto/create-comment-input.dto';
import { ExtractUserIfExistsFromRequest } from '../../../../core/guards/decorators/param/extract-user-if-exist-from-request.decorator';
import { UserContextDto } from '../../../../core/guards/dto/user-context.dto';
import { JwtAuthGuard } from '../../../../core/guards/bearer/jwt-auth.guard';
import { ExtractUserFromRequest } from '../../../../core/guards/decorators/param/extract-user-from-request.decorator';
import { JwtOptionalAuthGuard } from '../../../../core/guards/bearer/jwt-optional-auth.guard';
import { CommandBus } from '@nestjs/cqrs';
import { LikePostCommand } from '../application/usecases/like-post.use-case';
import { CreateCommentCommand } from '../../comments/application/usecases/create-comment.use-case';

@Controller('posts')
export class PostsController {
  constructor(
    private readonly postsQueryRepository: PostsQueryRepository,
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get()
  @HttpCode(200)
  @UseGuards(JwtOptionalAuthGuard)
  async getAll(
    @Query() query: GetPostsQueryParams,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const result = await this.postsQueryRepository.selectAll(query, user?.id);
    return result;
  }

  @Get(':id')
  @HttpCode(200)
  @UseGuards(JwtOptionalAuthGuard)
  async getById(
    @Param('id') id: string,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<PostViewDto> {
    return this.postsQueryRepository.selectByIdOrNotFound(id, user?.id);
  }

  @Put(':id/like-status')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async like(
    @Param('id') id: string,
    @Body() dto: LikePostInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    const likeDto = {
      parentId: id,
      status: dto.likeStatus,
      userId: user.id,
    };

    await this.commandBus.execute(new LikePostCommand(likeDto));
  }

  @Get(':id/comments')
  @HttpCode(200)
  @UseGuards(JwtOptionalAuthGuard)
  async getComments(
    @Param('id') id: string,
    @Query() query: GetCommentsQueryParams,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ) {
    return this.commentsQueryRepository.selectAllInPost(query, id, user?.id);
  }

  @Post(':id/comments')
  @HttpCode(201)
  @UseGuards(JwtAuthGuard)
  async createComment(
    @Param('id') id: string,
    @Body() createDto: CreateCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<CommentViewDto> {
    const dto = {
      ...createDto,
      postId: id,
      userId: user.id,
    };

    const commentId: string = await this.commandBus.execute(
      new CreateCommentCommand(dto),
    );

    return this.commentsQueryRepository.selectByIdOrNotFound(commentId);
  }
}
