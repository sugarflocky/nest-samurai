import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  Put,
  UseGuards,
  Request,
} from '@nestjs/common';
import { CommentsService } from '../application/comments.service';
import { CommentsQueryRepository } from '../infrastructure/query/comments.query-repository';
import { CommentViewDto } from './dto/view-dto/comment-view.dto';
import { UpdateCommentInputDto } from './dto/input-dto/update-comment-input.dto';
import { JwtAuthGuard } from '../../../../core/guards/jwt-auth.guard';
import { LikeCommentInputDto } from './dto/input-dto/like-comment-input.dto';
import { OptionalJwtGuard } from '../../../../core/guards/optional-jwt-auth.guard';
import { ParseObjectIdPipe } from '../../../../core/pipes/parse-object-id.pipe';

@Controller('comments')
export class CommentsController {
  constructor(
    private readonly commentsService: CommentsService,
    private readonly commentsQueryRepository: CommentsQueryRepository,
  ) {}

  @Get(':id')
  @HttpCode(200)
  @UseGuards(OptionalJwtGuard)
  async getById(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req,
  ): Promise<CommentViewDto> {
    return this.commentsQueryRepository.getByIdOrNotFoundFail(id, req.user?.id);
  }

  @Put(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async update(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() updateDto: UpdateCommentInputDto,
    @Request() req,
  ) {
    await this.commentsService.updateComment(id, {
      ...updateDto,
      userId: req.user.id,
    });
  }

  @Delete(':id')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async delete(
    @Param('id', ParseObjectIdPipe) id: string,
    @Request() req,
  ): Promise<void> {
    await this.commentsService.deleteComment(id, req.user.id);
  }

  @Put(':id/like-status')
  @HttpCode(204)
  @UseGuards(JwtAuthGuard)
  async like(
    @Param('id', ParseObjectIdPipe) id: string,
    @Body() dto: LikeCommentInputDto,
    @Request() req,
  ): Promise<void> {
    await this.commentsService.likeComment({
      parentId: id,
      status: dto.likeStatus,
      userId: req.user.id,
    });
  }
}
