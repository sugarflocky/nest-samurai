import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Types } from 'mongoose';
import { Comment, CommentModelType } from '../../domain/comment.entity';
import { CommentViewDto } from '../../api/dto/view-dto/comment-view.dto';
import { GetCommentsQueryParams } from '../../api/dto/input-dto/get-comments-query-params-input.dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { CommentsViewService } from '../../application/comments-view.service';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { NotFoundDomainException } from '../../../../../core/exceptions/domain-exceptions';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    @InjectModel(Comment.name) private CommentModel: CommentModelType,
    private commentsViewService: CommentsViewService,
    private postsRepository: PostsRepository,
  ) {}

  async getByIdOrNotFoundFail(
    id: string,
    userId: string = new Types.ObjectId().toString(),
  ): Promise<CommentViewDto> {
    const comment = await this.CommentModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!comment) {
      throw NotFoundDomainException.create();
    }

    return this.commentsViewService.mapToView(comment, userId);
  }

  async getCommentsInPost(
    query: GetCommentsQueryParams,
    postId: string,
    userId: string = new Types.ObjectId().toString(),
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const { sortBy, sortDirection, pageSize, pageNumber } = query;
    const filter: any = {
      postId: new Types.ObjectId(postId),
      deletedAt: null,
    };

    await this.postsRepository.findOrNotFoundFail(postId);

    const items = await this.CommentModel.find(filter)
      .sort([[sortBy, sortDirection]])
      .skip(query.calculateSkip())
      .limit(pageSize)
      .exec();

    const totalCount = await this.CommentModel.countDocuments(filter).exec();

    await this.commentsViewService.mapToViewList(items, userId);

    const data = {
      items: await this.commentsViewService.mapToViewList(items, userId),
      page: pageNumber,
      size: pageSize,
      totalCount: totalCount,
    };

    return PaginatedViewDto.mapToView(data);
  }
}
