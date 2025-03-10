import { BaseSortablePaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Trim } from '../../../../../../core/decorators/transform/trim';

export enum BlogsSortBy {
  CreatedAt = 'createdAt',
  Name = 'name',
}

export class GetBlogsQueryParams extends BaseSortablePaginationParams<BlogsSortBy> {
  @Trim()
  @IsEnum(BlogsSortBy)
  sortBy = BlogsSortBy.CreatedAt;
  @IsString()
  @IsOptional()
  searchNameTerm: string | null = null;
}
