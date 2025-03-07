import { BaseSortablePaginationParams } from '../../../../../../core/dto/base.query-params.input-dto';

export class GetCommentsQueryParams extends BaseSortablePaginationParams<CommentsSortBy> {
  sortBy = CommentsSortBy.createdAt;
}

export enum CommentsSortBy {
  createdAt = 'createdAt',
}
