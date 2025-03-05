import { BaseSortablePaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';

export class GetPostsQueryParams extends BaseSortablePaginationParams<PostsSortBy> {
  sortBy = PostsSortBy.CreatedAt;
}

export enum PostsSortBy {
  CreatedAt = 'createdAt',
  Title = 'title',
}
