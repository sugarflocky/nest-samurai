import { BaseSortablePaginationParams } from '../../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Trim } from '../../../../../core/decorators/transform/trim';

export enum UsersSortBy {
  CreatedAt = 'createdAt',
  Login = 'login',
  Email = 'email',
}

export class GetUsersQueryParams extends BaseSortablePaginationParams<UsersSortBy> {
  @Trim()
  @IsEnum(UsersSortBy)
  sortBy = UsersSortBy.CreatedAt;
  @IsString()
  @IsOptional()
  searchLoginTerm: string | null = null;
  @IsString()
  @IsOptional()
  searchEmailTerm: string | null = null;
}
