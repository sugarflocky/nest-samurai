import { BaseSortablePaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';

export class GetBlogsQueryParams extends BaseSortablePaginationParams<BlogsSortBy> {
  sortBy = BlogsSortBy.CreatedAt;
  searchNameTerm: string | null = null;
}

export enum BlogsSortBy {
  CreatedAt = 'createdAt',
  Name = 'name',
}
