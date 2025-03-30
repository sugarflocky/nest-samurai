import { Injectable } from '@nestjs/common';
import { CommentViewDto } from '../../api/dto/view-dto/comment-view.dto';
import { GetCommentsQueryParams } from '../../api/dto/input-dto/get-comments-query-params-input.dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { CommentsViewService } from '../../application/comments-view.service';
import { PostsRepository } from '../../../posts/infrastructure/posts.repository';
import { NotFoundDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { v4 as uuidv4 } from 'uuid';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class CommentsQueryRepository {
  constructor(
    private commentsViewService: CommentsViewService,
    private postsRepository: PostsRepository,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  async selectByIdOrNotFound(
    commentId: string,
    userId: string = uuidv4(),
  ): Promise<CommentViewDto> {
    const commentQuery = await this.dataSource.query(
      `
    SELECT c.*, u.login as "userLogin"
    FROM "Comments" c
    LEFT JOIN "Users" u ON c."userId" = u."id"
    WHERE c."id"=$1 AND c."deletedAt" IS NULL
    `,
      [commentId],
    );

    if (!commentQuery[0]) {
      throw NotFoundDomainException.create();
    }

    return this.commentsViewService.mapToView(commentQuery[0], userId);
  }

  async selectAllInPost(
    query: GetCommentsQueryParams,
    postId: string,
    userId: string = uuidv4(),
  ): Promise<PaginatedViewDto<CommentViewDto[]>> {
    const offset = query.calculateSkip();
    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    await this.postsRepository.selectOrNotFoundFail(postId);

    const comments = await this.dataSource.query(
      `
    SELECT c.*, u."login" as "userLogin"
    FROM "Comments" c
    LEFT JOIN "Users" u ON c."userId" = u."id"
    WHERE c."postId"=$1 AND c."deletedAt" IS NULL
    ORDER BY "${sortBy}" ${sortDirection}
    LIMIT $2 OFFSET $3
    `,
      [postId, pageSize, offset],
    );

    const countResult = await this.dataSource.query(
      `
    SELECT COUNT(*) FROM "Comments"
    WHERE "postId"=$1 AND "deletedAt" IS NULL
    `,
      [postId],
    );

    const totalCount = +countResult[0].count;

    const data = {
      items: await this.commentsViewService.mapToViewList(comments, userId),
      page: pageNumber,
      size: pageSize,
      totalCount: totalCount,
    };

    return PaginatedViewDto.mapToView(data);
  }
}
