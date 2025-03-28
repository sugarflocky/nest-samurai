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
  constructor(
    @InjectModel(User.name)
    private UserModel: UserModelType,
    @InjectDataSource() private dataSource: DataSource,
  ) {}

  /*
  async getAll(
    query: GetUsersQueryParams,
  ): Promise<PaginatedViewDto<UserViewDto[]>> {
    const {
      sortBy,
      sortDirection,
      pageSize,
      pageNumber,
      searchLoginTerm,
      searchEmailTerm,
    } = query;

    let filter: any = {
      deletedAt: null,
    };

    if (searchLoginTerm && searchEmailTerm) {
      filter = {
        $or: [
          { login: { $regex: searchLoginTerm, $options: 'i' } },
          { email: { $regex: searchEmailTerm, $options: 'i' } },
        ],
        deletedAt: null,
      };
    } else if (searchLoginTerm) {
      filter = {
        login: { $regex: searchLoginTerm, $options: 'i' },
        deletedAt: null,
      };
    } else if (searchEmailTerm) {
      filter = {
        email: { $regex: searchEmailTerm, $options: 'i' },
        deletedAt: null,
      };
    }

    const items = await this.UserModel.find(filter)
      .sort([[sortBy, sortDirection]])
      .skip(query.calculateSkip())
      .limit(pageSize)
      .exec();
    const totalCount = await this.UserModel.countDocuments(filter).exec();

    const data = {
      items: items.map((user) => UserViewDto.mapToView(user)),
      page: pageNumber,
      size: pageSize,
      totalCount: totalCount,
    };

    return PaginatedViewDto.mapToView(data);

    async getUserByAccessToken(id: string) {
      const user = await this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!user) {
      throw NotFoundDomainException.create();
    }

    return MeViewDto.mapToView(user);
  }

  async getByIdOrNotFoundFail(id: string): Promise<UserViewDto> {
    const user = await this.UserModel.findOne({
      _id: id,
      deletedAt: null,
    });

    if (!user) {
      throw NotFoundDomainException.create();
    }

    return UserViewDto.mapToView(user);
  }
  }*/

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
