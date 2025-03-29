import { Injectable } from '@nestjs/common';
import { BlogViewDto } from '../../api/dto/view-dto/blog-view.dto';
import { GetBlogsQueryParams } from '../../api/dto/input-dto/get-blogs-query-params.input-dto';
import { PaginatedViewDto } from '../../../../../core/dto/base.paginated.view-dto';
import { NotFoundDomainException } from '../../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class BlogsQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async selectByIdOrNotFound(id: string): Promise<BlogViewDto> {
    const blogQuery = await this.dataSource.query(
      `
    SELECT * FROM "Blogs"
    WHERE "id"=$1 AND "deletedAt" IS NULL
    `,
      [id],
    );

    if (!blogQuery[0]) {
      throw NotFoundDomainException.create();
    }

    return BlogViewDto.mapToView(blogQuery[0]);
  }

  async selectAll(
    query: GetBlogsQueryParams,
  ): Promise<PaginatedViewDto<BlogViewDto[]>> {
    const offset = query.calculateSkip();
    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    const searchNameTerm = query.searchNameTerm ?? '';

    const blogs = await this.dataSource.query(
      `
  SELECT * 
  FROM "Blogs"
  WHERE "deletedAt" IS NULL 
  AND ("name" ILIKE $1)
  ORDER BY "${sortBy}" ${sortDirection}
  LIMIT $2 OFFSET $3
`,
      [`%${searchNameTerm}%`, pageSize, offset],
    );

    const countResult = await this.dataSource.query(
      `
  SELECT COUNT(*)
  FROM "Blogs" u
  WHERE u."deletedAt" IS NULL 
  AND (u."name" ILIKE $1)
    `,
      [`%${searchNameTerm}%`],
    );

    const totalCount = +countResult[0].count;

    const data = {
      items: blogs.map((blog) => BlogViewDto.mapToView(blog)),
      page: pageNumber,
      size: pageSize,
      totalCount: totalCount,
    };

    return PaginatedViewDto.mapToView(data);
  }
}
