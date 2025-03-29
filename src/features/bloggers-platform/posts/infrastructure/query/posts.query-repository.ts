import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PostViewDto } from '../../api/dto/view-dto/post-view.dto';
import { GetPostsQueryParams } from '../../api/dto/input-dto/get-posts-query-params.input-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { Types } from 'mongoose';
import { PostsViewService } from '../../application/posts-view.service';
import { NotFoundDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';
import { query } from 'express';

@Injectable()
export class PostsQueryRepository {
  constructor(
    @InjectDataSource() private dataSource: DataSource,
    private postsViewService: PostsViewService,
  ) {}

  async selectByIdOrNotFound(
    id: string,
    userId: string = uuidv4(),
  ): Promise<PostViewDto> {
    const postQuery = await this.dataSource.query(
      `
    SELECT p.*, b."name" as "blogName"
    FROM "Posts" p
    LEFT JOIN "Blogs" b ON p."blogId" = b."id"
    WHERE p."id"=$1 AND p."deletedAt" IS NULL
    `,
      [id],
    );
    if (!postQuery[0]) {
      throw NotFoundDomainException.create();
    }

    return this.postsViewService.mapToView(postQuery[0], userId);
  }

  async selectAllForBlog(
    query: GetPostsQueryParams,
    blogId: string,
    userId: string,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const offset = query.calculateSkip();
    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    const posts = await this.dataSource.query(
      `
    SELECT p.*, b."name" as "blogName"
    FROM "Posts" p
    LEFT JOIN "Blogs" b ON p."blogId" = b."id"
    WHERE p."blogId"=$1 AND p."deletedAt" IS NULL
    ORDER BY "${sortBy}" ${sortDirection}
    LIMIT $2 OFFSET $3
    `,
      [blogId, pageSize, offset],
    );

    const countResult = await this.dataSource.query(
      `
    SELECT COUNT(*) FROM "Posts"
    WHERE "deletedAt" IS NULL
    `,
    );

    const totalCount = +countResult[0].count;

    const data = {
      items: await this.postsViewService.mapToViewList(posts, userId),
      page: pageNumber,
      size: pageSize,
      totalCount: totalCount,
    };

    return PaginatedViewDto.mapToView(data);
  }

  async selectAll(
    query: GetPostsQueryParams,
    userId: string,
  ): Promise<PaginatedViewDto<PostViewDto[]>> {
    const offset = query.calculateSkip();
    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    const posts = await this.dataSource.query(
      `
    SELECT p.*, b."name" as "blogName"
    FROM "Posts" p
    LEFT JOIN "Blogs" b ON p."blogId" = b."id"
    WHERE p."deletedAt" IS NULL
    ORDER BY "${sortBy}" ${sortDirection}
    LIMIT $1 OFFSET $2
    `,
      [pageSize, offset],
    );

    const countResult = await this.dataSource.query(
      `
    SELECT COUNT(*) FROM "Posts"
    WHERE "deletedAt" IS NULL
    `,
    );

    const totalCount = +countResult[0].count;

    const data = {
      items: await this.postsViewService.mapToViewList(posts, userId),
      page: pageNumber,
      size: pageSize,
      totalCount: totalCount,
    };

    return PaginatedViewDto.mapToView(data);
  }
}
