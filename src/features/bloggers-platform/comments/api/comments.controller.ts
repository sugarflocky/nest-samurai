import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query-repository';
import { CommentViewDto } from './dto/view-dto/comment-view.dto';
import { UpdateCommentInputDto } from './dto/input-dto/update-comment-input.dto';
import { LikeCommentInputDto } from './dto/input-dto/like-comment-input.dto';
import { JwtAuthGuard } from '../../../../core/guards/bearer/jwt-auth.guard';
import { JwtOptionalAuthGuard } from '../../../../core/guards/bearer/jwt-optional-auth.guard';
import { ExtractUserIfExistsFromRequest } from '../../../../core/guards/decorators/param/extract-user-if-exist-from-request.decorator';
import { UserContextDto } from '../../../../core/guards/dto/user-context.dto';
import { ExtractUserFromRequest } from '../../../../core/guards/decorators/param/extract-user-from-request.decorator';
import { CommandBus } from '@nestjs/cqrs';
import { UpdateCommentCommand } from '../application/usecases/update-comment.use-case';
import { DeleteCommentCommand } from '../application/usecases/delete-comment.use-case';
import { LikeCommentCommand } from '../application/usecases/like-comments.use-case';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsQueryRepository: CommentsQueryRepository,
    private commandBus: CommandBus,
  ) {}

  @Get(':id')
  @HttpCode(200)
  @UseGuards(JwtOptionalAuthGuard)
  async getById(
    @Param('id') id: string,
    @ExtractUserIfExistsFromRequest() user: UserContextDto,
  ): Promise<CommentViewDto> {
    return this.commentsQueryRepository.getByIdOrNotFoundFail(id, user?.id);
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ) {
    const dto = {
      ...updateDto,
      userId: user.id,
    };
    await this.commandBus.execute(new UpdateCommentCommand(id, dto));
    return;
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id') id: string,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    await this.commandBus.execute(new DeleteCommentCommand(id, user.id));
  }

  @Put(':id/like-status')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async like(
    @Param('id') id: string,
    @Body() dto: LikeCommentInputDto,
    @ExtractUserFromRequest() user: UserContextDto,
  ): Promise<void> {
    const likeDto = {
      parentId: id,
      status: dto.likeStatus,
      userId: user.id,
    };
    await this.commandBus.execute(new LikeCommentCommand(likeDto));
    return;
  }
}
