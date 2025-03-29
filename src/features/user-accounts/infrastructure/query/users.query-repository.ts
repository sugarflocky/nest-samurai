import { User, UserModelType } from '../../domain/user.entity';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable } from '@nestjs/common';
import { UserViewDto } from '../../api/dto/view-dto/user-view.dto';
import { PaginatedViewDto } from '../../../../core/dto/base.paginated.view-dto';
import { GetUsersQueryParams } from '../../api/dto/input-dto/get-users-query-params.input-dto';
import { MeViewDto } from '../../api/dto/view-dto/me-view.dto';
import { NotFoundDomainException } from '../../../../core/exceptions/domain-exceptions';
import { InjectDataSource } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

@Injectable()
export class UsersQueryRepository {
  constructor(@InjectDataSource() private dataSource: DataSource) {}

  async selectByIdOrNotFound(userId: string): Promise<UserViewDto> {
    const userQuery = await this.dataSource.query(
      `
SELECT * FROM "Users" u
WHERE u."id"=$1 AND u."deletedAt" IS NULL
`,
      [userId],
    );
    const user = userQuery[0];

    if (!user) {
      throw NotFoundDomainException.create();
    }

    return UserViewDto.mapToView(user);
  }

  async selectByIdAndMapToMeView(userId: string): Promise<MeViewDto> {
    const userQuery = await this.dataSource.query(
      `
SELECT * FROM "Users" u
WHERE u."id"=$1 AND u."deletedAt" IS NULL
`,
      [userId],
    );
    const user = userQuery[0];

    if (!user) {
      throw NotFoundDomainException.create();
    }

    return MeViewDto.mapToView(user);
  }

  async selectAll(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const offset = query.calculateSkip();
    const { sortBy, sortDirection, pageSize, pageNumber } = query;

    const searchLoginTerm = query.searchLoginTerm ?? '';
    const searchEmailTerm = query.searchEmailTerm ?? '';

    const users = await this.dataSource.query(
      `
  SELECT * 
  FROM "Users" u
  WHERE u."deletedAt" IS NULL 
  AND (u."login" ILIKE $1 OR u."email" ILIKE $2)
  ORDER BY "${sortBy}" ${sortDirection}
  LIMIT $3 OFFSET $4
`,
      [`%${searchLoginTerm}%`, `%${searchEmailTerm}%`, pageSize, offset],
    );

    const countResult = await this.dataSource.query(
      `
    SELECT COUNT(*)
    FROM "Users" u
    WHERE u."deletedAt" IS NULL
    AND (u."login" ILIKE $1 OR u."email" ILIKE $2)
    `,
      [`%${searchLoginTerm}%`, `%${searchEmailTerm}%`],
    );

    const totalCount = +countResult[0].count;

    const data = {
      items: users.map((user) => UserViewDto.mapToView(user)),
      page: pageNumber,
      size: pageSize,
      totalCount: totalCount,
    };

    return PaginatedViewDto.mapToView(data);
  }
}
